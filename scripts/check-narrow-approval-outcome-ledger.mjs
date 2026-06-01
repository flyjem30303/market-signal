import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-narrow-approval-outcome-ledger.mjs";
const ledgerPath = "src/lib/narrow-approval-outcome-ledger.ts";
const outcomeDataPath = "data/source-gates/narrow-approval-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const reportSource = fs.readFileSync(reportPath, "utf8");
const ledgerSource = fs.readFileSync(ledgerPath, "utf8");
const outcomeData = JSON.parse(fs.readFileSync(outcomeDataPath, "utf8"));
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const missing = [];
const blocked = [];

for (const [file, source] of [[ledgerPath, ledgerSource]]) {
  for (const phrase of [
    "local_narrow_approval_outcome_ledger",
    "data/source-gates/narrow-approval-outcomes.json",
    "loadOutcomeRecords",
    "awaiting_oral_review_outcome",
    "partial_outcome_recorded",
    "outcome_recorded",
    "legal-source-terms-review",
    "investment-non-advisory-interpretation-review",
    "pending",
    "accepted",
    "rejected",
    "not_recorded",
    "publicDataSource",
    "scoreSource",
    "scoreSourceRealEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (!source.includes(phrase)) {
      missing.push(`${file}: ${phrase}`);
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
      blocked.push(`${file}: forbidden source pattern ${String(pattern)}`);
    }
  }
}

if (!Array.isArray(outcomeData.outcomes) || outcomeData.outcomes.length !== 2) {
  blocked.push(`${outcomeDataPath}: expected two outcomes`);
} else {
  const observedIds = new Set(outcomeData.outcomes.map((item) => item.id));
  for (const id of ["legal-source-terms-review", "investment-non-advisory-interpretation-review"]) {
    if (!observedIds.has(id)) {
      blocked.push(`${outcomeDataPath}: missing ${id}`);
    }
  }

  for (const item of outcomeData.outcomes) {
    if (!["pending", "accepted", "rejected"].includes(item.outcome)) {
      blocked.push(`${outcomeDataPath}: invalid outcome for ${String(item.id)}`);
    }
    if (!["CEO", "Chairman", "not_recorded"].includes(item.recordedBy)) {
      blocked.push(`${outcomeDataPath}: invalid recordedBy for ${String(item.id)}`);
    }
    if (item.outcome === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      blocked.push(`${outcomeDataPath}: pending item must use not_recorded and null recordedAt for ${String(item.id)}`);
    }
    if (item.outcome !== "pending" && (item.recordedBy === "not_recorded" || typeof item.recordedAt !== "string")) {
      blocked.push(`${outcomeDataPath}: recorded item must include recorder and recordedAt for ${String(item.id)}`);
    }
    if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length === 0) {
      blocked.push(`${outcomeDataPath}: decisionNote is required for ${String(item.id)}`);
    }
  }
}

for (const phrase of [
  "src/lib/narrow-approval-outcome-ledger.ts",
  "getNarrowApprovalOutcomeLedger",
  "loadTsModule"
]) {
  if (!reportSource.includes(phrase)) {
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
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/
]) {
  if (pattern.test(reportSource)) {
    blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (packageJson.scripts?.["report:narrow-approval-outcome-ledger"] !== "node scripts/report-narrow-approval-outcome-ledger.mjs") {
  missing.push(`${packagePath}: report:narrow-approval-outcome-ledger`);
}

if (packageJson.scripts?.["check:narrow-approval-outcome-ledger"] !== "node scripts/check-narrow-approval-outcome-ledger.mjs") {
  missing.push(`${packagePath}: check:narrow-approval-outcome-ledger`);
}

if (!reviewGate.includes("scripts/check-narrow-approval-outcome-ledger.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-narrow-approval-outcome-ledger.mjs`);
}

if (!fullHealth.includes("scripts/check-narrow-approval-outcome-ledger.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-narrow-approval-outcome-ledger.mjs`);
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
  if (output.mode !== "local_narrow_approval_outcome_ledger") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (!["awaiting_oral_review_outcome", "partial_outcome_recorded", "outcome_recorded"].includes(output.status)) {
    blocked.push(`output.status: ${String(output.status)}`);
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

  if (!Array.isArray(output.outcomes) || output.outcomes.length !== 2) {
    blocked.push(`output.outcomes: expected 2 outcomes, got ${String(output.outcomes?.length)}`);
  }

  const acceptedCount = (output.outcomes ?? []).filter((item) => item.outcome === "accepted").length;
  const rejectedCount = (output.outcomes ?? []).filter((item) => item.outcome === "rejected").length;
  const expectedStatus =
    acceptedCount === 2 ? "outcome_recorded" : acceptedCount > 0 || rejectedCount > 0 ? "partial_outcome_recorded" : "awaiting_oral_review_outcome";
  if (output.status !== expectedStatus) {
    blocked.push(`output.status expected ${expectedStatus}, got ${String(output.status)}`);
  }
  if (output.allRequiredOutcomesAccepted !== (acceptedCount === 2)) {
    blocked.push(`output.allRequiredOutcomesAccepted: ${String(output.allRequiredOutcomesAccepted)}`);
  }

  for (const item of output.outcomes ?? []) {
    if (!["pending", "accepted", "rejected"].includes(item.outcome)) {
      blocked.push(`${item.id}: invalid outcome ${String(item.outcome)}`);
    }
    if (item.outcome === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      blocked.push(`${item.id}: pending outcome must use not_recorded and null recordedAt`);
    }
    if (item.outcome !== "pending" && (item.recordedBy === "not_recorded" || typeof item.recordedAt !== "string")) {
      blocked.push(`${item.id}: recorded outcome must include recorder and recordedAt`);
    }
    if (!Array.isArray(item.stillDoesNotAuthorize) || item.stillDoesNotAuthorize.length < 4) {
      blocked.push(`${item.id}: expected at least four stillDoesNotAuthorize items`);
    }
  }

  if (!Array.isArray(output.stillBlocked) || output.stillBlocked.length < 8) {
    blocked.push("output.stillBlocked: expected at least 8 blocked items");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
