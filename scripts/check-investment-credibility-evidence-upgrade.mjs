import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-investment-credibility-evidence-upgrade.mjs";
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
  "mode: \"investment_credibility_evidence_upgrade\"",
  "local_investment_evidence_upgraded_not_real_scoring",
  "readinessLift: allOk ? 12 : 0",
  "upgradedReadinessPercent: allOk ? 58 : 46",
  "targetForMvpReview: 80",
  "scripts/check-narrow-approval-outcome-ledger.mjs",
  "scripts/check-cp3-tw-stock-backtest-method.mjs",
  "scripts/check-stock-investor-action-summary.mjs",
  "scripts/check-briefing-market-action-summary.mjs",
  "scripts/check-source-rights-mvp-readiness.mjs",
  "scripts/check-data-goal-readiness.mjs",
  "non-advisory interpretation outcome is recorded",
  "backtest method draft documents limitations",
  "source-rights readiness blocks public professional indicator claims",
  "data readiness blocks confidence or real-score claims",
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
  /upgradedReadinessPercent:\s*100/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:investment-credibility-evidence-upgrade"] !==
  "node scripts/report-investment-credibility-evidence-upgrade.mjs"
) {
  missing.push(`${packagePath}: report:investment-credibility-evidence-upgrade`);
}

if (
  packageJson.scripts?.["check:investment-credibility-evidence-upgrade"] !==
  "node scripts/check-investment-credibility-evidence-upgrade.mjs"
) {
  missing.push(`${packagePath}: check:investment-credibility-evidence-upgrade`);
}

if (!reviewGate.includes("scripts/check-investment-credibility-evidence-upgrade.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-investment-credibility-evidence-upgrade.mjs`);
}

if (!fullHealth.includes("scripts/check-investment-credibility-evidence-upgrade.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-investment-credibility-evidence-upgrade.mjs`);
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
  if (output.mode !== "investment_credibility_evidence_upgrade") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_investment_evidence_upgraded_not_real_scoring") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 12) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 58) {
    blocked.push(`output.upgradedReadinessPercent expected 58, got ${String(output.upgradedReadinessPercent)}`);
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
