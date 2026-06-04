import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-investment-formula-downgrade-readiness.mjs";
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
  "mode: \"investment_formula_downgrade_readiness\"",
  "local_formula_downgrade_ready_not_real_scoring",
  "readinessLift: allOk ? 10 : 0",
  "upgradedReadinessPercent: allOk ? 68 : 58",
  "targetForMvpReview: 80",
  "scripts/check-model-credibility-checklist.mjs",
  "scripts/check-model-credibility-local-review.mjs",
  "scripts/check-model-credibility-acceptance-gate.mjs",
  "scripts/check-data-quality-downgrade-state.mjs",
  "scripts/check-data-quality-score-contract.mjs",
  "scripts/check-investment-credibility-evidence-upgrade.mjs",
  "local_documented_not_promoted",
  "local_fail_closed_policy_ready",
  "formula version mismatch",
  "row coverage incomplete",
  "scoreSource=real",
  "publicDataSource=supabase",
  "does not run SQL"
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
  /upgradedReadinessPercent:\s*100/,
  /publicVersionClaimApproved:\s*true/,
  /canUseForPublicScore:\s*true/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:investment-formula-downgrade-readiness"] !==
  "node scripts/report-investment-formula-downgrade-readiness.mjs"
) {
  missing.push(`${packagePath}: report:investment-formula-downgrade-readiness`);
}

if (
  packageJson.scripts?.["check:investment-formula-downgrade-readiness"] !==
  "node scripts/check-investment-formula-downgrade-readiness.mjs"
) {
  missing.push(`${packagePath}: check:investment-formula-downgrade-readiness`);
}

if (!reviewGate.includes("scripts/check-investment-formula-downgrade-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-investment-formula-downgrade-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-investment-formula-downgrade-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-investment-formula-downgrade-readiness.mjs`);
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
  if (output.mode !== "investment_formula_downgrade_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_formula_downgrade_ready_not_real_scoring") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 10) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 68) {
    blocked.push(`output.upgradedReadinessPercent expected 68, got ${String(output.upgradedReadinessPercent)}`);
  }
  if (output.formulaVersionPosture?.publicVersionClaimApproved !== false) {
    blocked.push(`output.formulaVersionPosture.publicVersionClaimApproved: ${String(output.formulaVersionPosture?.publicVersionClaimApproved)}`);
  }
  if (output.downgradePolicyPosture?.canUseForPublicScore !== false) {
    blocked.push(`output.downgradePolicyPosture.canUseForPublicScore: ${String(output.downgradePolicyPosture?.canUseForPublicScore)}`);
  }
  if (!Array.isArray(output.evidence) || output.evidence.length !== 6 || !output.evidence.every((item) => item.ok === true)) {
    blocked.push("output.evidence expected six passing evidence items");
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
