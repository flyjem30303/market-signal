import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-provider-specific-terms-post-review-rollup.mjs";
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
  "mode: \"provider_specific_terms_post_review_rollup\"",
  "status: \"local_terms_packet_output_ready_for_ceo_oral_review\"",
  "packetId: \"provider-specific-terms-review-packet\"",
  "scripts/report-provider-specific-terms-review-packet.mjs",
  "scripts/report-narrow-approval-outcome-ledger.mjs",
  "legal-source-terms-review",
  "readyForNextReadonlyDecision",
  "already accepted for local planning only",
  "externalTermsApproved: false",
  "providerTermsFetched: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "ready_for_oral_review",
  "Does CEO accept this local Legal terms-review packet",
  "legal-source-terms-review",
  "accepted for local planning only",
  "provider terms approval",
  "source license approval",
  "raw market data redistribution",
  "publicDataSource=supabase",
  "scoreSource=real",
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
  /sourceLicenseApproved:\s*true/,
  /writeFileSync/
]) {
  if (pattern.test(source)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["report:provider-specific-terms-post-review-rollup"] !==
  "node scripts/report-provider-specific-terms-post-review-rollup.mjs"
) {
  missing.push(`${packagePath}: report:provider-specific-terms-post-review-rollup`);
}

if (
  packageJson.scripts?.["check:provider-specific-terms-post-review-rollup"] !==
  "node scripts/check-provider-specific-terms-post-review-rollup.mjs"
) {
  missing.push(`${packagePath}: check:provider-specific-terms-post-review-rollup`);
}

if (!reviewGate.includes("scripts/check-provider-specific-terms-post-review-rollup.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-provider-specific-terms-post-review-rollup.mjs`);
}

if (!fullHealth.includes("scripts/check-provider-specific-terms-post-review-rollup.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-provider-specific-terms-post-review-rollup.mjs`);
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
  if (output.mode !== "provider_specific_terms_post_review_rollup") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "local_terms_packet_output_ready_for_ceo_oral_review") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.packetId !== "provider-specific-terms-review-packet") {
    blocked.push(`output.packetId: ${String(output.packetId)}`);
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

  if (!Array.isArray(output.rollupItems) || output.rollupItems.length !== 5) {
    blocked.push(`output.rollupItems: expected 5 items, got ${String(output.rollupItems?.length)}`);
  }

  if (output.legalOutcome?.id !== "legal-source-terms-review") {
    blocked.push(`output.legalOutcome.id: ${String(output.legalOutcome?.id)}`);
  }
  if (!["pending", "accepted", "rejected"].includes(output.legalOutcome?.outcome)) {
    blocked.push(`output.legalOutcome.outcome: ${String(output.legalOutcome?.outcome)}`);
  }
  if (output.legalOutcome?.outcome === "accepted" && output.readyForNextReadonlyDecision !== true) {
    blocked.push("output.readyForNextReadonlyDecision should be true when legal outcome is accepted");
  }
  if (output.legalOutcome?.outcome !== "accepted" && output.readyForNextReadonlyDecision !== false) {
    blocked.push("output.readyForNextReadonlyDecision should be false until legal outcome is accepted");
  }
  if (!Array.isArray(output.legalOutcome?.stillDoesNotAuthorize) || output.legalOutcome.stillDoesNotAuthorize.length < 4) {
    blocked.push("output.legalOutcome.stillDoesNotAuthorize: expected at least four blocked items");
  }

  if (!Array.isArray(output.ceoDecisionOptions) || output.ceoDecisionOptions.length !== 2) {
    blocked.push("output.ceoDecisionOptions: expected accepted/rejected options");
  }

  if (!Array.isArray(output.notApproved) || output.notApproved.length < 10) {
    blocked.push("output.notApproved: expected at least 10 blocked approvals");
  }

  if (output.legalOutcome?.outcome === "accepted" && output.nextRecordCommand !== null) {
    blocked.push("output.nextRecordCommand: expected null after legal outcome is already accepted");
  }
  if (output.legalOutcome?.outcome !== "accepted" && !String(output.nextRecordCommand).includes("legal-source-terms-review")) {
    blocked.push("output.nextRecordCommand: expected legal-source-terms-review command text until accepted");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
