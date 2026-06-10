import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-explicit-execution-readiness-selector.mjs";
const docPath = "docs/TWII_EXPLICIT_EXECUTION_READINESS_SELECTOR.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
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

const output = parseJson(run.stdout ?? "", "explicit execution readiness selector stdout");
if (run.status !== 0) problems.push("explicit execution readiness selector report must exit 0");
if (output.status !== "twii_explicit_execution_readiness_selector_ready_no_execution") {
  problems.push("selector status must be ready no execution");
}
if (output.outcome !== "selector_routes_to_proof_bundle_execution_still_blocked") {
  problems.push("selector outcome must route to proof bundle and keep execution blocked");
}
if (output.currentRoute !== "twii_explicit_execution_packet_reviewed_execution_blocked") {
  problems.push("currentRoute mismatch");
}
if (output.recommendedNextAction !== "prepare_rollback_readback_postwrite_proof_bundle") {
  problems.push("recommendedNextAction mismatch");
}
if (!Array.isArray(output.requiredBeforeAnyExecution) || output.requiredBeforeAnyExecution.length < 5) {
  problems.push("requiredBeforeAnyExecution must list the proof requirements");
}
if (!Array.isArray(output.blockedExecutionReasons) || output.blockedExecutionReasons.length < 5) {
  problems.push("blockedExecutionReasons must list blocking reasons");
}
if (output.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.upstream?.draftStatus !== "twii_explicit_execution_packet_draft_ready_no_execution") {
  problems.push("draftStatus mismatch");
}
if (output.upstream?.acceptedPrerequisiteSlots !== 6) problems.push("acceptedPrerequisiteSlots must be 6");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.executionControls?.execute !== false) problems.push("execute must remain false");

assertSafety(output);

if (pkg.scripts?.["report:twii-explicit-execution-readiness-selector"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-explicit-execution-readiness-selector`);
}
if (pkg.scripts?.["check:twii-explicit-execution-readiness-selector"] !== "node scripts/check-twii-explicit-execution-readiness-selector.mjs") {
  problems.push(`${packagePath} missing check:twii-explicit-execution-readiness-selector`);
}

for (const phrase of [
  "TWII Explicit Execution Readiness Selector",
  "twii_explicit_execution_readiness_selector_ready_no_execution",
  "selector_routes_to_proof_bundle_execution_still_blocked",
  "currentRoute=twii_explicit_execution_packet_reviewed_execution_blocked",
  "recommendedNextAction=prepare_rollback_readback_postwrite_proof_bundle",
  "requiredBeforeAnyExecution",
  "blockedExecutionReasons",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII explicit execution readiness selector slice",
  "docs/TWII_EXPLICIT_EXECUTION_READINESS_SELECTOR.md",
  "twii_explicit_execution_readiness_selector_ready_no_execution",
  "selector_routes_to_proof_bundle_execution_still_blocked",
  "prepare_rollback_readback_postwrite_proof_bundle"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_EXPLICIT_EXECUTION_READINESS_SELECTOR.md` is `accepted` as TWII explicit execution readiness selector",
  "twii_explicit_execution_readiness_selector_ready_no_execution",
  "selector_routes_to_proof_bundle_execution_still_blocked",
  "prepare_rollback_readback_postwrite_proof_bundle"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-explicit-execution-readiness-selector.mjs",
  "name: \"twii-explicit-execution-readiness-selector\"",
  "\"twii-explicit-execution-readiness-selector\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["explicit execution readiness selector stdout", run.stdout ?? ""]
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
      recommendedNextAction: output.recommendedNextAction,
      executionAllowedNow: output.executionAllowedNow,
      writeGateExecutableNow: output.writeGateExecutableNow,
      implementationAllowedNow: output.implementationAllowedNow
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("selector must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`selector safety.${key} must be false`);
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
