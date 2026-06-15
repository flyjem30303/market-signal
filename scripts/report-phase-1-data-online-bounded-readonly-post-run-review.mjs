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

if (!acceptsFailClosedStub) problems.push("post_run_review_accepts_only_fail_closed_stub_no_remote_attempt");
if (summary.failClosed !== true || summary.remoteExecutionImplemented !== false) {
  problems.push("summary_must_be_fail_closed_and_remote_unimplemented");
}
assertRunnerSafety(summary.safety, "summary safety");

const accepted = problems.length === 0;
const review = {
  status: accepted ? "phase_1_data_online_bounded_readonly_post_run_review_accepted_fail_closed_stub" : "blocked",
  outcome: accepted ? "accepted_fail_closed_stub_no_remote_attempt" : "blocked",
  summaryPath: summaryPath || null,
  reviewedStatus: summary.status ?? null,
  reviewedOutcome: summary.outcome ?? null,
  remoteAttempted: summary.remoteAttempted === true,
  acceptedMeaning:
    "Accepted only as proof that the Phase 1 bounded readonly runner fails closed without confirmation. It does not approve or execute a Supabase readonly attempt.",
  nextRecommendedSlice: "phase_1_data_online_operator_decision_for_exactly_one_readonly_attempt",
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
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
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
}
