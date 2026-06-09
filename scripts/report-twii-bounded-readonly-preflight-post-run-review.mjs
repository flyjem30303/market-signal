import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));
const summaryPath = normalizePath(args["summary-path"] ?? "");
const problems = [];

if (!summaryPath || !summaryPath.startsWith("tmp/")) {
  problems.push("summary_path_must_be_under_tmp");
}

const summary = summaryPath ? readJson(summaryPath) : {};
const acceptsDefaultBlockedStub =
  summary.status === "twii_bounded_readonly_preflight_stub_blocked_confirmation_required" &&
  summary.outcome === "blocked_fail_closed_no_remote_attempt";
const acceptsBoundaryDryRun =
  summary.status === "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready" &&
  summary.outcome === "ready_for_single_remote_readonly_attempt_not_executed" &&
  summary.remoteExecutionBoundaryImplemented === true &&
  summary.executeRequested === false;

if (!acceptsDefaultBlockedStub && !acceptsBoundaryDryRun) {
  problems.push("post_run_review_accepts_only_default_blocked_stub_or_real_readonly_boundary_dry_run");
}
if (summary.failClosed !== true || summary.remoteExecutionImplemented !== false) {
  problems.push("summary_must_be_fail_closed_and_remote_unexecuted");
}
assertSafety(summary.safety, "summary safety");

const accepted = problems.length === 0;
const acceptedStatus = acceptsBoundaryDryRun
  ? "twii_bounded_readonly_preflight_post_run_review_accepted_real_readonly_boundary_dry_run"
  : "twii_bounded_readonly_preflight_post_run_review_accepted_fail_closed_stub";
const acceptedOutcome = acceptsBoundaryDryRun
  ? "accepted_real_readonly_boundary_dry_run_no_remote_attempt"
  : "accepted_fail_closed_stub_no_remote_attempt";
const review = {
  status: accepted ? acceptedStatus : "blocked",
  outcome: accepted ? acceptedOutcome : "blocked",
  summaryPath: summaryPath || null,
  reviewedStatus: summary.status ?? null,
  reviewedOutcome: summary.outcome ?? null,
  acceptedMeaning: acceptsBoundaryDryRun
    ? "Accepted only as proof that the real-readonly runner boundary dry-run is token-gated and no-remote. It does not approve a Supabase readonly attempt."
    : "Accepted only as proof that the local readonly preflight stub fails closed without confirmation. It does not approve a Supabase readonly attempt.",
  nextRecommendedSlice: acceptsBoundaryDryRun
    ? "twii_bounded_readonly_preflight_single_attempt_authorization"
    : "twii_bounded_readonly_preflight_authorization_packet",
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

function assertSafety(safety, label) {
  const requiredFalse = [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ];
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of requiredFalse) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}
