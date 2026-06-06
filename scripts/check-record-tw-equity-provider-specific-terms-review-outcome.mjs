import { spawnSync } from "node:child_process";
import fs from "node:fs";

const recordPath = "scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs";
const outcomeDataPath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const source = fs.readFileSync(recordPath, "utf8");
const before = fs.readFileSync(outcomeDataPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const readableStatus = fs.readFileSync(readableStatusPath, "utf8");
const projectStatus = fs.readFileSync(projectStatusPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "tw_equity_provider_specific_terms_review_outcome_recording",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "permitted-use",
  "attribution",
  "redistribution",
  "retention",
  "rate-limit-and-outage",
  "delay-incompleteness-public-display",
  "derived-score-use",
  "pending",
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only",
  "rejected",
  "unknown_keep_blocked",
  "--dry-run",
  "--apply",
  "recordedBy",
  "recordedAt",
  "decisionNote",
  "marketDataFetched",
  "publicDataSource",
  "scoreSource",
  "scoreSourceRealEnabled",
  "supabaseReadsEnabled",
  "supabaseWritesEnabled",
  "stillDoesNotAuthorize"
]) {
  if (!source.includes(phrase)) missing.push(`${recordPath}: ${phrase}`);
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /fetch\(/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /marketDataFetched:\s*true/u,
  /scoreSourceRealEnabled:\s*true/u,
  /connectionAttempted:\s*true/u,
  /sqlExecuted:\s*true/u,
  /supabaseReadsEnabled:\s*true/u,
  /supabaseWritesEnabled:\s*true/u
]) {
  if (pattern.test(source)) blocked.push(`${recordPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["record:tw-equity-provider-specific-terms-review-outcome"] !==
  "node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs"
) {
  missing.push(`${packagePath}: record:tw-equity-provider-specific-terms-review-outcome`);
}
if (
  packageJson.scripts?.["check:record-tw-equity-provider-specific-terms-review-outcome"] !==
  "node scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs"
) {
  missing.push(`${packagePath}: check:record-tw-equity-provider-specific-terms-review-outcome`);
}
for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs")) {
    missing.push(`${path}: scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs`);
  }
  if (!text.includes("record-tw-equity-provider-specific-terms-review-outcome")) {
    missing.push(`${path}: record-tw-equity-provider-specific-terms-review-outcome`);
  }
}
if (!reviewGate.includes('"record-tw-equity-provider-specific-terms-review-outcome"')) {
  missing.push(`${reviewGatePath}: core set missing record-tw-equity-provider-specific-terms-review-outcome`);
}
for (const [path, text] of [
  [readableStatusPath, readableStatus],
  [projectStatusPath, projectStatus]
]) {
  if (!text.includes("record TW equity provider terms outcome tool")) {
    missing.push(`${path}: record TW equity provider terms outcome tool`);
  }
  if (!text.includes("dry-run does not mutate")) {
    missing.push(`${path}: dry-run does not mutate`);
  }
}

const run = spawnSync(
  process.execPath,
  [
    recordPath,
    "--dry-run",
    "--id",
    "permitted-use",
    "--classification",
    "accepted_for_local_planning_only",
    "--recordedBy",
    "CEO",
    "--recordedAt",
    "2026-06-06T00:00:00.000Z",
    "--note",
    "Dry run verifies TW equity provider terms review outcome recording without mutating the ledger."
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  }
);

const after = fs.readFileSync(outcomeDataPath, "utf8");
if (after !== before) blocked.push(`${recordPath}: dry-run mutated ${outcomeDataPath}`);

let output = null;
if (run.status !== 0) {
  blocked.push(`${recordPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/u,
    /SUPABASE_SERVICE_ROLE_KEY/u,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\brawRows\b/u,
    /\browPayload\b/iu,
    /\bselect\s+\*\s+from\b/iu,
    /\binsert\s+into\b/iu,
    /\bupdate\s+[a-z_]+\s+set\b/iu,
    /\bdelete\s+from\b/iu
  ]) {
    if (pattern.test(run.stdout)) blocked.push(`${recordPath}: forbidden output pattern ${String(pattern)}`);
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${recordPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "tw_equity_provider_specific_terms_review_outcome_recording") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "dry_run") blocked.push(`output.status: ${String(output.status)}`);
  if (output.target !== "permitted-use" || output.requestedClassification !== "accepted_for_local_planning_only") {
    blocked.push(`output target/classification mismatch: ${String(output.target)} ${String(output.requestedClassification)}`);
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourcePayloadStored",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
  if (!Array.isArray(output.stillDoesNotAuthorize) || output.stillDoesNotAuthorize.length < 14) {
    blocked.push("output.stillDoesNotAuthorize: expected blocked promotion list");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;
