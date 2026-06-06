import fs from "node:fs";

const problems = [];

const runbookPath = "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md";
const roleReviewPath =
  "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md";
const recorderPath = "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs";
const ledgerPath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const runbook = read(runbookPath);
const roleReview = read(roleReviewPath);
const recorder = read(recorderPath);
const ledger = read(ledgerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Provider-Specific Terms Apply Runbook",
  "tw_equity_provider_specific_terms_apply_runbook_ready_no_outcome_recorded",
  "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "This runbook does not record any outcome by itself",
  "Required Human Input",
  "`permitted-use`",
  "`attribution`",
  "`redistribution`",
  "`retention`",
  "`rate-limit-and-outage`",
  "`delay-incompleteness-public-display`",
  "`derived-score-use`",
  "`accepted_for_local_planning_only`",
  "`accepted_for_internal_only`",
  "`accepted_for_delayed_public_display`",
  "`accepted_for_derived_metrics_only`",
  "`rejected`",
  "`unknown_keep_blocked`",
  "Do not infer a favorable classification",
  "Step 1: Inspect Current Ledger",
  "node scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "publicDataSource",
  "scoreSource",
  "not_source_approved",
  "Step 2: Dry-Run The Recording Command",
  "--dry-run",
  "status` is `dry_run`",
  "stillDoesNotAuthorize",
  "If dry-run fails, stop and report",
  "Step 3: Apply Only After Dry-Run Passes",
  "--apply",
  "This records only a local classification",
  "It does not promote runtime state",
  "Step 4: Post-Apply Checks",
  "node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "node scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "node scripts/check-readable-current-status.mjs",
  "cmd.exe /c npm run check:json",
  "node scripts/check-review-gates.mjs",
  "Stop Lines",
  "dry-run mutates the ledger",
  "post-apply checks fail",
  "Use this runbook only after a specific human classification exists"
]) {
  if (!runbook.includes(phrase)) problems.push(`${runbookPath} missing: ${phrase}`);
}

for (const [path, text, phrases] of [
  [roleReviewPath, roleReview, ["prepare a role-reviewed apply runbook", "classification does not equal source approval"]],
  [recorderPath, recorder, ["--dry-run", "--apply", "tw_equity_provider_specific_terms_review_outcome_recording"]],
  [ledgerPath, ledger, ["permitted-use", "pending"]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest TW equity provider terms apply runbook slice",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md",
  "tw_equity_provider_specific_terms_apply_runbook_ready_no_outcome_recorded",
  "does not record any outcome by itself",
  "Use this runbook only after a specific human classification exists"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-provider-specific-terms-apply-runbook"] !==
  "node scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs"
) {
  problems.push("package.json missing check:tw-equity-provider-specific-terms-apply-runbook");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs")) {
    problems.push(`${path} missing TW equity provider terms apply runbook checker`);
  }
  if (!text.includes("tw-equity-provider-specific-terms-apply-runbook")) {
    problems.push(`${path} missing tw-equity-provider-specific-terms-apply-runbook name`);
  }
}

if (!reviewGate.includes('"tw-equity-provider-specific-terms-apply-runbook"')) {
  problems.push("review gate core set missing tw-equity-provider-specific-terms-apply-runbook");
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
  if (pattern.test(runbook)) problems.push(`${runbookPath} contains forbidden token: ${pattern}`);
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
