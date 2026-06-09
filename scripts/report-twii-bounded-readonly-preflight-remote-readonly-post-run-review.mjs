import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));
const summaryPath = normalizePath(args["summary-path"] ?? "");
const problems = [];

if (!summaryPath.startsWith("tmp/twii-bounded-readonly-preflight-20260609-a/")) {
  problems.push("summary_path_must_be_named_attempt_tmp_path");
}

const summary = summaryPath ? readJson(summaryPath) : {};
const acceptableStatus = new Set([
  "twii_bounded_readonly_preflight_remote_readonly_completed_sanitized_probe",
  "twii_bounded_readonly_preflight_remote_readonly_blocked_sanitized_probe"
]);
const accepted = acceptableStatus.has(summary.status) && summary.readonlyAttempted === true;

if (!accepted) problems.push("summary_must_be_completed_or_blocked_sanitized_remote_readonly_probe");
if (!Array.isArray(summary.probes) || summary.probes.length !== 2) problems.push("summary_must_have_two_sanitized_probes");
for (const probe of summary.probes ?? []) {
  if (!["stocks", "daily_prices"].includes(probe.table)) problems.push("unexpected_probe_table");
  if (!["ok", "blocked"].includes(probe.reachable)) problems.push("probe_reachable_must_be_ok_or_blocked");
  if (probe.errorCode && !/^[A-Z0-9_]+$/iu.test(probe.errorCode)) problems.push("probe_error_code_must_be_sanitized");
}
assertSafety(summary.safety, "summary safety");
assertOutputPolicy(summary.outputPolicy, "summary output policy");

const reviewAccepted = problems.length === 0;
const review = {
  status: reviewAccepted
    ? "twii_bounded_readonly_preflight_remote_readonly_post_run_review_accepted_sanitized_probe"
    : "blocked",
  outcome: reviewAccepted ? "accepted_sanitized_remote_readonly_probe_no_write_no_rows" : "blocked",
  summaryPath,
  reviewedStatus: summary.status ?? null,
  reviewedOutcome: summary.outcome ?? null,
  acceptedMeaning:
    "Accepted only as a bounded Supabase readonly reachability/count proof. It does not accept rows, score coverage, mutate data, promote public data source, or set real score.",
  nextRecommendedSlice: "twii_bounded_readonly_preflight_remote_readonly_result_to_data_route_decision",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseReadonlyAcceptedForThisProbe: reviewAccepted,
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
if (!reviewAccepted) process.exit(1);

function assertSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  const requiredFalse = [
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
  ];
  for (const key of requiredFalse) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
  if (safety?.supabaseConnectionAttempted !== true) problems.push(`${label}.supabaseConnectionAttempted must be true`);
  if (safety?.supabaseReadAttempted !== true) problems.push(`${label}.supabaseReadAttempted must be true`);
}

function assertOutputPolicy(policy, label) {
  if (policy?.aggregateStatusOnly !== true) problems.push(`${label}.aggregateStatusOnly must be true`);
  for (const key of [
    "rowPayloadIncluded",
    "rawPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded",
    "supabaseUrlPrinted"
  ]) {
    if (policy?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`${filePath}_not_valid_json`);
    return {};
  }
}

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
