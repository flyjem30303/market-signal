import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_A1_A2_OUTCOME_INTAKE_LEDGER.md";
const ledgerPath = "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json";
const applyRecorderPath = "scripts/record-phase-1-data-online-a1-a2-outcome-reviewed-apply.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledgerBefore = readText(ledgerPath);
const applyRecorder = readText(applyRecorderPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const dryRun = run("scripts/record-phase-1-data-online-a1-a2-outcome-dry-run.mjs", [
  "--dry-run",
  "--id",
  "a2_twii_etf_public_copy_guard_outcome",
  "--status",
  "deferred",
  "--recordedBy",
  "PM",
  "--safe-summary",
  "A2 copy guard outcome deferred for more no-secret copy review.",
  "--source-reference-label",
  "a2-public-copy-review-label",
  "--remaining-risk",
  "Public copy guard remains pending before any promotion language can change."
]);
const applyPreview = run(applyRecorderPath, [
  "--dry-run",
  "--id",
  "a2_twii_etf_public_copy_guard_outcome",
  "--status",
  "deferred",
  "--recordedBy",
  "PM",
  "--safe-summary",
  "A2 copy guard outcome deferred for more no-secret copy review.",
  "--source-reference-label",
  "a2-public-copy-review-label",
  "--remaining-risk",
  "Public copy guard remains pending before any promotion language can change.",
  "--reviewed-by",
  "PM",
  "--reviewed-note",
  "Dry-run only; no ledger mutation in checker."
]);
const ledgerAfter = readText(ledgerPath);

validateDoc();
validateSource();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_a1_a2_outcome_reviewed_apply_gate_ready_no_remote"
    : "phase_1_data_online_a1_a2_outcome_reviewed_apply_gate_blocked",
  decision: "ALLOW_REVIEWED_LOCAL_LEDGER_APPLY_ONLY",
  ledgerUnchangedByChecker: ledgerBefore === ledgerAfter,
  dryRunRoute: dryRun.pmReceiverRoute ?? null,
  applyPreviewRoute: applyPreview.pmReceiverRoute ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_a1_a2_outcome_reviewed_apply_gate_ready_no_remote",
    "cmd.exe /c npm run record:phase-1-data-online-a1-a2-outcome-reviewed-apply",
    "Reviewed apply updates only the local outcome ledger",
    "Reviewed apply requires a prior dry-run preview",
    "Reviewed apply still does not authorize SQL, Supabase, market-row fetch, row coverage, or runtime promotion"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateSource() {
  if (!applyRecorder.includes("mode: \"phase_1_data_online_a1_a2_outcome_reviewed_apply_recording\"")) {
    problems.push("apply recorder missing mode marker");
  }
  if (!applyRecorder.includes("status: apply ? \"recorded\" : \"dry_run\"")) {
    problems.push("apply recorder must support dry-run and reviewed apply");
  }
  if (!applyRecorder.includes("reviewedBy")) problems.push("apply recorder must require reviewedBy");
  if (!applyRecorder.includes("reviewedNote")) problems.push("apply recorder must require reviewedNote");
  if (!applyRecorder.includes("fs.writeFileSync")) problems.push("apply recorder must write only the local ledger on --apply");
  for (const token of [
    "@supabase/supabase-js",
    "createClient",
    ".from(",
    ".insert(",
    ".upsert(",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]) {
    if (applyRecorder.includes(token)) problems.push(`apply recorder contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  const packageJson = parseJson(packageJsonText, "package.json");
  if (
    packageJson.scripts?.["record:phase-1-data-online-a1-a2-outcome-reviewed-apply"] !==
    "node scripts/record-phase-1-data-online-a1-a2-outcome-reviewed-apply.mjs"
  ) {
    problems.push("reviewed apply recorder not registered in package.json");
  }
  if (
    packageJson.scripts?.["check:phase-1-data-online-a1-a2-outcome-reviewed-apply-gate"] !==
    "node scripts/check-phase-1-data-online-a1-a2-outcome-reviewed-apply-gate.mjs"
  ) {
    problems.push("reviewed apply checker not registered in package.json");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-a1-a2-outcome-reviewed-apply-gate.mjs")) {
    problems.push("review gate does not execute reviewed apply checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-a1-a2-outcome-reviewed-apply-gate"')) {
    problems.push("focused review gate missing reviewed apply checker");
  }
}

function validateReports() {
  if (ledgerBefore !== ledgerAfter) problems.push("checker must not mutate ledger");
  expect(dryRun.status, "dry_run", "dryRun status");
  expect(applyPreview.status, "dry_run", "applyPreview status");
  expect(applyPreview.target, "a2_twii_etf_public_copy_guard_outcome", "applyPreview target");
  expect(applyPreview.requestedStatus, "deferred", "applyPreview requestedStatus");
  expect(applyPreview.pmReceiverRoute, "keep_data_online_no_go_and_continue_mock_runtime_truthfulness", "applyPreview route");
  expect(applyPreview.publicDataSource, "mock", "applyPreview publicDataSource");
  expect(applyPreview.scoreSource, "mock", "applyPreview scoreSource");
  for (const key of [
    "executionAllowedNow",
    "supabaseReadAllowedNow",
    "supabaseWriteAllowedNow",
    "rowCoverageAwardAllowedNow",
    "marketDataFetchAllowedNow",
    "runtimePromotionAllowedNow",
    "secretsPrinted"
  ]) {
    expect(applyPreview.safety?.[key], false, `applyPreview safety.${key}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
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

function run(filePath, args) {
  const runResult = spawnSync(process.execPath, [filePath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 30000,
    windowsHide: true
  });
  if (runResult.status !== 0) {
    problems.push(`${filePath} exited ${runResult.status}: ${(runResult.stderr ?? "").slice(0, 200)}`);
    return {};
  }
  return parseJson(runResult.stdout, filePath);
}
