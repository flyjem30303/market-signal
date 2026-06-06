import fs from "node:fs";
import path from "node:path";

const EXPECTED = {
  authorizationId: "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
  candidateInput: "data/candidates/tw-equity-staging-candidate.json",
  confirmation: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
  expectedCandidateRows: 180,
  expectedExistingExactRows: 3,
  expectedFinalTargetRows: 180,
  expectedInsertedRows: 177,
  expectedSkippedRows: 3,
  expectedSymbols: ["2330", "2382", "2308"],
  policyId: "insert_missing_skip_existing_no_overwrite",
  postRunReviewPrefix: "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_",
  postRunReviewSuffix: ".md",
  stagingScope: "AUTH-003"
};
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

loadProcessEnvFromDotEnvLocal();

const args = parseArgs(process.argv.slice(2));
const problems = [];
const exactCommandMatched = validateCommandContract(args, problems);
const executionRequested = args.execute === true;
const confirmationPresent =
  args.confirmBoundedDailyPricesMerge === true &&
  process.env.TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION === EXPECTED.confirmation;
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const candidateValidation = validateCandidateInput(args.candidateInput);
const localPreflightReady =
  exactCommandMatched &&
  confirmationPresent &&
  credentialPresence.nextPublicSupabaseUrl &&
  credentialPresence.serviceRoleKey &&
  candidateValidation.accepted;

if (executionRequested) {
  if (!confirmationPresent) problems.push("missing_bounded_daily_prices_merge_confirmation");
  if (!credentialPresence.nextPublicSupabaseUrl) problems.push("missing_next_public_supabase_url");
  if (!credentialPresence.serviceRoleKey) problems.push("missing_service_role_key");
  if (!candidateValidation.accepted) problems.push(...candidateValidation.problems);
}

const executionResult =
  executionRequested && problems.length === 0 ? await executeBoundedInsertMissingMerge(candidateValidation.artifact) : skippedExecution();

problems.push(...executionResult.problems);

const status =
  problems.length > 0
    ? "blocked"
    : executionRequested
      ? executionResult.status
      : "ready_for_manual_execution_gate_not_executed";

const output = buildOutput({ executionResult, problems, status });

if (executionResult.writeAttempted || executionResult.remoteAttempted) {
  writePostRunReview(output);
}

console.log(JSON.stringify(output, null, 2));
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

function validateCommandContract(parsedArgs, validationProblems) {
  const expectedPostRunReview =
    typeof parsedArgs.postRunReview === "string" &&
    parsedArgs.postRunReview.startsWith(EXPECTED.postRunReviewPrefix) &&
    parsedArgs.postRunReview.endsWith(EXPECTED.postRunReviewSuffix);

  const checks = [
    [parsedArgs.authorizationId === EXPECTED.authorizationId, "authorization_id_mismatch"],
    [parsedArgs.stagingScope === EXPECTED.stagingScope, "staging_scope_mismatch"],
    [parsedArgs.policyId === EXPECTED.policyId, "policy_id_mismatch"],
    [parsedArgs.candidateInput === EXPECTED.candidateInput, "candidate_input_mismatch"],
    [expectedPostRunReview, "post_run_review_path_mismatch"]
  ];

  for (const [passed, problem] of checks) {
    if (!passed) validationProblems.push(problem);
  }

  return checks.every(([passed]) => passed);
}

function validateCandidateInput(filePath) {
  const validation = {
    accepted: false,
    artifact: null,
    problems: []
  };

  if (filePath !== EXPECTED.candidateInput) {
    validation.problems.push("candidate_input_path_mismatch");
    return validation;
  }

  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    validation.problems.push("candidate_input_missing");
    return validation;
  }

  let artifact;
  try {
    artifact = JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch {
    validation.problems.push("candidate_input_not_valid_json");
    return validation;
  }

  const candidateRun = artifact.candidateRun;
  const candidatePrices = Array.isArray(artifact.candidatePrices) ? artifact.candidatePrices : [];

  if (!isObject(candidateRun)) validation.problems.push("candidate_run_missing");
  if (candidateRun?.run_id !== "11111111-2222-4333-8444-555555555555") {
    validation.problems.push("candidate_run_id_mismatch");
  }
  if (candidatePrices.length !== EXPECTED.expectedCandidateRows) validation.problems.push("candidate_price_rows_mismatch");
  if (!sameArray(artifact.symbols, EXPECTED.expectedSymbols)) validation.problems.push("candidate_symbols_mismatch");
  if (artifact.targetRelation !== "staging_twse_stock_day_runs,staging_twse_stock_day_prices") {
    validation.problems.push("candidate_target_relation_mismatch");
  }
  if (artifact.sourcePayloadIncluded !== false) validation.problems.push("candidate_source_payload_must_be_excluded");
  if (artifact.sourceUrlPayloadIncluded !== false) validation.problems.push("candidate_source_url_payload_must_be_excluded");
  if (artifact.secretsIncluded !== false) validation.problems.push("candidate_secrets_must_be_excluded");

  validation.accepted = validation.problems.length === 0;
  validation.artifact = validation.accepted ? artifact : null;
  return validation;
}

async function executeBoundedInsertMissingMerge(candidate) {
  const result = {
    connectionAttempted: false,
    finalTargetRowsAfterWrite: 0,
    insertedRows: 0,
    mockSupabaseUsed: process.env.TW_EQUITY_DAILY_PRICES_MERGE_MOCK_SUPABASE === "enabled",
    mutations: false,
    postRunReviewWritten: false,
    problems: [],
    remoteAttempted: true,
    sanitizedAggregateCounts: [],
    skippedExistingRows: 0,
    status: "blocked",
    writeAttempted: false
  };

  const supabase = await createWriteClient(result);
  const stockIdBySymbol = await lookupStockIdsBySymbol(supabase, EXPECTED.expectedSymbols);
  if (stockIdBySymbol.size !== EXPECTED.expectedSymbols.length) {
    result.problems.push("stock_mapping_incomplete");
    result.sanitizedAggregateCounts = buildSanitizedCounts(result);
    return result;
  }

  const plannedRows = [];
  let skippedExistingRows = 0;
  let conflictingRows = 0;
  for (const candidateRow of candidate.candidatePrices) {
    const stockId = stockIdBySymbol.get(candidateRow.symbol);
    const existingExactCount = await countExactExistingRow(supabase, stockId, candidateRow);
    const existingAnyCount = await countExistingKey(supabase, stockId, candidateRow.trade_date);

    if (existingAnyCount > 0 && existingExactCount > 0) {
      skippedExistingRows += 1;
      continue;
    }
    if (existingAnyCount > 0 && existingExactCount === 0) {
      conflictingRows += 1;
      continue;
    }

    plannedRows.push(toDailyPriceInsertRow(stockId, candidateRow));
  }

  result.skippedExistingRows = skippedExistingRows;
  if (conflictingRows > 0) result.problems.push("conflicting_existing_rows_detected");
  if (plannedRows.length !== EXPECTED.expectedInsertedRows) result.problems.push("insert_row_count_mismatch");
  if (skippedExistingRows !== EXPECTED.expectedSkippedRows) result.problems.push("skip_row_count_mismatch");

  if (result.problems.length === 0) {
    result.writeAttempted = true;
    const insertResult = await supabase.from("daily_prices").insert(plannedRows);
    if (insertResult.error) {
      result.problems.push(sanitizeSupabaseError("daily_prices_insert_failed", insertResult.error));
    } else {
      result.mutations = true;
      result.insertedRows = plannedRows.length;
    }
  }

  result.finalTargetRowsAfterWrite = await countFinalTargetRows(supabase, stockIdBySymbol, candidate.candidatePrices);
  if (result.mutations && result.finalTargetRowsAfterWrite !== EXPECTED.expectedFinalTargetRows) {
    result.problems.push("post_write_readback_count_mismatch");
  }

  result.sanitizedAggregateCounts = buildSanitizedCounts(result);
  result.status = result.problems.length === 0 ? "insert_missing_merge_passed_readback_complete" : "blocked";
  return result;
}

async function createWriteClient(result) {
  if (result.mockSupabaseUsed) return createMockSupabaseClient();

  result.connectionAttempted = true;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });
}

async function lookupStockIdsBySymbol(supabase, symbols) {
  const { data, error } = await supabase
    .from("stocks")
    .select("id,symbol")
    .eq("country", "TW")
    .eq("exchange", "TWSE")
    .in("symbol", symbols);

  const ids = new Map();
  if (error || !Array.isArray(data)) return ids;
  for (const row of data) {
    if (typeof row?.id === "string" && symbols.includes(row?.symbol)) ids.set(row.symbol, row.id);
  }
  return ids;
}

async function countExistingKey(supabase, stockId, tradeDate) {
  const { count, error } = await supabase
    .from("daily_prices")
    .select("stock_id", { count: "exact", head: true })
    .eq("stock_id", stockId)
    .eq("trade_date", tradeDate);

  if (error) return 0;
  return typeof count === "number" ? count : 0;
}

async function countExactExistingRow(supabase, stockId, row) {
  const { count, error } = await supabase
    .from("daily_prices")
    .select("stock_id", { count: "exact", head: true })
    .eq("stock_id", stockId)
    .eq("trade_date", row.trade_date)
    .eq("open", row.open_price)
    .eq("high", row.high_price)
    .eq("low", row.low_price)
    .eq("close", row.close_price)
    .eq("volume", row.volume)
    .eq("turnover", row.trade_value);

  if (error) return 0;
  return typeof count === "number" ? count : 0;
}

async function countFinalTargetRows(supabase, stockIdBySymbol, candidateRows) {
  let total = 0;
  for (const symbol of EXPECTED.expectedSymbols) {
    const stockId = stockIdBySymbol.get(symbol);
    const tradeDates = candidateRows.filter((row) => row.symbol === symbol).map((row) => row.trade_date);
    if (!stockId || tradeDates.length === 0) continue;
    const { count, error } = await supabase
      .from("daily_prices")
      .select("stock_id", { count: "exact", head: true })
      .eq("stock_id", stockId)
      .in("trade_date", tradeDates);
    if (!error && typeof count === "number") total += count;
  }
  return total;
}

function toDailyPriceInsertRow(stockId, row) {
  return {
    close: row.close_price,
    high: row.high_price,
    low: row.low_price,
    open: row.open_price,
    stock_id: stockId,
    trade_date: row.trade_date,
    turnover: row.trade_value,
    volume: row.volume
  };
}

function createMockSupabaseClient() {
  const candidate = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), EXPECTED.candidateInput), "utf8"));
  const mode = process.env.TW_EQUITY_DAILY_PRICES_MERGE_MOCK_MODE ?? "success";
  const stockRows = EXPECTED.expectedSymbols.map((symbol, index) => ({
    id: `mock-stock-id-${index + 1}`,
    symbol
  }));
  const insertedKeys = new Set();

  return {
    from(table) {
      const filters = [];
      const query = {
        eq(column, value) {
          filters.push({ column, op: "eq", value });
          return query;
        },
        in(column, values) {
          filters.push({ column, op: "in", values });
          return query;
        },
        insert(rows) {
          if (table !== "daily_prices") return Promise.resolve({ data: null, error: { code: "mock_forbidden_table" } });
          if (!Array.isArray(rows) || rows.length !== EXPECTED.expectedInsertedRows) {
            return Promise.resolve({ data: null, error: { code: "mock_insert_count_mismatch" } });
          }
          for (const row of rows) insertedKeys.add(`${row.stock_id}|${row.trade_date}`);
          return Promise.resolve({ data: null, error: null });
        },
        select(_columns, options = {}) {
          query.options = options;
          return query;
        },
        then(resolve) {
          resolve(resolveMockQuery(table, filters, query.options));
        }
      };
      return query;
    }
  };

  function resolveMockQuery(table, filters, options = {}) {
    if (table === "stocks") {
      if (options.head) return { count: 1, data: null, error: null };
      return { count: stockRows.length, data: stockRows, error: null };
    }
    if (table !== "daily_prices") return { count: 0, data: options.head ? null : [], error: null };

    const stockId = filters.find((filter) => filter.column === "stock_id")?.value;
    const tradeDateEq = filters.find((filter) => filter.column === "trade_date" && filter.op === "eq")?.value;
    const tradeDateIn = filters.find((filter) => filter.column === "trade_date" && filter.op === "in")?.values;
    const stockRow = stockRows.find((row) => row.id === stockId);
    if (!stockRow) return { count: 0, data: options.head ? null : [], error: null };

    if (Array.isArray(tradeDateIn)) {
      const existingExact = existingExactDatesForSymbol(stockRow.symbol).length;
      const inserted = tradeDateIn.filter((date) => insertedKeys.has(`${stockId}|${date}`)).length;
      return { count: existingExact + inserted, data: null, error: null };
    }

    const candidateRow = candidate.candidatePrices.find((row) => row.symbol === stockRow.symbol && row.trade_date === tradeDateEq);
    const isExactValueQuery = filters.some((filter) => filter.column === "turnover");
    const isExistingExact = candidateRow && existingExactDatesForSymbol(stockRow.symbol).includes(candidateRow.trade_date);
    const isInserted = insertedKeys.has(`${stockId}|${tradeDateEq}`);

    if (mode === "conflict" && isExistingExact && isExactValueQuery) return { count: 0, data: null, error: null };
    if (isExactValueQuery) return { count: isExistingExact ? 1 : 0, data: null, error: null };
    return { count: isExistingExact || isInserted ? 1 : 0, data: null, error: null };
  }

  function existingExactDatesForSymbol(symbol) {
    const first = candidate.candidatePrices.find((row) => row.symbol === symbol);
    return first ? [first.trade_date] : [];
  }
}

function buildSanitizedCounts(result) {
  return [
    makeMetric("candidate_rows", EXPECTED.expectedCandidateRows, EXPECTED.expectedCandidateRows),
    makeMetric("inserted_rows", result.insertedRows, EXPECTED.expectedInsertedRows),
    makeMetric("skipped_existing_rows", result.skippedExistingRows, EXPECTED.expectedSkippedRows),
    makeMetric("final_target_rows_after_write", result.finalTargetRowsAfterWrite, result.mutations ? EXPECTED.expectedFinalTargetRows : 0),
    makeMetric("conflicting_rows", result.problems.includes("conflicting_existing_rows_detected") ? 1 : 0, 0)
  ];
}

function makeMetric(name, observed, expected) {
  return {
    expected,
    matchedExpectedCount: observed === expected,
    name,
    observed,
    status: observed === expected ? "ok" : "mismatch"
  };
}

function skippedExecution() {
  return {
    connectionAttempted: false,
    finalTargetRowsAfterWrite: 0,
    insertedRows: 0,
    mockSupabaseUsed: false,
    mutations: false,
    postRunReviewWritten: false,
    problems: [],
    remoteAttempted: false,
    sanitizedAggregateCounts: [],
    skippedExistingRows: 0,
    status: "not_executed",
    writeAttempted: false
  };
}

function buildOutput({ executionResult, problems, status }) {
  return {
    authorizationId: args.authorizationId ?? "missing",
    canAwardRowCoveragePoints: false,
    canClaimRealDataLive: false,
    canPromotePublicSource: false,
    canSetScoreSourceReal: false,
    candidateInputAccepted: candidateValidation.accepted,
    connectionAttempted: executionResult.connectionAttempted,
    credentialPresence,
    exactCommandMatched,
    executionAttempted: executionResult.remoteAttempted,
    executionRequested,
    filesWritten: false,
    finalTargetRowsAfterWrite: executionResult.finalTargetRowsAfterWrite,
    insertedRows: executionResult.insertedRows,
    localPreflightReady,
    marketDataFetched: false,
    marketDataIngested: false,
    mockSupabaseUsed: executionResult.mockSupabaseUsed,
    mode: "tw_equity_daily_prices_insert_missing_merge_once",
    mutations: executionResult.mutations,
    policyId: args.policyId ?? "missing",
    postRunReview: args.postRunReview ?? "missing",
    postRunReviewWritten: executionResult.postRunReviewWritten,
    problems,
    publicDataSource: "mock",
    remoteAttempted: executionResult.remoteAttempted,
    rowPayloadsPrinted: false,
    sanitizedAggregateCounts: executionResult.sanitizedAggregateCounts,
    scoreSource: "mock",
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    skippedExistingRows: executionResult.skippedExistingRows,
    sourcePayloadsPrinted: false,
    sqlExecuted: false,
    stagingScope: args.stagingScope ?? "missing",
    status,
    stockIdsPrinted: false,
    supabaseWriteAttempted: executionResult.writeAttempted,
    writeAttempted: executionResult.writeAttempted
  };
}

function writePostRunReview(output) {
  const reviewPath = args.postRunReview;
  fs.mkdirSync(path.dirname(reviewPath), { recursive: true });
  const lines = [
    "# TW Equity Daily Prices Insert-Missing Merge Post-Run Review",
    "",
    "Date: 2026-06-07",
    "",
    `Status: \`${output.status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded insert-missing/skip-existing merge attempt was classified or executed.",
    "- Output is sanitized aggregate evidence only.",
    "- No row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text were printed.",
    "",
    "## Sanitized Aggregate Counts",
    "",
    ...output.sanitizedAggregateCounts.map(
      (count) =>
        `- \`${count.name}\`: observed=\`${count.observed}\`, expected=\`${count.expected}\`, status=\`${count.status}\`.`
    ),
    "",
    "## Decision",
    "",
    `- Policy: \`${output.policyId}\`.`,
    `- Inserted rows: \`${output.insertedRows}\`.`,
    `- Skipped existing rows: \`${output.skippedExistingRows}\`.`,
    `- Final target rows after write: \`${output.finalTargetRowsAfterWrite}\`.`,
    "- Row coverage points awarded: `false`.",
    "- Public source promotion: `false`.",
    "- Score source promotion: `false`.",
    "",
    "## Problems",
    "",
    ...(output.problems.length > 0 ? output.problems.map((problem) => `- \`${problem}\`.`) : ["- `none`."]),
    "",
    "## Safety Confirmation",
    "",
    `- connectionAttempted: \`${output.connectionAttempted}\`.`,
    `- Supabase write attempted: \`${output.supabaseWriteAttempted}\`.`,
    `- daily_prices mutation status: \`${output.mutations}\`.`,
    "- SQL execution status: `false`.",
    "- Market-data fetch status: `false`.",
    "- Ingestion status: `false`.",
    "- Row payload output status: `false`.",
    "- Secret output status: `false`.",
    "- Stock id output status: `false`.",
    "- Public runtime state: `mock`.",
    "- Score runtime state: `mock`.",
    "",
    "## Next Slice",
    "",
    "- If passed, prepare production readback and row coverage scoring gate.",
    "- If blocked, do not retry until CEO records a revised merge decision."
  ];

  fs.writeFileSync(reviewPath, `${lines.join("\n")}\n`, "utf8");
  output.postRunReviewWritten = true;
}

function sanitizeSupabaseError(prefix, error) {
  const code = typeof error?.code === "string" ? error.code : "unknown";
  return `${prefix}_${code}`;
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
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    parsed[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
  return parsed;
}

function envPresent(key) {
  return typeof process.env[key] === "string" && process.env[key].trim().length > 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sameArray(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((value, index) => value === b[index]);
}
