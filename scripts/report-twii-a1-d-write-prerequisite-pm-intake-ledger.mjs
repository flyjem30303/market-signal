import fs from "node:fs";

const ledgerPath = "data/source-gates/twii-write-prerequisite-intake-ledger.json";
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));

const requiredSlots = [
  "source-rights-decision",
  "field-contract-decision",
  "asset-mapping-decision",
  "rollback-dry-run-plan",
  "post-write-readback-plan",
  "post-write-review-plan"
];

const allowedClassifications = ["accepted", "needs_bounded_repair", "blocked", "rejected", "pending"];
const outcomes = Array.isArray(ledger.outcomes) ? ledger.outcomes : [];
const counts = Object.fromEntries(allowedClassifications.map((classification) => [classification, 0]));

for (const outcome of outcomes) {
  if (Object.hasOwn(counts, outcome.classification)) counts[outcome.classification] += 1;
}

const missingSlots = requiredSlots.filter((slotId) => !outcomes.some((outcome) => outcome.slotId === slotId));
const duplicateSlots = requiredSlots.filter(
  (slotId) => outcomes.filter((outcome) => outcome.slotId === slotId).length > 1
);
const unsafeEntryCount = outcomes.filter((outcome) =>
  [
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded",
    "copiedTermsTextIncluded",
    "privateDashboardLinksIncluded"
  ].some((key) => outcome[key] !== false)
).length;

const allAccepted =
  outcomes.length === requiredSlots.length &&
  missingSlots.length === 0 &&
  duplicateSlots.length === 0 &&
  unsafeEntryCount === 0 &&
  outcomes.every((outcome) => outcome.classification === "accepted");

const status = allAccepted
  ? "twii_a1_d_write_prerequisite_pm_intake_ledger_all_accepted_ready_for_future_candidate_gate"
  : counts.blocked > 0 || counts.rejected > 0
    ? "twii_a1_d_write_prerequisite_pm_intake_ledger_blocked_or_rejected"
    : counts.needs_bounded_repair > 0
      ? "twii_a1_d_write_prerequisite_pm_intake_ledger_needs_bounded_repair"
      : "twii_a1_d_write_prerequisite_pm_intake_ledger_ready_pending_replies";

const report = {
  status,
  outcome: allAccepted
    ? "all_prerequisites_accepted_future_candidate_gate_may_be_prepared"
    : "implementation_upgrade_still_blocked_waiting_pm_intake",
  mode: "twii_a1_d_write_prerequisite_pm_intake_ledger",
  ledgerPath,
  sourceDispatchPacket: ledger.sourceDispatchPacket,
  requiredSlots,
  counts: {
    ...counts,
    total: outcomes.length,
    missingSlots: missingSlots.length,
    duplicateSlots: duplicateSlots.length,
    unsafeEntryCount
  },
  missingSlots,
  duplicateSlots,
  implementationAllowedNow: false,
  futureCandidateGateAllowed: allAccepted,
  nextAction: allAccepted
    ? "PM may prepare a later TWII write implementation upgrade candidate gate; this report itself still does not authorize execution."
    : "Keep write runner implementation blocked and wait for A1/D replies or one bounded repair answer per needs_bounded_repair slot.",
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
  },
  outcomes
};

console.log(JSON.stringify(report, null, 2));

