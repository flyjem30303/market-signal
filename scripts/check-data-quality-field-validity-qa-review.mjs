import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-data-quality-field-validity-qa-review.mjs";
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
  "mode: \"local_data_quality_field_validity_qa_review\"",
  "status: \"qa_review_recorded_no_points_awarded\"",
  "scripts/report-data-quality-field-validity.mjs",
  "QA-FIELD-001",
  "QA-FIELD-002",
  "QA-DOWNGRADE-001",
  "QA-BOUNDARY-001",
  "canAwardDataQualityPoints",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "data-quality score increase",
  "Supabase readonly execution",
  "scoreSource=real",
  "data-quality score at 25"
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

if (
  packageJson.scripts?.["report:data-quality-field-validity-qa-review"] !==
  "node scripts/report-data-quality-field-validity-qa-review.mjs"
) {
  missing.push(`${packagePath}: report:data-quality-field-validity-qa-review`);
}

if (
  packageJson.scripts?.["check:data-quality-field-validity-qa-review"] !==
  "node scripts/check-data-quality-field-validity-qa-review.mjs"
) {
  missing.push(`${packagePath}: check:data-quality-field-validity-qa-review`);
}

if (!reviewGate.includes("scripts/check-data-quality-field-validity-qa-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-quality-field-validity-qa-review.mjs`);
}

if (!fullHealth.includes("scripts/check-data-quality-field-validity-qa-review.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-data-quality-field-validity-qa-review.mjs`);
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
  if (output.mode !== "local_data_quality_field_validity_qa_review") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "qa_review_recorded_no_points_awarded") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.reviewedContract?.canAwardDataQualityPoints !== false) {
    blocked.push(`output.reviewedContract.canAwardDataQualityPoints: ${String(output.reviewedContract?.canAwardDataQualityPoints)}`);
  }
  if (output.reviewedContract?.publicDataSource !== "mock" || output.reviewedContract?.scoreSource !== "mock") {
    blocked.push("output reviewed contract must keep publicDataSource and scoreSource mock");
  }
  if (!Array.isArray(output.qaFindings) || output.qaFindings.length < 4) {
    blocked.push(`output.qaFindings length: ${String(output.qaFindings?.length)}`);
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
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
