import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-source-specific-acceptance-packets-readiness.mjs";
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
  "mode: \"source_specific_acceptance_packets_readiness\"",
  "source_specific_acceptance_packets_reviewable_no_write",
  "readinessLift: allOk ? 24 : 0",
  "upgradedReadinessPercent: allOk ? 88 : 64",
  "targetForMvpReview: 95",
  "scripts/check-twii-source-selection-acceptance-gate.mjs",
  "scripts/check-twii-report-only-probe-acceptance-gate.mjs",
  "scripts/check-etf-source-rights-review-packet.mjs",
  "scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs",
  "scripts/check-backfill-ingestion-design-gate.mjs",
  "accepted_for_rights_and_field_contract_review_only",
  "accepted_for_implementation_preparation_only",
  "packet_prepared_legal_terms_unapproved",
  "accepted_as_local_decision_quality_evidence_only",
  "design_gate_required_not_authorized_for_execution",
  "TWII source selection is accepted for rights and field-contract review only",
  "ETF source-rights packet is prepared",
  "Equity row coverage sample is accepted as local decision-quality evidence only",
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
  packageJson.scripts?.["report:source-specific-acceptance-packets-readiness"] !==
  "node scripts/report-source-specific-acceptance-packets-readiness.mjs"
) {
  missing.push(`${packagePath}: report:source-specific-acceptance-packets-readiness`);
}

if (
  packageJson.scripts?.["check:source-specific-acceptance-packets-readiness"] !==
  "node scripts/check-source-specific-acceptance-packets-readiness.mjs"
) {
  missing.push(`${packagePath}: check:source-specific-acceptance-packets-readiness`);
}

if (!reviewGate.includes("scripts/check-source-specific-acceptance-packets-readiness.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-specific-acceptance-packets-readiness.mjs`);
}

if (!fullHealth.includes("scripts/check-source-specific-acceptance-packets-readiness.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-source-specific-acceptance-packets-readiness.mjs`);
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
  if (output.mode !== "source_specific_acceptance_packets_readiness") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "source_specific_acceptance_packets_reviewable_no_write") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.readinessLift !== 24) blocked.push(`output.readinessLift: ${String(output.readinessLift)}`);
  if (output.upgradedReadinessPercent !== 88) {
    blocked.push(`output.upgradedReadinessPercent expected 88, got ${String(output.upgradedReadinessPercent)}`);
  }
  if (output.targetForMvpReview !== 95) blocked.push(`output.targetForMvpReview: ${String(output.targetForMvpReview)}`);
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
