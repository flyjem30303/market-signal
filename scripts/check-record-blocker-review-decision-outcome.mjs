import { spawnSync } from "node:child_process";
import fs from "node:fs";

const recordPath = "scripts/record-blocker-review-decision-outcome.mjs";
const outcomeDataPath = "data/source-gates/blocker-review-decision-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const source = fs.readFileSync(recordPath, "utf8");
const before = fs.readFileSync(outcomeDataPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "local_blocker_review_decision_outcome_recording",
  "data/source-gates/blocker-review-decision-outcomes.json",
  "source-rights-and-disclosure",
  "model-credibility",
  "data-quality-evidence",
  "pending",
  "accepted",
  "rejected",
  "deferred",
  "--dry-run",
  "--apply",
  "recordedBy",
  "recordedAt",
  "decisionNote",
  "publicDataSource",
  "scoreSource",
  "scoreSourceRealEnabled",
  "supabaseWritesEnabled",
  "stillDoesNotAuthorize"
]) {
  if (!source.includes(phrase)) {
    missing.push(`${recordPath}: ${phrase}`);
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
    blocked.push(`${recordPath}: forbidden source pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["record:blocker-review-decision-outcome"] !==
  "node scripts/record-blocker-review-decision-outcome.mjs"
) {
  missing.push(`${packagePath}: record:blocker-review-decision-outcome`);
}
if (
  packageJson.scripts?.["check:record-blocker-review-decision-outcome"] !==
  "node scripts/check-record-blocker-review-decision-outcome.mjs"
) {
  missing.push(`${packagePath}: check:record-blocker-review-decision-outcome`);
}
if (!reviewGate.includes("scripts/check-record-blocker-review-decision-outcome.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-record-blocker-review-decision-outcome.mjs`);
}

const run = spawnSync(
  process.execPath,
  [
    recordPath,
    "--dry-run",
    "--id",
    "source-rights-and-disclosure",
    "--outcome",
    "accepted",
    "--recordedBy",
    "CEO",
    "--recordedAt",
    "2026-06-03T00:00:00.000Z",
    "--note",
    "Dry run verifies blocker review decision outcome recording without mutating the ledger."
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  }
);

const after = fs.readFileSync(outcomeDataPath, "utf8");
if (after !== before) {
  blocked.push(`${recordPath}: dry-run mutated ${outcomeDataPath}`);
}

let output = null;
if (run.status !== 0) {
  blocked.push(`${recordPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(run.stdout)) {
      blocked.push(`${recordPath}: forbidden output pattern ${String(pattern)}`);
    }
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${recordPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "local_blocker_review_decision_outcome_recording") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "dry_run") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.target !== "source-rights-and-disclosure" || output.requestedOutcome !== "accepted") {
    blocked.push(`output target/outcome mismatch: ${String(output.target)} ${String(output.requestedOutcome)}`);
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
  if (!Array.isArray(output.stillDoesNotAuthorize) || output.stillDoesNotAuthorize.length < 10) {
    blocked.push("output.stillDoesNotAuthorize: expected at least 10 items");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
