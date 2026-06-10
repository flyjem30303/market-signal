import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-one-attempt-runner-execution-gate.mjs";
const docPath = "docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE.md";
const gatePath = "data/source-gates/twii-one-attempt-runner-execution-gate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gate = JSON.parse(read(gatePath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const output = parseJson(run.stdout ?? "", "one-attempt runner execution gate stdout");
if (run.status !== 0) problems.push("one-attempt runner execution gate report must exit 0");
if (output.status !== "twii_one_attempt_runner_execution_gate_ready_no_execution") {
  problems.push("runner gate status must be ready no execution");
}
if (output.outcome !== "runner_gate_ready_fail_closed_execution_still_blocked") {
  problems.push("runner gate outcome mismatch");
}
if (output.gateReadyForPmReview !== true) problems.push("gateReadyForPmReview must be true");
if (output.runnerMode !== "fail_closed_no_execution") problems.push("runnerMode mismatch");
if (output.runnerExecutableNow !== false) problems.push("runnerExecutableNow must be false");
if (output.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.upstream?.pmReviewDecision !== "accepted_for_future_execution_gate_preparation_only") {
  problems.push("PM decision must be accepted for future gate preparation only");
}
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");

assertGate(gate);
assertSafety(output);

if (pkg.scripts?.["report:twii-one-attempt-runner-execution-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-one-attempt-runner-execution-gate`);
}
if (pkg.scripts?.["check:twii-one-attempt-runner-execution-gate"] !== "node scripts/check-twii-one-attempt-runner-execution-gate.mjs") {
  problems.push(`${packagePath} missing check:twii-one-attempt-runner-execution-gate`);
}

for (const phrase of [
  "TWII One-Attempt Runner Execution Gate",
  "twii_one_attempt_runner_execution_gate_ready_no_execution",
  "runner_gate_ready_fail_closed_execution_still_blocked",
  "data/source-gates/twii-one-attempt-runner-execution-gate.json",
  "runnerMode=fail_closed_no_execution",
  "gateReadyForPmReview=true",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII one-attempt runner execution gate slice",
  "docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE.md",
  "data/source-gates/twii-one-attempt-runner-execution-gate.json",
  "twii_one_attempt_runner_execution_gate_ready_no_execution",
  "runner_gate_ready_fail_closed_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_ONE_ATTEMPT_RUNNER_EXECUTION_GATE.md` is `accepted` as TWII one-attempt runner execution gate",
  "twii_one_attempt_runner_execution_gate_ready_no_execution",
  "runner_gate_ready_fail_closed_execution_still_blocked",
  "prepare_fail_closed_runner_stub_or_explicit_execution_attempt_packet"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-one-attempt-runner-execution-gate.mjs",
  "name: \"twii-one-attempt-runner-execution-gate\"",
  "\"twii-one-attempt-runner-execution-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, JSON.stringify(gate)],
  ["one-attempt runner execution gate stdout", run.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: output.status,
      acceptedOutcome: output.outcome,
      runnerMode: output.runnerMode,
      runnerExecutableNow: output.runnerExecutableNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  if (gate.gateKind !== "twii_one_attempt_runner_execution_gate_no_execution") problems.push("gateKind mismatch");
  if (gate.runnerMode !== "fail_closed_no_execution") problems.push("gate runnerMode mismatch");
  if (gate.gateReadyForPmReview !== true) problems.push("gateReadyForPmReview must be true");
  if (gate.runnerExecutableNow !== false) problems.push("runnerExecutableNow must be false");
  if (gate.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (gate.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (gate.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
  if (gate.pmDecisionRequired !== "accepted_for_future_execution_gate_preparation_only") {
    problems.push("pmDecisionRequired mismatch");
  }
}

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("runner gate must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`runner gate safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage scoring is approved/iu
  ];
}
