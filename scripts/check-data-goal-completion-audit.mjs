import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-data-goal-completion-audit.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"data_goal_completion_audit\"",
  "audit_passed_not_100_until_coverage_route_complete",
  "currentDataGoalReadinessPercent",
  "all_ten_evidence_rows_ok",
  "proved_with_blocked_coverage",
  "completed_with_sanitized_aggregate_incomplete_review",
  "sanitized-post-run-review",
  "aggregate row coverage is incomplete",
  "sanitized post-run review",
  "publicDataSource=supabase",
  "scoreSource=real",
  "does not execute Supabase"
]) {
  if (!source.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const pattern of [
  /run-row-coverage-readonly-once/,
  /validate-supabase-readonly/,
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["report:data-goal-completion-audit"] !== "node scripts/report-data-goal-completion-audit.mjs") {
  missing.push(`${packagePath}: report:data-goal-completion-audit`);
}

if (packageJson.scripts?.["check:data-goal-completion-audit"] !== "node scripts/check-data-goal-completion-audit.mjs") {
  missing.push(`${packagePath}: check:data-goal-completion-audit`);
}

if (!reviewGate.includes("scripts/check-data-goal-completion-audit.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-goal-completion-audit.mjs`);
}

if (!fullHealth.includes("scripts/check-data-goal-completion-audit.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-data-goal-completion-audit.mjs`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

let output = null;
if (run.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\bstock_id\b/,
    /\bstockId\b/,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(run.stdout)) blocked.push(`${reportPath}: forbidden output pattern ${String(pattern)}`);
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "data_goal_completion_audit") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "audit_passed_not_100_until_coverage_route_complete") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.currentDataGoalReadinessPercent !== 96) {
    blocked.push(`currentDataGoalReadinessPercent expected 96, got ${String(output.currentDataGoalReadinessPercent)}`);
  }
  if (!Array.isArray(output.requirements) || output.requirements.length !== 8) {
    blocked.push("requirements expected eight rows");
  }
  if (!output.requirements?.some((row) => row.result === "proved_with_blocked_coverage")) {
    blocked.push("requirements must include proved_with_blocked_coverage");
  }
  if (!Array.isArray(output.completionBlockers) || output.completionBlockers.length < 4) {
    blocked.push("completionBlockers expected at least four items");
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "providerTermsFetched",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }

  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
