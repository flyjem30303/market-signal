import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-data-coverage-quality-route-readiness.mjs";
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
  "mode: \"data_coverage_quality_route_readiness\"",
  "no_write_coverage_quality_route_ready_for_review",
  "readinessLift: allOk ? 20 : 0",
  "upgradedReadinessPercent: allOk ? 84 : 64",
  "targetForMvpReview: 95",
  "scripts/check-data-coverage-backfill-plan.mjs",
  "scripts/check-backfill-ingestion-design-gate.mjs",
  "scripts/check-source-specific-backfill-design-packet.mjs",
  "scripts/check-promotion-prerequisites-gate.mjs",
  "scripts/check-source-rights-specific-classification-readiness.mjs",
  "TWII remains the clearest missing-row blocker",
  "ETF coverage remains source-rights gated",
  "Equity coverage can reuse existing TWSE STOCK_DAY design evidence",
  "future mutation target must be decided separately",
  "QA thresholds, rollback, retention, sanitized output, and post-run review",
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
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /scoreSourceRealEnabled:\s*true/,
  /marketDataFetched:\s*true/,
  /ingestionStarted:\s*true/,
  /upgradedReadinessPercent:\s*100/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:data-coverage-quality-route-readiness"] !==
  "node scripts/report-data-coverage-quality-route-readiness.mjs"
) {
  missing.push(`${packagePath}: report:data-coverage-quality-route-readiness`);
}

if (
  packageJson.scripts?.["check:data-coverage-quality-route-readiness"] !==
  "node scripts/check-data-coverage-quality-route-readiness.mjs"
) {
  missing.push(`${packagePath}: check:data-coverage-quality-route-readiness`);
}

if (!reviewGate.includes("scripts/check-data-coverage-quality-route-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-coverage-quality-route-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-data-coverage-quality-route-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-data-coverage-quality-route-readiness.mjs`);
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
  if (output.mode !== "data_coverage_quality_route_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "no_write_coverage_quality_route_ready_for_review") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 20) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 84) {
    blocked.push(`output.upgradedReadinessPercent expected 84, got ${String(output.upgradedReadinessPercent)}`);
  }
  if (output.targetForMvpReview !== 95) {
    blocked.push(`output.targetForMvpReview: ${String(output.targetForMvpReview)}`);
  }
  if (!Array.isArray(output.evidence) || output.evidence.length !== 5 || !output.evidence.every((item) => item.ok === true)) {
    blocked.push("output.evidence expected five passing evidence items");
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
