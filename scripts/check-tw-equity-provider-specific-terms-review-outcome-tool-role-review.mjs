import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md";
const recorderPath = "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs";
const recorderCheckPath = "scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs";
const ledgerCheckPath = "scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const review = read(reviewPath);
const recorder = read(recorderPath);
const recorderCheck = read(recorderCheckPath);
const ledgerCheck = read(ledgerCheckPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Provider-Specific Terms Review Outcome Tool Role Review",
  "Status: TW equity provider-specific terms review outcome tool role review recorded",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "ACCEPT AS LOCAL-ONLY OUTCOME RECORDING CONTROL",
  "accepted as local-only outcome recording control",
  "dry-run does not mutate the ledger",
  "classification does not equal source approval",
  "apply only records a local classification",
  "accepted_for_local_planning_only remains local planning only",
  "accepted_for_internal_only remains internal only",
  "accepted_for_delayed_public_display remains delayed display only",
  "accepted_for_derived_metrics_only remains derived metrics only",
  "rejected remains blocked",
  "unknown_keep_blocked remains blocked",
  "does not fetch market data",
  "does not ingest market data",
  "does not store source-derived rows",
  "does not write staging rows",
  "does not write daily_prices",
  "does not award row coverage points",
  "no Supabase client",
  "no SQL path",
  "no environment secret access",
  "no runtime wiring",
  "scoreSource remains mock",
  "publicDataSource remains mock",
  "recorder checker passes",
  "outcome ledger checker passes",
  "dry-run mutation guard passes",
  "review gate includes recorder checker",
  "full health includes recorder checker",
  "forbidden source patterns remain blocked",
  "This role review does not accept",
  "source approval",
  "provider terms approval",
  "source license approval",
  "redistribution approval",
  "retention approval",
  "public display approval",
  "derived-score use approval",
  "SQL execution",
  "Supabase connection",
  "Supabase reads",
  "Supabase writes",
  "staging rows",
  "production `daily_prices` mutation",
  "TWSE source retrieval",
  "market-data ingestion",
  "source-derived row storage",
  "public source promotion",
  "row coverage points",
  "`scoreSource=real`",
  "prepare a role-reviewed apply runbook"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const [path, text, phrases] of [
  [recorderPath, recorder, ["tw_equity_provider_specific_terms_review_outcome_recording", "--dry-run", "--apply", "stillDoesNotAuthorize"]],
  [recorderCheckPath, recorderCheck, ["dry-run mutated", "output.status !== \"dry_run\"", "record-tw-equity-provider-specific-terms-review-outcome"]],
  [ledgerCheckPath, ledgerCheck, ["tw_equity_provider_specific_terms_review_outcome_ledger", "not_source_approved", "scoreSourceRealEnabled"]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest TW equity provider terms outcome tool role review slice",
  "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md",
  "accepted as local-only outcome recording control",
  "classification does not equal source approval",
  "prepare a role-reviewed apply runbook"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-provider-specific-terms-review-outcome-tool-role-review"] !==
  "node scripts/check-tw-equity-provider-specific-terms-review-outcome-tool-role-review.mjs"
) {
  problems.push("package.json missing check:tw-equity-provider-specific-terms-review-outcome-tool-role-review");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-provider-specific-terms-review-outcome-tool-role-review.mjs")) {
    problems.push(`${path} missing TW equity provider terms outcome tool role review checker`);
  }
  if (!text.includes("tw-equity-provider-specific-terms-review-outcome-tool-role-review")) {
    problems.push(`${path} missing tw-equity-provider-specific-terms-review-outcome-tool-role-review name`);
  }
}

if (!reviewGate.includes('"tw-equity-provider-specific-terms-review-outcome-tool-role-review"')) {
  problems.push("review gate core set missing tw-equity-provider-specific-terms-review-outcome-tool-role-review");
}

const forbiddenPatterns = [
  /source approval is complete/u,
  /source is approved/u,
  /provider terms are approved/u,
  /source license is approved/u,
  /SQL execution is approved/u,
  /Supabase reads are approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /publicDataSource=supabase/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u,
  /raw payload/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(review)) problems.push(`${reviewPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
