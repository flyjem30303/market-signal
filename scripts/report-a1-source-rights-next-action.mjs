import fs from "node:fs";

const twiiLedgerPath = "data/source-gates/twii-vendor-internal-evidence-outcomes.json";
const etfGatePath = "data/source-gates/etf-source-gate.json";

const twii = summarizeTwii(readJson(twiiLedgerPath, { outcomes: [] }));
const etf = summarizeEtf(readJson(etfGatePath, { decision: "unknown", blockers: [], candidate_sources: [] }));
const route = chooseRoute(twii, etf);

const report = {
  status: route.status,
  ok: true,
  ceoDecision: "route_a1_source_rights_next_action_without_reopening_governance",
  pmNextAction: route.pmNextAction,
  pmCommand: "cmd.exe /c npm run report:a1-source-rights-next-action",
  a1NextAction: route.a1NextAction,
  a2NextAction:
    "keep_launch_blocking_trust_copy_stable_only_if_runtime_or_public_copy_surface_changes",
  currentState: {
    twii,
    etf,
    coverage: {
      twEquity: "180/180",
      twii: "0/60",
      etf: "2/120",
      level1Mvp: "182/360"
    },
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    }
  },
  decisionRules: [
    "If TWII four required evidence outcomes become accepted_for_source_rights_outcome_gate_only, PM may open a separate TWII source-rights outcome gate.",
    "If ETF legal, redistribution, attribution, retention, derived-analysis, rate-limit, and field-contract evidence become accepted, PM may open a separate ETF source-rights outcome gate.",
    "If neither lane has accepted evidence, A1 stays on exact evidence intake while PM continues Beta mainline work that does not require real source promotion."
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

function summarizeTwii(ledger) {
  const requiredClassification = "accepted_for_source_rights_outcome_gate_only";
  const requiredIds = [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ];
  const outcomes = Array.isArray(ledger.outcomes) ? ledger.outcomes : [];
  const byId = new Map(outcomes.map((outcome) => [outcome.id, outcome]));
  const pendingEvidenceIds = requiredIds.filter(
    (id) => byId.get(id)?.classification !== requiredClassification
  );

  return {
    lane: "twii_vendor_internal_source_rights",
    status:
      pendingEvidenceIds.length === 0
        ? "ready_for_separate_twii_source_rights_outcome_gate"
        : "blocked_waiting_twii_vendor_internal_evidence",
    source: twiiLedgerPath,
    canOpenOutcomeGate: pendingEvidenceIds.length === 0,
    requiredEvidenceCount: requiredIds.length,
    acceptedEvidenceCount: requiredIds.length - pendingEvidenceIds.length,
    pendingEvidenceCount: pendingEvidenceIds.length,
    pendingEvidenceIds
  };
}

function summarizeEtf(gate) {
  const blockers = Array.isArray(gate.blockers) ? gate.blockers : [];
  const candidateSources = Array.isArray(gate.candidate_sources) ? gate.candidate_sources : [];

  return {
    lane: "etf_source_rights",
    status:
      gate.decision === "accepted"
        ? "ready_for_separate_etf_source_rights_outcome_gate"
        : "blocked_waiting_etf_legal_and_redistribution_evidence",
    source: etfGatePath,
    canOpenOutcomeGate: gate.decision === "accepted",
    decision: gate.decision ?? "unknown",
    targetCoverage: "2/120",
    missingRows: 118,
    blockerCount: blockers.length,
    blockers,
    candidateSourceCount: candidateSources.length,
    candidateSourceNames: candidateSources.map((source) => source.name).filter(Boolean)
  };
}

function chooseRoute(twii, etf) {
  if (twii.canOpenOutcomeGate) {
    return {
      status: "ready_to_open_twii_source_rights_outcome_gate",
      pmNextAction: "prepare_separate_twii_source_rights_outcome_gate",
      a1NextAction: "handoff_twii_accepted_evidence_ids_to_pm_for_gate_review"
    };
  }

  if (etf.canOpenOutcomeGate) {
    return {
      status: "ready_to_open_etf_source_rights_outcome_gate",
      pmNextAction: "prepare_separate_etf_source_rights_outcome_gate",
      a1NextAction: "handoff_etf_accepted_source_lane_evidence_to_pm_for_gate_review"
    };
  }

  return {
    status: "blocked_waiting_source_rights_evidence",
    pmNextAction: "keep_beta_mainline_moving_and_assign_a1_exact_twii_etf_source_rights_evidence_intake",
    a1NextAction:
      "collect_or_classify_twii_vendor_terms_internal_owner_field_contract_asset_mapping_and_etf_legal_redistribution_evidence"
  };
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}
