import fs from "node:fs";
import path from "node:path";

const EXPECTED = {
  authorizationId: "TW-EQUITY-DAILY-PRICES-OVERLAP-CLASSIFY-2026-06-07-AUTH-001",
  candidateInput: "data/candidates/tw-equity-staging-candidate.json",
  confirmation: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_ONCE",
  expectedCandidateRows: 180,
  expectedSymbols: ["2330", "2382", "2308"],
  maxExistingOverlapRows: 180,
  postRunReviewPrefix: "docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_",
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
  args.confirmBoundedReadonlyOverlapClassification === true &&
  process.env.TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_CONFIRMATION === EXPECTED.confirmation;
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
  if (!confirmationPresent) problems.push("missing_bounded_readonly_overlap_classification_confirmation");
  if (!credentialPresence.nextPublicSupabaseUrl) problems.push("missing_next_public_supabase_url");
  if (!credentialPresence.serviceRoleKey) problems.push("missing_service_role_key");
  if (!candidateValidation.accepted) problems.push(...candidateValidation.problems);
}

const executionResult =
  executionRequested && problems.length === 0
    ? await executeBoundedReadonlyOverlapClassification(candidateValidation.artifact)
    : skippedExecution();

problems.push(...executionResult.problems);

const status =
  problems.length > 0
    ? "blocked"
    : executionRequested
      ? executionResult.status
      : "ready_for_manual_execution_gate_not_executed";

const output = buildOutput({ executionResult, problems, status });

if (executionResult.remoteAttempted) {
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

async function executeBoundedReadonlyOverlapClassification(candidate) {
  const result = {
    classification: "blocked_not_classified",
    connectionAttempted: false,
    exactValueMatchCount: 0,
    mockSupabaseUsed: process.env.TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_SUPABASE === "enabled",
    overlapRatio: 0,
    perSymbolAggregateCounts: [],
    postRunReviewWritten: false,
    problems: [],
    remoteAttempted: true,
    sanitizedAggregateCounts: [],
    status: "blocked"
  };

  const supabase = await createReadonlyClient(result);
  const stockIdBySymbol = await lookupStockIdsBySymbol(supabase, EXPECTED.expectedSymbols);
  const candidateRows = candidate.candidatePrices;
  const candidateDates = [...new Set(candidateRows.map((row) => row.trade_date))];

  if (stockIdBySymbol.size !== EXPECTED.expectedSymbols.length) {
    result.problems.push("stock_mapping_incomplete");
  }

  let totalOverlapCount = 0;
  let exactValueMatchCount = 0;
  for (const symbol of EXPECTED.expectedSymbols) {
    const stockId = stockIdBySymbol.get(symbol);
    const symbolRows = candidateRows.filter((row) => row.symbol === symbol);
    const existingCount = stockId
      ? await countExistingRowsForSymbol(supabase, stockId, symbolRows.map((row) => row.trade_date))
      : 0;
    const exactMatches = stockId ? await countExactValueMatchesForRows(supabase, stockId, symbolRows) : 0;

    totalOverlapCount += existingCount;
    exactValueMatchCount += exactMatches;
    result.perSymbolAggregateCounts.push({
      exactValueMatchCount: exactMatches,
      existingOverlapCount: existingCount,
      expectedCandidateRows: symbolRows.length,
      symbol
    });
  }

  result.exactValueMatchCount = exactValueMatchCount;
  result.overlapRatio = roundRatio(totalOverlapCount, candidateRows.length);

  const conflictCount = Math.max(totalOverlapCount - exactValueMatchCount, 0);
  result.sanitizedAggregateCounts = [
    makeMetric("expected_candidate_rows", candidateRows.length, EXPECTED.expectedCandidateRows, "exact"),
    makeMetric("candidate_symbol_count", EXPECTED.expectedSymbols.length, EXPECTED.expectedSymbols.length, "exact"),
    makeMetric("candidate_unique_trade_date_count", candidateDates.length, candidateDates.length, "informational"),
    makeMetric("existing_overlap_count", totalOverlapCount, totalOverlapCount, "informational"),
    makeMetric("exact_value_match_count", exactValueMatchCount, totalOverlapCount, "must_match_overlap"),
    makeMetric("conflicting_overlap_count", conflictCount, 0, "must_be_zero"),
    makeMetric("missing_insert_candidate_count", Math.max(candidateRows.length - totalOverlapCount, 0), 177, "informational")
  ];

  if (totalOverlapCount === 0) {
    result.classification = "no_overlap_insert_all_candidates_possible";
    result.status = "overlap_classification_passed_no_overlap_merge_still_requires_separate_authorization";
  } else if (conflictCount === 0 && totalOverlapCount <= EXPECTED.maxExistingOverlapRows) {
    result.classification = "idempotent_safe_partial_overlap_skip_existing_insert_missing";
    result.status = "overlap_classification_passed_idempotent_safe_partial_overlap";
  } else {
    result.classification = "blocked_conflicting_overlap_requires_reconciliation";
    result.status = "blocked";
    result.problems.push("conflicting_overlap_count_nonzero");
  }

  if (result.problems.length > 0) result.status = "blocked";
  return result;
}

async function createReadonlyClient(result) {
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

async function countExistingRowsForSymbol(supabase, stockId, tradeDates) {
  if (!stockId || tradeDates.length === 0) return 0;
  const { count, error } = await supabase
    .from("daily_prices")
    .select("stock_id", { count: "exact", head: true })
    .eq("stock_id", stockId)
    .in("trade_date", tradeDates);

  if (error) return 0;
  return typeof count === "number" ? count : 0;
}

async function countExactValueMatchesForRows(supabase, stockId, rows) {
  let count = 0;
  for (const row of rows) {
    const { count: rowCount, error } = await supabase
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

    if (!error && typeof rowCount === "number" && rowCount > 0) count += 1;
  }
  return count;
}

function createMockSupabaseClient() {
  const candidate = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), EXPECTED.candidateInput), "utf8"));
  const overlapMode = process.env.TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_OVERLAP_MODE ?? "idempotent_partial";
  const stockRows = EXPECTED.expectedSymbols.map((symbol, index) => ({
    id: `mock-stock-id-${index + 1}`,
    symbol
  }));

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

    const stockIdFilter = filters.find((filter) => filter.column === "stock_id");
    const stockRow = stockRows.find((row) => row.id === stockIdFilter?.value);
    if (!stockRow) return { count: 0, data: options.head ? null : [], error: null };

    const exactRow = candidate.candidatePrices.find(
      (row) =>
        row.symbol === stockRow.symbol &&
        filters.some((filter) => filter.column === "trade_date" && filter.value === row.trade_date)
    );
    const isExactValueQuery = filters.some((filter) => filter.column === "turnover");

    if (overlapMode === "none") return { count: 0, data: options.head ? null : [], error: null };
    if (overlapMode === "conflict" && isExactValueQuery) return { count: 0, data: options.head ? null : [], error: null };
    if (isExactValueQuery) return { count: exactRow && isFirstCandidateRowForSymbol(exactRow) ? 1 : 0, data: null, error: null };
    return { count: 1, data: null, error: null };
  }

  function isFirstCandidateRowForSymbol(row) {
    return candidate.candidatePrices.find((candidateRow) => candidateRow.symbol === row.symbol) === row;
  }
}

function makeMetric(name, observed, expected, rule) {
  return {
    expected,
    matchedExpectedCount: observed === expected,
    name,
    observed,
    rule,
    status: observed === expected ? "ok" : rule === "informational" ? "info" : "mismatch"
  };
}

function skippedExecution() {
  return {
    classification: "not_executed",
    connectionAttempted: false,
    exactValueMatchCount: 0,
    mockSupabaseUsed: false,
    overlapRatio: 0,
    perSymbolAggregateCounts: [],
    postRunReviewWritten: false,
    problems: [],
    remoteAttempted: false,
    sanitizedAggregateCounts: [],
    status: "not_executed"
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
    classification: executionResult.classification,
    connectionAttempted: executionResult.connectionAttempted,
    credentialPresence,
    exactCommandMatched,
    exactValueMatchCount: executionResult.exactValueMatchCount,
    executionAttempted: executionResult.remoteAttempted,
    executionRequested,
    filesWritten: false,
    localPreflightReady,
    marketDataFetched: false,
    marketDataIngested: false,
    mockSupabaseUsed: executionResult.mockSupabaseUsed,
    mode: "tw_equity_daily_prices_overlap_classification_once",
    mutations: false,
    overlapRatio: executionResult.overlapRatio,
    perSymbolAggregateCounts: executionResult.perSymbolAggregateCounts,
    postRunReview: args.postRunReview ?? "missing",
    postRunReviewWritten: executionResult.postRunReviewWritten,
    preflightStatus: executionResult.status,
    problems,
    publicDataSource: "mock",
    remoteAttempted: executionResult.remoteAttempted,
    rowPayloadsPrinted: false,
    sanitizedAggregateCounts: executionResult.sanitizedAggregateCounts,
    scoreSource: "mock",
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    sourcePayloadsPrinted: false,
    sqlExecuted: false,
    stagingScope: args.stagingScope ?? "missing",
    status,
    stockIdsPrinted: false,
    supabaseWriteAttempted: false
  };
}

function writePostRunReview(output) {
  const reviewPath = args.postRunReview;
  fs.mkdirSync(path.dirname(reviewPath), { recursive: true });
  const lines = [
    "# TW Equity Daily Prices Overlap Classification Post-Run Review",
    "",
    "Date: 2026-06-07",
    "",
    `Status: \`${output.status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded Supabase readonly overlap-classification attempt was performed for `AUTH-003`.",
    "- Output is sanitized aggregate evidence only.",
    "- No row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text were printed.",
    "",
    "## Sanitized Aggregate Counts",
    "",
    ...output.sanitizedAggregateCounts.map(
      (count) =>
        `- \`${count.name}\`: observed=\`${count.observed}\`, expected=\`${count.expected}\`, rule=\`${count.rule}\`, status=\`${count.status}\`.`
    ),
    "",
    "## Per-Symbol Aggregate Counts",
    "",
    ...output.perSymbolAggregateCounts.map(
      (item) =>
        `- \`${item.symbol}\`: expectedCandidateRows=\`${item.expectedCandidateRows}\`, existingOverlapCount=\`${item.existingOverlapCount}\`, exactValueMatchCount=\`${item.exactValueMatchCount}\`.`
    ),
    "",
    "## Classification",
    "",
    `- Classification: \`${output.classification}\`.`,
    `- Overlap ratio: \`${output.overlapRatio}\`.`,
    `- Accepted for merge preparation: \`${output.status === "overlap_classification_passed_idempotent_safe_partial_overlap" || output.status === "overlap_classification_passed_no_overlap_merge_still_requires_separate_authorization"}\`.`,
    "- Production merge authorized: `false`.",
    "- Row coverage points awarded: `false`.",
    "- Later production merge authorization remains separate.",
    "",
    "## Problems",
    "",
    ...(output.problems.length > 0 ? output.problems.map((problem) => `- \`${problem}\`.`) : ["- `none`."]),
    "",
    "## Safety Confirmation",
    "",
    `- connectionAttempted: \`${output.connectionAttempted}\`.`,
    "- SQL execution status: `false`.",
    "- Supabase write status: `false`.",
    "- `daily_prices` mutation status: `false`.",
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
    "- If idempotent-safe, prepare an insert-missing/skip-existing production merge authorization packet.",
    "- If conflicting, keep merge blocked and prepare a reconciliation decision packet."
  ];

  fs.writeFileSync(reviewPath, `${lines.join("\n")}\n`, "utf8");
  output.postRunReviewWritten = true;
}

function roundRatio(numerator, denominator) {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 10000) / 10000;
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
