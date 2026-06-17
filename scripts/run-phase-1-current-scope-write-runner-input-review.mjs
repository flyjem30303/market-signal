import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const candidateArtifactPath =
  args.candidateArtifact ?? process.env.PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH;
const validatorPath = "scripts/validate-phase-1-current-scope-sanitized-row-payload-candidate-artifact.mjs";
const problems = [];

if (!candidateArtifactPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_write_runner_input_review_blocked_missing_candidate",
    reviewMode: "current_scope_write_runner_input_review_aggregate_only",
    candidateArtifactPathProvided: false,
    candidateArtifactAcceptedNow: false,
    dryRunReviewAllowedNow: false,
    nextRoute: "provide_current_scope_row_payload_candidate_path_then_run_input_review",
    problems: ["--candidate-artifact or PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH is required"]
  }));
  process.exit(1);
}

const validation = runValidator(candidateArtifactPath);
if (!validation.parsed) {
  problems.push("candidate_validator_output_unreadable");
}
if (validation.exitCode !== 0) {
  problems.push(`candidate_validator_exit_code_${validation.exitCode}`);
}

const validatorResult = validation.parsed ?? {};
const accepted = validatorResult.accepted === true && problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_write_runner_input_review_ready"
    : "phase_1_current_scope_write_runner_input_review_blocked",
  reviewMode: "current_scope_write_runner_input_review_aggregate_only",
  candidateArtifactPathProvided: true,
  candidateArtifactAcceptedNow: accepted,
  dryRunReviewAllowedNow: accepted,
  boundedWriteExecutableNow: false,
  runnerExecutableNow: false,
  candidateReview: aggregateOnlyCandidateReview(validatorResult),
  nextRoute: accepted
    ? "prepare_current_scope_insert_missing_dry_run_review_against_candidate"
    : "repair_current_scope_row_payload_candidate_then_rerun_input_review",
  problems: [...problems, ...(Array.isArray(validatorResult.problems) ? validatorResult.problems : [])]
}));

if (!accepted) process.exit(1);

function runValidator(candidatePath) {
  const run = spawnSync(process.execPath, [validatorPath, "--candidate-artifact", candidatePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  let parsed = null;
  try {
    parsed = JSON.parse(run.stdout);
  } catch {
    parsed = null;
  }

  return {
    exitCode: run.status ?? 1,
    parsed
  };
}

function aggregateOnlyCandidateReview(result) {
  return {
    validatorStatus: result.status ?? null,
    validatorMode: result.validatorMode ?? null,
    accepted: result.accepted === true,
    rowCount: Number.isInteger(result.rowCount) ? result.rowCount : null,
    expectedRows: Number.isInteger(result.expectedRows) ? result.expectedRows : null,
    symbolsCoveredCount: Number.isInteger(result.symbolsCoveredCount) ? result.symbolsCoveredCount : null,
    symbolsCoveredPreview: Array.isArray(result.symbolsCoveredPreview) ? result.symbolsCoveredPreview.slice(0, 12) : [],
    dateBounds: result.dateBounds ?? null,
    duplicateCount: Number.isInteger(result.duplicateCount) ? result.duplicateCount : null,
    etfSymbolCount: Number.isInteger(result.etfSymbolCount) ? result.etfSymbolCount : null,
    listedStockSymbolCount: Number.isInteger(result.listedStockSymbolCount) ? result.listedStockSymbolCount : null,
    twiiRowCount: Number.isInteger(result.twiiRowCount) ? result.twiiRowCount : null,
    candidatePathPolicy: result.candidatePathPolicy ?? null,
    safety: {
      rowPayloadOutput: result.safety?.rowPayloadOutput === true,
      rawPayloadOutput: result.safety?.rawPayloadOutput === true,
      stockIdPayloadOutput: result.safety?.stockIdPayloadOutput === true,
      secretsOutput: result.safety?.secretsOutput === true,
      sqlExecuted: result.safety?.sqlExecuted === true,
      supabaseConnectionAttempted: result.safety?.supabaseConnectionAttempted === true,
      supabaseWriteAttempted: result.safety?.supabaseWriteAttempted === true,
      dailyPricesMutated: result.safety?.dailyPricesMutated === true
    }
  };
}

function safePayload(fields) {
  return {
    ...fields,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function parseArgs(tokens) {
  const parsed = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
