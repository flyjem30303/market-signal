import fs from "node:fs";

const reviewPacketPath = "data/source-gates/twii-future-write-gate-review-packet.json";
const candidatePacketPath = "data/source-gates/twii-write-implementation-candidate-gate-packet.json";
const prerequisiteLedgerPath = "data/source-gates/twii-write-prerequisite-intake-ledger.json";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";

const problems = [];
const reviewPacket = readJson(reviewPacketPath);
const candidatePacket = readJson(candidatePacketPath);
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

validateReviewPacket();
validateCandidatePacket();
validatePrerequisites();
validateCandidateArtifact();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_future_write_gate_review_packet_ready_no_execution" : "blocked",
  outcome: ok ? "future_write_gate_review_ready_implementation_still_blocked" : "future_write_gate_review_blocked",
  mode: "twii_future_write_gate_review_packet",
  owner: "CEO/PM",
  reviewPacketPath,
  candidatePacketPath,
  prerequisiteLedgerPath,
  candidateArtifactPath,
  acceptedPrerequisiteSlots: acceptedPrerequisiteSlots.length,
  requiredPrerequisiteSlots: requiredSlots.length,
  target: {
    targetTable: reviewPacket.targetTable ?? null,
    targetLane: reviewPacket.targetLane ?? null,
    targetScope: reviewPacket.targetScope ?? null,
    maxRows: reviewPacket.maxRows ?? null,
    writeMode: reviewPacket.writeMode ?? null,
    duplicatePolicy: reviewPacket.duplicatePolicy ?? null
  },
  requiredFutureExecutionControls: {
    credentialHandlingRequirement: reviewPacket.credentialHandlingRequirement ?? null,
    executeSwitchRequirement: reviewPacket.executeSwitchRequirement ?? null,
    confirmationPhraseRequirement: reviewPacket.confirmationPhraseRequirement ?? null,
    rollbackPlanRequired: reviewPacket.rollbackPlanRequired === true,
    postWriteReadbackPlanRequired: reviewPacket.postWriteReadbackPlanRequired === true,
    postWriteReviewCommandRequired: reviewPacket.postWriteReviewCommandRequired === true
  },
  implementationAllowedNow: false,
  writeGateExecutableNow: false,
  futureExplicitExecutionPacketRequired: true,
  nextAction: ok
    ? "PM may prepare a separate implementation/execution packet review next; this review packet still does not authorize writes."
    : "Repair review packet prerequisites before preparing any future implementation packet.",
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

function validateReviewPacket() {
  const expected = {
    packetKind: "twii_future_write_gate_review_packet",
    candidateGatePacketPath: candidatePacketPath,
    prerequisiteLedgerPath,
    requiredAcceptedPrerequisiteSlots: 6,
    candidateArtifactPath,
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    rollbackPlanRequired: true,
    postWriteReadbackPlanRequired: true,
    postWriteReviewCommandRequired: true,
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    implementationAllowedNow: false,
    writeGateExecutableNow: false,
    futureExplicitExecutionPacketRequired: true
  };

  for (const [key, value] of Object.entries(expected)) {
    if (reviewPacket[key] !== value) problems.push(`reviewPacket.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(reviewPacket.reviewId)) problems.push("reviewPacket.reviewId is required");
  if (reviewPacket.credentialHandlingRequirement?.serviceRoleServerOnly !== true) {
    problems.push("credential handling must require server-only service role");
  }
  if (reviewPacket.credentialHandlingRequirement?.presenceCheckBooleanOnly !== true) {
    problems.push("credential handling must require boolean-only presence checks");
  }
  if (reviewPacket.credentialHandlingRequirement?.credentialValueOutputAllowed !== false) {
    problems.push("credential value output must be forbidden");
  }
  if (reviewPacket.executeSwitchRequirement?.requiredForFutureExecution !== true) {
    problems.push("execute switch must be required for future execution");
  }
  if (reviewPacket.executeSwitchRequirement?.executeDefault !== false) {
    problems.push("execute default must be false");
  }
  if (reviewPacket.confirmationPhraseRequirement?.requiredForFutureExecution !== true) {
    problems.push("confirmation phrase must be required for future execution");
  }
  if (!safeText(reviewPacket.confirmationPhraseRequirement?.phrase)) {
    problems.push("confirmation phrase is required");
  }
}

function validateCandidatePacket() {
  if (candidatePacket.packetKind !== "twii_write_implementation_candidate_gate_packet") {
    problems.push("candidate packet kind must be twii_write_implementation_candidate_gate_packet");
  }
  if (candidatePacket.implementationAllowedNow !== false) problems.push("candidate implementationAllowedNow must be false");
  if (candidatePacket.futureWriteGatePacketRequired !== true) {
    problems.push("candidate packet must require a future write gate packet");
  }
  for (const key of ["targetTable", "targetLane", "targetScope", "maxRows", "writeMode", "duplicatePolicy"]) {
    if (candidatePacket[key] !== reviewPacket[key]) problems.push(`candidate ${key} must match review packet`);
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
