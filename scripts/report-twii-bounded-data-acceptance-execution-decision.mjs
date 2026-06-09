import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const CANDIDATE_PATH = "data/candidates/twii-sanitized-candidate.json";
const ATTEMPT_ID = "twii-bounded-data-acceptance-20260609-a";
const DECISION_ID = "twii-bounded-data-acceptance-execution-decision-20260609";
const OUT_DIR = path.join("tmp", "twii-bounded-data-acceptance-execution-decision");
const PACKET_PATH = path.join(OUT_DIR, `${ATTEMPT_ID}.packet.json`);
const PACKET_RESULT_PATH = path.join(OUT_DIR, `${ATTEMPT_ID}.packet.result.json`);

const problems = [];

const preparation = runJson(["scripts/report-twii-candidate-acceptance-preparation.mjs"]);
const routePreflight = runJsonWithCandidate(["scripts/report-twii-bounded-data-acceptance-route-preflight.mjs"]);

if (preparation.status !== "twii_candidate_acceptance_preparation_ready") {
  problems.push("candidate_acceptance_preparation_not_ready");
}
if (routePreflight.status !== "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet") {
  problems.push("bounded_data_acceptance_route_preflight_not_ready");
}
if (!fs.existsSync(CANDIDATE_PATH)) problems.push("candidate_artifact_missing");

fs.mkdirSync(OUT_DIR, { recursive: true });
const packet = createPacket();
fs.writeFileSync(PACKET_PATH, `${JSON.stringify(packet, null, 2)}\n`);

const packetGate = runJson([
  "scripts/report-twii-bounded-data-acceptance-named-attempt-packet.mjs",
  "--packet-path",
  PACKET_PATH,
  "--out",
  PACKET_RESULT_PATH
]);

if (packetGate.status !== "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain") {
  problems.push("named_attempt_packet_gate_not_accepted_for_no_write_chain");
}
assertMockSafety(preparation, "preparation");
assertMockSafety(routePreflight, "route preflight");
assertGateSafety(packetGate, "packet gate");

const ready = problems.length === 0;
const report = {
  status: ready
    ? "twii_bounded_data_acceptance_execution_decision_ready_for_named_no_write_chain"
    : "blocked",
  outcome: ready ? "named_acceptance_attempt_gate_ready_no_write_chain_only" : "blocked",
  mode: "twii_bounded_data_acceptance_execution_decision",
  owner: "CEO/PM",
  attemptId: ATTEMPT_ID,
  decisionId: DECISION_ID,
  candidateArtifactPath: CANDIDATE_PATH,
  generatedPacketPath: PACKET_PATH,
  generatedPacketResultPath: PACKET_RESULT_PATH,
  upstream: {
    candidateAcceptancePreparationStatus: preparation.status ?? null,
    boundedRoutePreflightStatus: routePreflight.status ?? null,
    namedAttemptPacketGateStatus: packetGate.status ?? null
  },
  nextAction: ready
    ? "Run and review the local packet-driven no-write chain, then stop for post-run review before any broader data action."
    : "Resolve blocked upstream readiness before opening the local packet-driven no-write chain.",
  nextCommand: ready
    ? `cmd.exe /c npm run run:twii-bounded-data-acceptance-packet-driven-chain -- --packet-path ${PACKET_PATH}`
    : null,
  executionDecision: {
    namedNoWritePacketDrivenChainAllowedNext: ready,
    dataAcceptanceAttemptAllowedNow: false,
    candidateRowsAcceptedNow: false,
    rowCoverageScoringAllowed: false,
    dailyPricesMutationAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadAttemptedByThisSlice: false,
    supabaseWriteAttempted: false,
    marketDataFetched: false,
    marketDataIngested: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
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
if (!ready) process.exit(1);

function createPacket() {
  return {
    packetKind: "twii_bounded_data_acceptance_named_attempt_packet",
    attemptId: ATTEMPT_ID,
    candidateArtifactPath: CANDIDATE_PATH,
    mode: "no-write-preview",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    decisionReference: {
      decisionId: DECISION_ID,
      owner: "CEO/PM",
      decisionStatus: "accepted_for_no_write_dry_run_chain",
      summary:
        "Readonly proof and candidate acceptance preparation are ready; this permits only a local no-write packet-driven chain."
    },
    commands: {
      chainCommand:
        "cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id twii-bounded-data-acceptance-20260609-a --candidate-artifact-path data\\candidates\\twii-sanitized-candidate.json --mode no-write-preview",
      postRunReviewCommand:
        "cmd.exe /c npm run report:twii-bounded-data-acceptance-post-run-review -- --summary-path tmp\\twii-bounded-data-acceptance-20260609-a\\twii-bounded-data-acceptance-chain-twii-bounded-data-acceptance-20260609-a.json"
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
      sourcePayloadOutputAllowed: false,
      secretOutputAllowed: false,
      publicPromotionAllowed: false,
      scoreSourceRealAllowed: false
    }
  };
}

function runJson(args) {
  return run(args, process.env);
}

function runJsonWithCandidate(args) {
  return run(args, { ...process.env, A1_TWII_CANDIDATE_ARTIFACT_PATH: CANDIDATE_PATH });
}

function run(args, env) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(result.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} did not return JSON`);
    return {};
  }
}

function assertMockSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
  }
  const boundary = output.authorizationBoundary ?? output.boundary ?? output.executionDecision ?? {};
  if (boundary.candidateRowsAcceptedNow !== false) problems.push(`${label}_must_not_accept_rows`);
  if (boundary.rowCoverageScoringAllowed !== false) problems.push(`${label}_must_not_score_coverage`);
  if (boundary.dailyPricesMutationAllowed !== false) problems.push(`${label}_must_not_mutate_daily_prices`);
}

function assertGateSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
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
    "sourcePayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key}_must_be_false`);
  }
}

