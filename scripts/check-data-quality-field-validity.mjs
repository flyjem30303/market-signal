import { spawnSync } from "node:child_process";
import fs from "node:fs";

const contractPath = "src/lib/data-quality-field-validity.ts";
const reportPath = "scripts/report-data-quality-field-validity.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const source = fs.readFileSync(contractPath, "utf8");
const reportSource = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "buildDataQualityFieldValidityContract",
  "local_qa_reviewed",
  "canAwardDataQualityPoints: true",
  "symbol",
  "trade_date",
  "close",
  "open_high_low",
  "volume",
  "source_quality_flags",
  "critical price field invalid or missing",
  "trade date stale or outside approved coverage window",
  "non-critical module missing or partially valid",
  "source rights unclear or redistribution not approved",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "accepted for local Phase 1 quality scoring",
  "set scoreSource=real"
]) {
  if (!source.includes(phrase)) {
    missing.push(`${contractPath}: ${phrase}`);
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
  /publicDataSource:\s*"supabase"/
]) {
  if (pattern.test(source) || pattern.test(reportSource)) {
    blocked.push(`forbidden pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:data-quality-field-validity"] !== "node scripts/report-data-quality-field-validity.mjs") {
  missing.push(`${packagePath}: report:data-quality-field-validity`);
}

if (packageJson.scripts?.["check:data-quality-field-validity"] !== "node scripts/check-data-quality-field-validity.mjs") {
  missing.push(`${packagePath}: check:data-quality-field-validity`);
}

if (!reviewGate.includes("scripts/check-data-quality-field-validity.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-quality-field-validity.mjs`);
}

if (!fullHealth.includes("scripts/check-data-quality-field-validity.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-data-quality-field-validity.mjs`);
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
  if (output.approvalState !== "local_qa_reviewed") {
    blocked.push(`output.approvalState: ${String(output.approvalState)}`);
  }
  if (output.canAwardDataQualityPoints !== true) {
    blocked.push(`output.canAwardDataQualityPoints: ${String(output.canAwardDataQualityPoints)}`);
  }
  if (output.publicDataSource !== "mock" || output.scoreSource !== "mock") {
    blocked.push("output must keep publicDataSource and scoreSource mock");
  }
  if (!Array.isArray(output.fieldRules) || output.fieldRules.length < 6) {
    blocked.push(`output.fieldRules length: ${String(output.fieldRules?.length)}`);
  }
  if (!Array.isArray(output.downgradeRules) || output.downgradeRules.length < 4) {
    blocked.push(`output.downgradeRules length: ${String(output.downgradeRules?.length)}`);
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
