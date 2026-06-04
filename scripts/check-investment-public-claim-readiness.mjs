import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-investment-public-claim-readiness.mjs";
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
  "mode: \"investment_public_claim_readiness\"",
  "local_public_claim_review_ready_not_real_scoring",
  "readinessLift: allOk ? 12 : 0",
  "upgradedReadinessPercent: allOk ? 80 : 68",
  "targetForMvpReview: 80",
  "scripts/check-cp3-public-claim-approval-checklist.mjs",
  "scripts/check-cp3-public-claim-approval-checklist-role-review.mjs",
  "scripts/check-cp3-claim-to-runtime-state-mapping.mjs",
  "scripts/check-cp3-claim-to-runtime-state-mapping-role-review.mjs",
  "scripts/check-investment-formula-downgrade-readiness.mjs",
  "scripts/check-source-rights-public-placement-readiness.mjs",
  "public claim checklist exists and is explicitly draft/not approved",
  "claim categories are mapped to runtime state fields",
  "source-rights placement is mapped",
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
  /scoreSourceRealEnabled:\s*true/,
  /marketDataFetched:\s*true/,
  /upgradedReadinessPercent:\s*100/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:investment-public-claim-readiness"] !==
  "node scripts/report-investment-public-claim-readiness.mjs"
) {
  missing.push(`${packagePath}: report:investment-public-claim-readiness`);
}

if (
  packageJson.scripts?.["check:investment-public-claim-readiness"] !==
  "node scripts/check-investment-public-claim-readiness.mjs"
) {
  missing.push(`${packagePath}: check:investment-public-claim-readiness`);
}

if (!reviewGate.includes("scripts/check-investment-public-claim-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-investment-public-claim-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-investment-public-claim-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-investment-public-claim-readiness.mjs`);
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
  if (output.mode !== "investment_public_claim_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_public_claim_review_ready_not_real_scoring") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 12) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 80) {
    blocked.push(`output.upgradedReadinessPercent expected 80, got ${String(output.upgradedReadinessPercent)}`);
  }
  if (output.targetForMvpReview !== 80) {
    blocked.push(`output.targetForMvpReview: ${String(output.targetForMvpReview)}`);
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
