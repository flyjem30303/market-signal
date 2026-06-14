import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_EXECUTION_PACKET_READINESS_GATE.md";
const recordPath = "data/source-gates/twii-bounded-execution-packet-readiness-gate.json";
const reportPath = "scripts/report-twii-bounded-execution-packet-readiness-gate.mjs";
const checkerPath = "scripts/check-twii-bounded-execution-packet-readiness-gate.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const upstreamPaths = {
  reportOnlyChain: "data/source-gates/twii-report-only-dry-run-chain-gate.json",
  serverOnlyIntegration: "data/source-gates/twii-server-only-pre-execution-integration-gate.json",
  operatorAuthorization: "data/source-gates/twii-bounded-operator-authorization-packet-gate.json",
  aggregateReadback: "data/source-gates/twii-aggregate-readback-contract-preflight.json",
  rollbackReadiness: "data/source-gates/twii-rollback-readiness-contract-preflight.json"
};

const doc = read(docPath);
const record = readJson(recordPath);
const reportSource = read(reportPath);
const status = read(statusPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const report = runJson(reportPath);
const upstream = Object.fromEntries(Object.entries(upstreamPaths).map(([key, value]) => [key, readJson(value)]));

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env\.SUPABASE/u,
  /SQL is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
  /market-data fetch is approved/iu,
  /row coverage scoring is approved/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const phrase of [
  "Status: `twii_bounded_execution_packet_readiness_gate_ready_no_execution`",
  "Decision: `accept_twii_bounded_execution_packet_readiness_for_operator_packet_preparation_only`",
  "Upstream report-only chain: `twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only`",
  "Server-only integration: `twii_server_only_pre_execution_integration_gate`",
  "Operator authorization packet: `twii_bounded_operator_authorization_packet_gate`",
  "Aggregate readback contract: `aggregate_readback_contract_ready_but_runtime_execution_still_blocked`",
  "Rollback readiness contract: `rollback_readiness_contract_ready_but_runtime_execution_still_blocked`",
  "Next PM route: `twii_explicit_operator_packet_preparation_gate`",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`",
  "This readiness gate does not authorize SQL, Supabase connection, Supabase read/write, staging rows, `daily_prices` mutation, market-data fetch, source-derived candidate row generation, row coverage scoring, public source promotion, real scoring, or execution."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

const expected = {
  status: "twii_bounded_execution_packet_readiness_gate_ready_no_execution",
  decision: "accept_twii_bounded_execution_packet_readiness_for_operator_packet_preparation_only",
  acceptedScope: "bounded_execution_packet_readiness_only",
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  targetTable: "daily_prices",
  maxRows: 60,
  reportOnlyChainStatus: "twii_report_only_dry_run_chain_gate_completed_no_write_aggregate_only",
  serverOnlyIntegrationStatus: "twii_server_only_pre_execution_integration_gate_ready_no_execution",
  operatorAuthorizationStatus: "twii_bounded_operator_authorization_packet_gate_ready_no_execution",
  aggregateReadbackDecision: "aggregate_readback_contract_ready_but_runtime_execution_still_blocked",
  rollbackReadinessDecision: "rollback_readiness_contract_ready_but_runtime_execution_still_blocked",
  nextPMRoute: "twii_explicit_operator_packet_preparation_gate",
  publicDataSource: "mock",
  scoreSource: "mock",
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  sqlAllowed: false,
  supabaseAllowed: false,
  dailyPricesMutationAllowed: false,
  marketDataFetchAllowed: false,
  sourceDerivedCandidateGenerationAllowed: false,
  rowCoverageAwardAllowed: false,
  runtimePromotionAllowed: false
};

for (const [key, value] of Object.entries(expected)) {
  if (record?.[key] !== value) {
    problems.push(`${recordPath} expected ${key}=${JSON.stringify(value)} but found ${JSON.stringify(record?.[key])}`);
  }
  if (report?.[key] !== value) {
    problems.push(`${reportPath} expected ${key}=${JSON.stringify(value)} but found ${JSON.stringify(report?.[key])}`);
  }
}

if (upstream.reportOnlyChain?.status !== expected.reportOnlyChainStatus) problems.push("report-only chain upstream status mismatch");
if (upstream.serverOnlyIntegration?.gateKind !== "twii_server_only_pre_execution_integration_gate") problems.push("server-only integration kind mismatch");
if (upstream.operatorAuthorization?.gateKind !== "twii_bounded_operator_authorization_packet_gate") problems.push("operator authorization kind mismatch");
if (upstream.aggregateReadback?.contractDecision !== expected.aggregateReadbackDecision) problems.push("aggregate readback decision mismatch");
if (upstream.rollbackReadiness?.contractDecision !== expected.rollbackReadinessDecision) problems.push("rollback readiness decision mismatch");

for (const item of [
  "explicit_operator_decision_required",
  "execute_switch_required",
  "confirmation_phrase_required",
  "server_only_credential_presence_required",
  "rollback_dry_run_required",
  "aggregate_readback_required",
  "post_run_review_required",
  "candidate_duplicate_rejection_required",
  "public_copy_truthfulness_required"
]) {
  if (!record?.requiredBeforeExecution?.includes(item)) problems.push(`${recordPath} missing requiredBeforeExecution item ${item}`);
  if (!report?.requiredBeforeExecution?.includes(item)) problems.push(`${reportPath} missing requiredBeforeExecution item ${item}`);
}

for (const [path, source, phrase] of [
  [statusPath, status, "TWII Bounded Execution Packet Readiness Gate"],
  [statusPath, status, expected.status],
  [reviewGatePath, reviewGate, checkerPath],
  [reviewGatePath, reviewGate, "twii-bounded-execution-packet-readiness-gate"]
]) {
  if (!source.includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
}

if (pkg?.scripts?.["report:twii-bounded-execution-packet-readiness-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-bounded-execution-packet-readiness-gate script`);
}
if (pkg?.scripts?.["check:twii-bounded-execution-packet-readiness-gate"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-bounded-execution-packet-readiness-gate script`);
}

assertSafety(record, "record");
assertSafety(report, "report");

for (const [path, source] of [
  [docPath, doc],
  [recordPath, fs.existsSync(recordPath) ? fs.readFileSync(recordPath, "utf8") : ""],
  [reportPath, reportSource],
  ["report output", JSON.stringify(report ?? {})]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) problems.push(`${path} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: record.status,
      nextPMRoute: record.nextPMRoute,
      publicDataSource: record.publicDataSource,
      scoreSource: record.scoreSource,
      executionAllowedNow: record.executionAllowedNow,
      problems: []
    },
    null,
    2
  )
);

function assertSafety(source, label) {
  if (source?.publicDataSource !== "mock" || source?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "executionAllowedNow",
    "writeGateExecutableNow",
    "sqlAllowed",
    "supabaseAllowed",
    "dailyPricesMutationAllowed",
    "marketDataFetchAllowed",
    "sourceDerivedCandidateGenerationAllowed",
    "rowCoverageAwardAllowed",
    "runtimePromotionAllowed"
  ]) {
    if (source?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`${filePath} invalid JSON: ${error.message}`);
    return null;
  }
}

function runJson(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return null;
  }
  const result = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    problems.push(`${filePath} failed with exit ${result.status}: ${result.stderr || result.stdout}`);
    return null;
  }
  const start = result.stdout.indexOf("{");
  if (start < 0) {
    problems.push(`${filePath} did not print JSON`);
    return null;
  }
  try {
    return JSON.parse(result.stdout.slice(start));
  } catch (error) {
    problems.push(`${filePath} output invalid JSON: ${error.message}`);
    return null;
  }
}
