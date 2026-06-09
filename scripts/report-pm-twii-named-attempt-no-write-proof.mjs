import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PM_TWII_NAMED_ATTEMPT_NO_WRITE_PROOF.md";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const evidencePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const attemptId = "twii-no-write-proof-20260609";
const decisionId = "pm-twii-named-attempt-no-write-proof-20260609";
const decisionSummary = "A1 artifact and D four-slot evidence accepted for local no-write packet proof only.";

const problems = [];
const doc = read(docPath);
const evidence = readJson(evidencePath);

const requiredDocPhrases = [
  "Status: `pm_twii_named_attempt_no_write_proof_ready`",
  candidateArtifactPath,
  "twii-sanitized-candidate-20260609",
  "twii-no-write-proof-20260609",
  "pm-twii-named-attempt-no-write-proof-20260609",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "render:twii-bounded-data-acceptance-named-packet-scaffold",
  "report:twii-bounded-data-acceptance-named-attempt-packet",
  "run:twii-scaffold-to-packet-driven-chain-smoke-proof",
  "publicDataSource=mock",
  "scoreSource=mock"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredEvidenceSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const outcomes = Array.isArray(evidence.outcomes) ? evidence.outcomes : [];
for (const slot of requiredEvidenceSlots) {
  const found = outcomes.find((item) => item.id === slot && item.lane === "TWII");
  if (!found) {
    problems.push(`${evidencePath} missing TWII slot: ${slot}`);
  } else if (found.classification !== "accepted" || found.pmQuestionResolved !== true) {
    problems.push(`${evidencePath} slot ${slot} must be accepted and resolved`);
  }
}

const handoff = runJson([
  "scripts/report-twii-sanitized-candidate-artifact-chain-handoff.mjs",
  "--candidate-artifact-path",
  candidateArtifactPath
]);
if (handoff.status !== "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet") {
  problems.push("A1 artifact handoff must be ready for named packet");
}
if (handoff.outcome !== "accepted_for_named_attempt_packet_no_write_only") {
  problems.push("A1 artifact handoff outcome must be no-write accepted");
}
if (handoff.validation?.accepted !== true) problems.push("A1 artifact validation must be accepted");
assertSafety(handoff.safety, "handoff safety");

const smokeProof = runJson([
  "scripts/run-twii-scaffold-to-packet-driven-chain-smoke-proof.mjs",
  "--candidate-artifact-path",
  candidateArtifactPath,
  "--attempt-id",
  attemptId,
  "--decision-id",
  decisionId,
  "--decision-summary",
  decisionSummary,
  "--out-dir",
  "tmp/pm-twii-named-attempt-no-write-proof"
]);
if (smokeProof.status !== "twii_scaffold_to_packet_driven_chain_smoke_proof_completed_no_write") {
  problems.push("smoke proof must complete no-write");
}
if (smokeProof.outcome !== "accepted_no_write_smoke_proof") {
  problems.push("smoke proof outcome must be accepted no-write smoke proof");
}

const ready = problems.length === 0;
const report = {
  status: ready ? "pm_twii_named_attempt_no_write_proof_ready" : "blocked",
  outcome: ready ? "accepted_no_write_named_attempt_proof" : "blocked",
  docPath,
  candidateArtifactPath,
  attemptId,
  decisionId,
  dEvidenceSlotsAccepted: requiredEvidenceSlots.length,
  handoffStatus: handoff.status ?? null,
  smokeProofStatus: smokeProof.status ?? null,
  outputs: {
    packetPath: smokeProof.outputs?.packetPath ?? null,
    smokeProofPath: smokeProof.outputs?.smokeProofPath ?? null,
    packetDrivenSummaryPath: smokeProof.outputs?.packetDrivenSummaryPath ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ready) process.exit(1);

function runJson(args) {
  const run = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let parsed = {};
  try {
    parsed = JSON.parse(run.stdout ?? "");
  } catch {
    problems.push(`${args[0]} stdout is not valid JSON`);
  }
  if (run.status !== 0) problems.push(`${args[0]} failed`);
  return parsed;
}

function assertSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch {
    problems.push(`${filePath} is not valid JSON`);
    return {};
  }
}
