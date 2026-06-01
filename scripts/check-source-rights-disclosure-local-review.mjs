import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-source-rights-disclosure-local-review.mjs";
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
  "mode: \"local_source_rights_disclosure_review\"",
  "status: \"local_review_recorded_external_rights_unverified\"",
  "scripts/report-source-rights-disclosure-checklist.mjs",
  "externalRightsVerified: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false",
  "ready_for_human_terms_review",
  "source-specific terms",
  "external source rights",
  "raw market data redistribution",
  "public real-data source claim",
  "Supabase readonly execution",
  "market data ingestion",
  "scoreSource=real",
  "locally prepared but not externally approved"
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
  /scoreSourceRealEnabled:\s*true/,
  /connectionAttempted:\s*true/,
  /externalRightsVerified:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:source-rights-disclosure-local-review"] !== "node scripts/report-source-rights-disclosure-local-review.mjs") {
  missing.push(`${packagePath}: report:source-rights-disclosure-local-review`);
}

if (packageJson.scripts?.["check:source-rights-disclosure-local-review"] !== "node scripts/check-source-rights-disclosure-local-review.mjs") {
  missing.push(`${packagePath}: check:source-rights-disclosure-local-review`);
}

if (!reviewGate.includes("scripts/check-source-rights-disclosure-local-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-rights-disclosure-local-review.mjs`);
}

if (!fullHealth.includes("scripts/check-source-rights-disclosure-local-review.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-source-rights-disclosure-local-review.mjs`);
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
  if (output.mode !== "local_source_rights_disclosure_review") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "local_review_recorded_external_rights_unverified") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.blockerId !== "source-rights-and-disclosure") {
    blocked.push(`output.blockerId: ${String(output.blockerId)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "externalRightsVerified",
    "ingestionStarted",
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

  if (!Array.isArray(output.reviewedSections) || output.reviewedSections.length !== 4) {
    blocked.push(`output.reviewedSections: expected 4 sections, got ${String(output.reviewedSections?.length)}`);
  }

  for (const section of output.reviewedSections ?? []) {
    if (section.localReviewState !== "ready_for_human_terms_review") {
      blocked.push(`${section.id}: expected ready_for_human_terms_review`);
    }
  }

  if (!Array.isArray(output.notApproved) || output.notApproved.length < 8) {
    blocked.push("output.notApproved: expected at least 8 blocked approvals");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
