const REQUIRED_CONFIRMATION = "CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT";
const SOURCE_ID = "official-exchange-index";
const TARGET_SYMBOL = "TWII";
const ROUTE = "https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_HIST";
const PROBE_DATE = "20260501";
const TIMEOUT_MS = 15000;

if (process.env.TWII_REPORT_ONLY_PROBE_CONFIRMATION !== REQUIRED_CONFIRMATION) {
  printSanitized({
    connectionAttempted: false,
    failureClass: "missing_execution_confirmation",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exitCode = 1;
} else if (process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock") {
  printSanitized({
    connectionAttempted: false,
    failureClass: "public_data_source_not_mock",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exitCode = 1;
} else {
  const startedAt = new Date();
  const result = await runProbe();
  const finishedAt = new Date();

  printSanitized({
    ...result,
    finishedAt: finishedAt.toISOString(),
    remoteAttempted: true,
    startedAt: startedAt.toISOString()
  });
  process.exitCode = result.status === "ready_for_review" ? 0 : 1;
}

await settleBeforeExit();

async function runProbe() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ROUTE}?response=json&date=${PROBE_DATE}`, {
      headers: {
        accept: "application/json",
        "user-agent": "taiwan-market-signal-twii-report-only-probe/0.1"
      },
      signal: controller.signal
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    const rows = Array.isArray(parsed.data) ? parsed.data : [];
    const aggregate = summarizeRows(rows);
    const fieldParseFailureCount = aggregate.fieldParseFailureCount + (rows.length === 0 ? 1 : 0);
    const parserFlagCount = fieldParseFailureCount;
    const failureClass = classifyResult({ fieldParseFailureCount, parsedRowCount: rows.length, responseStatus: response.status });

    return {
      calendarGapCount: 0,
      connectionAttempted: true,
      dateRangeEnd: aggregate.dateRangeEnd,
      dateRangeStart: aggregate.dateRangeStart,
      duplicateTradeDateCount: aggregate.duplicateTradeDateCount,
      failureClass,
      fieldParseFailureCount,
      httpStatusGroup: toStatusGroup(response.status),
      missingSessionCount: 0,
      parsedRowCount: rows.length,
      parserFlagCount,
      status: failureClass === "none" ? "ready_for_review" : "blocked"
    };
  } catch (error) {
    return {
      calendarGapCount: 0,
      connectionAttempted: true,
      dateRangeEnd: "",
      dateRangeStart: "",
      duplicateTradeDateCount: 0,
      failureClass: categorizeError(error),
      fieldParseFailureCount: 1,
      httpStatusGroup: "error",
      missingSessionCount: 0,
      parsedRowCount: 0,
      parserFlagCount: 1,
      status: "blocked"
    };
  } finally {
    clearTimeout(timeout);
  }
}

function summarizeRows(rows) {
  const dateCounts = new Map();
  let fieldParseFailureCount = 0;

  for (const row of rows) {
    const tradeDate = parseRocDate(row?.[0]);
    if (!tradeDate) {
      fieldParseFailureCount += 1;
      continue;
    }
    dateCounts.set(tradeDate, (dateCounts.get(tradeDate) ?? 0) + 1);

    for (const index of [1, 2, 3, 4]) {
      if (!isNumericCell(row?.[index])) {
        fieldParseFailureCount += 1;
      }
    }
  }

  const dates = [...dateCounts.keys()].sort();
  return {
    dateRangeEnd: dates.at(-1) ?? "",
    dateRangeStart: dates[0] ?? "",
    duplicateTradeDateCount: [...dateCounts.values()].filter((count) => count > 1).length,
    fieldParseFailureCount
  };
}

function classifyResult({ fieldParseFailureCount, parsedRowCount, responseStatus }) {
  if (responseStatus < 200 || responseStatus >= 300) return `http_${toStatusGroup(responseStatus)}`;
  if (parsedRowCount === 0) return "no_rows";
  if (fieldParseFailureCount > 0) return "field_mismatch";
  return "none";
}

function printSanitized(payload) {
  console.log(
    JSON.stringify(
      {
        calendarGapCount: payload.calendarGapCount ?? 0,
        connectionAttempted: payload.connectionAttempted,
        dateRangeEnd: payload.dateRangeEnd ?? "",
        dateRangeStart: payload.dateRangeStart ?? "",
        duplicateTradeDateCount: payload.duplicateTradeDateCount ?? 0,
        failureClass: payload.failureClass,
        fieldParseFailureCount: payload.fieldParseFailureCount ?? 0,
        finishedAt: payload.finishedAt,
        httpStatusGroup: payload.httpStatusGroup ?? "",
        marketDataFilesWritten: false,
        missingSessionCount: payload.missingSessionCount ?? 0,
        mode: "twii_report_only_probe",
        parsedRowCount: payload.parsedRowCount ?? 0,
        parserFlagCount: payload.parserFlagCount ?? 0,
        publicDataSource: "mock",
        remoteAttempted: payload.remoteAttempted,
        rowCoverageCreditAwarded: false,
        rowPayloadsPrinted: false,
        scoreSource: "mock",
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        selectedCandidate: SOURCE_ID,
        sourceId: SOURCE_ID,
        sqlExecuted: false,
        startedAt: payload.startedAt,
        status: payload.status,
        stockIdPayloadsPrinted: false,
        targetSymbol: TARGET_SYMBOL,
        writesAttempted: false
      },
      null,
      2
    )
  );
}

function parseRocDate(value) {
  const match = String(value ?? "").trim().match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (!match) return "";
  return `${Number(match[1]) + 1911}-${match[2]}-${match[3]}`;
}

function isNumericCell(value) {
  const normalized = String(value ?? "").trim().replaceAll(",", "");
  return normalized !== "" && normalized !== "--" && Number.isFinite(Number(normalized));
}

function toStatusGroup(status) {
  if (!Number.isInteger(status)) return "error";
  return `${Math.trunc(status / 100)}xx`;
}

function categorizeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/abort|timeout/i.test(message)) return "timeout";
  if (/json/i.test(message)) return "json_parse_failed";
  if (/network|fetch|connection|dns|getaddrinfo/i.test(message)) return "connection_error";
  return "runtime_error";
}

function settleBeforeExit() {
  return new Promise((resolve) => setImmediate(resolve));
}
