import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-provider-specific-terms-review-packet.mjs";
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
  "mode: \"provider_specific_terms_review_packet\"",
  "status: \"local_terms_review_packet_ready_no_terms_approval\"",
  "selectedGate: \"provider-specific-terms-review\"",
  "scripts/report-source-rights-disclosure-local-review.mjs",
  "externalTermsApproved: false",
  "providerTermsFetched: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "provider-identity-and-officialness",
  "attribution-placement",
  "display-and-redistribution-limits",
  "delay-incompleteness-and-outage-copy",
  "non-advisory-public-claim-copy",
  "provider terms approval",
  "source license approval",
  "raw market data redistribution",
  "row coverage points",
  "scoreSource=real",
  "legal-source-terms-review",
  "do not promote runtime state"
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
  /externalTermsApproved:\s*true/,
  /providerTermsFetched:\s*true/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/,
  /termsApproved:\s*true/,
  /sourceLicenseApproved:\s*true/
]) {
  if (pattern.test(source)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["report:provider-specific-terms-review-packet"] !==
  "node scripts/report-provider-specific-terms-review-packet.mjs"
) {
  missing.push(`${packagePath}: report:provider-specific-terms-review-packet`);
}

if (
  packageJson.scripts?.["check:provider-specific-terms-review-packet"] !==
  "node scripts/check-provider-specific-terms-review-packet.mjs"
) {
  missing.push(`${packagePath}: check:provider-specific-terms-review-packet`);
}

if (!reviewGate.includes("scripts/check-provider-specific-terms-review-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-provider-specific-terms-review-packet.mjs`);
}

if (!fullHealth.includes("scripts/check-provider-specific-terms-review-packet.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-provider-specific-terms-review-packet.mjs`);
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
  if (output.mode !== "provider_specific_terms_review_packet") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_terms_review_packet_ready_no_terms_approval") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.selectedGate !== "provider-specific-terms-review") {
    blocked.push(`output.selectedGate: ${String(output.selectedGate)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "externalTermsApproved",
    "ingestionStarted",
    "providerTermsFetched",
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

  if (!Array.isArray(output.reviewScope) || output.reviewScope.length !== 5) {
    blocked.push(`output.reviewScope: expected 5 sections, got ${String(output.reviewScope?.length)}`);
  }

  if (!Array.isArray(output.evidenceFromLocalReview) || output.evidenceFromLocalReview.length !== 4) {
    blocked.push(`output.evidenceFromLocalReview: expected 4 local review sections`);
  }

  if (!Array.isArray(output.notApproved) || output.notApproved.length < 9) {
    blocked.push("output.notApproved: expected at least 9 blocked approvals");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
