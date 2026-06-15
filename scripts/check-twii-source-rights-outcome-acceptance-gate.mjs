import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_ACCEPTANCE_GATE.md";
const recordPath = "data/source-gates/twii-source-rights-outcome-acceptance.json";
const candidateGatePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const bridgePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md";
const selectorPath = "docs/TWII_EXACT_EXECUTION_PREFLIGHT_REPAIR_SELECTOR.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const record = readJson(recordPath);
const candidateGate = read(candidateGatePath);
const bridge = read(bridgePath);
const selector = read(selectorPath);
const status = read(statusPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);

const bridgeReport = runJson("scripts/report-twii-source-rights-outcome-gate-bridge.mjs");
const exactSelectorReport = runJson("scripts/check-twii-exact-execution-preflight-repair-selector.mjs");

const requiredDocPhrases = [
  "Status: `twii_source_rights_outcome_accepted_for_next_gate_only_no_execution`",
  "Decision: `accept_twii_source_rights_outcome_for_field_contract_and_asset_mapping_gate_only`",
  "This is not legal clearance, source-data fetch permission, candidate generation permission, SQL permission, Supabase permission, row coverage permission, or runtime promotion.",
  "Accepted source-rights outcome scope: `next_gate_only`",
  "Next PM route: `twii_field_contract_asset_mapping_acceptance_gate`",
  "Selected source lane: `official-exchange-index`",
  "Fallback lanes remain `licensed-market-data-vendor` and `internal-approved-feed`",
  "Evidence ledger count: `4/4`",
  "Bridge status: `ready_for_twii_source_rights_outcome_gate_only`",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`",
  "TWII execution remains `false`",
  "No SQL, Supabase connection, Supabase read/write, staging rows, `daily_prices` mutation, market-data fetch, source-derived candidate generation, row coverage points, public source promotion, real score promotion, raw payload, row payload, stock id payload, or secrets are allowed by this gate."
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const requiredRecord = {
  status: "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution",
  decision: "accept_twii_source_rights_outcome_for_field_contract_and_asset_mapping_gate_only",
  selectedSourceLane: "official-exchange-index",
  acceptedScope: "next_gate_only",
  nextPMRoute: "twii_field_contract_asset_mapping_acceptance_gate",
  publicDataSource: "mock",
  scoreSource: "mock",
  twiiExecutionAllowedNow: false,
  sourceRightsBridgeReady: true,
  evidenceLedgerAcceptedCount: 4,
  requiredEvidenceCount: 4,
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

if (!Array.isArray(record?.stopLines) || record.stopLines.length < 10) {
  problems.push(`${recordPath} stopLines must list the no-execution boundaries`);
}

if (!Array.isArray(record?.evidenceSlots) || record.evidenceSlots.length !== 4) {
  problems.push(`${recordPath} evidenceSlots must contain the four accepted evidence ids`);
}

for (const id of [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
]) {
  if (!record?.evidenceSlots?.some((slot) => slot.id === id && slot.classification === "accepted_for_source_rights_outcome_gate_only")) {
    problems.push(`${recordPath} missing accepted evidence slot: ${id}`);
  }
}

for (const [path, source, phrase] of [
  [candidateGatePath, candidateGate, "Status: `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`"],
  [candidateGatePath, candidateGate, "`candidate_ready_no_execution_authority`"],
  [bridgePath, bridge, "Status: `twii_source_rights_outcome_gate_bridge_ready_evidence_pending`"],
  [selectorPath, selector, "Resolved Route - TWII Source-Rights Outcome Gate"],
  [selectorPath, selector, "Route id: `twii_source_rights_outcome_gate_acceptance`"],
  [selectorPath, selector, "Current posture: `resolved_next_gate_only_no_execution`"],
  [statusPath, status, "TWII Source-Rights Outcome Acceptance Gate"],
  [statusPath, status, "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution"],
  [reviewGatePath, reviewGate, "scripts/check-twii-source-rights-outcome-acceptance-gate.mjs"],
  [reviewGatePath, reviewGate, "twii-source-rights-outcome-acceptance-gate"]
]) {
  if (!source.includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:twii-source-rights-outcome-acceptance-gate"] !==
  "node scripts/check-twii-source-rights-outcome-acceptance-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twii-source-rights-outcome-acceptance-gate script`);
}

if (bridgeReport?.status !== "ready_for_twii_source_rights_outcome_gate_only") {
  problems.push("bridge report must be ready_for_twii_source_rights_outcome_gate_only");
}

if (bridgeReport?.canOpenTwiiSourceRightsOutcomeGate !== true) {
  problems.push("bridge report must allow opening the separate TWII source-rights outcome gate");
}

if (bridgeReport?.counts?.acceptedForSourceRightsOutcomeGateOnly !== 4 || bridgeReport?.counts?.required !== 4) {
  problems.push("bridge report must show 4/4 accepted evidence slots");
}

if (bridgeReport?.runtimeBoundary?.publicDataSource !== "mock" || bridgeReport?.runtimeBoundary?.scoreSource !== "mock") {
  problems.push("bridge report must keep mock/mock runtime boundary");
}

if (!exactSelectorReport?.resolvedRoutes?.includes("twii_source_rights_outcome_gate_acceptance")) {
  problems.push("exact execution selector must list source-rights outcome acceptance as resolved");
}

if (exactSelectorReport?.selectedNextRoute !== "twii_sanitized_candidate_artifact_readiness_gate") {
  problems.push("exact execution selector must now point to sanitized candidate artifact readiness");
}

if (exactSelectorReport?.twiiExecutionAllowedNow !== false) {
  problems.push("exact execution selector must keep TWII execution blocked");
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
  /legal clearance is approved/iu,
  /source[- ]data fetch permission is approved/iu,
  /candidate generation is approved/iu,
  /SQL permission is approved/iu,
  /Supabase permission is approved/iu,
  /daily_prices mutation is approved/iu,
  /row coverage points awarded/iu,
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
      guardedStatus: "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution",
      selectedSourceLane: record.selectedSourceLane,
      acceptedScope: record.acceptedScope,
      nextPMRoute: record.nextPMRoute,
      publicDataSource: record.publicDataSource,
      scoreSource: record.scoreSource,
      twiiExecutionAllowedNow: record.twiiExecutionAllowedNow,
      sourceRightsBridgeReady: bridgeReport.canOpenTwiiSourceRightsOutcomeGate,
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
