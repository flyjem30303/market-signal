import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_ONE_ATTEMPT_STAGING_WRITE_PREFLIGHT_GATE.md";
const authPath = "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md";
const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const reconciliationReviewPath = "docs/reviews/TW_EQUITY_TARGET_RELATION_RECONCILIATION_REVIEW_2026-06-06.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const auth = read(authPath);
const migration = read(migrationPath);
const reconciliationReview = read(reconciliationReviewPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity One-Attempt Staging Write Preflight Gate",
  "tw_equity_one_attempt_staging_write_preflight_gate_reconciled_not_executed",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "target relation set: `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`",
  "source classification reference: `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`",
  "service-role posture: present but not executed",
  "RLS posture: present but not executed",
  "rollback owner: `PM`",
  "rollback dry-run posture: present but not run",
  "retention window: `internal_staging_validation_window_7_days_then_review_or_purge`",
  "post-run review artifact: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md`",
  "no retry",
  "no public redistribution",
  "no public promotion",
  "no row coverage points",
  "no score-source promotion",
  "`staging_twse_stock_day_runs`",
  "`staging_twse_stock_day_prices`",
  "Current decision: target relation reconciled, not executed",
  "No SQL, Supabase connection, Supabase write, staging row creation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrase] of [
  [authPath, auth, "tw_equity_actual_bounded_staging_write_authorization_packet_ready_not_executed"],
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_runs"],
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_prices"],
  [reconciliationReviewPath, reconciliationReview, "tw_equity_target_relation_reconciliation_accepted_not_executed"]
]) {
  if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity one-attempt staging write preflight gate slice",
  "docs/TW_EQUITY_ONE_ATTEMPT_STAGING_WRITE_PREFLIGHT_GATE.md",
  "tw_equity_one_attempt_staging_write_preflight_gate_reconciled_not_executed",
  "docs/reviews/TW_EQUITY_TARGET_RELATION_RECONCILIATION_REVIEW_2026-06-06.md",
  "target relation reconciliation is accepted",
  "actual bounded staging write remains not executed because no write-capable runner exists"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-one-attempt-staging-write-preflight-gate"] !==
  "node scripts/check-tw-equity-one-attempt-staging-write-preflight-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-one-attempt-staging-write-preflight-gate");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-one-attempt-staging-write-preflight-gate.mjs")) {
    problems.push(`${path} missing one-attempt staging write preflight gate checker`);
  }
  if (!text.includes("tw-equity-one-attempt-staging-write-preflight-gate")) {
    problems.push(`${path} missing tw-equity-one-attempt-staging-write-preflight-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-one-attempt-staging-write-preflight-gate"')) {
  problems.push("review gate core set missing tw-equity-one-attempt-staging-write-preflight-gate");
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
