import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-aggregate-readback-contract-preflight.mjs";
const docPath = "docs/TWII_AGGREGATE_READBACK_CONTRACT_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gateText = read(gatePath);
const gate = JSON.parse(gateText);
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

const output = parseJson(run.stdout ?? "", "aggregate readback contract preflight stdout");
if (run.status !== 0) problems.push("aggregate readback contract preflight report must exit 0");
if (output.status !== "twii_aggregate_readback_contract_preflight_ready_no_execution") {
  problems.push("aggregate readback contract preflight status mismatch");
}
if (output.outcome !== "aggregate_readback_contract_ready_runtime_still_blocked") {
  problems.push("aggregate readback contract preflight outcome mismatch");
}
if (output.mode !== "twii_aggregate_readback_contract_preflight_no_execution") {
  problems.push("aggregate readback contract preflight mode mismatch");
}
if (output.contractMode !== "aggregate_readback_contract_no_execution") problems.push("contractMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");
if (output.candidateArtifactPath !== "data/candidates/twii-sanitized-candidate.json") {
  problems.push("candidateArtifactPath mismatch");
}

assertGate(gate);
assertReadbackContractState(output.readbackContractState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-aggregate-readback-contract-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-aggregate-readback-contract-preflight`);
}
if (
  pkg.scripts?.["check:twii-aggregate-readback-contract-preflight"] !==
  "node scripts/check-twii-aggregate-readback-contract-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-aggregate-readback-contract-preflight`);
}

for (const phrase of [
  "TWII Aggregate Readback Contract Preflight",
  "twii_aggregate_readback_contract_preflight_ready_no_execution",
  "aggregate_readback_contract_ready_runtime_still_blocked",
  "data/source-gates/twii-aggregate-readback-contract-preflight.json",
  "sourceContractGatePath=data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "contractMode=aggregate_readback_contract_no_execution",
  "aggregateReadbackContractPrepared=true",
  "readbackFieldsAggregateOnly=true",
  "readbackCountBoundsPrepared=true",
  "readbackScopeLockPrepared=true",
  "readbackNoRowPayloadPrepared=true",
  "candidateArtifactReferenceOnly=true",
  "candidateArtifactRowsRead=false",
  "rowPayloadRead=false",
  "rawPayloadRead=false",
  "readbackExecutionAllowedNow=false",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "supabaseWritesEnabled=false",
  "supabaseReadsEnabled=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII aggregate readback contract preflight slice",
  "docs/TWII_AGGREGATE_READBACK_CONTRACT_PREFLIGHT.md",
  "data/source-gates/twii-aggregate-readback-contract-preflight.json",
  "twii_aggregate_readback_contract_preflight_ready_no_execution",
  "aggregate_readback_contract_ready_runtime_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_AGGREGATE_READBACK_CONTRACT_PREFLIGHT.md` is `accepted` as TWII aggregate readback contract preflight",
  "twii_aggregate_readback_contract_preflight_ready_no_execution",
  "aggregate_readback_contract_ready_runtime_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-aggregate-readback-contract-preflight.mjs",
  "name: \"twii-aggregate-readback-contract-preflight\"",
  "\"twii-aggregate-readback-contract-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["aggregate readback contract preflight stdout", run.stdout ?? ""]
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
      contractMode: output.contractMode,
      readbackExecutionAllowedNow: output.readbackContractState.readbackExecutionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_aggregate_readback_contract_preflight",
    sourceContractGatePath: "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    contractMode: "aggregate_readback_contract_no_execution",
    sourceContractGateAccepted: true,
    aggregateReadbackContractPrepared: true,
    readbackFieldsAggregateOnly: true,
    readbackCountBoundsPrepared: true,
    readbackScopeLockPrepared: true,
    readbackNoRowPayloadPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    readbackExecutionAllowedNow: false,
    contractDecision: "aggregate_readback_contract_ready_but_runtime_execution_still_blocked",
    nextIfContractAccepted: "prepare_post_run_review_contract_preflight_without_connecting_supabase",
    nextIfContractRejected: "repair_aggregate_readback_contract_or_bounded_insert_contract"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (gate.readbackContract?.operationKind !== "future_aggregate_readback_only") {
    problems.push("readbackContract.operationKind mismatch");
  }
  if (gate.readbackContract?.requiresCountBounds !== true) {
    problems.push("readbackContract.requiresCountBounds must be true");
  }
}

function assertReadbackContractState(state) {
  for (const key of [
    "sourceContractGateAccepted",
    "aggregateReadbackContractPrepared",
    "readbackFieldsAggregateOnly",
    "readbackCountBoundsPrepared",
    "readbackScopeLockPrepared",
    "readbackNoRowPayloadPrepared",
    "postRunReviewContractPrepared",
    "rollbackReadinessContractPrepared"
  ]) {
    if (state[key] !== true) problems.push(`readbackContractState.${key} must be true`);
  }
  if (state.readbackExecutionAllowedNow !== false) {
    problems.push("readbackContractState.readbackExecutionAllowedNow must be false");
  }
}

function assertCandidateState(state) {
  if (state.candidateArtifactReferenceOnly !== true) {
    problems.push("candidateState.candidateArtifactReferenceOnly must be true");
  }
  for (const key of ["candidateArtifactRowsRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead"]) {
    if (state[key] !== false) problems.push(`candidateState.${key} must be false`);
  }
}

function assertNoExecutionState(state) {
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow"
  ]) {
    if (state[key] !== false) problems.push(`noExecutionState.${key} must be false`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("safety must stay publicDataSource=mock and scoreSource=mock");
  }
  if (safety.candidateArtifactReferenceOnly !== true) {
    problems.push("safety.candidateArtifactReferenceOnly must be true");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "sourcePayloadRead",
    "rowPayloadRead",
    "rawPayloadRead",
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
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
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

function read(filePath) {
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
