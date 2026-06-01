import fs from "node:fs";

const REQUIRED_CONFIRMATION = "CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION";
const APPROVAL_OUTCOME_PATH = "data/source-gates/runner-approval-decision-outcomes.json";
const ALLOWED_SYMBOLS = ["2330", "2382", "2308"];
const SOURCE_ID = "twse-stock-day";
const ROUTE = "https://www.twse.com.tw/exchangeReport/STOCK_DAY";
const START_MONTH = "2023-03";
const END_MONTH = "2026-05";
const EXPECTED_MONTHS = 39;
const MINIMUM_DELAY_MS = 800;
const TIMEOUT_MS = 15000;

const approval = readImplementationApproval();

if (!approval.implementationApproved) {
  printSanitized({
    implementationApproved: false,
    reason: "implementation_approval_not_accepted",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

if (process.env.EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION !== REQUIRED_CONFIRMATION) {
  printSanitized({
    implementationApproved: true,
    reason: "missing_execution_confirmation",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

if (process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock") {
  printSanitized({
    implementationApproved: true,
    reason: "public_data_source_not_mock",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

const startedAt = new Date();
const runResult = await runReportOnly();
const finishedAt = new Date();

printSanitized({
  ...runResult,
  finishedAt: finishedAt.toISOString(),
  implementationApproved: true,
  remoteAttempted: true,
  startedAt: startedAt.toISOString()
});
process.exit(runResult.status === "ready_for_review" ? 0 : 1);

async function runReportOnly() {
  const months = buildMonths(START_MONTH, END_MONTH);
  const symbolSummaries = [];

  for (const [symbolIndex, symbol] of ALLOWED_SYMBOLS.entries()) {
    const monthly = [];

    for (const [monthIndex, month] of months.entries()) {
      if (symbolIndex > 0 || monthIndex > 0) {
        await delay(MINIMUM_DELAY_MS);
      }
      monthly.push(await fetchMonthSummary({ month, symbol }));
    }

    symbolSummaries.push(summarizeSymbol(symbol, monthly));
  }

  const totalParsedRowCount = symbolSummaries.reduce((total, item) => total + item.parsedRowCount, 0);
  const failedMonthCount = symbolSummaries.reduce((total, item) => total + item.failedMonthCount, 0);
  const parserFlagCount = symbolSummaries.reduce((total, item) => total + item.parserFlagCount, 0);
  const zeroRowMonthCount = symbolSummaries.reduce((total, item) => total + item.zeroRowMonthCount, 0);
  const duplicateTradeDateCount = symbolSummaries.reduce((total, item) => total + item.duplicateTradeDateCount, 0);
  const status =
    failedMonthCount === 0 && parserFlagCount === 0 && zeroRowMonthCount === 0 && duplicateTradeDateCount === 0
      ? "ready_for_review"
      : "blocked";

  return {
    duplicateTradeDateCount,
    expectedMonths: EXPECTED_MONTHS,
    failedMonthCount,
    parserFlagCount,
    sourceId: SOURCE_ID,
    status,
    symbolSummaries,
    totalParsedRowCount,
    zeroRowMonthCount
  };
}

async function fetchMonthSummary({ month, symbol }) {
  const date = `${month.replace("-", "")}01`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ROUTE}?response=json&date=${date}&stockNo=${symbol}`, {
      headers: {
        accept: "application/json",
        "user-agent": "taiwan-market-signal-equity-report-only-runner/0.1"
      },
      signal: controller.signal
    });
    const body = await response.text();
    const bytes = Buffer.byteLength(body, "utf8");
    const parsed = JSON.parse(body);
    const sourceRows = Array.isArray(parsed.data) ? parsed.data : [];
    const aggregate = validateSourceRows(sourceRows);

    return {
      bytes,
      duplicateTradeDateCount: aggregate.duplicateTradeDateCount,
      firstTradeDate: aggregate.firstTradeDate,
      lastTradeDate: aggregate.lastTradeDate,
      month,
      parsedRowCount: sourceRows.length,
      parserFlagCount: aggregate.parserFlagCount,
      status: response.status,
      symbol
    };
  } catch (error) {
    return {
      bytes: 0,
      duplicateTradeDateCount: 0,
      errorCategory: categorizeError(error),
      firstTradeDate: "",
      lastTradeDate: "",
      month,
      parsedRowCount: 0,
      parserFlagCount: 1,
      status: "error",
      symbol
    };
  } finally {
    clearTimeout(timeout);
  }
}

function validateSourceRows(sourceRows) {
  const dateCounts = new Map();
  let parserFlagCount = 0;

  for (const row of sourceRows) {
    const sourceDate = row?.[0];
    const tradeDate = parseRocDate(sourceDate);
    if (!tradeDate) {
      parserFlagCount += 1;
      continue;
    }
    dateCounts.set(tradeDate, (dateCounts.get(tradeDate) ?? 0) + 1);

    for (const index of [1, 2, 3, 4, 5, 6, 8]) {
      if (!isNumericCell(row?.[index])) {
        parserFlagCount += 1;
      }
    }
  }

  const dates = [...dateCounts.keys()].sort();
  return {
    duplicateTradeDateCount: [...dateCounts.values()].filter((count) => count > 1).length,
    firstTradeDate: dates[0] ?? "",
    lastTradeDate: dates.at(-1) ?? "",
    parserFlagCount
  };
}

function summarizeSymbol(symbol, monthly) {
  const httpStatusSummary = {};
  const observedFirstDates = [];
  const observedLastDates = [];

  for (const item of monthly) {
    httpStatusSummary[item.status] = (httpStatusSummary[item.status] ?? 0) + 1;
    if (item.firstTradeDate) observedFirstDates.push(item.firstTradeDate);
    if (item.lastTradeDate) observedLastDates.push(item.lastTradeDate);
  }

  return {
    duplicateTradeDateCount: monthly.reduce((total, item) => total + item.duplicateTradeDateCount, 0),
    failedMonthCount: monthly.filter((item) => item.status !== 200).length,
    firstObservedTradeDate: observedFirstDates.sort()[0] ?? "",
    httpStatusSummary,
    lastObservedTradeDate: observedLastDates.sort().at(-1) ?? "",
    parsedRowCount: monthly.reduce((total, item) => total + item.parsedRowCount, 0),
    parserFlagCount: monthly.reduce((total, item) => total + item.parserFlagCount, 0),
    symbol,
    zeroRowMonthCount: monthly.filter((item) => item.parsedRowCount === 0).length
  };
}

function printSanitized(payload) {
  console.log(
    JSON.stringify(
      {
        duplicateTradeDateCount: payload.duplicateTradeDateCount,
        expectedMonths: payload.expectedMonths,
        failedMonthCount: payload.failedMonthCount,
        finishedAt: payload.finishedAt,
        implementationApproved: payload.implementationApproved,
        mode: "equity_report_only_runner",
        parserFlagCount: payload.parserFlagCount,
        publicDataSource: "mock",
        reason: payload.reason,
        remoteAttempted: payload.remoteAttempted,
        rowCoverageCreditAwarded: false,
        rowPayloadsPrinted: false,
        scoreSource: "mock",
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sourceId: payload.sourceId ?? SOURCE_ID,
        sqlExecuted: false,
        startedAt: payload.startedAt,
        status: payload.status,
        symbolSummaries: payload.symbolSummaries,
        totalParsedRowCount: payload.totalParsedRowCount,
        writesAttempted: false,
        zeroRowMonthCount: payload.zeroRowMonthCount
      },
      null,
      2
    )
  );
}

function readImplementationApproval() {
  const parsed = JSON.parse(fs.readFileSync(APPROVAL_OUTCOME_PATH, "utf8"));
  const record = parsed.outcomes?.find((item) => item.id === "report-only-runner-implementation-slice");

  return {
    implementationApproved: record?.outcome === "accepted"
  };
}

function parseRocDate(value) {
  const match = String(value ?? "").trim().match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (!match) return "";
  return `${Number(match[1]) + 1911}-${match[2]}-${match[3]}`;
}

function isNumericCell(value) {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll(",", "")
    .replace(/^X/i, "");
  return normalized !== "" && normalized !== "--" && Number.isFinite(Number(normalized));
}

function categorizeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/abort|timeout/i.test(message)) return "timeout";
  if (/json/i.test(message)) return "json_parse_failed";
  if (/network|fetch|connection|dns|getaddrinfo/i.test(message)) return "connection_error";
  return "runtime_error";
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
