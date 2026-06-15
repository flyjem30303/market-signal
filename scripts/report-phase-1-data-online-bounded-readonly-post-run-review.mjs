import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));
const summaryPath = normalizePath(args["summary-path"] ?? "");
const problems = [];

if (!summaryPath || !summaryPath.startsWith("tmp/")) problems.push("summary_path_must_be_under_tmp");

const summary = summaryPath ? readJson(summaryPath) : {};
const acceptsFailClosedStub =
  summary.status === "phase_1_data_online_bounded_readonly_stub_blocked_confirmation_required" &&
  summary.outcome === "blocked_fail_closed_no_remote_attempt" &&
  summary.remoteAttempted === false;
const acceptsMissingEnvBoundary =
  summary.status === "phase_1_data_online_bounded_readonly_boundary_blocked_missing_env" &&
  summary.outcome === "blocked_missing_env_no_remote_attempt" &&
  summary.boundaryMode === "real_readonly_boundary_dry_run" &&
  summary.remoteAttempted === false;
const acceptsBoundaryDryRunReady =
  summary.status === "phase_1_data_online_bounded_readonly_boundary_dry_run_ready" &&
  summary.outcome === "dry_run_real_readonly_boundary_ready_no_remote_attempt" &&
  summary.boundaryMode === "real_readonly_boundary_dry_run" &&
  summary.remoteAttempted === false;
const acceptsAggregateProbe =
  summary.status === "phase_1_data_online_bounded_readonly_completed_aggregate_probe" &&
  summary.outcome === "completed_aggregate_readonly_probe_no_write" &&
  summary.remoteAttempted === true &&
  summary.aggregateProbe?.dailyPrices?.queryStatus === "ok";
const acceptedBoundary = acceptsMissingEnvBoundary || acceptsBoundaryDryRunReady;
const acceptedRemoteAggregate = acceptsAggregateProbe;

if (!acceptsFailClosedStub && !acceptedBoundary && !acceptedRemoteAggregate) {
  problems.push("post_run_review_accepts_only_fail_closed_or_safe_boundary_no_remote_attempt");
}
if (summary.failClosed !== true) {
  problems.push("summary_must_be_fail_closed");
}
if (acceptsFailClosedStub && summary.remoteExecutionImplemented !== false) {
  problems.push("fail_closed_stub_summary_must_keep_remote_unimplemented");
}
if ((acceptedBoundary || acceptedRemoteAggregate) && summary.remoteExecutionImplemented !== true) {
  problems.push("boundary_summary_must_mark_remote_boundary_implemented");
}
assertRunnerSafety(summary.safety, "summary safety");

const accepted = problems.length === 0;
const acceptedStatus = acceptsFailClosedStub
  ? "phase_1_data_online_bounded_readonly_post_run_review_accepted_fail_closed_stub"
  : acceptsMissingEnvBoundary
    ? "phase_1_data_online_bounded_readonly_post_run_review_accepted_missing_env_boundary"
    : acceptsBoundaryDryRunReady
      ? "phase_1_data_online_bounded_readonly_post_run_review_accepted_boundary_dry_run_ready"
      : acceptsAggregateProbe
        ? "phase_1_data_online_bounded_readonly_post_run_review_accepted_aggregate_probe"
      : "blocked";
const acceptedOutcome = acceptsFailClosedStub
  ? "accepted_fail_closed_stub_no_remote_attempt"
  : acceptsMissingEnvBoundary
    ? "accepted_missing_env_boundary_no_remote_attempt"
    : acceptsBoundaryDryRunReady
      ? "accepted_real_readonly_boundary_dry_run_ready_no_remote_attempt"
      : acceptsAggregateProbe
        ? "accepted_aggregate_readonly_probe_no_write"
      : "blocked";
const review = {
  status: accepted ? acceptedStatus : "blocked",
  outcome: accepted ? acceptedOutcome : "blocked",
  summaryPath: summaryPath || null,
  reviewedStatus: summary.status ?? null,
  reviewedOutcome: summary.outcome ?? null,
  remoteAttempted: summary.remoteAttempted === true,
  acceptedMeaning:
    acceptedRemoteAggregate
      ? "Accepted only as sanitized aggregate readonly evidence. It does not approve Supabase writes, row coverage awards, data-online promotion, score promotion, or investment advice claims."
      : acceptedBoundary
      ? "Accepted only as proof that the Phase 1 bounded readonly runner boundary is safe and did not attempt a remote read. It does not approve a data-online or runtime promotion."
      : "Accepted only as proof that the Phase 1 bounded readonly runner fails closed without confirmation. It does not approve or execute a Supabase readonly attempt.",
  nextRecommendedSlice: acceptedRemoteAggregate
    ? "phase_1_data_online_aggregate_readonly_result_to_write_gate_or_env_repair"
    : acceptedBoundary
    ? "phase_1_data_online_exactly_one_aggregate_readonly_attempt_or_env_repair"
    : "phase_1_data_online_operator_decision_for_exactly_one_readonly_attempt",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowed: false,
    supabaseReadAllowedByThisReview: false,
    supabaseWriteAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(review, null, 2));
if (!accepted) process.exit(1);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}

function normalizePath(value) {
  return String(value).replace(/\\/g, "/");
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`${filePath}_not_valid_json`);
    return {};
  }
}

function assertRunnerSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  const readWasAttempted = summary.remoteAttempted === true;
  for (const key of [
    "sqlExecuted",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
  if (safety?.supabaseConnectionAttempted !== readWasAttempted) {
    problems.push(`${label}.supabaseConnectionAttempted must match remoteAttempted`);
  }
  if (safety?.supabaseReadsEnabled !== readWasAttempted) {
    problems.push(`${label}.supabaseReadsEnabled must match remoteAttempted`);
  }
}
