import fs from "node:fs";

const executionPacketPath = "data/source-gates/twii-explicit-execution-packet-draft.json";
const candidatePacketPath = "data/source-gates/twii-write-implementation-candidate-gate-packet.json";
const futureReviewPacketPath = "data/source-gates/twii-future-write-gate-review-packet.json";
const prerequisiteLedgerPath = "data/source-gates/twii-write-prerequisite-intake-ledger.json";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";

const problems = [];
const executionPacket = readJson(executionPacketPath);
const candidatePacket = readJson(candidatePacketPath);
const futureReviewPacket = readJson(futureReviewPacketPath);
const prerequisiteLedger = readJson(prerequisiteLedgerPath);
const candidateArtifact = readJson(candidateArtifactPath);

const requiredSlots = [
  "source-rights-decision",
  "field-contract-decision",
  "asset-mapping-decision",
  "rollback-dry-run-plan",
  "post-write-readback-plan",
  "post-write-review-plan"
];

const acceptedPrerequisiteSlots = requiredSlots.filter((slotId) =>
  prerequisiteLedger.outcomes?.some((outcome) => outcome.slotId === slotId && outcome.classification === "accepted")
);

validateExecutionPacket();
validateUpstreamPackets();
validatePrerequisites();
validateCandidateArtifact();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_execution_packet_draft_ready_no_execution" : "blocked",
  outcome: ok
    ? "explicit_execution_packet_draft_ready_execution_still_blocked"
    : "explicit_execution_packet_draft_blocked",
  mode: "twii_explicit_execution_packet_draft",
  owner: "CEO/PM",
  executionPacketPath,
  candidatePacketPath,
  futureReviewPacketPath,
  prerequisiteLedgerPath,
  candidateArtifactPath,
  acceptedPrerequisiteSlots: acceptedPrerequisiteSlots.length,
  requiredPrerequisiteSlots: requiredSlots.length,
  target: {
    targetTable: executionPacket.targetTable ?? null,
    targetLane: executionPacket.targetLane ?? null,
    targetScope: executionPacket.targetScope ?? null,
    maxRows: executionPacket.maxRows ?? null,
    writeMode: executionPacket.writeMode ?? null,
    duplicatePolicy: executionPacket.duplicatePolicy ?? null
  },
  executionControls: {
    execute: executionPacket.execute === true,
    confirmationPhraseRequired: executionPacket.confirmationPhraseRequired === true,
    requiredConfirmationPhrasePresent: safeText(executionPacket.requiredConfirmationPhrase),
    credentialHandling: executionPacket.credentialHandling ?? null,
    rollbackDryRunRequired: executionPacket.rollbackDryRunRequired === true,
    aggregateReadbackRequired: executionPacket.aggregateReadbackRequired === true,
    postWriteReviewRequired: executionPacket.postWriteReviewRequired === true
  },
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
  nextAction: ok
    ? "CEO/PM may review this draft as the later explicit authorization entrance; this draft still does not execute writes."
    : "Repair the explicit execution packet draft before any future authorization review.",
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
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateExecutionPacket() {
  const expected = {
    executionPacketKind: "twii_explicit_execution_packet_draft",
    candidateGatePacketPath: candidatePacketPath,
    futureWriteGateReviewPacketPath: futureReviewPacketPath,
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    execute: false,
    confirmationPhraseRequired: true,
    rollbackDryRunRequired: true,
    aggregateReadbackRequired: true,
    postWriteReviewRequired: true,
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };

  for (const [key, value] of Object.entries(expected)) {
    if (executionPacket[key] !== value) problems.push(`executionPacket.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(executionPacket.executionId)) problems.push("executionPacket.executionId is required");
  if (executionPacket.requiredConfirmationPhrase !== "CEO_PM_AUTHORIZES_ONE_TWII_BOUNDED_WRITE_GATE_20260610_A") {
    problems.push("executionPacket.requiredConfirmationPhrase must match the future review phrase");
  }
  if (executionPacket.credentialHandling?.serviceRoleServerOnly !== true) {
    problems.push("credential handling must require server-only service role");
  }
  if (executionPacket.credentialHandling?.presenceCheckBooleanOnly !== true) {
    problems.push("credential handling must require boolean-only presence checks");
  }
  if (executionPacket.credentialHandling?.credentialValueOutputAllowed !== false) {
    problems.push("credential value output must be forbidden");
  }
}

function validateUpstreamPackets() {
  if (candidatePacket.packetKind !== "twii_write_implementation_candidate_gate_packet") {
    problems.push("candidate packet kind must be twii_write_implementation_candidate_gate_packet");
  }
  if (futureReviewPacket.packetKind !== "twii_future_write_gate_review_packet") {
    problems.push("future review packet kind must be twii_future_write_gate_review_packet");
  }
  if (candidatePacket.implementationAllowedNow !== false) problems.push("candidate implementationAllowedNow must be false");
  if (futureReviewPacket.implementationAllowedNow !== false) problems.push("future review implementationAllowedNow must be false");
  if (futureReviewPacket.writeGateExecutableNow !== false) problems.push("future review writeGateExecutableNow must be false");

  for (const key of ["targetTable", "targetLane", "targetScope", "maxRows", "writeMode", "duplicatePolicy"]) {
    if (candidatePacket[key] !== executionPacket[key]) problems.push(`candidate ${key} must match execution packet`);
    if (futureReviewPacket[key] !== executionPacket[key]) problems.push(`future review ${key} must match execution packet`);
  }
  if (futureReviewPacket.confirmationPhraseRequirement?.phrase !== executionPacket.requiredConfirmationPhrase) {
    problems.push("future review confirmation phrase must match execution packet");
  }
}

function validatePrerequisites() {
  if (prerequisiteLedger.status !== "twii_a1_d_write_prerequisite_pm_intake_ledger_all_accepted_ready_for_future_candidate_gate") {
    problems.push("prerequisite ledger must be accepted for future candidate gate");
  }
  if (acceptedPrerequisiteSlots.length !== 6) problems.push("all 6 prerequisites must be accepted");
}

function validateCandidateArtifact() {
  if (candidateArtifact.symbol !== "TWII") problems.push("candidate artifact symbol must be TWII");
  if (candidateArtifact.aggregateValidation?.candidateRows !== 60) problems.push("candidate artifact must have 60 candidate rows");
  if (candidateArtifact.sanitizedAggregateOnly !== true) problems.push("candidate artifact must be aggregate-only");
  for (const key of ["rawPayloadIncluded", "rowPayloadIncluded", "stockIdPayloadIncluded", "secretsIncluded"]) {
    if (candidateArtifact[key] !== false) problems.push(`candidate artifact ${key} must be false`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`cannot read JSON: ${filePath}`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 260;
}
