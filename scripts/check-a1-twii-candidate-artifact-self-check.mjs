import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_TWII_CANDIDATE_ARTIFACT_SELF_CHECK.md";
const specPath = "docs/A1_TWII_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md";
const reportPath = "scripts/report-a1-twii-candidate-artifact-self-check.mjs";
const checkerPath = "scripts/check-a1-twii-candidate-artifact-self-check.mjs";
const validatorPath = "scripts/lib/twii-candidate-artifact-validator.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const spec = read(specPath);
const reportSource = read(reportPath);
const validatorSource = read(validatorPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "A1 TWII Candidate Artifact Self-Check",
  "a1_twii_candidate_artifact_self_check_ready_no_candidate_data",
  "A1_TWII_CANDIDATE_ARTIFACT_PATH",
  "data/candidates/twii-sanitized-candidate.json",
  "ready_for_pm_intake_review_only",
  "Passing self-check does not authorize TWII source retrieval",
  "No candidate artifact is created in this slice",
  "No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "A1 TWII Candidate Artifact Delivery Spec",
  "a1_twii_candidate_artifact_delivery_spec_ready_no_candidate_data",
  "`lane=TWII`",
  "`assetType=index`",
  "`symbol=TWII`",
  "`scope=twii_index_daily_prices_missing_rows`",
  "`coverageWindowSessions=60`",
  "`candidateMissingRows=60`",
  "`expectedRows=60`",
  "`reviewOutputPolicy=aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`",
  "`sanitizedAggregateOnly=true`",
  "`rawPayloadIncluded=false`",
  "`rowPayloadIncluded=false`",
  "`stockIdPayloadIncluded=false`",
  "`secretsIncluded=false`"
]) {
  if (!spec.includes(phrase)) problems.push(`${specPath} missing: ${phrase}`);
}

for (const phrase of [
  "a1_twii_candidate_artifact_self_check_ready_for_pm_intake_review",
  "a1_twii_candidate_artifact_self_check_blocked_candidate_artifact_not_provided_or_invalid",
  "A1_TWII_CANDIDATE_ARTIFACT_PATH",
  "ready_for_pm_intake_review_only",
  "candidateArtifactCreated: false",
  "sourceDerivedCandidateRowsCreated: false",
  "supabaseConnectionAttempted: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false",
  "dailyPricesMutated: false",
  "marketDataFetched: false",
  "rowPayloadsPrinted: false",
  "stockIdPayloadsPrinted: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "defaultTwiiCandidateArtifactPath",
  "twii-sanitized-candidate.json",
  "official-exchange-index",
  "licensed-market-data-vendor",
  "internal-approved-feed",
  "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
  "candidate_artifact_not_provided",
  "forbidden_key_"
]) {
  if (!validatorSource.includes(phrase)) problems.push(`${validatorPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:a1-twii-candidate-artifact-self-check"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:a1-twii-candidate-artifact-self-check`);
}
if (pkg.scripts?.["check:a1-twii-candidate-artifact-self-check"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:a1-twii-candidate-artifact-self-check`);
}

for (const phrase of [
  "Latest TWII candidate artifact contract/self-check slice",
  "docs/A1_TWII_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md",
  "scripts/report-a1-twii-candidate-artifact-self-check.mjs",
  "a1_twii_candidate_artifact_self_check_blocked_candidate_artifact_not_provided_or_invalid",
  "ready_for_pm_intake_review_only",
  "No filled TWII candidate artifact, source-derived candidate rows, market-data retrieval, Supabase connection/read/write, SQL, staging row, daily_prices mutation, row coverage point, public source promotion, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_TWII_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md` is `accepted` as A1 TWII candidate artifact delivery spec",
  "`docs/A1_TWII_CANDIDATE_ARTIFACT_SELF_CHECK.md` is `accepted` as A1 TWII candidate artifact self-check",
  "a1_twii_candidate_artifact_self_check_ready_no_candidate_data"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-a1-twii-candidate-artifact-self-check.mjs",
  "name: \"a1-twii-candidate-artifact-self-check\"",
  "\"a1-twii-candidate-artifact-self-check\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const missingResult = runReport("__missing__/twii-candidate.json");
if (missingResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 when candidate artifact is missing`);
if (missingResult.output.status !== "a1_twii_candidate_artifact_self_check_blocked_candidate_artifact_not_provided_or_invalid") {
  problems.push("missing artifact report status must be blocked_candidate_artifact_not_provided_or_invalid");
}
if (missingResult.output.candidateArtifactProvided !== false) problems.push("missing artifact must not be provided");
if (missingResult.output.readyForPmIntakeReview !== false) problems.push("missing artifact must not be PM-ready");
if (missingResult.output.authorizationBoundary?.reportOnlyExecutionAllowed !== false) {
  problems.push("self-check must not authorize report-only execution");
}
if (missingResult.output.authorizationBoundary?.stagingWriteExecutionAllowed !== false) {
  problems.push("self-check must not authorize staging write execution");
}
assertSafety(missingResult.output.safety, "missing artifact safety");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "twii-candidate-self-check-"));
const fixturePath = path.join(tempDir, "candidate.json");
fs.writeFileSync(fixturePath, JSON.stringify(validFixture(), null, 2));
const fixtureResult = runReport(fixturePath);
fs.rmSync(tempDir, { recursive: true, force: true });

if (fixtureResult.statusCode !== 0) problems.push(`${reportPath} must exit 0 for a valid sanitized fixture`);
if (fixtureResult.output.status !== "a1_twii_candidate_artifact_self_check_ready_for_pm_intake_review") {
  problems.push("valid fixture must be ready_for_pm_intake_review");
}
if (fixtureResult.output.readyForPmIntakeReview !== true) problems.push("valid fixture must be PM-ready");
if (fixtureResult.output.validation?.candidateArtifactAccepted !== true) {
  problems.push("valid fixture must be accepted by validator");
}
if (fixtureResult.output.validation?.summary?.candidateRows !== 60) {
  problems.push("valid fixture candidateRows summary must be 60");
}
assertSafety(fixtureResult.output.safety, "valid fixture safety");

for (const [filePath, text] of [
  [docPath, doc],
  [specPath, spec],
  [reportPath, reportSource],
  [validatorPath, validatorSource],
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
      guardedStatus: "a1_twii_candidate_artifact_self_check_ready_no_candidate_data",
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
    problems.push("report output is not valid JSON");
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
    /candidate artifact created:\s*true/iu,
    /source-derived candidate rows are generated/iu,
    /row coverage points awarded/iu
  ];
}
