import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-source-rights-disclosure-checklist.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"local_source_rights_disclosure_checklist\"",
  "status: \"local_checklist_ready_external_rights_unverified\"",
  "source-rights-and-disclosure",
  "externalRightsVerified: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "source-attribution",
  "redistribution-display-limits",
  "delay-incompleteness-disclosure",
  "non-advisory-public-claim",
  "not a source-rights approval"
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
  /externalRightsVerified:\s*true/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:source-rights-disclosure-checklist"] !== "node scripts/report-source-rights-disclosure-checklist.mjs") {
  missing.push(`${packagePath}: report:source-rights-disclosure-checklist`);
}

if (packageJson.scripts?.["check:source-rights-disclosure-checklist"] !== "node scripts/check-source-rights-disclosure-checklist.mjs") {
  missing.push(`${packagePath}: check:source-rights-disclosure-checklist`);
}

if (!reviewGate.includes("scripts/check-source-rights-disclosure-checklist.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-rights-disclosure-checklist.mjs`);
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
  if (output.mode !== "local_source_rights_disclosure_checklist") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "local_checklist_ready_external_rights_unverified") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.blockerId !== "source-rights-and-disclosure") {
    blocked.push(`output.blockerId: ${String(output.blockerId)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "externalRightsVerified",
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

  const sectionIds = new Set((output.requiredSections ?? []).map((section) => section.id));
  for (const id of [
    "source-attribution",
    "redistribution-display-limits",
    "delay-incompleteness-disclosure",
    "non-advisory-public-claim"
  ]) {
    if (!sectionIds.has(id)) blocked.push(`output.requiredSections missing ${id}`);
  }

  for (const section of output.requiredSections ?? []) {
    if (!section.owner || section.status !== "pending_human_review") {
      blocked.push(`${section.id}: expected owner and pending_human_review status`);
    }
    if (!Array.isArray(section.acceptanceCriteria) || section.acceptanceCriteria.length < 5) {
      blocked.push(`${section.id}: expected at least five acceptance criteria`);
    }
  }

  if (!Array.isArray(output.approvalBoundary) || output.approvalBoundary.length < 4) {
    blocked.push("output.approvalBoundary: expected at least four boundaries");
  }
  if (!Array.isArray(output.readyToUnblockWhen) || output.readyToUnblockWhen.length < 5) {
    blocked.push("output.readyToUnblockWhen: expected at least five conditions");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
