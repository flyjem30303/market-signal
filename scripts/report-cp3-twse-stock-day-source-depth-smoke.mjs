import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_2026-05-29.md";
const timeoutMs = 15000;
const requestDelayMs = 800;
const stockNo = "2330";
const routeId = "TWSE-STOCK-DAY-EXCHANGE-REPORT";
const startMonth = "2023-06-01";
const endMonth = "2026-05-01";
const targetTradingDates = 756;
const months = buildMonths("2023-06", "2026-05");

const generatedAt = new Date().toISOString();
const results = [];

for (const [index, month] of months.entries()) {
  if (index > 0) {
    await delay(requestDelayMs);
  }
  results.push(await probeMonth(month));
}

const report = renderReport(results, generatedAt);
fs.writeFileSync(reportPath, report);
console.log(report);

async function probeMonth(month) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const queryMonth = `${month.replace("-", "")}01`;
  const url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${queryMonth}&stockNo=${stockNo}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": "taiwan-market-signal-stock-day-depth-smoke/0.1"
      },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "unknown";
    const text = await response.text();
    const metadata = extractStockDayMetadata(text, contentType);

    return {
      bodyBytes: Buffer.byteLength(text, "utf8"),
      contentType,
      error: "",
      httpStatus: response.status,
      month,
      ...metadata
    };
  } catch (error) {
    return {
      bodyBytes: 0,
      contentType: "unavailable",
      error: error instanceof Error ? error.message : String(error),
      fields: [],
      firstObservedDate: "unavailable",
      httpStatus: 0,
      lastObservedDate: "unavailable",
      month,
      rowCount: 0,
      title: "unavailable"
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractStockDayMetadata(text, contentType) {
  const trimmed = text.trim();
  if (!contentType.includes("json") && !trimmed.startsWith("{")) {
    return {
      fields: [],
      firstObservedDate: "unavailable",
      lastObservedDate: "unavailable",
      rowCount: 0,
      title: "non-json-response"
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const rows = Array.isArray(parsed.data) ? parsed.data : [];
    const observedDates = rows
      .map((row) => Array.isArray(row) ? String(row[0] ?? "").trim() : "")
      .filter(Boolean);

    return {
      fields: Array.isArray(parsed.fields) ? parsed.fields.slice(0, 40) : [],
      firstObservedDate: observedDates[0] ?? "unavailable",
      lastObservedDate: observedDates.at(-1) ?? "unavailable",
      rowCount: rows.length,
      title: typeof parsed.title === "string" ? sanitize(parsed.title) : "unavailable"
    };
  } catch {
    return {
      fields: [],
      firstObservedDate: "unavailable",
      lastObservedDate: "unavailable",
      rowCount: 0,
      title: "json-parse-failed"
    };
  }
}

function buildMonths(start, end) {
  const [startYear, startMonthNumber] = start.split("-").map(Number);
  const [endYear, endMonthNumber] = end.split("-").map(Number);
  const values = [];
  let year = startYear;
  let month = startMonthNumber;

  while (year < endYear || (year === endYear && month <= endMonthNumber)) {
    values.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      year += 1;
      month = 1;
    }
  }

  return values;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitize(value) {
  return value.replace(/\s+/g, " ").replace(/\|/g, "/").trim();
}

function renderReport(results, generatedAt) {
  const totalRowCount = results.reduce((sum, result) => sum + result.rowCount, 0);
  const successfulMonths = results.filter((result) => result.httpStatus === 200 && result.rowCount > 0);
  const firstObservedDate = successfulMonths[0]?.firstObservedDate ?? "unavailable";
  const lastObservedDate = successfulMonths.at(-1)?.lastObservedDate ?? "unavailable";
  const uniqueObservedMonthCount = new Set(successfulMonths.map((result) => result.month)).size;
  const httpStatusSummary = summarizeStatuses(results);
  const schemaFields = firstNonEmptyFields(results);
  const status = totalRowCount >= targetTradingDates ? "technically_plausible" : "not_enough_rows";

  const rows = results.map((result) => {
    const error = result.error ? result.error.replace(/\|/g, "/") : "";
    return `| ${result.month} | ${result.httpStatus} | ${result.rowCount} | ${result.firstObservedDate} | ${result.lastObservedDate} | ${result.bodyBytes} | ${error} |`;
  });

  return `# CP3 TWSE Stock Day Source Depth Smoke

Status: source-depth metadata smoke recorded

Generated at: ${generatedAt}

## CEO Decision

\`\`\`text
REVISE
\`\`\`

This report records metadata-only source-depth smoke for one TWSE stock. It is
not historical ingestion, not production source-depth approval, not a backtest,
and not approval for public scoring.

## Guardrails

\`\`\`text
one TWSE listed symbol only: 2330
one selected route only: exchangeReport/STOCK_DAY
start_month: ${startMonth}
end_month: ${endMonth}
maximum 36 month probes
minimum 800 ms delay between requests
no parallel requests
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no daily_prices writes
no scoreSource=real
no public backtest claims
source-depth gate remains not_ready unless CEO separately approves ingestion
Keep public data source mock
\`\`\`

## Summary

\`\`\`text
month_count: ${results.length}
total_row_count: ${totalRowCount}
target_row_count: ${targetTradingDates}
unique_observed_month_count: ${uniqueObservedMonthCount}
first_observed_date: ${firstObservedDate}
last_observed_date: ${lastObservedDate}
smoke_status: ${status}
HTTP status summary: ${httpStatusSummary}
schema fields: ${schemaFields.join(", ")}
\`\`\`

## Monthly Metadata

| Month | HTTP | Row Count | First Observed Date | Last Observed Date | Body Bytes Read Then Discarded | Error |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Interpretation

\`\`\`text
If total_row_count is at least 756 and first_observed_date reaches the expected
window, TWSE STOCK_DAY is technically plausible for one-symbol price-history
depth.
This does not approve legal use, automated collection, production storage,
all-symbol coverage, fundamental depth, corporate-action adjustment, backtest
validity, or public scoring.
\`\`\`

## Remaining Blockers

\`\`\`text
license / terms reviewed by D
rate-limit / fair-use policy documented
route selected for approved collection
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
fundamental / valuation history still unverified
CP3 source-depth production gate remains not_ready
\`\`\`
`;
}

function summarizeStatuses(results) {
  const counts = new Map();
  for (const result of results) {
    counts.set(result.httpStatus, (counts.get(result.httpStatus) ?? 0) + 1);
  }

  return [...counts.entries()].map(([status, count]) => `${status}:${count}`).join(", ");
}

function firstNonEmptyFields(results) {
  return results.find((result) => result.fields.length > 0)?.fields ?? [];
}
