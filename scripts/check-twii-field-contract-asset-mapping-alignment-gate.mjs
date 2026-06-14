import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_FIELD_CONTRACT_ASSET_MAPPING_ALIGNMENT_GATE.md";
const recordPath = "data/source-gates/twii-field-contract-asset-mapping-alignment.json";
const sourceRightsAcceptancePath = "data/source-gates/twii-source-rights-outcome-acceptance.json";
const writePrerequisiteLedgerPath = "data/source-gates/twii-write-prerequisite-intake-ledger.json";
const writeConsolidationDocPath = "docs/TWII_WRITE_READINESS_PACKET_CONSOLIDATION.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const record = readJson(recordPath);
const sourceRightsAcceptance = readJson(sourceRightsAcceptancePath);
const writeLedger = readJson(writePrerequisiteLedgerPath);
const writeConsolidationDoc = read(writeConsolidationDocPath);
const status = read(statusPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);

const writeConsolidationReport = runJson("scripts/report-twii-write-readiness-packet-consolidation.mjs");
const sourceRightsAcceptanceReport = runJson("scripts/check-twii-source-rights-outcome-acceptance-gate.mjs");

for (const phrase of [
  "Status: `twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution`",
  "Decision: `align_twii_field_contract_and_asset_mapping_for_sanitized_candidate_gate_only`",
  "This alignment does not authorize source fetch, candidate row generation, SQL, Supabase connection, Supabase write, `daily_prices` mutation, row coverage scoring, public source promotion, or real scoring.",
  "Minimum accepted field contract: `trade_date + index_close + source_label + source_rights_status + validation_status`",
  "Accepted asset lane: `TWII:index`",
  "Target table remains `daily_prices`",
  "Target scope remains `twii_index_daily_prices_missing_rows`",
  "Next PM route: `twii_sanitized_candidate_artifact_readiness_gate`",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`",
  "TWII execution remains `false`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const requiredRecord = {
  status: "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution",
  decision: "align_twii_field_contract_and_asset_mapping_for_sanitized_candidate_gate_only",
  acceptedScope: "sanitized_candidate_gate_prep_only",
  symbol: "TWII",
  assetType: "index",
  assetLane: "TWII:index",
  targetTable: "daily_prices",
  targetScope: "twii_index_daily_prices_missing_rows",
  minimumFieldContract: "trade_date,index_close,source_label,source_rights_status,validation_status",
  optionalFieldsRemainSeparate: true,
  nextPMRoute: "twii_sanitized_candidate_artifact_readiness_gate",
  publicDataSource: "mock",
  scoreSource: "mock",
  twiiExecutionAllowedNow: false,
  sourceRightsOutcomeAccepted: true,
  fieldContractDecisionAccepted: true,
  assetMappingDecisionAccepted: true,
  rawPayloadIncluded: false,
  rowPayloadIncluded: false,
  stockIdPayloadIncluded: false,
  secretsIncluded: false,
  sqlAllowed: false,
  supabaseAllowed: false,
  dailyPricesMutationAllowed: false,
  marketDataFetchAllowed: false,
  candidateGenerationAllowed: false,
  rowCoverageAwardAllowed: false,
  runtimePromotionAllowed: false
};

for (const [key, expected] of Object.entries(requiredRecord)) {
  if (record?.[key] !== expected) {
    problems.push(`${recordPath} expected ${key}=${JSON.stringify(expected)} but found ${JSON.stringify(record?.[key])}`);
  }
}

if (!Array.isArray(record?.acceptedPrerequisiteSlots) || record.acceptedPrerequisiteSlots.length !== 3) {
  problems.push(`${recordPath} acceptedPrerequisiteSlots must contain source-rights, field-contract, and asset-mapping decisions`);
}

for (const slotId of ["source-rights-decision", "field-contract-decision", "asset-mapping-decision"]) {
  if (!record?.acceptedPrerequisiteSlots?.some((slot) => slot.slotId === slotId && slot.classification === "accepted")) {
    problems.push(`${recordPath} missing accepted prerequisite slot: ${slotId}`);
  }
}

if (!Array.isArray(record?.stopLines) || record.stopLines.length < 12) {
  problems.push(`${recordPath} stopLines must preserve no-execution boundaries`);
}

if (sourceRightsAcceptance?.status !== "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution") {
  problems.push(`${sourceRightsAcceptancePath} must have accepted source-rights outcome status`);
}

const acceptedLedgerSlots = Array.isArray(writeLedger?.outcomes)
  ? writeLedger.outcomes.filter((outcome) => outcome.classification === "accepted")
  : [];
if (acceptedLedgerSlots.length !== 6) {
  problems.push(`${writePrerequisiteLedgerPath} must contain 6 accepted prerequisite outcomes`);
}

for (const slotId of ["source-rights-decision", "field-contract-decision", "asset-mapping-decision"]) {
  if (!acceptedLedgerSlots.some((outcome) => outcome.slotId === slotId)) {
    problems.push(`${writePrerequisiteLedgerPath} missing accepted slot ${slotId}`);
  }
}

if (
  writeConsolidationReport?.status !==
  "twii_write_readiness_packet_consolidation_prerequisites_accepted_future_gate_ready"
) {
  problems.push("write readiness consolidation report must be future-gate ready");
}

if (writeConsolidationReport?.futureCandidateGateAllowed !== true) {
  problems.push("write readiness consolidation must allow future candidate gate preparation only");
}

if (writeConsolidationReport?.implementationAllowedNow !== false) {
  problems.push("write readiness consolidation must keep implementationAllowedNow=false");
}

if (sourceRightsAcceptanceReport?.guardedStatus !== "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution") {
  problems.push("source-rights outcome acceptance gate must be green");
}

for (const [path, source, phrase] of [
  [writeConsolidationDocPath, writeConsolidationDoc, "Status: `twii_write_readiness_packet_consolidation_prerequisites_accepted_future_gate_ready`"],
  [writeConsolidationDocPath, writeConsolidationDoc, "Field-contract decision | `accepted_for_candidate_gate_prep`"],
  [writeConsolidationDocPath, writeConsolidationDoc, "Asset-mapping decision | `accepted_for_candidate_gate_prep`"],
  [statusPath, status, "TWII Field Contract Asset Mapping Alignment Gate"],
  [statusPath, status, "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution"],
  [reviewGatePath, reviewGate, "scripts/check-twii-field-contract-asset-mapping-alignment-gate.mjs"],
  [reviewGatePath, reviewGate, "twii-field-contract-asset-mapping-alignment-gate"]
]) {
  if (!source.includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:twii-field-contract-asset-mapping-alignment-gate"] !==
  "node scripts/check-twii-field-contract-asset-mapping-alignment-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twii-field-contract-asset-mapping-alignment-gate script`);
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
  /source fetch is approved/iu,
  /candidate row generation is approved/iu,
  /SQL is approved/iu,
  /Supabase connection is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
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
      nextPMRoute: record.nextPMRoute,
      assetLane: record.assetLane,
      targetTable: record.targetTable,
      targetScope: record.targetScope,
      publicDataSource: record.publicDataSource,
      scoreSource: record.scoreSource,
      twiiExecutionAllowedNow: record.twiiExecutionAllowedNow,
      futureCandidateGateAllowed: writeConsolidationReport.futureCandidateGateAllowed,
      problems: []
    },
    null,
    2
  )
);

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
