import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK_ROLE_REVIEW_2026-06-06.md";
const runbookPath = "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md";
const recorderPath = "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs";
const runbookCheckPath = "scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const review = read(reviewPath);
const runbook = read(runbookPath);
const recorder = read(recorderPath);
const runbookCheck = read(runbookCheckPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Provider-Specific Terms Apply Runbook Role Review",
  "Status: TW equity provider-specific terms apply runbook role review recorded",
  "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md",
  "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md",
  "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs",
  "scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs",
  "scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "ACCEPT AS LOCAL-ONLY APPLY RUNBOOK",
  "accepted as local-only apply runbook",
  "does not execute the runbook",
  "does not run the recorder",
  "does not record any outcome",
  "does not approve source use",
  "does not approve provider terms",
  "does not promote runtime state",
  "requires specific human classification",
  "requires id",
  "requires classification",
  "requires recordedBy",
  "requires recordedAt",
  "requires note",
  "do not infer a favorable classification",
  "do not copy provider terms",
  "do not copy source payloads",
  "unknown_keep_blocked remains blocked",
  "rejected remains blocked",
  "source license approval remains blocked",
  "provider terms approval remains blocked",
  "does not fetch market data",
  "does not ingest market data",
  "does not store source-derived rows",
  "does not write staging rows",
  "does not write daily_prices",
  "does not award row coverage points",
  "uses existing local recorder",
  "uses post-apply checks",
  "no Supabase client",
  "no SQL path",
  "no environment secret access",
  "no runtime wiring",
  "apply runbook checker passes",
  "recorder checker passes",
  "outcome ledger checker passes",
  "readable status checker passes",
  "JSON checker passes",
  "review gate passes",
  "This role review accepts",
  "the apply runbook as a future operating procedure",
  "the required dry-run-before-apply sequence",
  "the requirement to run post-apply checks",
  "This role review does not accept",
  "executing `--dry-run`",
  "executing `--apply`",
  "recording any classification",
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
  "wait for a specific human classification",
  "execute exactly one dry-run for that one item",
  "execute exactly one apply for that one item",
  "then run post-apply checks"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const [path, text, phrases] of [
  [runbookPath, runbook, ["tw_equity_provider_specific_terms_apply_runbook_ready_no_outcome_recorded", "This runbook does not record any outcome by itself", "Use this runbook only after a specific human classification exists"]],
  [recorderPath, recorder, ["--dry-run", "--apply", "tw_equity_provider_specific_terms_review_outcome_recording"]],
  [runbookCheckPath, runbookCheck, ["tw-equity-provider-specific-terms-apply-runbook", "review gate core set missing"]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest TW equity provider terms apply runbook role review slice",
  "docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK_ROLE_REVIEW_2026-06-06.md",
  "accepted as local-only apply runbook",
  "does not execute the runbook",
  "wait for a specific human classification"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-provider-specific-terms-apply-runbook-role-review"] !==
  "node scripts/check-tw-equity-provider-specific-terms-apply-runbook-role-review.mjs"
) {
  problems.push("package.json missing check:tw-equity-provider-specific-terms-apply-runbook-role-review");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-provider-specific-terms-apply-runbook-role-review.mjs")) {
    problems.push(`${path} missing TW equity provider terms apply runbook role review checker`);
  }
  if (!text.includes("tw-equity-provider-specific-terms-apply-runbook-role-review")) {
    problems.push(`${path} missing tw-equity-provider-specific-terms-apply-runbook-role-review name`);
  }
}

if (!reviewGate.includes('"tw-equity-provider-specific-terms-apply-runbook-role-review"')) {
  problems.push("review gate core set missing tw-equity-provider-specific-terms-apply-runbook-role-review");
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
