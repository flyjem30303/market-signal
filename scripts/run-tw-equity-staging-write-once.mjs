import fs from "node:fs";
import path from "node:path";

const SHARED_EXPECTED = {
  lane: "tw-equity",
  maxRows: 180,
  sessions: 60,
  symbols: "2330,2382,2308",
  target: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};
const ATTEMPT_CONTRACTS = [
  {
    ...SHARED_EXPECTED,
    authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
    candidateAuthorizationIds: ["TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001"],
    confirmation: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
    postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md"
  },
  {
    ...SHARED_EXPECTED,
    authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
    candidateAuthorizationIds: [
      "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
      "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002"
    ],
    confirmation: "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
    postRunReview: "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md"
  },
  {
    ...SHARED_EXPECTED,
    authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
    candidateAuthorizationIds: [
      "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
      "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
      "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003"
    ],
    confirmation: "CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE",
    postRunReview: "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md"
  }
];
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

loadProcessEnvFromDotEnvLocal();
const args = parseArgs(process.argv.slice(2));
const problems = [];
const EXPECTED = resolveExpected(args);

if (args.authorizationId !== EXPECTED.authorizationId) problems.push("authorization_id_mismatch");
if (args.lane !== EXPECTED.lane) problems.push("lane_mismatch");
if (args.symbols !== EXPECTED.symbols) problems.push("symbols_mismatch");
if (Number(args.sessions) !== EXPECTED.sessions) problems.push("sessions_mismatch");
if (args.target !== EXPECTED.target) problems.push("target_relation_mismatch");
if (Number(args.maxRows) !== EXPECTED.maxRows) problems.push("max_rows_mismatch");
if (args.postRunReview !== EXPECTED.postRunReview) problems.push("post_run_review_mismatch");

const commandContractMatched = problems.length === 0;
const executionRequested = args.execute === "true" || args.execute === true;
const candidateInputArtifact = args.candidateInput ?? "missing";
const candidateInputValidation =
  candidateInputArtifact === "missing" ? skippedCandidateInputValidation() : validateCandidateInputArtifact(candidateInputArtifact);
const candidateInputAccepted = candidateInputValidation.accepted;
const candidateInput = candidateInputValidation.artifact;
const confirmationPresent = process.env.TW_EQUITY_STAGING_WRITE_CONFIRMATION === EXPECTED.confirmation;
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const rollbackDryRunAvailable = args.rollbackDryRun === "true" || args.rollbackDryRun === true;
const rollbackDryRunCountReady = rollbackDryRunAvailable && candidateInputAccepted;
const writePreExecutionSummary = buildWritePreExecutionSummary({
  candidateInputAccepted,
  candidateInputValidation,
  commandContractMatched,
  confirmationPresent,
  credentialPresence,
  rollbackDryRunAvailable,
  rollbackDryRunCountReady
});
const localPreflightProblems = [];

problems.push(...candidateInputValidation.problems);

if (executionRequested) {
  if (!confirmationPresent) localPreflightProblems.push("missing_write_confirmation");
  if (!credentialPresence.nextPublicSupabaseUrl) localPreflightProblems.push("missing_next_public_supabase_url");
  if (!credentialPresence.serviceRoleKey) localPreflightProblems.push("missing_service_role_key");
  if (!rollbackDryRunAvailable) localPreflightProblems.push("missing_rollback_dry_run_posture");
  if (candidateInputArtifact === "missing") localPreflightProblems.push("missing_candidate_input_artifact_contract");
  if (candidateInputArtifact !== "missing" && !candidateInputAccepted) {
    localPreflightProblems.push("candidate_input_artifact_contract_invalid");
  }
}

if (executionRequested) {
  problems.push(...localPreflightProblems);
}

const executionResult =
  executionRequested && problems.length === 0
    ? await executeBoundedStagingWrite({
        candidateInput,
        credentialPresence,
        rollbackDryRunCountReady
      })
    : skippedExecution();
problems.push(...executionResult.problems);

const status =
  problems.length === 0 && executionResult.mutations
    ? "ok"
    : problems.length === 0
      ? "ready_for_manual_execution_gate_not_executed"
      : "blocked";

console.log(JSON.stringify(buildOutput({ executionResult, problems, status }), null, 2));

process.exitCode = problems.length === 0 ? 0 : 1;

function parseArgs(tokens) {
  const parsed = {};

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;

    const key = toCamelCase(token.slice(2));
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

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function resolveExpected(parsedArgs) {
  const exact = ATTEMPT_CONTRACTS.find(
    (contract) =>
      parsedArgs.authorizationId === contract.authorizationId &&
      (!parsedArgs.postRunReview || parsedArgs.postRunReview === contract.postRunReview)
  );
  if (exact) return exact;

  const byAuthorization = ATTEMPT_CONTRACTS.find((contract) => parsedArgs.authorizationId === contract.authorizationId);
  if (byAuthorization) return byAuthorization;

  const byPostRunReview = ATTEMPT_CONTRACTS.find((contract) => parsedArgs.postRunReview === contract.postRunReview);
  if (byPostRunReview) return byPostRunReview;

  return ATTEMPT_CONTRACTS[0];
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function loadProcessEnvFromDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const key of DOTENV_LOCAL_ALLOWED_KEYS) {
    if (!process.env[key] && parsed[key]) {
      process.env[key] = parsed[key];
    }
  }
}

function parseDotEnv(text) {
  const parsed = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    parsed[key] = normalizeDotEnvValue(value);
  }
  return parsed;
}

function normalizeDotEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if ((quote === "\"" || quote === "'") && trimmed[trimmed.length - 1] === quote) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function skippedCandidateInputValidation() {
  return {
    accepted: false,
    priceRows: 0,
    runId: null,
    problems: [],
    runRows: 0
  };
}

function validateCandidateInputArtifact(filePath) {
  const validation = {
    accepted: false,
    artifact: null,
    priceRows: 0,
    runId: null,
    problems: [],
    runRows: 0
  };

  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    validation.problems.push("candidate_input_artifact_missing");
    return validation;
  }

  let artifact;
  try {
    artifact = JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch {
    validation.problems.push("candidate_input_artifact_not_valid_json");
    return validation;
  }

  const candidateRun = artifact.candidateRun;
  const candidatePrices = Array.isArray(artifact.candidatePrices) ? artifact.candidatePrices : null;

  if (!EXPECTED.candidateAuthorizationIds.includes(artifact.authorizationId)) {
    validation.problems.push("candidate_authorization_id_mismatch");
  }
  if (artifact.targetRelation !== EXPECTED.target) validation.problems.push("candidate_target_relation_mismatch");
  if (artifact.sourceId !== "twse-stock-day") validation.problems.push("candidate_source_id_mismatch");
  if (!sameArray(artifact.symbols, EXPECTED.symbols.split(","))) validation.problems.push("candidate_symbols_mismatch");
  if (!Number.isInteger(artifact.maxRows) || artifact.maxRows > EXPECTED.maxRows || artifact.maxRows < 1) {
    validation.problems.push("candidate_max_rows_invalid");
  }
  if (artifact.sourcePayloadIncluded !== false) validation.problems.push("candidate_source_payload_must_be_excluded");
  if (artifact.sourceUrlPayloadIncluded !== false) validation.problems.push("candidate_source_url_payload_must_be_excluded");
  if (artifact.secretsIncluded !== false) validation.problems.push("candidate_secrets_must_be_excluded");

  for (const forbiddenKey of ["rawSourcePayload", "sourcePayload", "sourceRows", "rawRows", "sourceUrlPayload", "html", "csv", "secret", "secrets"]) {
    if (Object.hasOwn(artifact, forbiddenKey)) validation.problems.push(`candidate_forbidden_top_level_key_${forbiddenKey}`);
  }

  if (!isObject(candidateRun)) {
    validation.problems.push("candidate_run_missing");
  } else {
    validation.runRows = 1;
    validation.runId = candidateRun.run_id;
    validateCandidateRun(candidateRun, validation.problems);
  }

  if (!candidatePrices) {
    validation.problems.push("candidate_prices_missing");
  } else {
    validation.priceRows = candidatePrices.length;
    if (candidatePrices.length < 1) validation.problems.push("candidate_prices_empty");
    if (candidatePrices.length > EXPECTED.maxRows) validation.problems.push("candidate_price_rows_exceed_max_rows");
    validateCandidatePrices(candidatePrices, candidateRun?.run_id, validation.problems);
  }

  validation.accepted = validation.problems.length === 0;
  validation.artifact = validation.accepted ? artifact : null;
  return validation;
}

function validateCandidateRun(run, validationProblems) {
  const requiredText = [
    "run_id",
    "run_type",
    "source_id",
    "source_url_template",
    "license_url",
    "attribution_text",
    "started_at",
    "finished_at",
    "created_by",
    "review_status",
    "decision"
  ];
  for (const key of requiredText) {
    if (!nonEmptyString(run[key])) validationProblems.push(`candidate_run_${key}_missing`);
  }

  const requiredIntegers = [
    "requested_symbol_count",
    "requested_month_count",
    "successful_month_count",
    "failed_month_count",
    "total_candidate_row_count",
    "duplicate_trade_dates",
    "missing_required_field_count",
    "non_numeric_price_count",
    "non_numeric_volume_amount_count",
    "source_note_count",
    "parser_flag_count"
  ];
  for (const key of requiredIntegers) {
    if (!Number.isInteger(run[key]) || run[key] < 0) validationProblems.push(`candidate_run_${key}_invalid`);
  }

  if (run.run_type !== "staging_candidate") validationProblems.push("candidate_run_type_mismatch");
  if (!isUuid(run.run_id)) validationProblems.push("candidate_run_run_id_must_be_uuid");
  if (run.source_id !== "twse-stock-day") validationProblems.push("candidate_run_source_id_mismatch");
  if (run.requested_symbol_count !== EXPECTED.symbols.split(",").length) validationProblems.push("candidate_run_requested_symbol_count_mismatch");
  if (!["draft", "pending_review"].includes(run.review_status)) validationProblems.push("candidate_run_review_status_not_prewrite_safe");
  if (run.decision !== "ready_for_review") validationProblems.push("candidate_run_decision_mismatch");
  if (!Array.isArray(run.zero_row_months)) validationProblems.push("candidate_run_zero_row_months_must_be_array");
  if (!isObject(run.http_status_summary)) validationProblems.push("candidate_run_http_status_summary_must_be_object");
  if (!isObject(run.rate_limit_policy)) validationProblems.push("candidate_run_rate_limit_policy_must_be_object");
  if (Date.parse(run.finished_at) < Date.parse(run.started_at)) validationProblems.push("candidate_run_finished_before_started");
}

function validateCandidatePrices(prices, runId, validationProblems) {
  const seen = new Set();
  const allowedSymbols = new Set(EXPECTED.symbols.split(","));

  for (const [index, row] of prices.entries()) {
    if (!isObject(row)) {
      validationProblems.push(`candidate_price_${index}_not_object`);
      continue;
    }

    for (const key of ["run_id", "source_id", "exchange_code", "symbol", "trade_date", "source_fetched_at", "source_row_hash"]) {
      if (!nonEmptyString(row[key])) validationProblems.push(`candidate_price_${index}_${key}_missing`);
    }
    for (const key of ["open_price", "high_price", "low_price", "close_price", "volume", "trade_value", "transaction_count"]) {
      if (!nonNegativeNumber(row[key])) validationProblems.push(`candidate_price_${index}_${key}_invalid`);
    }

    if (row.run_id !== runId) validationProblems.push(`candidate_price_${index}_run_id_mismatch`);
    if (!isUuid(row.run_id)) validationProblems.push(`candidate_price_${index}_run_id_must_be_uuid`);
    if (row.source_id !== "twse-stock-day") validationProblems.push(`candidate_price_${index}_source_id_mismatch`);
    if (row.exchange_code !== "TWSE") validationProblems.push(`candidate_price_${index}_exchange_code_mismatch`);
    if (!allowedSymbols.has(row.symbol)) validationProblems.push(`candidate_price_${index}_symbol_not_authorized`);
    if (nonNegativeNumber(row.high_price) && nonNegativeNumber(row.low_price) && row.high_price < row.low_price) {
      validationProblems.push(`candidate_price_${index}_high_lower_than_low`);
    }
    if (row.price_change !== null && row.price_change !== undefined && typeof row.price_change !== "number") {
      validationProblems.push(`candidate_price_${index}_price_change_invalid`);
    }
    if (!Array.isArray(row.quality_flags)) validationProblems.push(`candidate_price_${index}_quality_flags_must_be_array`);

    const uniqueKey = `${row.run_id}|${row.exchange_code}|${row.symbol}|${row.trade_date}`;
    if (seen.has(uniqueKey)) validationProblems.push(`candidate_price_${index}_duplicate_trade_date`);
    seen.add(uniqueKey);
  }
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value)
  );
}

function sameArray(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function nonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function buildWritePreExecutionSummary({
  candidateInputAccepted,
  candidateInputValidation,
  commandContractMatched,
  confirmationPresent,
  credentialPresence,
  rollbackDryRunAvailable,
  rollbackDryRunCountReady
}) {
  const ready =
    commandContractMatched &&
    confirmationPresent &&
    credentialPresence.nextPublicSupabaseUrl &&
    credentialPresence.serviceRoleKey &&
    candidateInputAccepted &&
    rollbackDryRunAvailable &&
    rollbackDryRunCountReady;

  return {
    blockedUntilSeparateWriteImplementation: false,
    candidatePriceRows: candidateInputAccepted ? candidateInputValidation.priceRows : 0,
    candidateRunRows: candidateInputAccepted ? candidateInputValidation.runRows : 0,
    connectionPlanned: ready,
    destructiveRollbackAllowed: false,
    maxRows: EXPECTED.maxRows,
    mutationsPlanned: ready,
    noRetry: true,
    postRunReviewRequired: true,
    publicPromotionAllowed: false,
    ready,
    rollbackScopeRunId: rollbackDryRunCountReady ? candidateInputValidation.runId : null,
    rollbackScopeTargetRelation: rollbackDryRunCountReady ? EXPECTED.target : "not_ready",
    rowCoveragePointsAllowed: false,
    scoreSourcePromotionAllowed: false,
    sqlPlanned: false,
    targetRelation: EXPECTED.target,
    writeImplementationReady: true
  };
}

async function executeBoundedStagingWrite({ candidateInput, credentialPresence, rollbackDryRunCountReady }) {
  const result = {
    connectionAttempted: false,
    executionAttempted: true,
    mutations: false,
    problems: [],
    rollbackDryRunRemotePriceRows: 0,
    rollbackDryRunRemoteRunRows: 0,
    writeAttempted: false,
    writtenPriceRows: 0,
    writtenRunRows: 0
  };

  if (!credentialPresence.nextPublicSupabaseUrl || !credentialPresence.serviceRoleKey || !candidateInput || !rollbackDryRunCountReady) {
    result.problems.push("write_execution_preconditions_not_ready");
    return result;
  }

  const supabase = await createWriteClient(result);

  const runId = candidateInput.candidateRun.run_id;
  const rollbackCounts = await countExistingRowsForRun(supabase, runId);
  result.rollbackDryRunRemoteRunRows = rollbackCounts.runRows;
  result.rollbackDryRunRemotePriceRows = rollbackCounts.priceRows;
  result.problems.push(...rollbackCounts.problems);

  if (rollbackCounts.runRows > 0 || rollbackCounts.priceRows > 0) {
    result.problems.push("rollback_dry_run_scope_not_empty");
  }

  if (result.problems.length > 0) return result;

  result.writeAttempted = true;
  const runInsert = await supabase.from("staging_twse_stock_day_runs").insert([candidateInput.candidateRun]);
  if (runInsert.error) {
    result.problems.push(sanitizeSupabaseError("run_insert_failed", runInsert.error));
    return result;
  }

  const priceInsert = await supabase.from("staging_twse_stock_day_prices").insert(candidateInput.candidatePrices);
  if (priceInsert.error) {
    result.problems.push(sanitizeSupabaseError("price_insert_failed", priceInsert.error));
    return result;
  }

  result.mutations = true;
  result.writtenRunRows = 1;
  result.writtenPriceRows = candidateInput.candidatePrices.length;
  return result;
}

async function createWriteClient(executionResult) {
  if (process.env.TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE === "enabled") {
    return createMockSupabaseClient();
  }

  executionResult.connectionAttempted = true;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });
}

function createMockSupabaseClient() {
  return {
    from(table) {
      return {
        insert(rows) {
          return Promise.resolve({
            data: null,
            error: Array.isArray(rows) && rows.length > 0 ? null : { code: `mock_empty_insert_${table}` }
          });
        },
        select() {
          return {
            eq() {
              return Promise.resolve({
                count: 0,
                data: null,
                error: null
              });
            }
          };
        }
      };
    }
  };
}

async function countExistingRowsForRun(supabase, runId) {
  const problems = [];
  const runCount = await countRowsByRunId(supabase, "staging_twse_stock_day_runs", runId);
  const priceCount = await countRowsByRunId(supabase, "staging_twse_stock_day_prices", runId);

  for (const countResult of [runCount, priceCount]) {
    if (countResult.problem) problems.push(countResult.problem);
  }

  return {
    priceRows: priceCount.count,
    problems,
    runRows: runCount.count
  };
}

async function countRowsByRunId(supabase, table, runId) {
  const { count, error } = await supabase.from(table).select("run_id", {
    count: "exact",
    head: true
  }).eq("run_id", runId);

  if (error) {
    return {
      count: 0,
      problem: sanitizeSupabaseError(`${table}_rollback_count_failed`, error)
    };
  }

  return {
    count: count ?? 0,
    problem: null
  };
}

function sanitizeSupabaseError(prefix, error) {
  const code = typeof error?.code === "string" ? error.code : "unknown";
  return `${prefix}_${code}`;
}

function skippedExecution() {
  return {
    connectionAttempted: false,
    executionAttempted: false,
    mutations: false,
    problems: [],
    rollbackDryRunRemotePriceRows: 0,
    rollbackDryRunRemoteRunRows: 0,
    writeAttempted: false,
    writtenPriceRows: 0,
    writtenRunRows: 0
  };
}

function buildOutput({ executionResult, problems, status }) {
  return {
    authorizationId: args.authorizationId ?? "missing",
    canAwardRowCoveragePoints: false,
    canClaimRealDataLive: false,
    canPromotePublicSource: false,
    canSetScoreSourceReal: false,
    candidateInputAccepted,
    candidateInputArtifact,
    candidateInputPriceRows: candidateInputValidation.priceRows,
    candidateInputRunRows: candidateInputValidation.runRows,
    connectionAttempted: executionResult.connectionAttempted,
    confirmationPresent,
    credentialPresence,
    exactCommandMatched: commandContractMatched,
    executionAttempted: executionResult.executionAttempted,
    executionRequested,
    filesWritten: false,
    lane: args.lane ?? "missing",
    marketDataFetched: false,
    marketDataIngested: false,
    maxRows: Number(args.maxRows) || 0,
    mode: "tw_equity_staging_write_fail_closed_write_capable_runner",
    mockSupabaseUsed: process.env.TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE === "enabled",
    mutations: executionResult.mutations,
    postRunReview: args.postRunReview ?? "missing",
    problems,
    publicDataSource: "mock",
    publicRedistributionBlocked: true,
    rollbackDryRunAvailable,
    rollbackDryRunCandidatePriceRows: rollbackDryRunCountReady ? candidateInputValidation.priceRows : 0,
    rollbackDryRunCandidateRunRows: rollbackDryRunCountReady ? candidateInputValidation.runRows : 0,
    rollbackDryRunCountReady,
    rollbackDryRunRemotePriceRows: executionResult.rollbackDryRunRemotePriceRows,
    rollbackDryRunRemoteRunRows: executionResult.rollbackDryRunRemoteRunRows,
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    sourcePayloadsPrinted: false,
    sqlExecuted: false,
    status,
    symbols: args.symbols ? args.symbols.split(",") : [],
    targetRelation: args.target ?? "missing",
    writeAttempted: executionResult.writeAttempted,
    writeImplementationReady: true,
    writePreExecutionSummary,
    writePreExecutionSummaryReady: writePreExecutionSummary.ready,
    writtenPriceRows: executionResult.writtenPriceRows,
    writtenRunRows: executionResult.writtenRunRows
  };
}
