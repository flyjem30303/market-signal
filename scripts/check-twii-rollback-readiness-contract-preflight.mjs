import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-rollback-readiness-contract-preflight.mjs";
const docPath = "docs/TWII_ROLLBACK_READINESS_CONTRACT_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
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

const output = parseJson(run.stdout ?? "", "rollback readiness contract preflight stdout");
if (run.status !== 0) problems.push("rollback readiness contract preflight report must exit 0");
if (output.status !== "twii_rollback_readiness_contract_preflight_ready_no_execution") {
  problems.push("rollback readiness contract preflight status mismatch");
}
if (output.outcome !== "rollback_readiness_contract_ready_runtime_still_blocked") {
  problems.push("rollback readiness contract preflight outcome mismatch");
}
if (output.mode !== "twii_rollback_readiness_contract_preflight_no_execution") {
  problems.push("rollback readiness contract preflight mode mismatch");
}
if (output.contractMode !== "rollback_readiness_contract_no_execution") problems.push("contractMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertGate(gate);
assertRollbackReadinessContractState(output.rollbackReadinessContractState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-rollback-readiness-contract-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-rollback-readiness-contract-preflight`);
}
if (
  pkg.scripts?.["check:twii-rollback-readiness-contract-preflight"] !==
  "node scripts/check-twii-rollback-readiness-contract-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-rollback-readiness-contract-preflight`);
}

for (const phrase of [
  "TWII Rollback Readiness Contract Preflight",
  "twii_rollback_readiness_contract_preflight_ready_no_execution",
  "rollback_readiness_contract_ready_runtime_still_blocked",
  "data/source-gates/twii-rollback-readiness-contract-preflight.json",
  "sourcePostRunReviewGatePath=data/source-gates/twii-post-run-review-contract-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "contractMode=rollback_readiness_contract_no_execution",
  "rollbackReadinessContractPrepared=true",
  "rollbackScopeLockPrepared=true",
  "rollbackSummaryAggregateOnly=true",
  "rollbackStateVocabularyPrepared=true",
  "postRunReviewDependencyPrepared=true",
  "promotionLocksPrepared=true",
  "candidateArtifactReferenceOnly=true",
  "candidateArtifactRowsRead=false",
  "rowPayloadRead=false",
  "rawPayloadRead=false",
  "rollbackExecutionAllowedNow=false",
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
  "Latest TWII rollback readiness contract preflight slice",
  "docs/TWII_ROLLBACK_READINESS_CONTRACT_PREFLIGHT.md",
  "data/source-gates/twii-rollback-readiness-contract-preflight.json",
  "twii_rollback_readiness_contract_preflight_ready_no_execution",
  "rollback_readiness_contract_ready_runtime_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_ROLLBACK_READINESS_CONTRACT_PREFLIGHT.md` is `accepted` as TWII rollback readiness contract preflight",
  "twii_rollback_readiness_contract_preflight_ready_no_execution",
  "rollback_readiness_contract_ready_runtime_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-rollback-readiness-contract-preflight.mjs",
  "name: \"twii-rollback-readiness-contract-preflight\"",
  "\"twii-rollback-readiness-contract-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["rollback readiness contract preflight stdout", run.stdout ?? ""]
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
      rollbackExecutionAllowedNow: output.rollbackReadinessContractState.rollbackExecutionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_rollback_readiness_contract_preflight",
    sourcePostRunReviewGatePath: "data/source-gates/twii-post-run-review-contract-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    contractMode: "rollback_readiness_contract_no_execution",
    sourcePostRunReviewGateAccepted: true,
    rollbackReadinessContractPrepared: true,
    rollbackScopeLockPrepared: true,
    rollbackSummaryAggregateOnly: true,
    rollbackStateVocabularyPrepared: true,
    postRunReviewDependencyPrepared: true,
    promotionLocksPrepared: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    rollbackExecutionAllowedNow: false,
    contractDecision: "rollback_readiness_contract_ready_but_runtime_execution_still_blocked",
    nextIfContractAccepted: "prepare_final_execution_packet_preflight_without_connecting_supabase",
    nextIfContractRejected: "repair_rollback_readiness_or_post_run_review_contract"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (gate.rollbackReadinessContract?.operationKind !== "future_rollback_readiness_aggregate_only") {
    problems.push("rollbackReadinessContract.operationKind mismatch");
  }
  if (gate.promotionLocks?.publicDataSource !== "mock") problems.push("promotionLocks.publicDataSource must be mock");
}

function assertRollbackReadinessContractState(state) {
  for (const key of [
    "sourcePostRunReviewGateAccepted",
    "rollbackReadinessContractPrepared",
    "rollbackScopeLockPrepared",
    "rollbackSummaryAggregateOnly",
    "rollbackStateVocabularyPrepared",
    "postRunReviewDependencyPrepared",
    "promotionLocksPrepared"
  ]) {
    if (state[key] !== true) problems.push(`rollbackReadinessContractState.${key} must be true`);
  }
  if (state.rollbackExecutionAllowedNow !== false) {
    problems.push("rollbackReadinessContractState.rollbackExecutionAllowedNow must be false");
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
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
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
