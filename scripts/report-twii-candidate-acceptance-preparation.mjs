import { spawnSync } from "node:child_process";

const CANDIDATE_PATH = "data/candidates/twii-sanitized-candidate.json";

const routeDecision = runJson(["scripts/report-twii-bounded-readonly-result-to-data-route-decision.mjs"]);
const candidateDecision = runJsonWithCandidate(["scripts/report-twii-candidate-acceptance-decision-gate.mjs"]);
const pmReview = runJsonWithCandidate(["scripts/report-pm-twii-candidate-acceptance-review.mjs"]);
const routePreflight = runJsonWithCandidate(["scripts/report-twii-bounded-data-acceptance-route-preflight.mjs"]);

const problems = [];
if (routeDecision.status !== "twii_bounded_readonly_result_to_data_route_decision_ready") {
  problems.push("readonly_result_to_data_route_decision_not_ready");
}
if (candidateDecision.status !== "twii_candidate_acceptance_decision_gate_ready_for_later_bounded_data_acceptance_route") {
  problems.push("candidate_acceptance_decision_gate_not_ready");
}
if (pmReview.status !== "pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route") {
  problems.push("pm_candidate_acceptance_review_not_ready");
}
if (routePreflight.status !== "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet") {
  problems.push("bounded_data_acceptance_route_preflight_not_ready");
}
assertSafety(candidateDecision, "candidate decision");
assertSafety(pmReview, "pm review");
assertSafety(routePreflight, "route preflight");

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_candidate_acceptance_preparation_ready" : "blocked",
  outcome: ready ? "ready_for_bounded_data_acceptance_authorization_packet" : "blocked",
  mode: "twii_candidate_acceptance_preparation",
  owner: "CEO/PM",
  candidateArtifactPath: CANDIDATE_PATH,
  upstream: {
    routeDecisionStatus: routeDecision.status ?? null,
    candidateDecisionStatus: candidateDecision.status ?? null,
    pmReviewStatus: pmReview.status ?? null,
    boundedRoutePreflightStatus: routePreflight.status ?? null
  },
  nextAction: ready
    ? "Prepare or execute the existing TWII bounded data acceptance authorization packet review; do not run a data acceptance attempt without the separate named authorization gate."
    : "Resolve the blocked upstream gate before opening a bounded data acceptance authorization packet.",
  nextCommand: "cmd.exe /c npm run report:twii-bounded-data-acceptance-route-preflight",
  boundary: {
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
    dailyPricesMutated: false,
    stagingRowsCreated: false,
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
    return {};
  }
}

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
  }
  const boundary = output.authorizationBoundary ?? output.boundary ?? {};
  if (boundary.candidateRowsAcceptedNow !== false) problems.push(`${label}_must_not_accept_rows`);
  if (boundary.rowCoverageScoringAllowed !== false) problems.push(`${label}_must_not_score_coverage`);
}
