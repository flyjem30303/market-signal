import { spawnSync } from "node:child_process";
import fs from "node:fs";

const recordPath = "scripts/record-tw-equity-schema-exposure-repair-outcome.mjs";
const outcomeDataPath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const runbookPath = "docs/TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_RUNBOOK.md";
const statusPath = "PROJECT_STATUS.md";

const source = fs.readFileSync(recordPath, "utf8");
const before = fs.readFileSync(outcomeDataPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const runbook = fs.readFileSync(runbookPath, "utf8");
const status = fs.readFileSync(statusPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "local_tw_equity_schema_exposure_repair_outcome_recording",
  "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json",
  "tw-equity-postgrest-schema-exposure-cache-repair",
  "pending",
  "accepted",
  "rejected",
  "--dry-run",
  "--apply",
  "recordedBy",
  "recordedAt",
  "decisionNote",
  "one_bounded_postgrest_openapi_schema_exposure_probe_rerun_only",
  "create_new_schema_exposure_repair_packet_before_any_remote_probe_or_write",
  "publicDataSource",
  "scoreSource",
  "scoreSourceRealEnabled",
  "supabaseReadsEnabled",
  "supabaseWritesEnabled",
  "thirdWriteAttemptAllowed",
  "stillDoesNotAuthorize"
]) {
  if (!source.includes(phrase)) missing.push(`${recordPath}: ${phrase}`);
}

for (const [file, text, phrases] of [
  [
    runbookPath,
    runbook,
    [
      "npm run record:tw-equity-schema-exposure-repair-outcome -- --dry-run",
      "npm run record:tw-equity-schema-exposure-repair-outcome -- --apply",
      "Accepted outcome only allows the next bounded OpenAPI schema exposure probe"
    ]
  ],
  [
    statusPath,
    status,
    [
      "Latest TW equity schema exposure repair outcome recorder slice",
      "scripts/record-tw-equity-schema-exposure-repair-outcome.mjs",
      "scripts/check-record-tw-equity-schema-exposure-repair-outcome.mjs",
      "local_tw_equity_schema_exposure_repair_outcome_recording",
      "accepted outcome only unlocks one bounded OpenAPI schema exposure probe rerun"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) missing.push(`${file}: ${phrase}`);
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
  /supabaseWritesEnabled:\s*true/,
  /thirdWriteAttemptAllowed:\s*true/
]) {
  if (pattern.test(source)) blocked.push(`${recordPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["record:tw-equity-schema-exposure-repair-outcome"] !==
  "node scripts/record-tw-equity-schema-exposure-repair-outcome.mjs"
) {
  missing.push(`${packagePath}: record:tw-equity-schema-exposure-repair-outcome`);
}
if (
  packageJson.scripts?.["check:record-tw-equity-schema-exposure-repair-outcome"] !==
  "node scripts/check-record-tw-equity-schema-exposure-repair-outcome.mjs"
) {
  missing.push(`${packagePath}: check:record-tw-equity-schema-exposure-repair-outcome`);
}
for (const [file, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-record-tw-equity-schema-exposure-repair-outcome.mjs")) {
    missing.push(`${file}: scripts/check-record-tw-equity-schema-exposure-repair-outcome.mjs`);
  }
  if (!text.includes("record-tw-equity-schema-exposure-repair-outcome")) {
    missing.push(`${file}: record-tw-equity-schema-exposure-repair-outcome`);
  }
}

const run = spawnSync(
  process.execPath,
  [
    recordPath,
    "--dry-run",
    "--id",
    "tw-equity-postgrest-schema-exposure-cache-repair",
    "--outcome",
    "accepted",
    "--recordedBy",
    "CEO",
    "--recordedAt",
    "2026-06-06T00:00:00.000Z",
    "--note",
    "Dry run verifies schema exposure repair outcome recording without mutating the ledger."
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
    if (pattern.test(run.stdout)) blocked.push(`${recordPath}: forbidden output pattern ${String(pattern)}`);
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${recordPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "local_tw_equity_schema_exposure_repair_outcome_recording") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "dry_run") blocked.push(`output.status: ${String(output.status)}`);
  if (
    output.target !== "tw-equity-postgrest-schema-exposure-cache-repair" ||
    output.requestedOutcome !== "accepted"
  ) {
    blocked.push(`output target/outcome mismatch: ${String(output.target)} ${String(output.requestedOutcome)}`);
  }
  if (output.nextStepUnlocked !== "one_bounded_postgrest_openapi_schema_exposure_probe_rerun_only") {
    blocked.push(`output.nextStepUnlocked: ${String(output.nextStepUnlocked)}`);
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "dailyPricesMutated",
    "ingestionStarted",
    "marketDataFetched",
    "marketDataIngested",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "stagingRowsCreated",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "thirdWriteAttemptAllowed"
  ]) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
    }
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
  if (!Array.isArray(output.stillDoesNotAuthorize) || output.stillDoesNotAuthorize.length < 14) {
    blocked.push("output.stillDoesNotAuthorize: expected at least 14 items");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

