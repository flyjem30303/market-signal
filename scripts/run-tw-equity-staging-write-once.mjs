import fs from "node:fs";
import path from "node:path";

const EXPECTED = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  confirmation: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: "2330,2382,2308",
  target: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

loadProcessEnvFromDotEnvLocal();
const args = parseArgs(process.argv.slice(2));
const problems = [];

if (args.authorizationId !== EXPECTED.authorizationId) problems.push("authorization_id_mismatch");
if (args.lane !== EXPECTED.lane) problems.push("lane_mismatch");
if (args.symbols !== EXPECTED.symbols) problems.push("symbols_mismatch");
if (Number(args.sessions) !== EXPECTED.sessions) problems.push("sessions_mismatch");
if (args.target !== EXPECTED.target) problems.push("target_relation_mismatch");
if (Number(args.maxRows) !== EXPECTED.maxRows) problems.push("max_rows_mismatch");
if (args.postRunReview !== EXPECTED.postRunReview) problems.push("post_run_review_mismatch");

const executionRequested = args.execute === "true" || args.execute === true;
const candidateInputArtifact = args.candidateInput ?? "missing";
const candidateInputValidation =
  candidateInputArtifact === "missing" ? skippedCandidateInputValidation() : validateCandidateInputArtifact(candidateInputArtifact);
const candidateInputAccepted = candidateInputValidation.accepted;
const confirmationPresent = process.env.TW_EQUITY_STAGING_WRITE_CONFIRMATION === EXPECTED.confirmation;
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const rollbackDryRunAvailable = args.rollbackDryRun === "true" || args.rollbackDryRun === true;
const rollbackDryRunCountReady = rollbackDryRunAvailable && candidateInputAccepted;
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
  problems.push("runner_skeleton_has_no_supabase_write_implementation");
}

const status = problems.length === 0 ? "ready_for_manual_execution_gate_not_executed" : "blocked";

console.log(
  JSON.stringify(
    {
      authorizationId: args.authorizationId ?? "missing",
      canAwardRowCoveragePoints: false,
      canClaimRealDataLive: false,
      canPromotePublicSource: false,
      canSetScoreSourceReal: false,
      candidateInputAccepted,
      candidateInputArtifact,
      candidateInputPriceRows: candidateInputValidation.priceRows,
      candidateInputRunRows: candidateInputValidation.runRows,
      connectionAttempted: false,
      confirmationPresent,
      credentialPresence,
      exactCommandMatched: problems.length === 0,
      executionAttempted: false,
      executionRequested,
      filesWritten: false,
      lane: args.lane ?? "missing",
      marketDataFetched: false,
      marketDataIngested: false,
      maxRows: Number(args.maxRows) || 0,
      mode: "tw_equity_staging_write_fail_closed_runner_skeleton",
      mutations: false,
      postRunReview: args.postRunReview ?? "missing",
      problems,
      publicDataSource: "mock",
      publicRedistributionBlocked: true,
      rollbackDryRunAvailable,
      rollbackDryRunCandidatePriceRows: rollbackDryRunCountReady ? candidateInputValidation.priceRows : 0,
      rollbackDryRunCandidateRunRows: rollbackDryRunCountReady ? candidateInputValidation.runRows : 0,
      rollbackDryRunCountReady,
      rowPayloadsPrinted: false,
      scoreSource: "mock",
      secretsPrinted: false,
      serviceRoleKeyPrinted: false,
      sourcePayloadsPrinted: false,
      sqlExecuted: false,
      status,
      symbols: args.symbols ? args.symbols.split(",") : [],
      targetRelation: args.target ?? "missing",
      writeImplementationReady: false
    },
    null,
    2
  )
);

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
    problems: [],
    runRows: 0
  };
}

function validateCandidateInputArtifact(filePath) {
  const validation = {
    accepted: false,
    priceRows: 0,
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

  if (artifact.authorizationId !== EXPECTED.authorizationId) validation.problems.push("candidate_authorization_id_mismatch");
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
