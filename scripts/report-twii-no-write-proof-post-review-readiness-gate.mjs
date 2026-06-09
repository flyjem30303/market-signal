import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_NO_WRITE_PROOF_POST_REVIEW_READINESS_GATE.md";
const proofReportPath = "scripts/report-pm-twii-named-attempt-no-write-proof.mjs";
const candidatePath = "data/candidates/twii-sanitized-candidate.json";
const evidencePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";

const problems = [];
const doc = read(docPath);
const candidate = readJson(candidatePath);
const evidence = readJson(evidencePath);

const requiredDocPhrases = [
  "Status: `twii_no_write_proof_post_review_readiness_gate_ready`",
  "pm_twii_named_attempt_no_write_proof_ready",
  "accepted_no_write_named_attempt_proof",
  "ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked",
  "TWII bounded readonly preflight candidate design",
  "No SQL",
  "No Supabase connection in this gate",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const proof = runJson([proofReportPath]);
if (proof.status !== "pm_twii_named_attempt_no_write_proof_ready") {
  problems.push("PM named attempt no-write proof must be ready");
}
if (proof.outcome !== "accepted_no_write_named_attempt_proof") {
  problems.push("PM named attempt no-write proof must be accepted");
}
assertSafety(proof.safety, "proof safety");

for (const [key, expected] of [
  ["artifactId", "twii-sanitized-candidate-20260609"],
  ["lane", "TWII"],
  ["assetType", "index"],
  ["symbol", "TWII"],
  ["scope", "twii_index_daily_prices_missing_rows"],
  ["sourceLane", "official-exchange-index"],
  ["coverageWindowSessions", 60],
  ["candidateMissingRows", 60],
  ["expectedRows", 60],
  ["sanitizedAggregateOnly", true],
  ["rawPayloadIncluded", false],
  ["rowPayloadIncluded", false],
  ["stockIdPayloadIncluded", false],
  ["secretsIncluded", false]
]) {
  if (candidate?.[key] !== expected) problems.push(`${candidatePath}.${key} must be ${String(expected)}`);
}
if (Array.isArray(candidate.rows) || Array.isArray(candidate.candidateRows)) {
  problems.push(`${candidatePath} must not contain row arrays`);
}

const requiredSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];
const outcomes = Array.isArray(evidence.outcomes) ? evidence.outcomes : [];
for (const slot of requiredSlots) {
  const found = outcomes.find((item) => item.id === slot && item.lane === "TWII");
  if (!found) {
    problems.push(`${evidencePath} missing TWII accepted slot: ${slot}`);
  } else if (found.classification !== "accepted" || found.pmQuestionResolved !== true) {
    problems.push(`${evidencePath} slot ${slot} must be accepted and resolved`);
  }
}

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_no_write_proof_post_review_readiness_gate_ready" : "blocked",
  outcome: ready
    ? "ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked"
    : "blocked",
  docPath,
  reviewedProofStatus: proof.status ?? null,
  reviewedProofOutcome: proof.outcome ?? null,
  candidateArtifactPath: candidatePath,
  dEvidenceSlotsAccepted: requiredSlots.length,
  nextRecommendedSlice: "twii_bounded_readonly_preflight_candidate_design",
  nextAllowedWork: [
    "Design a bounded Supabase readonly preflight candidate without connecting to Supabase.",
    "Define aggregate-only metadata/count/column checks.",
    "Prepare fail-closed output and checker."
  ],
  stillBlocked: [
    "sql_execution",
    "supabase_connection_in_this_gate",
    "supabase_write",
    "daily_prices_mutation",
    "market_data_fetch_or_ingest",
    "candidate_row_acceptance",
    "row_coverage_scoring",
    "publicDataSource_promotion",
    "scoreSource_real"
  ],
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowedInThisGate: false,
    supabaseWriteAllowed: false,
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
