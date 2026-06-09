import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/PM_TWII_CANDIDATE_INTAKE_REVIEW.md";
const selfCheckDocPath = "docs/A1_TWII_CANDIDATE_ARTIFACT_SELF_CHECK.md";
const reportPath = "scripts/report-pm-twii-candidate-intake-review.mjs";
const checkerPath = "scripts/check-pm-twii-candidate-intake-review.mjs";
const selfCheckReportPath = "scripts/report-a1-twii-candidate-artifact-self-check.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const selfCheckDoc = read(selfCheckDocPath);
const reportSource = read(reportPath);
const selfCheckReport = read(selfCheckReportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "PM TWII Candidate Intake Review",
  "pm_twii_candidate_intake_review_ready_no_candidate_data",
  "pm_twii_candidate_intake_review_ready_for_report_only_dry_run_decision",
  "ready_for_next_report_only_dry_run_decision_only",
  "This review does not authorize report-only execution",
  "The remaining required steps are CEO naming exactly one bounded report-only attempt",
  "No candidate artifact is created in this slice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (!selfCheckDoc.includes("a1_twii_candidate_artifact_self_check_ready_no_candidate_data")) {
  problems.push(`${selfCheckDocPath} missing self-check ready status`);
}

for (const phrase of [
  "pm_twii_candidate_intake_review_ready_for_report_only_dry_run_decision",
  "pm_twii_candidate_intake_review_blocked_candidate_artifact_not_provided_or_invalid",
  "ready_for_next_report_only_dry_run_decision_only",
  "reportOnlyExecutionAllowed: false",
  "supabaseOperationAllowed: false",
  "dailyPricesMutationAllowed: false",
  "rowCoverageScoringAllowed: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (!selfCheckReport.includes("a1_twii_candidate_artifact_self_check_ready_for_pm_intake_review")) {
  problems.push(`${selfCheckReportPath} missing self-check ready status`);
}

if (pkg.scripts?.["report:pm-twii-candidate-intake-review"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:pm-twii-candidate-intake-review`);
}
if (pkg.scripts?.["check:pm-twii-candidate-intake-review"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:pm-twii-candidate-intake-review`);
}

for (const phrase of [
  "docs/PM_TWII_CANDIDATE_INTAKE_REVIEW.md",
  "scripts/report-pm-twii-candidate-intake-review.mjs",
  "pm_twii_candidate_intake_review_blocked_candidate_artifact_not_provided_or_invalid",
  "ready_for_next_report_only_dry_run_decision_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/PM_TWII_CANDIDATE_INTAKE_REVIEW.md` is `accepted` as PM TWII candidate intake review",
  "pm_twii_candidate_intake_review_ready_no_candidate_data",
  "ready_for_next_report_only_dry_run_decision_only"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-pm-twii-candidate-intake-review.mjs",
  "name: \"pm-twii-candidate-intake-review\"",
  "\"pm-twii-candidate-intake-review\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 when candidate artifact is missing`);
if (missingResult.output.status !== "pm_twii_candidate_intake_review_blocked_candidate_artifact_not_provided_or_invalid") {
  problems.push("missing artifact PM report must be blocked_candidate_artifact_not_provided_or_invalid");
}
if (missingResult.output.selfCheckReady !== false) problems.push("missing artifact PM report must not be self-check ready");
if (missingResult.output.authorizationBoundary?.reportOnlyExecutionAllowed !== false) {
  problems.push("PM intake must not authorize report-only execution");
}
assertSafety(missingResult.output.safety, "missing artifact PM safety");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-candidate-pm-intake-"));
const fixturePath = path.join(tempDir, "candidate.json");
fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
const fixtureResult = runReport(fixturePath);
fs.rmSync(tempDir, { recursive: true, force: true });

if (fixtureResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 for a valid sanitized fixture`);
if (fixtureResult.output.status !== "pm_twii_candidate_intake_review_ready_for_report_only_dry_run_decision") {
  problems.push("valid fixture PM report must be ready_for_report_only_dry_run_decision");
}
if (fixtureResult.output.selfCheckReady !== true) problems.push("valid fixture PM report must be self-check ready");
if (fixtureResult.output.decisionMeaning !== "ready_for_next_report_only_dry_run_decision_only") {
  problems.push("valid fixture PM report decisionMeaning mismatch");
}
assertSafety(fixtureResult.output.safety, "valid fixture PM safety");

for (const [filePath, text] of [
  [docPath, doc],
  [reportPath, reportSource],
  ["missing PM report output", JSON.stringify(missingResult.output)],
  ["valid fixture PM report output", JSON.stringify(fixtureResult.output)]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "pm_twii_candidate_intake_review_ready_no_candidate_data",
      missingPathStatus: missingResult.output.status,
      validFixtureStatus: fixtureResult.output.status,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function runReport(inputPath) {
  const result = spawnSync(process.execPath, [reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      A1_TWII_CANDIDATE_ARTIFACT_PATH: inputPath
    },
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  return {
    statusCode: result.status ?? 1,
    output: parseJson(result.stdout ?? "")
  };
}

function assertSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must keep publicDataSource and scoreSource mock`);
  }
  for (const key of [
    "candidateArtifactCreated",
    "sourceDerivedCandidateRowsCreated",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "serviceRoleKeyPrinted",
    "publicPromotionAllowed",
    "rowCoveragePointsAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function validFixture() {
  return {
    artifactId: "twii-candidate-artifact-contract-fixture",
    lane: "TWII",
    assetType: "index",
    symbol: "TWII",
    scope: "twii_index_daily_prices_missing_rows",
    sourceLane: "licensed-market-data-vendor",
    sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review",
    fieldContractVersion: "twii-v1",
    coverageWindowSessions: 60,
    alreadyObservedRows: 0,
    candidateMissingRows: 60,
    expectedRows: 60,
    reviewOutputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    aggregateValidation: {
      expectedRows: 60,
      candidateRows: 60,
      duplicateRows: 0,
      rejectedRows: 0,
      missingRows: 0,
      fieldNames: ["trade_date", "index_close", "source_row_hash"],
      validationStatus: "pending_pm_review"
    }
  };
}

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
    problems.push("PM report output is not valid JSON");
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /report-only execution is authorized/iu,
    /row coverage points awarded/iu
  ];
}
