import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-ceo-execution-focus-closure-readiness.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const progressPath = "src/lib/project-progress-score.ts";
const overallReportPath = "scripts/report-overall-project-100-readiness.mjs";

const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const progress = fs.readFileSync(progressPath, "utf8");
const overall = fs.readFileSync(overallReportPath, "utf8");

const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"ceo_execution_focus_closure_readiness\"",
  "ceo_execution_focus_mvp_review_ready",
  "previousCeoExecutionFocusPercent: 83",
  "upgradedCeoExecutionFocusPercent: allOk ? 90 : 83",
  "targetForMvpReview: 90",
  "larger coherent local-only slices",
  "A1/A2/I as support lanes",
  "authorized Supabase/SQL/real-data promotion",
  "defaultSliceGate",
  "milestoneGate",
  "scripts/check-project-progress-snapshot.mjs",
  "scripts/check-readable-current-status.mjs",
  "scripts/check-runtime-autonomy-handoff.mjs",
  "scripts/check-devops-health-recovery-readiness.mjs",
  "final MVP 100 completion audit",
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

if (packageJson.scripts?.["report:ceo-execution-focus-closure-readiness"] !== "node scripts/report-ceo-execution-focus-closure-readiness.mjs") {
  missing.push(`${packagePath}: report:ceo-execution-focus-closure-readiness`);
}

if (packageJson.scripts?.["check:ceo-execution-focus-closure-readiness"] !== "node scripts/check-ceo-execution-focus-closure-readiness.mjs") {
  missing.push(`${packagePath}: check:ceo-execution-focus-closure-readiness`);
}

if (!reviewGate.includes("scripts/check-ceo-execution-focus-closure-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-ceo-execution-focus-closure-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-ceo-execution-focus-closure-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-ceo-execution-focus-closure-readiness.mjs`);
}

for (const phrase of [
  "current: 90",
  "label: \"CEO execution focus\"",
  "larger coherent local-only slices",
  "A1/A2/I support lanes",
  "authorized Supabase/SQL/real-data promotion"
]) {
  if (!progress.includes(phrase)) missing.push(`${progressPath}: ${phrase}`);
}

for (const phrase of [
  "scripts/report-ceo-execution-focus-closure-readiness.mjs",
  "ceoExecutionFocusReadiness",
  "final-mvp-100-completion-audit",
  "CEO execution focus is closed for MVP review"
]) {
  if (!overall.includes(phrase)) missing.push(`${overallReportPath}: ${phrase}`);
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
  if (output.mode !== "ceo_execution_focus_closure_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "ceo_execution_focus_mvp_review_ready") blocked.push(`output.status: ${String(output.status)}`);
  if (output.previousCeoExecutionFocusPercent !== 83) blocked.push("output.previousCeoExecutionFocusPercent must be 83");
  if (output.upgradedCeoExecutionFocusPercent !== 90) blocked.push("output.upgradedCeoExecutionFocusPercent must be 90");
  if (output.targetForMvpReview !== 90) blocked.push("output.targetForMvpReview must be 90");
  if (!Array.isArray(output.evidence) || output.evidence.length !== 4) {
    blocked.push(`output.evidence expected 4 entries, got ${String(output.evidence?.length)}`);
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
