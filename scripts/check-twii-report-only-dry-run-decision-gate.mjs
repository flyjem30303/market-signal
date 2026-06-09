import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_REPORT_ONLY_DRY_RUN_DECISION_GATE.md";
const runnerContractPath = "docs/TWII_REPORT_ONLY_DRY_RUN_RUNNER_CONTRACT.md";
const reportPath = "scripts/report-twii-report-only-dry-run-decision-gate.mjs";
const checkerPath = "scripts/check-twii-report-only-dry-run-decision-gate.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const runnerContract = read(runnerContractPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "TWII Report-Only Dry-Run Decision Gate",
  "twii_report_only_dry_run_decision_gate_ready_no_execution",
  "twii_report_only_dry_run_decision_gate_blocked_candidate_artifact_not_ready",
  "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision",
  "Ready means CEO may name exactly one future bounded report-only dry-run attempt",
  "This gate stops before report-only execution",
  "No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "TWII Report-Only Dry-Run Runner Contract",
  "twii_report_only_dry_run_runner_contract_ready_not_implemented",
  "It is not the runner implementation",
  "execute at most once per named attempt",
  "supabaseConnectionAttempted=false",
  "sqlExecuted=false",
  "dailyPricesMutated=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!runnerContract.includes(phrase)) problems.push(`${runnerContractPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision",
  "twii_report_only_dry_run_decision_gate_blocked_candidate_artifact_not_ready",
  "ready_to_name_one_future_bounded_report_only_dry_run_attempt_only",
  "maximumExecutions: 1",
  "reportOnlyRunnerExecutionAllowedNow: false",
  "reportOnlyRunnerImplementationAllowedNow: false",
  "supabaseOperationAllowed: false",
  "reportOnlyRunnerExecuted: false",
  "marketDataFetched: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:twii-report-only-dry-run-decision-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-report-only-dry-run-decision-gate`);
}
if (pkg.scripts?.["check:twii-report-only-dry-run-decision-gate"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-report-only-dry-run-decision-gate`);
}

for (const phrase of [
  "Latest TWII report-only dry-run decision gate slice",
  "docs/TWII_REPORT_ONLY_DRY_RUN_DECISION_GATE.md",
  "docs/TWII_REPORT_ONLY_DRY_RUN_RUNNER_CONTRACT.md",
  "scripts/report-twii-report-only-dry-run-decision-gate.mjs",
  "twii_report_only_dry_run_decision_gate_blocked_candidate_artifact_not_ready",
  "ready_to_name_one_future_bounded_report_only_dry_run_attempt_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_REPORT_ONLY_DRY_RUN_DECISION_GATE.md` is `accepted` as CEO/PM TWII report-only dry-run decision gate",
  "`docs/TWII_REPORT_ONLY_DRY_RUN_RUNNER_CONTRACT.md` is `accepted` as TWII report-only runner contract",
  "twii_report_only_dry_run_decision_gate_ready_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-report-only-dry-run-decision-gate.mjs",
  "name: \"twii-report-only-dry-run-decision-gate\"",
  "\"twii-report-only-dry-run-decision-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 when candidate artifact is missing`);
if (missingResult.output.status !== "twii_report_only_dry_run_decision_gate_blocked_candidate_artifact_not_ready") {
  problems.push("missing artifact decision gate must be blocked_candidate_artifact_not_ready");
}
if (missingResult.output.pmIntakeReady !== false) problems.push("missing artifact decision gate must not be PM-intake ready");
assertSafety(missingResult.output, "missing artifact decision gate");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-report-only-decision-"));
const fixturePath = path.join(tempDir, "candidate.json");
fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
const fixtureResult = runReport(fixturePath);
fs.rmSync(tempDir, { recursive: true, force: true });

if (fixtureResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 for a valid sanitized fixture`);
if (fixtureResult.output.status !== "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision") {
  problems.push("valid fixture decision gate must be ready_for_named_attempt_decision");
}
if (fixtureResult.output.pmIntakeReady !== true) problems.push("valid fixture decision gate must be PM-intake ready");
if (fixtureResult.output.futureNamedAttemptRequirements?.maximumExecutions !== 1) {
  problems.push("valid fixture decision gate must limit future attempt to one execution");
}
assertSafety(fixtureResult.output, "valid fixture decision gate");

for (const [filePath, text] of [
  [docPath, doc],
  [runnerContractPath, runnerContract],
  [reportPath, reportSource],
  ["missing report output", JSON.stringify(missingResult.output)],
  ["valid fixture report output", JSON.stringify(fixtureResult.output)]
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
      guardedStatus: "twii_report_only_dry_run_decision_gate_ready_no_execution",
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
    artifactId: "twii-report-only-decision-fixture",
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
    problems.push("decision gate output is not valid JSON");
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
