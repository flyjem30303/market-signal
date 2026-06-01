import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-blocker-action-priorities.mjs";
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
  "mode: \"local_blocker_action_priorities\"",
  "status: \"ready_for_parallel_local_execution\"",
  "scripts/report-data-quality-evidence-checklist.mjs",
  "Data field-validity is locally specified and QA-reviewed",
  "npm run report:source-rights-disclosure-local-review",
  "npm run report:model-credibility-local-review",
  "npm run report:data-quality-field-validity-qa-review",
  "scripts/report-source-rights-disclosure-checklist.mjs",
  "scripts/report-model-credibility-checklist.mjs",
  "field-validity-rules",
  "downgrade-behavior",
  "source-attribution",
  "delay-incompleteness-disclosure",
  "score-purpose",
  "interpretation-downgrade-policy",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "Legal source-rights first, Investment credibility in parallel",
  "readonly evidence stays paused"
]) {
  if (!source.includes(phrase)) {
    missing.push(`${reportPath}: ${phrase}`);
  }
}

for (const pattern of [
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /scoreSourceRealEnabled:\s*true/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:blocker-action-priorities"] !== "node scripts/report-blocker-action-priorities.mjs") {
  missing.push(`${packagePath}: report:blocker-action-priorities`);
}

if (packageJson.scripts?.["check:blocker-action-priorities"] !== "node scripts/check-blocker-action-priorities.mjs") {
  missing.push(`${packagePath}: check:blocker-action-priorities`);
}

if (!reviewGate.includes("scripts/check-blocker-action-priorities.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-blocker-action-priorities.mjs`);
}

if (!fullHealth.includes("scripts/check-blocker-action-priorities.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-blocker-action-priorities.mjs`);
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
    if (pattern.test(run.stdout)) {
      blocked.push(`${reportPath}: forbidden output pattern ${String(pattern)}`);
    }
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "local_blocker_action_priorities") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "ready_for_parallel_local_execution") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.firstMove?.id !== "source-rights-and-disclosure") {
    blocked.push(`output.firstMove.id: ${String(output.firstMove?.id)}`);
  }
  if (output.firstMove?.command !== "npm run report:source-rights-disclosure-local-review") {
    blocked.push(`output.firstMove.command: ${String(output.firstMove?.command)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
    }
  }

  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }

  const laneIds = new Set((output.laneStatus ?? []).map((lane) => lane.id));
  for (const id of ["data-quality-evidence", "source-rights-and-disclosure", "model-credibility"]) {
    if (!laneIds.has(id)) {
      blocked.push(`output.laneStatus missing ${id}`);
    }
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
