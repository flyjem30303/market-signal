import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md";
const reportPath = "scripts/report-a1-twii-sanitized-candidate-artifact-readiness-gate.mjs";
const checkPath = "scripts/check-a1-twii-sanitized-candidate-artifact-readiness-gate.mjs";
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
  "A1 TWII Sanitized Candidate Artifact Readiness Gate",
  "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data",
  "twii_source_rights_outcome_gate_candidate_ready_for_pm_review",
  "D/A1 exact evidence intake: `4/4` TWII slots accepted",
  "TWII bridge ledger: `4/4` evidence outcomes accepted for a separate source-rights outcome gate only",
  "Level 1 MVP row coverage remains `182/360`",
  "TWII sub-scope remains `0/60`",
  "TWII target candidate coverage window remains `60` sessions",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`artifactId`",
  "`lane`",
  "`assetType`",
  "`symbol`",
  "`scope`",
  "`sourceLane`",
  "`sourceRightsGateStatus`",
  "`fieldContractVersion`",
  "`coverageWindowSessions`",
  "`alreadyObservedRows`",
  "`candidateMissingRows`",
  "`expectedRows`",
  "`reviewOutputPolicy`",
  "`sanitizedAggregateOnly`",
  "`rawPayloadIncluded`",
  "`rowPayloadIncluded`",
  "`stockIdPayloadIncluded`",
  "`secretsIncluded`",
  "source_rights_candidate_review_passed",
  "field_contract_reference_attached",
  "artifact_contract_confirmed",
  "sanitized_aggregate_policy_confirmed",
  "post_run_review_template_ready",
  "readback_gate_ready",
  "does not create a filled TWII candidate artifact",
  "does not generate source-derived TWII candidate rows",
  "does not run SQL",
  "does not read Supabase",
  "does not write Supabase",
  "does not fetch raw market data",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data",
  "source_rights_candidate_review_passed",
  "field_contract_reference_attached",
  "artifact_contract_confirmed",
  "sanitized_aggregate_policy_confirmed",
  "post_run_review_template_ready",
  "readback_gate_ready",
  "twii_index_daily_prices_missing_rows",
  "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
  "candidateArtifactCreated: false",
  "sourceDerivedCandidateRowsCreated: false",
  "supabaseConnectionAttempted: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false",
  "dailyPricesMutated: false",
  "marketDataFetched: false",
  "rawPayloadsPrinted: false",
  "rowPayloadsPrinted: false",
  "stockIdPayloadsPrinted: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-twii-sanitized-candidate-artifact-readiness-gate"] !==
  "node scripts/report-a1-twii-sanitized-candidate-artifact-readiness-gate.mjs"
) {
  problems.push(`${packagePath} missing report:a1-twii-sanitized-candidate-artifact-readiness-gate`);
}
if (
  pkg.scripts?.["check:a1-twii-sanitized-candidate-artifact-readiness-gate"] !==
  "node scripts/check-a1-twii-sanitized-candidate-artifact-readiness-gate.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-sanitized-candidate-artifact-readiness-gate`);
}

for (const phrase of [
  "Latest TWII sanitized candidate artifact readiness gate slice",
  "docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md",
  "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data",
  "No filled TWII candidate artifact, source-derived candidate rows, market-data fetch, Supabase connection/read/write, SQL, staging row, daily_prices mutation, row coverage point, public source promotion, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md` is `accepted` as A1/PM TWII sanitized candidate artifact readiness gate",
  "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-a1-twii-sanitized-candidate-artifact-readiness-gate.mjs",
  "name: \"a1-twii-sanitized-candidate-artifact-readiness-gate\"",
  "\"a1-twii-sanitized-candidate-artifact-readiness-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(result.stdout ?? "");

if (result.status !== 0) problems.push(`${reportPath} must exit 0`);
if (report.status !== "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data") {
  problems.push("report status must stay ready_no_candidate_data");
}
if (report.mode !== "a1_twii_sanitized_candidate_artifact_readiness_gate") problems.push("report mode mismatch");
if (report.requiredArtifactContract?.lane !== "TWII") problems.push("artifact lane must be TWII");
if (report.requiredArtifactContract?.assetType !== "index") problems.push("artifact assetType must be index");
if (report.requiredArtifactContract?.symbol !== "TWII") problems.push("artifact symbol must be TWII");
if (report.requiredArtifactContract?.expectedRows !== 60) problems.push("artifact expectedRows must be 60");
if (report.requiredArtifactContract?.candidateMissingRows !== 60) problems.push("artifact candidateMissingRows must be 60");
if (report.requiredArtifactContract?.sanitizedAggregateOnly !== true) problems.push("artifact must be aggregate only");
for (const flag of ["rawPayloadIncluded", "rowPayloadIncluded", "stockIdPayloadIncluded", "secretsIncluded"]) {
  if (report.requiredArtifactContract?.[flag] !== false) problems.push(`artifact ${flag} must be false`);
}
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("runtime boundary must stay mock/mock");
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
  "marketDataStored",
  "marketDataCommitted",
  "rawPayloadsPrinted",
  "rowPayloadsPrinted",
  "stockIdPayloadsPrinted",
  "secretsPrinted",
  "serviceRoleKeyPrinted",
  "publicPromotionAllowed",
  "rowCoveragePointsAllowed",
  "scoreSourceRealAllowed"
]) {
  if (report.safety?.[key] !== false) problems.push(`report.safety.${key} must be false`);
}

for (const [filePath, text] of [
  [docPath, doc],
  [reportPath, reportSource],
  ["report output", result.stdout ?? ""]
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
      guardedStatus: "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data",
      expectedRows: report.requiredArtifactContract.expectedRows,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
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
    /candidate artifact is created/iu,
    /source-derived TWII candidate rows are generated/iu,
    /row coverage points awarded/iu
  ];
}
