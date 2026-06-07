import fs from "node:fs";

const twiiLedgerPath = "data/source-gates/twii-vendor-internal-evidence-outcomes.json";
const etfGatePath = "data/source-gates/etf-source-gate.json";
const docPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_INTAKE_COMMAND_MAP.md";

const twiiSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const etfSlots = [
  "etf-legal-use-evidence",
  "etf-redistribution-evidence",
  "etf-attribution-retention-evidence",
  "etf-derived-analysis-rate-limit-evidence",
  "etf-field-contract-evidence",
  "etf-source-comparison-evidence"
];

const twiiLedger = readJson(twiiLedgerPath, { outcomes: [] });
const etfGate = readJson(etfGatePath, { decision: "unknown", blockers: [], candidate_sources: [] });

const twiiAcceptedClassification = "accepted_for_source_rights_outcome_gate_only";
const twiiOutcomes = Array.isArray(twiiLedger.outcomes) ? twiiLedger.outcomes : [];
const twiiOutcomeById = new Map(twiiOutcomes.map((outcome) => [outcome.id, outcome]));
const twiiPendingSlots = twiiSlots.filter(
  (slot) => twiiOutcomeById.get(slot)?.classification !== twiiAcceptedClassification
);

const etfBlockers = Array.isArray(etfGate.blockers) ? etfGate.blockers : [];
const etfCandidateSources = Array.isArray(etfGate.candidate_sources) ? etfGate.candidate_sources : [];

const report = {
  status: "a1_exact_source_rights_evidence_intake_command_map_ready_local_only_not_filled",
  ok: true,
  ceoDecision: "make_a1_source_rights_evidence_intake_exact_without_execution",
  pmRoute: "a1_exact_twii_etf_source_rights_evidence_intake_then_separate_outcome_gate",
  doc: docPath,
  currentCoverage: {
    twEquity: "180/180",
    twii: "0/60",
    etf: "2/120",
    level1Mvp: "182/360"
  },
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  twii: {
    source: twiiLedgerPath,
    requiredSlots: twiiSlots,
    pendingSlots: twiiPendingSlots,
    acceptedSlotCount: twiiSlots.length - twiiPendingSlots.length,
    requiredSlotCount: twiiSlots.length,
    nextGateAllowed: twiiPendingSlots.length === 0
  },
  etf: {
    source: etfGatePath,
    decision: etfGate.decision ?? "unknown",
    requiredSlots: etfSlots,
    blockerCount: etfBlockers.length,
    blockers: etfBlockers,
    candidateSourceNames: etfCandidateSources.map((source) => source.name).filter(Boolean),
    nextGateAllowed: etfGate.decision === "accepted"
  },
  pmAcceptanceOutcomes: ["accepted", "rejected", "needs_bounded_repair", "blocked", "unavailable"],
  nextAllowedRoutes: [
    "twii_source_rights_outcome_gate",
    "etf_source_rights_outcome_gate",
    "continue_public_beta_runtime_mainline_mock_visible"
  ],
  stopLines: [
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No staging rows or daily_prices rows are created or modified by this report.",
    "No remote market data is fetched, stored, ingested, or committed by this report.",
    "No secrets, source bodies, raw payloads, row payloads, or stock id payloads are printed by this report.",
    "No TWII or ETF candidate artifact is generated from source data by this report.",
    "No row coverage points are awarded by this report.",
    "No source-rights approval is claimed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}
