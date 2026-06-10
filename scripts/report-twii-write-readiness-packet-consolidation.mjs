import fs from "node:fs";

const intakeLedger = JSON.parse(fs.readFileSync("data/source-gates/twii-write-prerequisite-intake-ledger.json", "utf8"));
const acceptedPrerequisiteCount = Array.isArray(intakeLedger.outcomes)
  ? intakeLedger.outcomes.filter((outcome) => outcome.classification === "accepted").length
  : 0;
const allPrerequisitesAccepted = acceptedPrerequisiteCount === 6;

const readinessItems = [
  {
    item: "source-rights decision",
    currentState: allPrerequisitesAccepted ? "accepted_for_candidate_gate_prep" : "blocked_or_unresolved",
    owner: "A1/D/PM",
    acceptedEvidenceNeeded:
      "no-secret accepted source authority, storage, retention, redistribution, attribution, and commercial-use decision",
    nextExecutableAction: allPrerequisitesAccepted
      ? "carry accepted source-rights reference into the next future candidate gate"
      : "A1/D provide or update source-rights outcome evidence for PM review",
    boundary: "no_probe_no_ingestion_no_write"
  },
  {
    item: "field-contract decision",
    currentState: allPrerequisitesAccepted ? "accepted_for_candidate_gate_prep" : "blocked_or_unresolved",
    owner: "A1/PM",
    acceptedEvidenceNeeded: "accepted field list, field meaning, date convention, numeric precision, null handling, duplicate policy",
    nextExecutableAction: allPrerequisitesAccepted
      ? "carry accepted field-contract reference into the next future candidate gate"
      : "A1 provide field-contract evidence that PM can classify accepted/rejected",
    boundary: "no_row_payload_output"
  },
  {
    item: "asset-mapping decision",
    currentState: allPrerequisitesAccepted ? "accepted_for_candidate_gate_prep" : "blocked_or_unresolved",
    owner: "A1/PM",
    acceptedEvidenceNeeded: "accepted mapping from TWII index lane to target asset/table/scope without stock-id payload exposure",
    nextExecutableAction: allPrerequisitesAccepted
      ? "carry accepted asset-mapping reference into the next future candidate gate"
      : "A1 provide asset-mapping evidence for PM review",
    boundary: "no_stock_id_payload_output"
  },
  {
    item: "write-gate packet",
    currentState: "ready_local_only",
    owner: "PM",
    acceptedEvidenceNeeded: "explicit packet remains complete and mock/mock with promotion/scoring blocked",
    nextExecutableAction: "keep packet template available for later explicit authorization",
    boundary: "not_executable"
  },
  {
    item: "runner boundary",
    currentState: "ready_local_only",
    owner: "PM",
    acceptedEvidenceNeeded: "credential handling, target, duplicate, rollback, readback, review, and fail-closed rules remain explicit",
    nextExecutableAction: "keep boundary wired to implementation review gate",
    boundary: "no_credential_values"
  },
  {
    item: "credential handling",
    currentState: "policy_ready_local_only",
    owner: "PM",
    acceptedEvidenceNeeded: "server-only service-role handling with boolean-only presence checks and redacted reports",
    nextExecutableAction: "future implementation must pass credential-handling check before execution",
    boundary: "no_secret_output"
  },
  {
    item: "rollback dry-run",
    currentState: allPrerequisitesAccepted ? "plan_accepted_for_candidate_gate_prep" : "planned_not_executable",
    owner: "PM/A1",
    acceptedEvidenceNeeded: "aggregate-only dry-run plan scoped to authorization id before any mutation",
    nextExecutableAction: allPrerequisitesAccepted
      ? "carry accepted aggregate rollback dry-run plan into the next future candidate gate"
      : "define future no-mutation rollback count proof",
    boundary: "no_destructive_rollback"
  },
  {
    item: "post-write readback",
    currentState: allPrerequisitesAccepted ? "plan_accepted_for_candidate_gate_prep" : "planned_not_executable",
    owner: "PM/A1",
    acceptedEvidenceNeeded: "aggregate-only readback fields for attempted, inserted, rejected, duplicate counts and max date",
    nextExecutableAction: allPrerequisitesAccepted
      ? "carry accepted aggregate readback shape into the next future candidate gate"
      : "define future post-write readback summary shape",
    boundary: "no_row_payload_output"
  },
  {
    item: "post-write review",
    currentState: allPrerequisitesAccepted ? "plan_accepted_for_candidate_gate_prep" : "planned_not_executable",
    owner: "PM",
    acceptedEvidenceNeeded: "post-write review command that accepts only aggregate summary output",
    nextExecutableAction: allPrerequisitesAccepted
      ? "carry accepted aggregate post-write review plan into the next future candidate gate"
      : "prepare future review command after readback plan is accepted",
    boundary: "no_promotion_in_same_run"
  },
  {
    item: "fail-closed tests",
    currentState: "ready_local_only",
    owner: "PM",
    acceptedEvidenceNeeded: "skeleton blocks missing packet, missing execute switch, missing confirmation, and valid preconditions",
    nextExecutableAction: "keep skeleton check in review gate",
    boundary: "still_no_real_write"
  }
];

const blockedItems = readinessItems.filter((item) =>
  ["blocked_or_unresolved", "planned_not_executable"].includes(item.currentState)
);

const readyLocalItems = readinessItems.filter((item) =>
  [
    "ready_local_only",
    "policy_ready_local_only",
    "accepted_for_candidate_gate_prep",
    "plan_accepted_for_candidate_gate_prep"
  ].includes(item.currentState)
);

const report = {
  status: allPrerequisitesAccepted
    ? "twii_write_readiness_packet_consolidation_prerequisites_accepted_future_gate_ready"
    : "twii_write_readiness_packet_consolidation_ready_blocked_prerequisites_mapped",
  outcome: allPrerequisitesAccepted
    ? "write_readiness_prerequisites_accepted_prepare_future_candidate_gate_no_real_write"
    : "write_readiness_owner_action_map_ready_no_real_write",
  mode: "twii_write_readiness_packet_consolidation",
  owner: "CEO/PM",
  implementationAllowedNow: false,
  futureCandidateGateAllowed: allPrerequisitesAccepted,
  readyLocalCount: readyLocalItems.length,
  blockedPrerequisiteCount: blockedItems.length,
  acceptedPrerequisiteCount,
  readinessItems,
  ownerDispatch: {
    A1: [
      allPrerequisitesAccepted
        ? "stand by for future candidate-gate packet review; do not fetch or ingest market data"
        : "source-rights evidence",
      allPrerequisitesAccepted ? "preserve sanitized artifact path for PM packet use" : "field-contract evidence",
      allPrerequisitesAccepted ? "no new raw or row payload delivery" : "asset-mapping evidence"
    ],
    D: [
      allPrerequisitesAccepted
        ? "stand by for future candidate-gate source-rights wording review only"
        : "source-rights/legal/redistribution terms evidence"
    ],
    PM: [
      "keep write runner implementation blocked",
      allPrerequisitesAccepted
        ? "prepare the separate future TWII write implementation candidate gate"
        : "classify A1/D evidence through accepted/rejected records",
      "continue runtime-safe mainline work that does not require real write execution"
    ]
  },
  nextAction: allPrerequisitesAccepted
    ? "Prepare the separate future TWII write implementation candidate gate; do not implement or execute real write behavior from this consolidation report."
    : "Route A1/D to the three blocked prerequisite evidence rows first; PM should not implement real write behavior until all blocked rows become accepted.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));
