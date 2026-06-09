const twiiSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const report = {
  status: "a1_twii_pm_classification_route_ready_waiting_no_secret_evidence",
  ok: true,
  mode: "a1_twii_evidence_pm_classification_route",
  ceoDecision: "keep_a1_post_reply_review_to_four_slots_and_dry_run_only",
  purpose:
    "Give PM the shortest local route after A1 returns the four no-secret TWII evidence summaries.",
  requiredA1ReplyFields: [
    "evidenceSlotId",
    "sourceReferenceLabel",
    "safeEvidenceSummary",
    "remainingRisk"
  ],
  twiiSlots,
  dryRunCommandPreviews: twiiSlots.map((slotId) => ({
    evidenceSlotId: slotId,
    acceptedDryRunCommand: buildDryRunCommand({
      slotId,
      classification: "accepted",
      pmQuestionResolved: true,
      nextGateCandidate: "twii_source_rights_outcome_gate",
      safeSummary: `<PM reviewed no-secret summary for ${slotId}>`,
      sourceReferenceLabel: `<PM reviewed no-secret source label for ${slotId}>`,
      remainingRisk: `<PM reviewed remaining risk for ${slotId}>`
    }),
    needsRepairDryRunCommand: buildDryRunCommand({
      slotId,
      classification: "needs_bounded_repair",
      pmQuestionResolved: false,
      nextGateCandidate: "needs_bounded_repair",
      safeSummary: `<PM reviewed no-secret repair summary for ${slotId}>`,
      sourceReferenceLabel: `<PM reviewed no-secret source label for ${slotId}>`,
      remainingRisk: `<PM reviewed bounded repair needed for ${slotId}>`
    }),
    rejectedDryRunCommand: buildDryRunCommand({
      slotId,
      classification: "rejected",
      pmQuestionResolved: false,
      nextGateCandidate: "blocked",
      safeSummary: `<PM reviewed no-secret rejected summary for ${slotId}>`,
      sourceReferenceLabel: `<PM reviewed no-secret source label for ${slotId}>`,
      remainingRisk: `<PM reviewed rejection reason for ${slotId}>`
    }),
    blockedDryRunCommand: buildDryRunCommand({
      slotId,
      classification: "blocked",
      pmQuestionResolved: false,
      nextGateCandidate: "blocked",
      safeSummary: `<PM reviewed no-secret blocked summary for ${slotId}>`,
      sourceReferenceLabel: `<PM reviewed no-secret source label for ${slotId}>`,
      remainingRisk: `<PM reviewed blocker for ${slotId}>`
    })
  })),
  pmFlow: [
    {
      step: "shape_guard",
      command: "cmd.exe /c npm run check:a1-twii-evidence-response-shape"
    },
    {
      step: "classification_surface",
      command: "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface"
    },
    {
      step: "dry_run_slot_classifications",
      commandPattern:
        "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --dry-run --id <slot-id> --classification <accepted|rejected|needs_bounded_repair|blocked> --recordedBy PM --pm-question-resolved <true|false> --safe-summary \"<PM reviewed no-secret summary>\" --source-reference-label \"<PM reviewed source label>\" --remaining-risk \"<PM reviewed remaining risk>\" --next-gate-candidate <twii_source_rights_outcome_gate|blocked|needs_bounded_repair>"
    },
    {
      step: "readiness_rerun",
      command: "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
    }
  ],
  classificationRules: {
    accepted:
      "Only if the no-secret evidence answers the slot and PM is comfortable considering a separate TWII source-rights outcome gate.",
    rejected: "Use when the evidence is wrong, unsafe, copied, or does not answer the slot.",
    needs_bounded_repair: "Use when one narrow no-secret clarification can repair the slot without reopening broad governance.",
    blocked: "Use when owner, rights, field contract, or mapping proof is unavailable."
  },
  pmSingleClassificationChecklist: {
    classificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
    requiredPerSlot: [
      "classification",
      "pmQuestionResolved",
      "safeSummary",
      "sourceReferenceLabel",
      "remainingRisk",
      "nextGateCandidate"
    ],
    slotIds: twiiSlots,
    firstCommand: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    afterAnyDryRun: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
    stillNotAllowed: [
      "do_not_emit_apply_command",
      "do_not_record_evidence_from_this_report",
      "do_not_approve_source_rights_from_this_report",
      "do_not_award_row_coverage_from_this_report"
    ]
  },
  pmFastTriagePacket: {
    title: "A1 TWII PM fast triage packet",
    status: "ready_waiting_a1_no_secret_reply",
    firstCommand: "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    slotCount: twiiSlots.length,
    requiredDecisionPerSlot: [
      "accepted",
      "rejected",
      "needs_bounded_repair",
      "blocked"
    ],
    decisionRules: [
      "accepted only when the slot answer is complete, no-secret, and narrow enough to consider a separate TWII source-rights outcome gate",
      "needs_bounded_repair only when one narrow no-secret clarification can fix the slot",
      "rejected when the evidence is unsafe, copied, wrong, or not responsive",
      "blocked when the owner, rights, field contract, or mapping proof is unavailable"
    ],
    perSlotDryRunOnly: twiiSlots.map((slotId) => ({
      id: slotId,
      allowedClassifications: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
      dryRunOnly: true,
      afterDryRun: "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
    })),
    completionRule:
      "All four TWII slots must be separately accepted before PM may consider the TWII source-rights outcome gate candidate.",
    stillNotAllowed: [
      "do_not_apply_from_this_packet",
      "do_not_record_evidence_from_this_packet",
      "do_not_approve_source_rights_from_this_packet",
      "do_not_award_row_coverage_from_this_packet",
      "do_not_fetch_market_data_from_this_packet"
    ]
  },
  outcomeGateRule:
    "All four TWII slots must be accepted in a separate reviewed step before a TWII outcome gate candidate can be considered.",
  stopLines: [
    "No --apply command is emitted by this report.",
    "No evidence is recorded by this report.",
    "No source-rights approval is granted by this report.",
    "No candidate artifact is generated by this report.",
    "No row coverage points are awarded by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    applyCommandEmitted: false,
    candidateArtifactGenerated: false,
    evidenceRecorded: false,
    marketDataFetched: false,
    rowCoverageAwarded: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  }
};

console.log(JSON.stringify(report, null, 2));

function buildDryRunCommand({
  classification,
  nextGateCandidate,
  pmQuestionResolved,
  remainingRisk,
  safeSummary,
  slotId,
  sourceReferenceLabel
}) {
  return [
    "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome --",
    "--dry-run",
    "--id",
    slotId,
    "--classification",
    classification,
    "--recordedBy",
    "PM",
    "--pm-question-resolved",
    String(pmQuestionResolved),
    "--safe-summary",
    quote(safeSummary),
    "--source-reference-label",
    quote(sourceReferenceLabel),
    "--remaining-risk",
    quote(remainingRisk),
    "--next-gate-candidate",
    nextGateCandidate
  ].join(" ");
}

function quote(value) {
  return `"${value.replaceAll('"', '\\"')}"`;
}
