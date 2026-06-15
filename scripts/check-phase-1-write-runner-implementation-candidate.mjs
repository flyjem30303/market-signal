import fs from "node:fs";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-write-runner-implementation-candidate.mjs";
const docPath = "docs/PHASE_1_WRITE_RUNNER_IMPLEMENTATION_CANDIDATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const runnerSource = readText(runnerPath);
const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const run = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
if (run.status !== 0) problems.push("runner candidate must exit 0 while blocked");
const output = parseJson(run.stdout, "runner stdout");

validateOutput();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_write_runner_implementation_candidate_blocked_no_execution_ready"
        : "phase_1_write_runner_implementation_candidate_check_blocked",
      runnerStatus: output.runnerStatus ?? null,
      blockedReasons: output.blockedReasons ?? [],
      nextRoute: output.nextRoute ?? null,
      publicDataSource: output.publicDataSource ?? null,
      scoreSource: output.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateOutput() {
  expect(output.status, "blocked", "output.status");
  expect(output.runnerStatus, "phase_1_write_runner_implementation_candidate_blocked_no_execution", "runnerStatus");
  expect(output.outcome, "runner_candidate_fail_closed_before_row_payload_or_write", "outcome");
  expect(output.runnerMode, "implementation_candidate_fail_closed_no_execution", "runnerMode");
  expect(output.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(output.targetTable, "daily_prices", "targetTable");
  expect(output.expected?.fullLevel1MissingRows, 178, "fullLevel1MissingRows");
  expect(output.expected?.twiiMissingRows, 60, "twiiMissingRows");
  expect(output.expected?.etfMissingRows, 118, "etfMissingRows");
  expect(output.rowPayloadStatus?.twiiRowPayloadIncluded, false, "twiiRowPayloadIncluded");
  expect(output.rowPayloadStatus?.etfRowPayloadIncluded, false, "etfRowPayloadIncluded");
  expect(output.rowPayloadStatus?.twiiRawPayloadIncluded, false, "twiiRawPayloadIncluded");
  expect(output.rowPayloadStatus?.etfRawPayloadIncluded, false, "etfRawPayloadIncluded");
  expectIncludes(output.blockedReasons, "candidate_row_payloads_missing", "blockedReasons");
  expect(output.nextRoute, "provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go", "nextRoute");
  for (const key of [
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "credentialValueRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted"
  ]) {
    expect(output[key], false, key);
  }
  expect(output.publicDataSource, "mock", "publicDataSource");
  expect(output.scoreSource, "mock", "scoreSource");
}

function validateDoc() {
  for (const token of [
    "phase_1_write_runner_implementation_candidate_blocked_no_execution",
    "implementation_candidate_fail_closed_no_execution",
    "candidate_row_payloads_missing",
    "provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go",
    "twiiCandidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
    "etfCandidateArtifactPath=data/candidates/phase-1-etf-sanitized-candidate.json",
    "twiiRowPayloadIncluded=false",
    "etfRowPayloadIncluded=false",
    "No SQL",
    "No Supabase write",
    "No candidate row acceptance",
    "No `daily_prices` mutation",
    "No row payload output",
    "No public real-data claim",
    "No investment advice"
  ]) {
    if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["run:phase-1-write-runner-implementation-candidate"] !==
    "node scripts/run-phase-1-write-runner-implementation-candidate.mjs"
  ) {
    problems.push("package.json missing run:phase-1-write-runner-implementation-candidate");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-implementation-candidate"] !==
    "node scripts/check-phase-1-write-runner-implementation-candidate.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-implementation-candidate");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-implementation-candidate.mjs")) {
    problems.push("review gate missing implementation candidate checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-implementation-candidate"')) {
    problems.push("focused review gate missing implementation candidate checker");
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [runnerPath, runnerSource],
    [docPath, doc],
    ["runner output", run.stdout ?? ""]
  ]) {
    for (const pattern of [
      /@supabase\/supabase-js/u,
      /createClient\s*\(/u,
      /\.from\s*\(/u,
      /\.insert\s*\(/u,
      /\.update\s*\(/u,
      /\.delete\s*\(/u,
      /\.upsert\s*\(/u,
      /\.rpc\s*\(/u,
      /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
      /publicDataSource"\s*:\s*"supabase"/u,
      /scoreSource"\s*:\s*"real"/u,
      /executionAllowedNow"\s*:\s*true/u,
      /writeGateExecutableNow"\s*:\s*true/u,
      /dailyPricesMutated"\s*:\s*true/u,
      /supabaseWriteAttempted"\s*:\s*true/u
    ]) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.includes(expected)) problems.push(`${label} missing ${expected}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
