import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-source-rights-public-placement-readiness.mjs";
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
  "mode: \"source_rights_public_placement_readiness\"",
  "local_public_placement_ready_external_rights_unapproved",
  "readinessLift: allOk ? 10 : 0",
  "upgradedReadinessPercent: allOk ? 78 : 68",
  "targetForMvpReview: 100",
  "scripts/check-provider-specific-terms-review-packet.mjs",
  "scripts/check-provider-specific-terms-post-review-rollup.mjs",
  "scripts/check-trust-runtime-boundary-notice.mjs",
  "scripts/check-briefing-boundary-disclosure.mjs",
  "scripts/check-stock-investor-action-summary.mjs",
  "page-level-attribution",
  "delay-incompleteness-outage",
  "redistribution-storage",
  "public-investment-claim",
  "publicDataSource=supabase",
  "scoreSource=real",
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
  /externalRightsVerified:\s*true/,
  /externalTermsApproved:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /upgradedReadinessPercent:\s*100/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:source-rights-public-placement-readiness"] !==
  "node scripts/report-source-rights-public-placement-readiness.mjs"
) {
  missing.push(`${packagePath}: report:source-rights-public-placement-readiness`);
}

if (
  packageJson.scripts?.["check:source-rights-public-placement-readiness"] !==
  "node scripts/check-source-rights-public-placement-readiness.mjs"
) {
  missing.push(`${packagePath}: check:source-rights-public-placement-readiness`);
}

if (!reviewGate.includes("scripts/check-source-rights-public-placement-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-rights-public-placement-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-source-rights-public-placement-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-source-rights-public-placement-readiness.mjs`);
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
  if (output.mode !== "source_rights_public_placement_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_public_placement_ready_external_rights_unapproved") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 10) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 78) {
    blocked.push(`output.upgradedReadinessPercent expected 78, got ${String(output.upgradedReadinessPercent)}`);
  }
  if (!Array.isArray(output.evidence) || output.evidence.length !== 5 || !output.evidence.every((item) => item.ok === true)) {
    blocked.push("output.evidence expected five passing evidence items");
  }
  if (!Array.isArray(output.placementMap) || output.placementMap.length !== 4) {
    blocked.push("output.placementMap expected four placement entries");
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
