import fs from "node:fs";
import { spawnSync } from "node:child_process";

const SUMMARY_PATH =
  "tmp/twii-bounded-readonly-preflight-20260609-a/twii-bounded-readonly-preflight-remote-readonly-twii-bounded-readonly-preflight-20260609-a.json";
const ACCEPTED_READONLY_STATUS = "twii_bounded_readonly_preflight_remote_readonly_completed_sanitized_probe";
const ACCEPTED_HANDOFF_STATUS = "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet";

const summary = readJson(SUMMARY_PATH);
const candidateGate = runJson(["scripts/report-twii-candidate-acceptance-decision-gate.mjs"]);
const problems = [];

const readonlyReachable =
  summary.status === ACCEPTED_READONLY_STATUS &&
  summary.readonlyAttempted === true &&
  summary.safety?.supabaseReadAttempted === true &&
  summary.safety?.supabaseWriteAttempted === false &&
  Array.isArray(summary.probes) &&
  summary.probes.length === 2 &&
  summary.probes.every((probe) => ["stocks", "daily_prices"].includes(probe.table) && probe.reachable === "ok");

if (!readonlyReachable) problems.push("remote_readonly_summary_not_reachable_or_not_sanitized");
if (summary.candidateArtifactStatus !== ACCEPTED_HANDOFF_STATUS) problems.push("candidate_artifact_handoff_not_ready");
if (
  ![
    "twii_candidate_acceptance_decision_gate_blocked_aggregate_readback_not_ready",
    "twii_candidate_acceptance_decision_gate_ready_for_later_bounded_data_acceptance_route"
  ].includes(candidateGate.status)
) {
  problems.push("candidate_acceptance_gate_not_in_safe_blocked_or_ready_state");
}
assertSafety(summary.safety, "readonly summary safety");
assertCandidateSafety(candidateGate, "candidate gate safety");

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_bounded_readonly_result_to_data_route_decision_ready" : "blocked",
  outcome: ready
    ? "candidate_acceptance_preparation_with_rights_field_contract_guard"
    : "blocked",
  mode: "twii_bounded_readonly_result_to_data_route_decision",
  owner: "CEO/PM",
  inputSummaryPath: SUMMARY_PATH,
  readonlyProof: {
    status: summary.status ?? null,
    outcome: summary.outcome ?? null,
    tablesReachable: Array.isArray(summary.probes)
      ? summary.probes.map((probe) => ({
          countStatus: probe.countStatus,
          errorCategory: probe.errorCategory,
          reachable: probe.reachable,
          table: probe.table
        }))
      : [],
    sanitizedAggregateOnly: summary.outputPolicy?.aggregateStatusOnly === true
  },
  currentCandidateGate: {
    status: candidateGate.status ?? null,
    decisionMeaning: candidateGate.decisionMeaning ?? null
  },
  routeDecision: {
    immediateRoute: "candidate_acceptance_preparation_with_rights_field_contract_guard",
    blockedRoutes: [
      "candidate_rows_acceptance_now",
      "row_coverage_scoring_now",
      "daily_prices_mutation_now",
      "publicDataSource_supabase_promotion_now",
      "scoreSource_real_promotion_now"
    ],
    nextCommand: "cmd.exe /c npm run report:twii-candidate-acceptance-decision-gate",
    nextRequiredInput:
      "A1_TWII_CANDIDATE_ARTIFACT_PATH must point to an accepted sanitized aggregate-only artifact before any later bounded data acceptance route.",
    pmDecision:
      "Proceed to candidate acceptance preparation only; require source-rights, field-contract, and aggregate readback acceptance before any separate data acceptance or coverage scoring gate."
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseReadAttemptedInPriorProof: summary.safety?.supabaseReadAttempted === true,
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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function runJson(args) {
  const run = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    return {};
  }
}

function assertSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}_${key}_must_be_false`);
  }
}

function assertCandidateSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
  }
  if (output.authorizationBoundary?.candidateRowsAcceptedNow !== false) {
    problems.push(`${label}_must_not_accept_rows`);
  }
  if (output.authorizationBoundary?.rowCoverageScoringAllowed !== false) {
    problems.push(`${label}_must_not_score_coverage`);
  }
}
