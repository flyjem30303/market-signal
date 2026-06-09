import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/PM_TWII_REPORT_ONLY_DRY_RUN_PREFLIGHT.md";
const decisionDocPath = "docs/TWII_REPORT_ONLY_DRY_RUN_DECISION_GATE.md";
const reportPath = "scripts/report-pm-twii-report-only-dry-run-preflight.mjs";
const checkerPath = "scripts/check-pm-twii-report-only-dry-run-preflight.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const decisionDoc = read(decisionDocPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "PM TWII Report-Only Dry-Run Preflight",
  "pm_twii_report_only_dry_run_preflight_ready_no_execution",
  "If blocked, PM routes A1 back to candidate artifact self-check and PM intake review",
  "If ready, PM may ask CEO to name exactly one future bounded report-only dry-run attempt",
  "No report-only runner is executed in this slice"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (!decisionDoc.includes("twii_report_only_dry_run_decision_gate_ready_no_execution")) {
  problems.push(`${decisionDocPath} missing decision gate ready status`);
}

for (const phrase of [
  "pm_twii_report_only_dry_run_preflight_ready_to_request_ceo_named_attempt",
  "pm_twii_report_only_dry_run_preflight_blocked_candidate_artifact_not_ready",
  "reportOnlyRunnerExecutionAllowedNow: false",
  "reportOnlyRunnerImplementationAllowedNow: false",
  "supabaseOperationAllowed: false",
  "reportOnlyRunnerExecuted: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:pm-twii-report-only-dry-run-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:pm-twii-report-only-dry-run-preflight`);
}
if (pkg.scripts?.["check:pm-twii-report-only-dry-run-preflight"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:pm-twii-report-only-dry-run-preflight`);
}

for (const phrase of [
  "docs/PM_TWII_REPORT_ONLY_DRY_RUN_PREFLIGHT.md",
  "scripts/report-pm-twii-report-only-dry-run-preflight.mjs",
  "pm_twii_report_only_dry_run_preflight_blocked_candidate_artifact_not_ready",
  "pm_twii_report_only_dry_run_preflight_ready_to_request_ceo_named_attempt"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/PM_TWII_REPORT_ONLY_DRY_RUN_PREFLIGHT.md` is `accepted` as PM TWII report-only dry-run preflight",
  "pm_twii_report_only_dry_run_preflight_ready_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-pm-twii-report-only-dry-run-preflight.mjs",
  "name: \"pm-twii-report-only-dry-run-preflight\"",
  "\"pm-twii-report-only-dry-run-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 when candidate artifact is missing`);
if (missingResult.output.status !== "pm_twii_report_only_dry_run_preflight_blocked_candidate_artifact_not_ready") {
  problems.push("missing artifact PM preflight must be blocked_candidate_artifact_not_ready");
}
if (missingResult.output.decisionReady !== false) problems.push("missing artifact PM preflight must not be decision-ready");
assertSafety(missingResult.output, "missing artifact PM preflight");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-report-only-preflight-"));
const fixturePath = path.join(tempDir, "candidate.json");
fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
const fixtureResult = runReport(fixturePath);
fs.rmSync(tempDir, { recursive: true, force: true });

if (fixtureResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 for a valid sanitized fixture`);
if (fixtureResult.output.status !== "pm_twii_report_only_dry_run_preflight_ready_to_request_ceo_named_attempt") {
  problems.push("valid fixture PM preflight must be ready_to_request_ceo_named_attempt");
}
if (fixtureResult.output.decisionReady !== true) problems.push("valid fixture PM preflight must be decision-ready");
assertSafety(fixtureResult.output, "valid fixture PM preflight");

for (const [filePath, text] of [
  [docPath, doc],
  [reportPath, reportSource],
  ["missing PM preflight output", JSON.stringify(missingResult.output)],
  ["valid fixture PM preflight output", JSON.stringify(fixtureResult.output)]
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
      guardedStatus: "pm_twii_report_only_dry_run_preflight_ready_no_execution",
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

function assertSafety(output, label) {
  if (output.authorizationBoundary?.reportOnlyRunnerExecutionAllowedNow !== false) {
    problems.push(`${label} must not authorize runner execution`);
  }
  if (output.authorizationBoundary?.supabaseOperationAllowed !== false) {
    problems.push(`${label} must not authorize Supabase operation`);
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must keep publicDataSource and scoreSource mock`);
  }
  for (const key of [
    "candidateArtifactCreated",
    "sourceDerivedCandidateRowsCreated",
    "reportOnlyRunnerExecuted",
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
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function validFixture() {
  return {
    artifactId: "twii-report-only-preflight-fixture",
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
    problems.push("PM preflight output is not valid JSON");
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
    /report-only runner executed:\s*true/iu,
    /row coverage points awarded/iu
  ];
}
