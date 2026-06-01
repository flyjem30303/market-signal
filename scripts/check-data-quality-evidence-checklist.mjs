import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-data-quality-evidence-checklist.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"local_data_quality_evidence_checklist\"",
  "status: \"local_checklist_ready_remote_evidence_missing\"",
  "data-quality-evidence",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "row-coverage-evidence",
  "field-validity-rules",
  "quality-score-threshold",
  "downgrade-behavior",
  "remote row coverage stays paused"
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
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /scoreSourceRealEnabled:\s*true/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["report:data-quality-evidence-checklist"] !== "node scripts/report-data-quality-evidence-checklist.mjs") {
  missing.push(`${packagePath}: report:data-quality-evidence-checklist`);
}

if (packageJson.scripts?.["check:data-quality-evidence-checklist"] !== "node scripts/check-data-quality-evidence-checklist.mjs") {
  missing.push(`${packagePath}: check:data-quality-evidence-checklist`);
}

if (!reviewGate.includes("scripts/check-data-quality-evidence-checklist.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-quality-evidence-checklist.mjs`);
}

const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false });
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
  if (output.mode !== "local_data_quality_evidence_checklist") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_checklist_ready_remote_evidence_missing") blocked.push(`output.status: ${String(output.status)}`);
  if (output.blockerId !== "data-quality-evidence") blocked.push(`output.blockerId: ${String(output.blockerId)}`);
  for (const flag of ["automatedRemoteRun", "connectionAttempted", "ingestionStarted", "scoreSourceRealEnabled", "secretsPrinted", "sqlExecuted", "supabaseWritesEnabled"]) {
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
  const sectionIds = new Set((output.requiredSections ?? []).map((section) => section.id));
  for (const id of ["row-coverage-evidence", "field-validity-rules", "quality-score-threshold", "downgrade-behavior"]) {
    if (!sectionIds.has(id)) blocked.push(`output.requiredSections missing ${id}`);
  }
  for (const section of output.requiredSections ?? []) {
    if (!section.owner || !section.status) blocked.push(`${section.id}: expected owner and status`);
    if (!Array.isArray(section.acceptanceCriteria) || section.acceptanceCriteria.length < 5) {
      blocked.push(`${section.id}: expected at least five acceptance criteria`);
    }
  }
  if (!Array.isArray(output.readyToUnblockWhen) || output.readyToUnblockWhen.length < 5) {
    blocked.push("output.readyToUnblockWhen: expected at least five conditions");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;
