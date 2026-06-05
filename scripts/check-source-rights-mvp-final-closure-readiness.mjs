import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-source-rights-mvp-final-closure-readiness.mjs";
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
  "mode: \"source_rights_mvp_final_closure_readiness\"",
  "mock_mvp_source_rights_closure_ready_external_rights_unapproved",
  "readinessLift: allOk ? 4 : 0",
  "upgradedReadinessPercent: allOk ? 100 : 96",
  "targetForMvpReview: 100",
  "scripts/check-source-rights-mvp-deferral-decision-readiness.mjs",
  "scripts/check-source-rights-public-copy-acceptance-readiness.mjs",
  "scripts/check-source-rights-specific-classification-readiness.mjs",
  "scripts/check-provider-specific-terms-post-review-rollup.mjs",
  "scripts/check-mvp-launch-prd.mjs",
  "scripts/check-source-rights-public-placement-readiness.mjs",
  "mock-mvp-source-copy",
  "external-provider-terms",
  "source-promotion-dependency",
  "public-investment-claims",
  "Public placement map keeps attribution",
  "MVP launch PRD supports mock-only review",
  "closed_for_mock_mvp_review",
  "not_approved_deferred_to_external_review",
  "blocked_until_separate_promotion_gate",
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
  /externalRightsVerified:\s*true/,
  /externalTermsApproved:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /scoreSourceRealEnabled:\s*true/,
  /marketDataFetched:\s*true/,
  /ingestionStarted:\s*true/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:source-rights-mvp-final-closure-readiness"] !==
  "node scripts/report-source-rights-mvp-final-closure-readiness.mjs"
) {
  missing.push(`${packagePath}: report:source-rights-mvp-final-closure-readiness`);
}

if (
  packageJson.scripts?.["check:source-rights-mvp-final-closure-readiness"] !==
  "node scripts/check-source-rights-mvp-final-closure-readiness.mjs"
) {
  missing.push(`${packagePath}: check:source-rights-mvp-final-closure-readiness`);
}

if (!reviewGate.includes("scripts/check-source-rights-mvp-final-closure-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-rights-mvp-final-closure-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-source-rights-mvp-final-closure-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-source-rights-mvp-final-closure-readiness.mjs`);
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
  if (output.mode !== "source_rights_mvp_final_closure_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "mock_mvp_source_rights_closure_ready_external_rights_unapproved") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 4) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 100) {
    blocked.push(`output.upgradedReadinessPercent expected 100, got ${String(output.upgradedReadinessPercent)}`);
  }
  if (!Array.isArray(output.evidence) || output.evidence.length !== 6 || !output.evidence.every((item) => item.ok === true)) {
    blocked.push("output.evidence expected six passing evidence items");
  }
  if (!Array.isArray(output.closureDecisionMap) || output.closureDecisionMap.length !== 4) {
    blocked.push("output.closureDecisionMap expected four entries");
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "externalRightsVerified",
    "externalTermsApproved",
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
