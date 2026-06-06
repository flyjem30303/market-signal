import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-pm-tw-equity-candidate-intake-review.mjs";
const checkerPath = "scripts/check-pm-tw-equity-candidate-intake-review.mjs";
const docPath = "docs/PM_TW_EQUITY_CANDIDATE_INTAKE_REVIEW.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "pm_tw_equity_candidate_intake_review_blocked_candidate_artifact_not_provided",
  "pm_tw_equity_candidate_intake_review_ready_for_ceo_bounded_staging_write_decision",
  "ready_to_ask_ceo_to_name_exactly_one_bounded_staging_write_attempt",
  "blocked_waiting_for_a1_sanitized_candidate_artifact",
  "ready_for_ceo_bounded_staging_write_decision_only",
  "data/candidates/tw-equity-staging-candidate.json",
  "A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH",
  "sourcePayloadsPrinted: false",
  "rowPayloadsPrinted: false",
  "realSupabaseWrites: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "PM TW Equity Candidate Intake Review",
  "pm_tw_equity_candidate_intake_review_ready_no_candidate_data",
  "node scripts/report-pm-tw-equity-candidate-intake-review.mjs",
  "node scripts/check-pm-tw-equity-candidate-intake-review.mjs",
  "ready_for_ceo_bounded_staging_write_decision_only",
  "This review does not authorize staging write execution",
  "A1 self-check",
  "PM intake",
  "No candidate artifact is created in this slice",
  "No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest PM TW equity candidate intake review slice",
  "docs/PM_TW_EQUITY_CANDIDATE_INTAKE_REVIEW.md",
  "scripts/report-pm-tw-equity-candidate-intake-review.mjs",
  "pm_tw_equity_candidate_intake_review_blocked_candidate_artifact_not_provided",
  "PM can now collapse A1 self-check and PM intake into one CEO decision-ready summary",
  "passing PM review only means ready_for_ceo_bounded_staging_write_decision_only",
  "No candidate artifact, market-data fetch, Supabase connection, SQL, write, staging row, source payload output, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:pm-tw-equity-candidate-intake-review"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:pm-tw-equity-candidate-intake-review");
}
if (pkg.scripts?.["check:pm-tw-equity-candidate-intake-review"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:pm-tw-equity-candidate-intake-review");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) {
    problems.push(`${pathName} missing PM candidate intake review checker`);
  }
  if (!text.includes("pm-tw-equity-candidate-intake-review")) {
    problems.push(`${pathName} missing pm-tw-equity-candidate-intake-review name`);
  }
}

if (!reviewGate.includes('"pm-tw-equity-candidate-intake-review"')) {
  problems.push("review gate core set missing pm-tw-equity-candidate-intake-review");
}

for (const [pathName, text] of [
  [reportPath, reportSource],
  [docPath, doc]
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
  env: {
    ...process.env,
    A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH: "__missing__/candidate.json"
  },
  shell: false
});

if (result.status !== 0) problems.push(`${reportPath} must exit 0 even when candidate is missing`);
const report = parseJson(result.stdout);
if (report.status !== "pm_tw_equity_candidate_intake_review_blocked_candidate_artifact_not_provided") {
  problems.push("missing artifact PM review must be blocked_candidate_artifact_not_provided");
}
if (report.readyForCeoBoundedWriteDecision !== false) {
  problems.push("missing artifact PM review must not be ready for CEO bounded write decision");
}
if (report.authorizationBoundary?.stagingWriteExecutionAllowed !== false) {
  problems.push("PM review must not authorize staging write execution");
}
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("PM review safety must keep publicDataSource and scoreSource mock");
}
for (const key of [
  "sqlExecuted",
  "realSupabaseConnectionAttempted",
  "realSupabaseWrites",
  "stagingRowsCreated",
  "dailyPricesMutated",
  "marketDataFetched",
  "marketDataIngested",
  "sourcePayloadsPrinted",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "serviceRoleKeyPrinted",
  "publicPromotionAllowed",
  "rowCoveragePointsAllowed",
  "scoreSourceRealAllowed"
]) {
  if (report.safety?.[key] !== false) problems.push(`PM review safety ${key} must be false`);
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
