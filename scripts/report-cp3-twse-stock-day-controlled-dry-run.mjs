import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_CONTROLLED_DRY_RUN_2026-05-29.md";
const timeoutMs = 15000;
const requestDelayMs = 800;
const stockNo = "2330";
const exchangeCode = "TWSE";
const sourceId = "twse-stock-day";
const route = "https://www.twse.com.tw/exchangeReport/STOCK_DAY";
const sourceUrlTemplate = `${route}?response=json&date=YYYYMMDD&stockNo=SYMBOL`;
const licenseUrl = "https://data.gov.tw/license";
const attributionText =
  "Data source: Taiwan Stock Exchange / Securities and Futures Bureau, Financial Supervisory Commission, Executive Yuan, R.O.C.; Dataset: Daily Trading Information of Listed Stocks; License: Open Government Data License, version 1.0.";
const startMonth = "2023-03-01";
const endMonth = "2026-05-01";
const expectedMonths = 39;
const targetRowCount = 756;
const months = buildMonths("2023-03", "2026-05");

const startedAt = new Date();
const monthSummaries = [];
const parsedRows = [];

for (const [index, month] of months.entries()) {
  if (index > 0) await delay(requestDelayMs);
  monthSummaries.push(await fetchMonth(month));
}

const validation = validateRows(monthSummaries, parsedRows);
const decision = decide(validation);
const finishedAt = new Date();

fs.writeFileSync(
  reportPath,
  renderReport({
    decision,
    finishedAt,
    monthSummaries,
    startedAt,
    validation
  })
);

console.log(
  JSON.stringify(
    {
      decision,
      report: reportPath,
      status: "ok",
      total_parsed_row_count: validation.totalParsedRowCount
    },
    null,
    2
  )
);

async function fetchMonth(month) {
  const date = `${month.replace("-", "")}01`;
  const url = `${route}?response=json&date=${date}&stockNo=${stockNo}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "taiwan-market-signal-controlled-dry-run/0.1"
      },
      signal: controller.signal
    });
    const body = await response.text();
    const bytes = Buffer.byteLength(body, "utf8");
    let source;

    try {
      source = JSON.parse(body);
    } catch (error) {
      return {
        bytes,
        error: `json_parse_failed:${error.message}`,
        firstDate: "",
        lastDate: "",
        month,
        parsedRowCount: 0,
        status: response.status
      };
    }

    const rows = Array.isArray(source.data) ? source.data : [];
    const normalizedRows = rows.map((row) => parseSourceRow(row, month));
    parsedRows.push(...normalizedRows);

    return {
      bytes,
      error: "",
      firstDate: normalizedRows[0]?.trade_date ?? "",
      lastDate: normalizedRows.at(-1)?.trade_date ?? "",
      month,
      parsedRowCount: normalizedRows.length,
      status: response.status
    };
  } catch (error) {
    return {
      bytes: 0,
      error: error.name === "AbortError" ? "request_timeout" : error.message,
      firstDate: "",
      lastDate: "",
      month,
      parsedRowCount: 0,
      status: "error"
    };
  } finally {
    clearTimeout(timeout);
  }
}

function parseSourceRow(row, month) {
  const [
    sourceDate,
    volume,
    tradeValue,
    openPrice,
    highPrice,
    lowPrice,
    closePrice,
    priceChange,
    transactionCount,
    note = ""
  ] = row;

  const qualityFlags = [];
  const normalized = {
    close_price: parseDecimal(closePrice, "close_price", qualityFlags),
    high_price: parseDecimal(highPrice, "high_price", qualityFlags),
    low_price: parseDecimal(lowPrice, "low_price", qualityFlags),
    month,
    note: String(note ?? "").trim(),
    open_price: parseDecimal(openPrice, "open_price", qualityFlags),
    price_change: parseDecimal(priceChange, "price_change", qualityFlags),
    quality_flags: qualityFlags,
    source_date: sourceDate,
    trade_date: parseRocDate(sourceDate, qualityFlags),
    trade_value: parseInteger(tradeValue, "trade_value", qualityFlags),
    transaction_count: parseInteger(transactionCount, "transaction_count", qualityFlags),
    volume: parseInteger(volume, "volume", qualityFlags)
  };

  for (const field of [
    "trade_date",
    "open_price",
    "high_price",
    "low_price",
    "close_price",
    "volume",
    "trade_value",
    "transaction_count"
  ]) {
    if (normalized[field] === null || normalized[field] === "") {
      qualityFlags.push(`missing_required:${field}`);
    }
  }

  return normalized;
}

function parseRocDate(value, qualityFlags) {
  const match = String(value ?? "").trim().match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (!match) {
    qualityFlags.push("invalid_roc_date");
    return "";
  }

  const year = Number(match[1]) + 1911;
  return `${year}-${match[2]}-${match[3]}`;
}

function parseDecimal(value, field, qualityFlags) {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll(",", "")
    .replace(/^X/i, "");

  if (normalized === "" || normalized === "--") {
    qualityFlags.push(`non_numeric:${field}`);
    return null;
  }

  const number = Number(normalized);
  if (!Number.isFinite(number)) {
    qualityFlags.push(`non_numeric:${field}`);
    return null;
  }

  return number;
}

function parseInteger(value, field, qualityFlags) {
  const normalized = String(value ?? "").trim().replaceAll(",", "");
  const number = Number(normalized);

  if (!Number.isInteger(number)) {
    qualityFlags.push(`non_numeric:${field}`);
    return null;
  }

  return number;
}

function validateRows(summaries, rows) {
  const dateCounts = new Map();
  const httpStatusSummary = {};
  let missingRequiredFieldCount = 0;
  let nonNumericPriceCount = 0;
  let nonNumericVolumeAmountCount = 0;
  let sourceNoteCount = 0;
  let parserFlagCount = 0;

  for (const summary of summaries) {
    httpStatusSummary[summary.status] = (httpStatusSummary[summary.status] ?? 0) + 1;
  }

  for (const row of rows) {
    if (row.trade_date) {
      dateCounts.set(row.trade_date, (dateCounts.get(row.trade_date) ?? 0) + 1);
    }
    if (row.note) sourceNoteCount += 1;

    for (const flag of row.quality_flags) {
      parserFlagCount += 1;
      if (flag.startsWith("missing_required:")) missingRequiredFieldCount += 1;
      if (flag.match(/^non_numeric:(open_price|high_price|low_price|close_price|price_change)$/)) {
        nonNumericPriceCount += 1;
      }
      if (flag.match(/^non_numeric:(volume|trade_value|transaction_count)$/)) {
        nonNumericVolumeAmountCount += 1;
      }
    }
  }

  const observedDates = [...dateCounts.keys()].sort();
  const successfulMonths = summaries.filter((summary) => summary.status === 200).length;

  return {
    duplicateTradeDateCount: [...dateCounts.values()].filter((count) => count > 1).length,
    failedMonths: summaries.length - successfulMonths,
    firstObservedTradeDate: observedDates[0] ?? "",
    httpStatusSummary,
    httpSuccessRate: successfulMonths / summaries.length,
    lastObservedTradeDate: observedDates.at(-1) ?? "",
    missingRequiredFieldCount,
    nonNumericPriceCount,
    nonNumericVolumeAmountCount,
    parserFlagCount,
    sourceNoteCount,
    successfulMonths,
    totalParsedRowCount: rows.length,
    zeroRowMonths: summaries.filter((summary) => summary.parsedRowCount === 0).map((summary) => summary.month)
  };
}

function decide(validation) {
  if (
    validation.httpSuccessRate < 0.95 ||
    validation.totalParsedRowCount < targetRowCount ||
    validation.duplicateTradeDateCount > 0 ||
    validation.missingRequiredFieldCount > 0 ||
    validation.zeroRowMonths.length > 0 ||
    validation.parserFlagCount > 0
  ) {
    return "blocked";
  }

  return "ready_for_review";
}

function renderReport({ decision, finishedAt, monthSummaries, startedAt, validation }) {
  const tableRows = monthSummaries
    .map((summary) =>
      [
        summary.month,
        summary.status,
        summary.parsedRowCount,
        summary.firstDate,
        summary.lastDate,
        summary.bytes,
        summary.error || "-"
      ].join(" | ")
    )
    .join("\n");

  return `# CP3 TWSE Stock Day Controlled Dry-Run

Status: controlled dry-run report recorded

Date: 2026-05-29

## CEO Decision

\`\`\`text
REVISE
\`\`\`

This is a report-only dry-run. It validates TWSE STOCK_DAY parser behavior and
source depth for one symbol without approving ingestion or public use.

## Guardrails

\`\`\`text
report-only dry-run
source_id: ${sourceId}
symbol: ${stockNo}
exchange_code: ${exchangeCode}
start_month: ${startMonth}
end_month: ${endMonth}
expected_months: ${expectedMonths}
minimum_delay_ms: ${requestDelayMs}
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no staging writes
no daily_prices writes
no scoreSource=real
no public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
\`\`\`

## Run Metadata

\`\`\`text
run_type: controlled_report_only_dry_run
decision: ${decision}
route: ${route}
source_url_template: ${sourceUrlTemplate}
license_url: ${licenseUrl}
attribution_text: ${attributionText}
requested_months: ${monthSummaries.length}
successful_months: ${validation.successfulMonths}
failed_months: ${validation.failedMonths}
total_parsed_row_count: ${validation.totalParsedRowCount}
target_row_count: ${targetRowCount}
zero_row_months: ${validation.zeroRowMonths.length === 0 ? "none" : validation.zeroRowMonths.join(", ")}
duplicate_trade_dates: ${validation.duplicateTradeDateCount}
missing_required_field_count: ${validation.missingRequiredFieldCount}
non_numeric_price_count: ${validation.nonNumericPriceCount}
non_numeric_volume_amount_count: ${validation.nonNumericVolumeAmountCount}
source_note_count: ${validation.sourceNoteCount}
parser_flag_count: ${validation.parserFlagCount}
http_success_rate: ${validation.httpSuccessRate.toFixed(4)}
http_status_summary: ${JSON.stringify(validation.httpStatusSummary)}
first_observed_trade_date: ${validation.firstObservedTradeDate}
last_observed_trade_date: ${validation.lastObservedTradeDate}
started_at: ${startedAt.toISOString()}
finished_at: ${finishedAt.toISOString()}
\`\`\`

## Sample Parsed Schema Keys Only

\`\`\`text
trade_date
source_date
open_price
high_price
low_price
close_price
price_change
volume
trade_value
transaction_count
note
quality_flags
\`\`\`

## Monthly Validation Summary

month | http_status | parsed_row_count | first_date | last_date | response_bytes | error
--- | ---: | ---: | --- | --- | ---: | ---
${tableRows}

## Interpretation

ready_for_review means this report is internally consistent enough for human
review. It does not approve ingestion.

This report does not create staging tables, does not write Supabase, does not
write \`daily_prices\`, does not store raw market rows, and does not change the
public site data source.

## Remaining Blockers

\`\`\`text
CEO approval required before ingestion
Legal review required before storage and redistribution
Investment review required before model/backtest use
CP3 source-depth production gate remains not_ready
Public scoreSource=real remains unapproved
\`\`\`
`;
}

function buildMonths(start, end) {
  const result = [];
  const cursor = new Date(`${start}-01T00:00:00Z`);
  const endDate = new Date(`${end}-01T00:00:00Z`);

  while (cursor <= endDate) {
    result.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return result;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
