import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_DECISION.md";
const reportPath = "scripts/report-tw-equity-second-bounded-staging-write-retry-decision.mjs";
const checkerPath = "scripts/check-tw-equity-second-bounded-staging-write-retry-decision.mjs";
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
  "TW Equity Second Bounded Staging Write Retry Decision",
  "tw_equity_second_bounded_staging_write_retry_named_not_executed",
  "AUTHORIZE_NEXT_SLICE_SECOND_BOUNDED_STAGING_WRITE_RETRY_IF_RUNNER_CONTRACT_ALIGNED",
  "TW-EQUITY-STAGING-WRITE-RETRY-DECISION-2026-06-06-001",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
  "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
  "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
  "data/candidates/tw-equity-staging-candidate.json",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "--rollback-dry-run --execute",
  "Runner alignment is not a write attempt",
  "STOP-001 this decision packet does not execute the retry",
  "no retry beyond this one named future attempt is authorized",
  "NEXT-SLICE-001 align the guarded write runner contract"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_second_bounded_staging_write_retry_named_not_executed",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
  "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
  "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
  "runnerContractAlignmentRequiredBeforeExecution: true",
  "executionAllowedByThisSlice: false",
  "executionRequiresNextSlice: true",
  "freshPostRunReviewRequired: true",
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
  "Latest TW equity second bounded staging write retry decision slice",
  "docs/TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_DECISION.md",
  "scripts/report-tw-equity-second-bounded-staging-write-retry-decision.mjs",
  "scripts/check-tw-equity-second-bounded-staging-write-retry-decision.mjs",
  "tw_equity_second_bounded_staging_write_retry_named_not_executed",
  "second bounded staging write retry is named but not executed",
  "runner contract alignment is required before any second write attempt",
  "No Supabase connection, SQL, write retry, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:tw-equity-second-bounded-staging-write-retry-decision"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:tw-equity-second-bounded-staging-write-retry-decision");
}
if (pkg.scripts?.["check:tw-equity-second-bounded-staging-write-retry-decision"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:tw-equity-second-bounded-staging-write-retry-decision");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) problems.push(`${pathName} missing second bounded staging write retry decision checker`);
  if (!text.includes("tw-equity-second-bounded-staging-write-retry-decision")) {
    problems.push(`${pathName} missing tw-equity-second-bounded-staging-write-retry-decision name`);
  }
}

if (!reviewGate.includes('"tw-equity-second-bounded-staging-write-retry-decision"')) {
  problems.push("review gate core set missing tw-equity-second-bounded-staging-write-retry-decision");
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
  if (report.status !== "tw_equity_second_bounded_staging_write_retry_named_not_executed") {
    problems.push("report must name the second retry attempt without execution");
  }
  if (report.decision?.authorizationId !== "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002") {
    problems.push("report must use AUTH-002");
  }
  if (report.decisionBoundary?.executionAllowedByThisSlice !== false) {
    problems.push("decision slice must not allow execution");
  }
  if (report.decisionBoundary?.runnerAlignmentRequiredBeforeExecution !== true) {
    problems.push("runner alignment must be required before execution");
  }
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
