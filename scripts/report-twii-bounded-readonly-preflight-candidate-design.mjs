import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_CANDIDATE_DESIGN.md";
const upstreamReportPath = "scripts/report-twii-no-write-proof-post-review-readiness-gate.mjs";
const proofReportPath = "scripts/report-pm-twii-named-attempt-no-write-proof.mjs";
const candidatePath = "data/candidates/twii-sanitized-candidate.json";

const problems = [];
const doc = read(docPath);
const candidate = readJson(candidatePath);

const requiredDocPhrases = [
  "Status: `twii_bounded_readonly_preflight_candidate_design_ready`",
  "twii_no_write_proof_post_review_readiness_gate_ready",
  "ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked",
  "run:twii-bounded-readonly-preflight-once",
  "report:twii-bounded-readonly-preflight-post-run-review",
  "aggregate-only-readonly",
  "table reachability status",
  "required column labels only",
  "TWII bounded readonly preflight runner stub",
  "No SQL",
  "No Supabase connection in this design",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const upstream = runJson([upstreamReportPath]);
if (upstream.status !== "twii_no_write_proof_post_review_readiness_gate_ready") {
  problems.push("upstream post-review readiness gate must be ready");
}
if (upstream.outcome !== "ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked") {
  problems.push("upstream gate must route to readonly candidate and keep write blocked");
}
assertPostReviewSafety(upstream.safety, "upstream safety");

const proof = runJson([proofReportPath]);
if (proof.status !== "pm_twii_named_attempt_no_write_proof_ready") {
  problems.push("PM named attempt no-write proof must remain ready");
}
if (proof.outcome !== "accepted_no_write_named_attempt_proof") {
  problems.push("PM named attempt no-write proof must remain accepted");
}
assertProofSafety(proof.safety, "proof safety");

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

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_bounded_readonly_preflight_candidate_design_ready" : "blocked",
  outcome: ready ? "accepted_as_design_only_readonly_preflight_candidate" : "blocked",
  docPath,
  upstreamStatus: upstream.status ?? null,
  upstreamOutcome: upstream.outcome ?? null,
  proofStatus: proof.status ?? null,
  candidateArtifactPath: candidatePath,
  futureCommandContract: {
    runner: "cmd.exe /c npm run run:twii-bounded-readonly-preflight-once -- --attempt-id <NO_SECRET_ATTEMPT_ID> --candidate-artifact-path data\\candidates\\twii-sanitized-candidate.json --mode aggregate-only-readonly --confirm <CEO_APPROVED_CONFIRMATION>",
    postRunReview: "cmd.exe /c npm run report:twii-bounded-readonly-preflight-post-run-review -- --summary-path <SANITIZED_SUMMARY_JSON>",
    requiredMode: "aggregate-only-readonly",
    outputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads_no_secrets",
    failClosed: true
  },
  nextRecommendedSlice: "twii_bounded_readonly_preflight_runner_stub",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowedInThisDesign: false,
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

function assertPostReviewSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowedInThisGate",
    "supabaseWriteAllowed",
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

function assertProofSafety(safety, label) {
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
