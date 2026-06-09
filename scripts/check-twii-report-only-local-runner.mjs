import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_REPORT_ONLY_LOCAL_RUNNER_IMPLEMENTATION_GATE.md";
const reportPath = "scripts/report-twii-report-only-local-runner.mjs";
const checkerPath = "scripts/check-twii-report-only-local-runner.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "TWII Report-Only Local Runner Implementation Gate",
  "twii_report_only_local_runner_implementation_gate_ready",
  "local sanitized aggregate-only TWII candidate artifact",
  "twii_report_only_local_runner_blocked_candidate_artifact_not_ready",
  "twii_report_only_local_runner_completed_aggregate_only",
  "No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_report_only_local_runner_completed_aggregate_only",
  "twii_report_only_local_runner_blocked_candidate_artifact_not_ready",
  "local_artifact_shape_only",
  "rawPayloadOutputAllowed: false",
  "remoteTwiiProbeAllowed: false",
  "localArtifactShapeRunnerExecuted: true",
  "remoteTwiiProbeExecuted: false",
  "marketDataFetched: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:twii-report-only-local-runner"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-report-only-local-runner`);
}
if (pkg.scripts?.["check:twii-report-only-local-runner"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-report-only-local-runner`);
}

for (const phrase of [
  "Latest TWII report-only local runner skeleton slice",
  "docs/TWII_REPORT_ONLY_LOCAL_RUNNER_IMPLEMENTATION_GATE.md",
  "scripts/report-twii-report-only-local-runner.mjs",
  "twii_report_only_local_runner_blocked_candidate_artifact_not_ready",
  "twii_report_only_local_runner_completed_aggregate_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_REPORT_ONLY_LOCAL_RUNNER_IMPLEMENTATION_GATE.md` is `accepted` as TWII report-only local runner implementation gate",
  "twii_report_only_local_runner_implementation_gate_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-report-only-local-runner.mjs",
  "name: \"twii-report-only-local-runner\"",
  "\"twii-report-only-local-runner\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 when candidate artifact is missing`);
if (missingResult.output.status !== "twii_report_only_local_runner_blocked_candidate_artifact_not_ready") {
  problems.push("missing artifact runner must be blocked_candidate_artifact_not_ready");
}
if (missingResult.output.localArtifactValidationCompleted !== false) {
  problems.push("missing artifact runner must not complete validation");
}
assertSafety(missingResult.output, "missing artifact runner");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-local-runner-"));
const fixturePath = path.join(tempDir, "candidate.json");
fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
const fixtureResult = runReport(fixturePath);
fs.rmSync(tempDir, { recursive: true, force: true });

if (fixtureResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 for a valid sanitized fixture`);
if (fixtureResult.output.status !== "twii_report_only_local_runner_completed_aggregate_only") {
  problems.push("valid fixture runner must complete aggregate-only");
}
if (fixtureResult.output.localArtifactValidationCompleted !== true) {
  problems.push("valid fixture runner must complete local artifact validation");
}
if (fixtureResult.output.validation?.aggregateSummary?.candidateRows !== 60) {
  problems.push("valid fixture runner candidateRows summary must be 60");
}
assertSafety(fixtureResult.output, "valid fixture runner");

for (const [filePath, text] of [
  [docPath, doc],
  [reportPath, reportSource],
  ["missing runner output", JSON.stringify(missingResult.output)],
  ["valid fixture runner output", JSON.stringify(fixtureResult.output)]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok", guardedStatus: "twii_report_only_local_runner_implementation_gate_ready" }, null, 2));

function runReport(inputPath) {
  const result = spawnSync(process.execPath, [reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, A1_TWII_CANDIDATE_ARTIFACT_PATH: inputPath },
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return { statusCode: result.status ?? 1, output: parseJson(result.stdout ?? "") };
}

function assertSafety(output, label) {
  if (output.authorizationBoundary?.remoteTwiiProbeAllowed !== false) problems.push(`${label} must not allow remote TWII probe`);
  if (output.authorizationBoundary?.supabaseOperationAllowed !== false) problems.push(`${label} must not allow Supabase operation`);
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  if (output.safety?.localArtifactShapeRunnerExecuted !== true) problems.push(`${label} must show local shape runner executed`);
  for (const key of [
    "remoteTwiiProbeExecuted",
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
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function validFixture() {
  return {
    artifactId: "twii-local-runner-fixture",
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
    problems.push("runner output is not valid JSON");
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
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u
  ];
}
