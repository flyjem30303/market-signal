import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-narrow-approval-packet.mjs";
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
  "mode: \"local_narrow_approval_packet\"",
  "status: \"ready_for_ceo_or_chairman_oral_review\"",
  "scripts/report-blocker-resolution-plan.mjs",
  "narrow_human_review_only",
  "legal-source-terms-review",
  "investment-non-advisory-interpretation-review",
  "Supabase reads",
  "Supabase writes",
  "market data ingestion",
  "public real-data source claim",
  "scoreSource=real",
  "publicDataSource=supabase",
  "data quality score lift",
  "exactly one bounded Supabase readonly attempt",
  "separate later decision",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "supabaseWritesEnabled: false"
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
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:narrow-approval-packet"] !== "node scripts/report-narrow-approval-packet.mjs") {
  missing.push(`${packagePath}: report:narrow-approval-packet`);
}

if (packageJson.scripts?.["check:narrow-approval-packet"] !== "node scripts/check-narrow-approval-packet.mjs") {
  missing.push(`${packagePath}: check:narrow-approval-packet`);
}

if (!reviewGate.includes("scripts/check-narrow-approval-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-narrow-approval-packet.mjs`);
}

if (!fullHealth.includes("scripts/check-narrow-approval-packet.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-narrow-approval-packet.mjs`);
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
  if (output.mode !== "local_narrow_approval_packet") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "ready_for_ceo_or_chairman_oral_review") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.approvalRequest?.scope !== "narrow_human_review_only") {
    blocked.push(`output.approvalRequest.scope: ${String(output.approvalRequest?.scope)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
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

  if (!Array.isArray(output.approvalRequest?.canApprove) || output.approvalRequest.canApprove.length !== 2) {
    blocked.push(`output.approvalRequest.canApprove: expected 2 items, got ${String(output.approvalRequest?.canApprove?.length)}`);
  }

  if (!Array.isArray(output.approvalRequest?.cannotApprove) || output.approvalRequest.cannotApprove.length < 8) {
    blocked.push("output.approvalRequest.cannotApprove: expected at least 8 blocked approvals");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
