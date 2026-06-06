import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_ATTEMPT_DECISION.md";
const reportPath = "scripts/report-tw-equity-bounded-staging-write-attempt-decision.mjs";
const checkerPath = "scripts/check-tw-equity-bounded-staging-write-attempt-decision.mjs";
const readinessReportPath = "scripts/report-tw-equity-staging-write-execution-readiness.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Bounded Staging Write Attempt Decision",
  "tw_equity_bounded_staging_write_attempt_named_not_executed",
  "TW-EQUITY-STAGING-WRITE-ATTEMPT-DECISION-2026-06-06-001",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "data/candidates/tw-equity-staging-candidate.json",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  "--candidate-input",
  "--rollback-dry-run --execute",
  "The attempt is named but not executed",
  "does not execute the write",
  "No retry is allowed without a separate new decision"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_bounded_staging_write_attempt_named_not_executed",
  "tw_equity_bounded_staging_write_attempt_decision_blocked_readiness_not_accepted",
  "tw_equity_staging_write_execution_ready_for_one_attempt",
  "candidateInputPriceRows === decision.maxRows",
  "stagingWriteExecutionAllowed === false",
  "executionAllowedByThisSlice: false",
  "executionRequiresNextSlice: true",
  "sameSlicePostRunReviewRequired: true",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "realSupabaseWrites: false",
  "stagingRowsCreated: false",
  "dailyPricesMutated: false",
  "marketDataFetched: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity bounded staging write attempt decision slice",
  "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_ATTEMPT_DECISION.md",
  "scripts/report-tw-equity-bounded-staging-write-attempt-decision.mjs",
  "tw_equity_bounded_staging_write_attempt_named_not_executed",
  "CEO named exactly one bounded TW equity staging write attempt",
  "execution remains separate",
  "No Supabase connection, SQL, write, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:tw-equity-bounded-staging-write-attempt-decision"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:tw-equity-bounded-staging-write-attempt-decision");
}
if (pkg.scripts?.["check:tw-equity-bounded-staging-write-attempt-decision"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:tw-equity-bounded-staging-write-attempt-decision");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) problems.push(`${pathName} missing bounded staging write attempt decision checker`);
  if (!text.includes("tw-equity-bounded-staging-write-attempt-decision")) {
    problems.push(`${pathName} missing tw-equity-bounded-staging-write-attempt-decision name`);
  }
}

if (!reviewGate.includes('"tw-equity-bounded-staging-write-attempt-decision"')) {
  problems.push("review gate core set missing tw-equity-bounded-staging-write-attempt-decision");
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  for (const pattern of [
    /\bfetch\s*\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /await import\("@supabase\/supabase-js"\)/u,
    /sb_secret_/u,
    /sb_publishable_/u
  ]) {
    if (pattern.test(text)) problems.push(`${pathName} contains forbidden token: ${pattern}`);
  }
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${reportPath} must exit 0`);
} else {
  const report = parseJson(result.stdout);
  if (report.status !== "tw_equity_bounded_staging_write_attempt_named_not_executed") {
    problems.push("report must name the attempt when readiness is accepted");
  }
  if (report.readiness?.status !== "tw_equity_staging_write_execution_ready_for_one_attempt") {
    problems.push(`report must consume ${readinessReportPath} ready status`);
  }
  if (report.readiness?.candidateInputPriceRows !== 180) problems.push("report must show 180 candidate price rows");
  if (report.decisionBoundary?.ceoNamedExactlyOneAttempt !== true) problems.push("CEO named attempt must be true");
  if (report.decisionBoundary?.executionAllowedByThisSlice !== false) problems.push("decision slice must not allow execution");
  if (report.decisionBoundary?.executionRequiresNextSlice !== true) problems.push("execution must require next slice");
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("report must keep publicDataSource and scoreSource mock");
  }
  for (const key of [
    "sqlExecuted",
    "realSupabaseConnectionAttempted",
    "realSupabaseWrites",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "serviceRoleKeyPrinted",
    "publicPromotionAllowed",
    "rowCoveragePointsAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (report.safety?.[key] !== false) problems.push(`report safety ${key} must be false`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("report output is not valid JSON");
    return {};
  }
}
