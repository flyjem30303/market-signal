import fs from "node:fs";
import path from "node:path";

const artifactPath = process.env.A1_FULL_TWSE_EQUITY_CANDIDATE_ARTIFACT_PATH ?? latestCandidatePath();
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const rows = Array.isArray(artifact.candidatePrices) ? artifact.candidatePrices : [];
const duplicateKeys = countDuplicateSymbolDateRows(rows);
const dates = rows.map((row) => row.trade_date).filter(Boolean).sort();
const monthBuckets = new Set(rows.map((row) => String(row.trade_date ?? "").slice(0, 7)).filter((month) => /^\d{4}-\d{2}$/u.test(month)));
const requestedMonthCount = artifact.candidateRun?.requested_month_count;
const requestedSymbolCount = artifact.candidateRun?.requested_symbol_count;
const expectedMinMonth = expectedOldestRequestedMonth(artifact.candidateRun?.started_at, requestedMonthCount);
const expectedMaxMonth = expectedNewestRequestedMonth(artifact.candidateRun?.started_at);
const outOfWindowRows = rows.filter((row) => {
  const month = String(row.trade_date ?? "").slice(0, 7);
  return month < expectedMinMonth || month > expectedMaxMonth;
}).length;
const parserFlagSummary = artifact.candidateRun?.parser_flag_summary ?? {};
const parserFlagCount = Object.values(parserFlagSummary).reduce((sum, count) => sum + Number(count ?? 0), 0);
const safeForStaging =
  rows.length > 0 &&
  duplicateKeys === 0 &&
  outOfWindowRows === 0 &&
  artifact.sourcePayloadIncluded === false &&
  artifact.sourceUrlPayloadIncluded === false &&
  artifact.secretsIncluded === false &&
  artifact.sourcePayloadStored === false &&
  artifact.sourceUrlPayloadPrinted === false &&
  artifact.stockIdListPrinted === false;

console.log(
  JSON.stringify(
    {
      status: safeForStaging ? "candidate_post_run_review_ready_for_validation" : "candidate_post_run_review_blocked",
      artifactPath,
      aggregateOnly: true,
      requestedSymbolCount,
      requestedMonthCount,
      attemptedRequestCount: artifact.candidateRun?.attempted_request_count,
      failedRequestCount: artifact.candidateRun?.failed_request_count,
      candidatePriceRows: rows.length,
      firstTradeDate: dates[0] ?? null,
      lastTradeDate: dates.at(-1) ?? null,
      monthBucketCount: monthBuckets.size,
      expectedMinMonth,
      expectedMaxMonth,
      outOfWindowRows,
      duplicateSymbolDateCount: duplicateKeys,
      parserFlagCount,
      parserFlagSummary,
      safety: {
        sourcePayloadIncluded: artifact.sourcePayloadIncluded === false,
        sourceUrlPayloadIncluded: artifact.sourceUrlPayloadIncluded === false,
        secretsIncluded: artifact.secretsIncluded === false,
        sourcePayloadStored: artifact.sourcePayloadStored === false,
        sourceUrlPayloadPrinted: artifact.sourceUrlPayloadPrinted === false,
        stockIdListPrinted: artifact.stockIdListPrinted === false,
        sqlExecuted: false,
        supabaseConnectionAttempted: false,
        dailyPricesMutation: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      nextAction: safeForStaging
        ? "run sanitized row validator before any staging write discussion"
        : "repair runner date-window filtering and rerun a separately named bounded attempt"
    },
    null,
    2
  )
);

function latestCandidatePath() {
  const dir = "tmp/a1-full-twse-equity-candidates";
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith("-candidate.json"))
    .sort();
  if (files.length === 0) throw new Error(`No candidate artifacts found in ${dir}`);
  return path.join(dir, files.at(-1));
}

function countDuplicateSymbolDateRows(rowsToCheck) {
  const seen = new Set();
  let duplicates = 0;
  for (const row of rowsToCheck) {
    const key = `${row.symbol}|${row.trade_date}`;
    if (seen.has(key)) duplicates += 1;
    seen.add(key);
  }
  return duplicates;
}

function expectedOldestRequestedMonth(startedAt, monthCount) {
  const date = startedAt ? new Date(startedAt) : new Date();
  const oldest = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - Number(monthCount ?? 1) + 1, 1));
  return `${oldest.getUTCFullYear()}-${String(oldest.getUTCMonth() + 1).padStart(2, "0")}`;
}

function expectedNewestRequestedMonth(startedAt) {
  const date = startedAt ? new Date(startedAt) : new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
