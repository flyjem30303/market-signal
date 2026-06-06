import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-devops-health-recovery-readiness.mjs";
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
  "mode: \"devops_health_recovery_readiness\"",
  "devops_health_recovery_mvp_review_ready",
  "previousDevopsHealthRecoveryPercent: 88",
  "upgradedDevopsHealthRecoveryPercent: allOk ? 95 : 88",
  "targetForMvpReview: 95",
  "scripts/check-local-verification-runbook.mjs",
  "scripts/check-next-dev-recovery-tools.mjs",
  "scripts/check-localhost-health-config.mjs",
  "scripts/check-localhost-content-health.mjs",
  "scripts/check-project-progress-snapshot.mjs",
  "scripts/check-readable-current-status.mjs",
  "scripts/check-runtime-autonomy-handoff.mjs",
  "scripts/check-public-visible-language-quality.mjs",
  "node node_modules/typescript/bin/tsc --noEmit",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run dev:recover",
  "node scripts/check-localhost-full-health.mjs",
  "node scripts/check-review-gates.mjs",
  "Run build and localhost health in sequence, not in parallel.",
  "project-local-recovery",
  "post-build-health",
  "aggregate-review-gate",
  "publicDataSource=supabase",
  "scoreSource=real",
  "does not connect to Supabase"
]) {
  if (!source.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const pattern of [
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
  /supabaseWritesEnabled:\s*true/,
  /marketDataFetched:\s*true/,
  /secretsPrinted:\s*true/,
  /rowPayloadsPrinted:\s*true/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /spawnSync\(process\.execPath,\s*\["scripts\/check-review-gates\.mjs"/,
  /spawnSync\(process\.execPath,\s*\["scripts\/check-localhost-full-health\.mjs"/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["report:devops-health-recovery-readiness"] !== "node scripts/report-devops-health-recovery-readiness.mjs") {
  missing.push(`${packagePath}: report:devops-health-recovery-readiness`);
}

if (packageJson.scripts?.["check:devops-health-recovery-readiness"] !== "node scripts/check-devops-health-recovery-readiness.mjs") {
  missing.push(`${packagePath}: check:devops-health-recovery-readiness`);
}

if (!reviewGate.includes("scripts/check-devops-health-recovery-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-devops-health-recovery-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-devops-health-recovery-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-devops-health-recovery-readiness.mjs`);
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
  if (output.mode !== "devops_health_recovery_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "devops_health_recovery_mvp_review_ready") blocked.push(`output.status: ${String(output.status)}`);
  if (output.previousDevopsHealthRecoveryPercent !== 88) blocked.push("output.previousDevopsHealthRecoveryPercent must be 88");
  if (output.upgradedDevopsHealthRecoveryPercent !== 95) blocked.push("output.upgradedDevopsHealthRecoveryPercent must be 95");
  if (output.targetForMvpReview !== 95) blocked.push("output.targetForMvpReview must be 95");
  if (!Array.isArray(output.verificationSequence) || output.verificationSequence.length !== 6) {
    blocked.push(`output.verificationSequence expected 6 entries, got ${String(output.verificationSequence?.length)}`);
  }
  if (!Array.isArray(output.recoveryContract) || output.recoveryContract.length !== 3) {
    blocked.push(`output.recoveryContract expected 3 entries, got ${String(output.recoveryContract?.length)}`);
  }
  if (!Array.isArray(output.evidence) || output.evidence.length !== 8) {
    blocked.push(`output.evidence expected 8 entries, got ${String(output.evidence?.length)}`);
  }
  for (const item of output.evidence ?? []) {
    if (item.ok !== true) blocked.push(`output.evidence.${String(item.id)} not ok`);
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
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
