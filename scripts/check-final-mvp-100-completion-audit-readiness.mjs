import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-final-mvp-100-completion-audit-readiness.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const progressPath = "src/lib/project-progress-score.ts";
const statusPath = "PROJECT_STATUS.md";

const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const progress = fs.readFileSync(progressPath, "utf8");
const status = fs.readFileSync(statusPath, "utf8");

const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"final_mvp_100_completion_audit_readiness\"",
  "final_mvp_100_completion_verified",
  "previousOverallProjectPercent: 91",
  "focusedAuditReadinessPercent: allOk ? 100 : 91",
  "targetOverallProjectPercent: 100",
  "100% for mock MVP pre-launch review readiness",
  "proved_by_final_milestone_verification",
  "cmd.exe /c npm run build",
  "node node_modules/typescript/bin/tsc --noEmit",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npm run dev:recover",
  "node scripts/check-localhost-full-health.mjs",
  "node scripts/check-review-gates.mjs",
  "scripts/report-project-progress-snapshot.mjs",
  "scripts/report-runtime-schema-promotion-readiness.mjs",
  "scripts/report-mock-signal-reading-flow-readiness.mjs",
  "scripts/report-mock-mvp-product-surface-readiness.mjs",
  "scripts/report-devops-health-recovery-readiness.mjs",
  "scripts/report-ceo-execution-focus-closure-readiness.mjs",
  "scripts/report-data-goal-completion-audit.mjs",
  "scripts/report-investment-credibility-mvp-readiness.mjs",
  "scripts/report-source-rights-mvp-final-closure-readiness.mjs",
  "PROJECT_STATUS.md",
  "static_source_contract",
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
  /status:\s*"mvp_100_readiness_complete"/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["report:final-mvp-100-completion-audit-readiness"] !== "node scripts/report-final-mvp-100-completion-audit-readiness.mjs") {
  missing.push(`${packagePath}: report:final-mvp-100-completion-audit-readiness`);
}

if (packageJson.scripts?.["check:final-mvp-100-completion-audit-readiness"] !== "node scripts/check-final-mvp-100-completion-audit-readiness.mjs") {
  missing.push(`${packagePath}: check:final-mvp-100-completion-audit-readiness`);
}

if (!reviewGate.includes("scripts/check-final-mvp-100-completion-audit-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-final-mvp-100-completion-audit-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-final-mvp-100-completion-audit-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-final-mvp-100-completion-audit-readiness.mjs`);
}

for (const phrase of [
  "final audit readiness",
  "currentOverallPercent",
  "focusedAuditReadiness"
]) {
  if (!progress.includes(phrase)) missing.push(`${progressPath}: ${phrase}`);
}

for (const phrase of [
  "Latest final MVP 100 completion audit readiness slice",
  "focused audit readiness moved from 91% to 96%",
  "Not yet 100%"
]) {
  if (!status.includes(phrase)) missing.push(`${statusPath}: ${phrase}`);
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
  if (output.mode !== "final_mvp_100_completion_audit_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "final_mvp_100_completion_verified") blocked.push(`output.status: ${String(output.status)}`);
  if (output.previousOverallProjectPercent !== 91) blocked.push("output.previousOverallProjectPercent must be 91");
  if (output.focusedAuditReadinessPercent !== 100) blocked.push("output.focusedAuditReadinessPercent must be 100");
  if (output.targetOverallProjectPercent !== 100) blocked.push("output.targetOverallProjectPercent must be 100");
  if (!Array.isArray(output.evidence) || output.evidence.length !== 10) {
    blocked.push(`output.evidence expected 10 entries, got ${String(output.evidence?.length)}`);
  }
  for (const item of output.evidence ?? []) {
    if (item.ok !== true) blocked.push(`output.evidence.${String(item.id)} not ok`);
  }
  if (!Array.isArray(output.requirementAudit) || output.requirementAudit.length !== 7) {
    blocked.push(`output.requirementAudit expected 7 entries, got ${String(output.requirementAudit?.length)}`);
  }
  if (!output.requirementAudit?.some((row) => row.result === "proved_by_final_milestone_verification")) {
    blocked.push("output.requirementAudit must include proved final milestone verification");
  }
  if (!Array.isArray(output.milestoneVerificationSequence) || output.milestoneVerificationSequence.length !== 6) {
    blocked.push("output.milestoneVerificationSequence expected 6 commands");
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
