import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-data-goal-execution-review-bridge.mjs";
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
  "mode: \"data_goal_execution_review_bridge\"",
  "ready_for_explicit_authorized_one_attempt_flow",
  "execute exactly one bounded Supabase readonly row coverage attempt",
  "CP3_ROW_COVERAGE_READONLY_VALIDATE",
  "scripts/run-row-coverage-readonly-once.mjs",
  "postRunReviewContract",
  "sanitizedAggregateOnly",
  "noPromotionFromAttemptAlone",
  "postRunDecisionMap",
  "preflight_blocked",
  "publicDataSource=supabase",
  "scoreSource=real",
  "does not execute Supabase"
]) {
  if (!source.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const pattern of [
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

if (packageJson.scripts?.["report:data-goal-execution-review-bridge"] !== "node scripts/report-data-goal-execution-review-bridge.mjs") {
  missing.push(`${packagePath}: report:data-goal-execution-review-bridge`);
}

if (packageJson.scripts?.["check:data-goal-execution-review-bridge"] !== "node scripts/check-data-goal-execution-review-bridge.mjs") {
  missing.push(`${packagePath}: check:data-goal-execution-review-bridge`);
}

if (!reviewGate.includes("scripts/check-data-goal-execution-review-bridge.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-goal-execution-review-bridge.mjs`);
}

if (!fullHealth.includes("scripts/check-data-goal-execution-review-bridge.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-data-goal-execution-review-bridge.mjs`);
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
  if (output.mode !== "data_goal_execution_review_bridge") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "ready_for_explicit_authorized_one_attempt_flow") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.guardedRunner?.maxAttempts !== 1) blocked.push("guardedRunner.maxAttempts must be 1");
  if (output.postRunReviewContract?.immediate !== true) blocked.push("postRunReviewContract.immediate must be true");
  if (output.postRunReviewContract?.sanitizedAggregateOnly !== true) {
    blocked.push("postRunReviewContract.sanitizedAggregateOnly must be true");
  }
  if (output.postRunReviewContract?.noPromotionFromAttemptAlone !== true) {
    blocked.push("postRunReviewContract.noPromotionFromAttemptAlone must be true");
  }
  if (!Array.isArray(output.immediatePrechecksRequired) || output.immediatePrechecksRequired.length < 5) {
    blocked.push("immediatePrechecksRequired expected at least five checks");
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
