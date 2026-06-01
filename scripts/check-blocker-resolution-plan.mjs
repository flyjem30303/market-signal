import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-blocker-resolution-plan.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"local_blocker_resolution_plan\"",
  "status: \"local_actions_ready_remote_paused\"",
  "scripts/report-project-progress-snapshot.mjs",
  "row-coverage-readonly",
  "data-quality-evidence",
  "report:data-quality-field-validity-qa-review",
  "source-rights-and-disclosure",
  "report:source-rights-disclosure-local-review",
  "model-credibility",
  "report:model-credibility-local-review",
  "unblockDecisionReadiness",
  "local_reviews_complete_external_approvals_pending",
  "canRequestHumanApproval: true",
  "source-specific rights have not been approved",
  "Investment has not approved public interpretation",
  "data quality score remains below the real-score threshold",
  "scoreSource=real remains explicitly blocked",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "Legal 45, Investment 35, Data 20",
  "remote readonly execution paused"
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

if (packageJson.scripts?.["report:blocker-resolution-plan"] !== "node scripts/report-blocker-resolution-plan.mjs") {
  missing.push(`${packagePath}: report:blocker-resolution-plan`);
}

if (packageJson.scripts?.["check:blocker-resolution-plan"] !== "node scripts/check-blocker-resolution-plan.mjs") {
  missing.push(`${packagePath}: check:blocker-resolution-plan`);
}

if (!reviewGate.includes("scripts/check-blocker-resolution-plan.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-blocker-resolution-plan.mjs`);
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
  if (output.mode !== "local_blocker_resolution_plan") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "local_actions_ready_remote_paused") {
    blocked.push(`output.status: ${String(output.status)}`);
  }

  for (const flag of ["automatedRemoteRun", "connectionAttempted", "ingestionStarted", "scoreSourceRealEnabled", "secretsPrinted", "sqlExecuted", "supabaseWritesEnabled"]) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
    }
  }

  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }

  if (output.unblockDecisionReadiness?.status !== "local_reviews_complete_external_approvals_pending") {
    blocked.push(`output.unblockDecisionReadiness.status: ${String(output.unblockDecisionReadiness?.status)}`);
  }

  if (output.unblockDecisionReadiness?.canRequestHumanApproval !== true) {
    blocked.push(`output.unblockDecisionReadiness.canRequestHumanApproval: ${String(output.unblockDecisionReadiness?.canRequestHumanApproval)}`);
  }

  if (!Array.isArray(output.unblockDecisionReadiness?.cannotProceedToRealRuntimeBecause) || output.unblockDecisionReadiness.cannotProceedToRealRuntimeBecause.length < 5) {
    blocked.push("output.unblockDecisionReadiness.cannotProceedToRealRuntimeBecause: expected at least five blockers");
  }

  const waitingIds = new Set((output.waiting ?? []).map((item) => item.id));
  const blockerIds = new Set((output.blockers ?? []).map((item) => item.id));
  for (const id of ["row-coverage-readonly"]) {
    if (!waitingIds.has(id)) blocked.push(`output.waiting missing ${id}`);
  }
  for (const id of ["data-quality-evidence", "source-rights-and-disclosure", "model-credibility"]) {
    if (!blockerIds.has(id)) blocked.push(`output.blockers missing ${id}`);
  }

  for (const item of [...(output.waiting ?? []), ...(output.blockers ?? [])]) {
    if (!Array.isArray(item.acceptanceCriteria) || item.acceptanceCriteria.length < 5) {
      blocked.push(`${item.id}: expected at least five acceptance criteria`);
    }
    if (!item.nextLocalMove || !item.owner || !item.state) {
      blocked.push(`${item.id}: missing owner, state, or nextLocalMove`);
    }
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
