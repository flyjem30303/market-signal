import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-blocker-execution-queue.mjs";
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
  "mode: \"local_blocker_execution_queue\"",
  "status: \"parallel_local_actions_ready_remote_paused\"",
  "scripts/report-blocker-resolution-plan.mjs",
  "Data 50 / Legal 25 / Investment 25",
  "advance one acceptance item per lane",
  "data-quality-evidence",
  "source-rights-and-disclosure",
  "model-credibility",
  "row-coverage-readonly",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "Do not spend more governance effort"
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

if (packageJson.scripts?.["report:blocker-execution-queue"] !== "node scripts/report-blocker-execution-queue.mjs") {
  missing.push(`${packagePath}: report:blocker-execution-queue`);
}

if (packageJson.scripts?.["check:blocker-execution-queue"] !== "node scripts/check-blocker-execution-queue.mjs") {
  missing.push(`${packagePath}: check:blocker-execution-queue`);
}

if (!reviewGate.includes("scripts/check-blocker-execution-queue.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-blocker-execution-queue.mjs`);
}

if (!fullHealth.includes("scripts/check-blocker-execution-queue.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-blocker-execution-queue.mjs`);
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
  if (output.mode !== "local_blocker_execution_queue") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "parallel_local_actions_ready_remote_paused") {
    blocked.push(`output.status: ${String(output.status)}`);
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

  const queueIds = new Set((output.executionQueue ?? []).map((item) => item.id));
  for (const id of ["data-quality-evidence", "source-rights-and-disclosure", "model-credibility"]) {
    if (!queueIds.has(id)) blocked.push(`output.executionQueue missing ${id}`);
  }

  for (const item of output.executionQueue ?? []) {
    if (!item.readyToExecuteLocally) {
      blocked.push(`${item.id}: must be readyToExecuteLocally`);
    }
    if (!Array.isArray(item.doneWhen) || item.doneWhen.length < 5) {
      blocked.push(`${item.id}: expected at least five doneWhen criteria`);
    }
    if (!item.nextCommand || !item.nextArtifact || !item.owner || !item.currentState) {
      blocked.push(`${item.id}: missing owner, state, nextCommand, or nextArtifact`);
    }
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
