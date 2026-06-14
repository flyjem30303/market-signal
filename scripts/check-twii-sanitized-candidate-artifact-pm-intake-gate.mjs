import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_SANITIZED_CANDIDATE_ARTIFACT_PM_INTAKE_GATE.md";
const recordPath = "data/source-gates/twii-sanitized-candidate-artifact-pm-intake.json";
const candidatePath = "data/candidates/twii-sanitized-candidate.json";
const alignmentRecordPath = "data/source-gates/twii-field-contract-asset-mapping-alignment.json";
const sourceRightsRecordPath = "data/source-gates/twii-source-rights-outcome-acceptance.json";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const record = readJson(recordPath);
const candidate = readJson(candidatePath);
const alignmentRecord = readJson(alignmentRecordPath);
const sourceRightsRecord = readJson(sourceRightsRecordPath);
const status = read(statusPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);

const handoffReport = runJson("scripts/report-twii-sanitized-candidate-artifact-chain-handoff.mjs");
const alignmentReport = runJson("scripts/check-twii-field-contract-asset-mapping-alignment-gate.mjs");

for (const phrase of [
  "Status: `twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain`",
  "Decision: `accept_twii_sanitized_candidate_artifact_for_no_write_dry_run_chain_only`",
  "Candidate artifact path: `data/candidates/twii-sanitized-candidate.json`",
  "Artifact id: `twii-sanitized-candidate-20260609`",
  "Target scope: `twii_index_daily_prices_missing_rows`",
  "Expected rows: `60`",
  "Candidate rows: `60`",
  "Duplicate rows: `0`",
  "Rejected rows: `0`",
  "Missing rows: `0`",
  "Next PM route: `twii_report_only_dry_run_chain_gate`",
  "This intake does not authorize SQL, Supabase connection, Supabase read/write, staging rows, `daily_prices` mutation, market-data fetch, source-derived candidate row generation, row coverage scoring, public source promotion, or real scoring.",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`",
  "TWII execution remains `false`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const requiredRecord = {
  status: "twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain",
  decision: "accept_twii_sanitized_candidate_artifact_for_no_write_dry_run_chain_only",
  acceptedScope: "no_write_dry_run_chain_only",
  candidateArtifactPath: candidatePath,
  artifactId: "twii-sanitized-candidate-20260609",
  lane: "TWII",
  assetType: "index",
  symbol: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  sourceLane: "official-exchange-index",
  fieldContractVersion: "twii-v1",
  expectedRows: 60,
  candidateRows: 60,
  duplicateRows: 0,
  rejectedRows: 0,
  missingRows: 0,
  rawPayloadIncluded: false,
  rowPayloadIncluded: false,
  stockIdPayloadIncluded: false,
  secretsIncluded: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  twiiExecutionAllowedNow: false,
  nextPMRoute: "twii_report_only_dry_run_chain_gate",
  sqlAllowed: false,
  supabaseAllowed: false,
  dailyPricesMutationAllowed: false,
  marketDataFetchAllowed: false,
  sourceDerivedCandidateGenerationAllowed: false,
  rowCoverageAwardAllowed: false,
  runtimePromotionAllowed: false
};

for (const [key, expected] of Object.entries(requiredRecord)) {
  if (record?.[key] !== expected) {
    problems.push(`${recordPath} expected ${key}=${JSON.stringify(expected)} but found ${JSON.stringify(record?.[key])}`);
  }
}

if (!Array.isArray(record?.acceptedEvidence) || record.acceptedEvidence.length < 3) {
  problems.push(`${recordPath} acceptedEvidence must reference prior source-rights, field-contract, and handoff gates`);
}

for (const id of [
  "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution",
  "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution",
  "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet"
]) {
  if (!record?.acceptedEvidence?.some((item) => item.status === id)) {
    problems.push(`${recordPath} missing accepted evidence status: ${id}`);
  }
}

if (candidate?.artifactId !== "twii-sanitized-candidate-20260609") problems.push(`${candidatePath} artifactId mismatch`);
if (candidate?.lane !== "TWII") problems.push(`${candidatePath} lane mismatch`);
if (candidate?.assetType !== "index") problems.push(`${candidatePath} assetType mismatch`);
if (candidate?.symbol !== "TWII") problems.push(`${candidatePath} symbol mismatch`);
if (candidate?.scope !== "twii_index_daily_prices_missing_rows") problems.push(`${candidatePath} scope mismatch`);
if (candidate?.sourceLane !== "official-exchange-index") problems.push(`${candidatePath} sourceLane mismatch`);
if (candidate?.fieldContractVersion !== "twii-v1") problems.push(`${candidatePath} fieldContractVersion mismatch`);
if (candidate?.expectedRows !== 60 || candidate?.candidateMissingRows !== 60) {
  problems.push(`${candidatePath} expectedRows and candidateMissingRows must both be 60`);
}
if (candidate?.sanitizedAggregateOnly !== true) problems.push(`${candidatePath} must be sanitizedAggregateOnly=true`);
for (const flag of ["rawPayloadIncluded", "rowPayloadIncluded", "stockIdPayloadIncluded", "secretsIncluded"]) {
  if (candidate?.[flag] !== false) problems.push(`${candidatePath} ${flag} must be false`);
}
if (candidate?.aggregateValidation?.candidateRows !== 60) problems.push(`${candidatePath} aggregate candidateRows must be 60`);
if (candidate?.aggregateValidation?.duplicateRows !== 0) problems.push(`${candidatePath} aggregate duplicateRows must be 0`);
if (candidate?.aggregateValidation?.rejectedRows !== 0) problems.push(`${candidatePath} aggregate rejectedRows must be 0`);
if (candidate?.aggregateValidation?.missingRows !== 0) problems.push(`${candidatePath} aggregate missingRows must be 0`);

if (sourceRightsRecord?.status !== "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution") {
  problems.push(`${sourceRightsRecordPath} must be accepted for next gate only`);
}
if (alignmentRecord?.status !== "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution") {
  problems.push(`${alignmentRecordPath} must be aligned for sanitized candidate gate`);
}

if (handoffReport?.status !== "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet") {
  problems.push("handoff report must be ready for named packet");
}
if (handoffReport?.validation?.accepted !== true) problems.push("handoff validation must be accepted");
if (handoffReport?.validation?.summary?.candidateRows !== 60) problems.push("handoff summary candidateRows must be 60");
for (const flag of ["rawPayloadIncluded", "rowPayloadIncluded", "stockIdPayloadIncluded", "secretsIncluded"]) {
  if (handoffReport?.validation?.summary?.[flag] !== false) problems.push(`handoff summary ${flag} must be false`);
}
assertSafety(handoffReport?.safety, "handoff safety");

if (alignmentReport?.guardedStatus !== "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution") {
  problems.push("alignment gate must be green");
}

for (const [path, source, phrase] of [
  [statusPath, status, "TWII Sanitized Candidate Artifact PM Intake Gate"],
  [statusPath, status, "twii_sanitized_candidate_artifact_pm_intake_accepted_for_no_write_dry_run_chain"],
  [reviewGatePath, reviewGate, "scripts/check-twii-sanitized-candidate-artifact-pm-intake-gate.mjs"],
  [reviewGatePath, reviewGate, "twii-sanitized-candidate-artifact-pm-intake-gate"]
]) {
  if (!source.includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:twii-sanitized-candidate-artifact-pm-intake-gate"] !==
  "node scripts/check-twii-sanitized-candidate-artifact-pm-intake-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twii-sanitized-candidate-artifact-pm-intake-gate script`);
}

const forbiddenSources = [
  [docPath, doc],
  [recordPath, fs.existsSync(recordPath) ? fs.readFileSync(recordPath, "utf8") : ""]
];

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /SQL is approved/iu,
  /Supabase connection is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
  /market-data fetch is approved/iu,
  /row coverage scoring is approved/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const [path, source] of forbiddenSources) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) problems.push(`${path} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: record.status,
      candidateArtifactPath: record.candidateArtifactPath,
      artifactId: record.artifactId,
      candidateRows: record.candidateRows,
      nextPMRoute: record.nextPMRoute,
      publicDataSource: record.publicDataSource,
      scoreSource: record.scoreSource,
      twiiExecutionAllowedNow: record.twiiExecutionAllowedNow,
      problems: []
    },
    null,
    2
  )
);

function assertSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`${filePath} invalid JSON: ${error.message}`);
    return null;
  }
}

function runJson(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    problems.push(`${scriptPath} failed with exit ${result.status}: ${result.stderr || result.stdout}`);
    return null;
  }
  const start = result.stdout.indexOf("{");
  if (start < 0) {
    problems.push(`${scriptPath} did not print JSON`);
    return null;
  }
  try {
    return JSON.parse(result.stdout.slice(start));
  } catch (error) {
    problems.push(`${scriptPath} output invalid JSON: ${error.message}`);
    return null;
  }
}
