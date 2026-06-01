import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-narrow-approval-post-review-gate.mjs";
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
  "mode: \"local_narrow_approval_post_review_gate\"",
  "status: ledger.status",
  "scripts/report-narrow-approval-packet.mjs",
  "scripts/report-narrow-approval-outcome-ledger.mjs",
  "pending_oral_review",
  "outcomeLedger",
  "allRequiredOutcomesAccepted",
  "pendingOutcomes",
  "rejectedOutcomes",
  "Supabase readonly attempt remains a separate decision",
  "Data quality score lift remains blocked",
  "real runtime activation remains blocked",
  "prepared but not approved",
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

if (packageJson.scripts?.["report:narrow-approval-post-review-gate"] !== "node scripts/report-narrow-approval-post-review-gate.mjs") {
  missing.push(`${packagePath}: report:narrow-approval-post-review-gate`);
}

if (packageJson.scripts?.["check:narrow-approval-post-review-gate"] !== "node scripts/check-narrow-approval-post-review-gate.mjs") {
  missing.push(`${packagePath}: check:narrow-approval-post-review-gate`);
}

if (!reviewGate.includes("scripts/check-narrow-approval-post-review-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-narrow-approval-post-review-gate.mjs`);
}

if (!fullHealth.includes("scripts/check-narrow-approval-post-review-gate.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-narrow-approval-post-review-gate.mjs`);
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
  if (output.mode !== "local_narrow_approval_post_review_gate") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (!["awaiting_oral_review_outcome", "partial_outcome_recorded", "outcome_recorded"].includes(output.status)) {
    blocked.push(`output.status: ${String(output.status)}`);
  }

  if (output.outcomeLedger?.status !== output.status || typeof output.outcomeLedger?.allRequiredOutcomesAccepted !== "boolean") {
    blocked.push(`output.outcomeLedger: ${JSON.stringify(output.outcomeLedger)}`);
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

  if (!Array.isArray(output.outcomeSlots) || output.outcomeSlots.length !== 2) {
    blocked.push(`output.outcomeSlots: expected 2 slots, got ${String(output.outcomeSlots?.length)}`);
  }

  for (const slot of output.outcomeSlots ?? []) {
    if (!["pending_oral_review", "accepted", "rejected"].includes(slot.outcome)) {
      blocked.push(`${slot.id}: invalid outcome ${String(slot.outcome)}`);
    }
    if (!Array.isArray(slot.stillDoesNotAuthorize) || slot.stillDoesNotAuthorize.length < 4) {
      blocked.push(`${slot.id}: expected at least four stillDoesNotAuthorize items`);
    }
  }

  if (!Array.isArray(output.blockedUntilOutcomeRecorded) || output.blockedUntilOutcomeRecorded.length < 3) {
    blocked.push("output.blockedUntilOutcomeRecorded: expected at least three blocked items");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
