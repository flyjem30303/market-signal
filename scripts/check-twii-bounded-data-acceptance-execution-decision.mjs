import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-bounded-data-acceptance-execution-decision.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_EXECUTION_DECISION.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
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
const output = parseJson(run.stdout ?? "", "execution decision stdout");
if (run.status !== 0) problems.push("execution decision report must exit 0");
if (output.status !== "twii_bounded_data_acceptance_execution_decision_ready_for_named_no_write_chain") {
  problems.push("execution decision status must be ready for named no-write chain");
}
if (output.outcome !== "named_acceptance_attempt_gate_ready_no_write_chain_only") {
  problems.push("execution decision outcome must be named no-write chain only");
}
if (output.executionDecision?.namedNoWritePacketDrivenChainAllowedNext !== true) {
  problems.push("execution decision must allow only the named no-write packet-driven chain next");
}
assertReportSafety(output);

if (
  pkg.scripts?.["report:twii-bounded-data-acceptance-execution-decision"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-data-acceptance-execution-decision`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-execution-decision"] !==
  "node scripts/check-twii-bounded-data-acceptance-execution-decision.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-execution-decision`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Execution Decision",
  "twii_bounded_data_acceptance_execution_decision_ready_for_named_no_write_chain",
  "named no-write packet-driven chain",
  "attemptId=twii-bounded-data-acceptance-20260609-a",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "Supabase read/write",
  "candidate row acceptance",
  "row coverage scoring"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance execution decision slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_EXECUTION_DECISION.md",
  "twii_bounded_data_acceptance_execution_decision_ready_for_named_no_write_chain",
  "named_acceptance_attempt_gate_ready_no_write_chain_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_EXECUTION_DECISION.md` is `accepted` as TWII bounded data acceptance execution decision",
  "twii_bounded_data_acceptance_execution_decision_ready_for_named_no_write_chain",
  "named_acceptance_attempt_gate_ready_no_write_chain_only"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-execution-decision.mjs",
  "name: \"twii-bounded-data-acceptance-execution-decision\"",
  "\"twii-bounded-data-acceptance-execution-decision\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["execution decision stdout", run.stdout ?? ""]
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
      generatedPacketPath: output.generatedPacketPath
    },
    null,
    2
  )
);

function assertReportSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("execution decision must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadAttemptedByThisSlice",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`execution decision safety.${key} must be false`);
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
    /\bfetch\s*\(/u,
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

