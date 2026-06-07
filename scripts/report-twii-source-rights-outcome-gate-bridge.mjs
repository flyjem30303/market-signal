import fs from "node:fs";

const ledgerPath = "data/source-gates/twii-vendor-internal-evidence-outcomes.json";
const requiredClassification = "accepted_for_source_rights_outcome_gate_only";

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const outcomes = Array.isArray(ledger.outcomes) ? ledger.outcomes : [];

const requiredIds = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const byId = new Map(outcomes.map((outcome) => [outcome.id, outcome]));
const missingRequiredIds = requiredIds.filter((id) => !byId.has(id));
const acceptedIds = requiredIds.filter((id) => byId.get(id)?.classification === requiredClassification);
const notAccepted = requiredIds
  .filter((id) => byId.get(id)?.classification !== requiredClassification)
  .map((id) => ({
    id,
    classification: byId.get(id)?.classification ?? "missing"
  }));

const canOpenTwiiSourceRightsOutcomeGate = missingRequiredIds.length === 0 && acceptedIds.length === requiredIds.length;
const status = canOpenTwiiSourceRightsOutcomeGate
  ? "ready_for_twii_source_rights_outcome_gate_only"
  : "blocked_waiting_twii_vendor_internal_evidence";

const report = {
  mode: "twii_source_rights_outcome_gate_bridge",
  status,
  bridgeDoc: "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md",
  inputLedger: ledgerPath,
  canOpenTwiiSourceRightsOutcomeGate,
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  counts: {
    acceptedForSourceRightsOutcomeGateOnly: acceptedIds.length,
    required: requiredIds.length,
    missingRequiredIds: missingRequiredIds.length,
    notAccepted: notAccepted.length
  },
  notAccepted,
  nextPMAction: canOpenTwiiSourceRightsOutcomeGate
    ? "Open a separate TWII source-rights outcome gate; do not execute candidate generation or Supabase work from this bridge."
    : "Keep TWII source-rights gate closed; assign A1 to evidence collection/classification or continue Beta platform work.",
  roleAssignments: {
    PM: canOpenTwiiSourceRightsOutcomeGate
      ? "Prepare the separate TWII source-rights outcome gate and verify it before any later candidate or Supabase step."
      : "Use this bridge as the stop/go signal and keep the mainline moving without repeating manual evidence interpretation.",
    A1: "Record safe vendor/internal/field/asset evidence classifications without secrets, raw payloads, SQL snippets, or Supabase URLs.",
    A2: "Keep public copy aligned to partial coverage and mock/mock runtime while TWII evidence remains incomplete."
  },
  stillBlocked: [
    "source-rights approval",
    "field-contract approval",
    "asset-mapping approval",
    "TWII candidate generation",
    "TWII probe execution",
    "SQL execution",
    "Supabase connection",
    "Supabase reads",
    "Supabase writes",
    "staging rows",
    "daily_prices mutation",
    "market-data fetch",
    "market-data ingestion",
    "source-derived row storage",
    "row coverage points",
    "publicDataSource=supabase",
    "scoreSource=real"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicSourcePromoted: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourcePayloadStored: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This bridge reads only local ledger classifications and does not connect to Supabase, run SQL, write data, fetch market data, print secrets, generate TWII candidates, award coverage, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
