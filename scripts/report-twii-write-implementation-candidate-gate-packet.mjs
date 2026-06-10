import fs from "node:fs";

const packetPath = "data/source-gates/twii-write-implementation-candidate-gate-packet.json";
const prerequisiteLedgerPath = "data/source-gates/twii-write-prerequisite-intake-ledger.json";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";

const problems = [];
const packet = readJson(packetPath);
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

validatePacket();
validatePrerequisites();
validateCandidateArtifact();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_write_implementation_candidate_gate_packet_ready_future_gate_only" : "blocked",
  outcome: ok
    ? "future_write_gate_candidate_packet_ready_no_execution"
    : "future_write_gate_candidate_packet_blocked",
  mode: "twii_write_implementation_candidate_gate_packet",
  owner: "CEO/PM",
  packetPath,
  prerequisiteLedgerPath,
  candidateArtifactPath,
  acceptedPrerequisiteSlots: acceptedPrerequisiteSlots.length,
  requiredPrerequisiteSlots: requiredSlots.length,
  authorizationId: packet.authorizationId ?? null,
  target: {
    targetTable: packet.targetTable ?? null,
    targetLane: packet.targetLane ?? null,
    targetScope: packet.targetScope ?? null,
    maxRows: packet.maxRows ?? null,
    writeMode: packet.writeMode ?? null,
    duplicatePolicy: packet.duplicatePolicy ?? null
  },
  nextAction: ok
    ? "CEO/PM may review this packet as the input to a separate future write gate; this report does not implement or execute writes."
    : "Repair the blocked packet fields before any future write-gate review.",
  implementationAllowedNow: false,
  futureWriteGatePacketRequired: true,
  currentBoundary: {
    writeRunnerImplementationAllowedNow: false,
    writeGateExecutableNow: false,
    sqlAllowedNow: false,
    supabaseConnectionAllowedNow: false,
    supabaseWriteAllowedNow: false,
    dailyPricesMutationAllowedNow: false,
    candidateRowsAcceptedNow: false,
    rowCoverageScoringAllowedNow: false,
    publicPromotionAllowedNow: false,
    scoreSourceRealAllowedNow: false
  },
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

function validatePacket() {
  const expected = {
    packetKind: "twii_write_implementation_candidate_gate_packet",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    implementationAllowedNow: false,
    futureWriteGatePacketRequired: true
  };

  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }

  for (const field of [
    "authorizationId",
    "pmOwner",
    "candidateArtifactPath",
    "sourceRightsDecisionReference",
    "fieldContractReference",
    "assetMappingReference",
    "postWriteReviewCommand"
  ]) {
    if (!safeText(packet[field])) problems.push(`packet.${field} is required`);
  }

  if (packet.candidateArtifactPath !== candidateArtifactPath) {
    problems.push(`packet.candidateArtifactPath must be ${candidateArtifactPath}`);
  }
  if (packet.rollbackPlan?.required !== true) problems.push("packet.rollbackPlan.required must be true");
  if (packet.rollbackPlan?.scope !== "authorizationId") problems.push("packet.rollbackPlan.scope must be authorizationId");
  if (packet.rollbackPlan?.noWriteStopLine !== true) problems.push("packet.rollbackPlan.noWriteStopLine must be true");
  if (packet.postWriteReadbackPlan?.aggregateOnly !== true) {
    problems.push("packet.postWriteReadbackPlan.aggregateOnly must be true");
  }

  for (const field of [
    "attempted_row_count",
    "inserted_row_count",
    "rejected_row_count",
    "duplicate_row_count",
    "target_scope",
    "target_table",
    "post_write_max_trade_date"
  ]) {
    if (!packet.postWriteReadbackPlan?.requiredFields?.includes(field)) {
      problems.push(`packet.postWriteReadbackPlan.requiredFields missing ${field}`);
    }
  }

  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (packet.safety?.[key] !== false) problems.push(`packet.safety.${key} must be false`);
  }
  if (packet.safety?.publicDataSource !== "mock") problems.push("packet.safety.publicDataSource must be mock");
  if (packet.safety?.scoreSource !== "mock") problems.push("packet.safety.scoreSource must be mock");
}

function validatePrerequisites() {
  if (prerequisiteLedger.status !== "twii_a1_d_write_prerequisite_pm_intake_ledger_all_accepted_ready_for_future_candidate_gate") {
    problems.push("prerequisite ledger must be all accepted for future candidate gate");
  }
  if (acceptedPrerequisiteSlots.length !== requiredSlots.length) {
    problems.push("all 6 prerequisite slots must be accepted");
  }
}

function validateCandidateArtifact() {
  if (candidateArtifact.artifactId !== "twii-sanitized-candidate-20260609") {
    problems.push("candidate artifact id must match the reviewed TWII artifact");
  }
  if (candidateArtifact.symbol !== "TWII") problems.push("candidate artifact symbol must be TWII");
  if (candidateArtifact.aggregateValidation?.candidateRows !== 60) {
    problems.push("candidate artifact candidateRows must be 60");
  }
  for (const key of ["sanitizedAggregateOnly"]) {
    if (candidateArtifact[key] !== true) problems.push(`candidate artifact ${key} must be true`);
  }
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
