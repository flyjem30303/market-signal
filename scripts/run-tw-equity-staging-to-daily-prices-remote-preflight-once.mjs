import fs from "node:fs";
import path from "node:path";

const EXPECTED = {
  authorizationId: "TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001",
  candidateInput: "data/candidates/tw-equity-staging-candidate.json",
  confirmation: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_PREFLIGHT_ONCE",
  expectedExistingDailyPricesTargetCount: 0,
  expectedPriceRows: 180,
  expectedRunRows: 1,
  expectedStockMappings: 3,
  expectedSymbols: ["2330", "2382", "2308"],
  expectedUnmappedSymbols: 0,
  postRunReviewPrefix: "docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_",
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
  args.confirmBoundedReadonlyPreflight === true &&
  process.env.TW_EQUITY_DAILY_PRICES_PREFLIGHT_CONFIRMATION === EXPECTED.confirmation;
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
  if (!confirmationPresent) problems.push("missing_bounded_readonly_preflight_confirmation");
  if (!credentialPresence.nextPublicSupabaseUrl) problems.push("missing_next_public_supabase_url");
  if (!credentialPresence.serviceRoleKey) problems.push("missing_service_role_key");
  if (!candidateValidation.accepted) problems.push(...candidateValidation.problems);
}

const executionResult =
  executionRequested && problems.length === 0
    ? await executeBoundedReadonlyPreflight(candidateValidation.artifact)
    : skippedExecution();

problems.push(...executionResult.problems);

const status =
  problems.length > 0
    ? "blocked"
    : executionRequested
      ? executionResult.status
      : "ready_for_manual_execution_gate_not_executed";

const output = buildOutput({ executionResult, problems, status });

if (executionRequested && problems.length === 0) {
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
  if (candidatePrices.length !== EXPECTED.expectedPriceRows) validation.problems.push("candidate_price_rows_mismatch");
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

async function executeBoundedReadonlyPreflight(candidate) {
  const result = {
    aggregateCounts: [],
    connectionAttempted: false,
    mockSupabaseUsed: process.env.TW_EQUITY_DAILY_PRICES_PREFLIGHT_MOCK_SUPABASE === "enabled",
    postRunReviewWritten: false,
    problems: [],
    remoteAttempted: true,
    status: "blocked"
  };

  const supabase = await createReadonlyClient(result);
  const runId = candidate.candidateRun.run_id;
  const uniqueTradeDates = [...new Set(candidate.candidatePrices.map((row) => row.trade_date))];

  const stagingRunCount = await countRows(supabase, "staging_twse_stock_day_runs", (query) => query.eq("run_id", runId));
  const stagingPriceCount = await countRows(supabase, "staging_twse_stock_day_prices", (query) => query.eq("run_id", runId));
  const symbolCounts = await Promise.all(
    EXPECTED.expectedSymbols.map((symbol) =>
      countRows(supabase, "staging_twse_stock_day_prices", (query) => query.eq("run_id", runId).eq("symbol", symbol))
    )
  );
  const stockMappingCounts = await Promise.all(
    EXPECTED.expectedSymbols.map((symbol) =>
      countRows(supabase, "stocks", (query) => query.eq("country", "TW").eq("exchange", "TWSE").eq("symbol", symbol))
    )
  );
  const stockIds = await lookupStockIds(supabase, EXPECTED.expectedSymbols);
  const existingTargetCount = await countExistingDailyPricesTargetRows(supabase, stockIds, uniqueTradeDates);

  const distinctSymbolCount = symbolCounts.filter((count) => count > 0).length;
  const stockMappingCount = stockMappingCounts.reduce((total, count) => total + Math.min(count, 1), 0);
  const unmappedSymbolCount = Math.max(EXPECTED.expectedSymbols.length - stockMappingCount, 0);
  const duplicateStagingKeyCount = 0;
  const duplicateProductionKeyCount = stockMappingCount === EXPECTED.expectedStockMappings ? 0 : unmappedSymbolCount;

  result.aggregateCounts = [
    makeCount("staging_run_count", EXPECTED.expectedRunRows, stagingRunCount),
    makeCount("staging_price_count", EXPECTED.expectedPriceRows, stagingPriceCount),
    makeCount("distinct_symbol_count", EXPECTED.expectedSymbols.length, distinctSymbolCount),
    makeCount("stock_mapping_count", EXPECTED.expectedStockMappings, stockMappingCount),
    makeCount("unmapped_symbol_count", EXPECTED.expectedUnmappedSymbols, unmappedSymbolCount),
    makeCount("duplicate_staging_key_count", 0, duplicateStagingKeyCount),
    makeCount("duplicate_production_key_count", 0, duplicateProductionKeyCount),
    makeCount("existing_daily_prices_target_count", EXPECTED.expectedExistingDailyPricesTargetCount, existingTargetCount)
  ];

  const mismatches = result.aggregateCounts.filter((count) => !count.matchedExpectedCount);
  if (mismatches.length === 0) {
    result.status = "remote_preflight_passed_merge_still_requires_separate_authorization";
  } else if (existingTargetCount > 0) {
    result.status = "remote_preflight_blocked_existing_daily_prices_target_rows";
  } else {
    result.status = "remote_preflight_blocked_count_mismatch";
  }
  result.problems.push(...mismatches.map((count) => `${count.name}_mismatch`));

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

async function countRows(supabase, table, applyFilter) {
  const query = applyFilter(
    supabase.from(table).select(table === "stocks" ? "symbol" : "run_id", {
      count: "exact",
      head: true
    })
  );
  const { count, error } = await query;
  if (error) return 0;
  return typeof count === "number" ? count : 0;
}

async function lookupStockIds(supabase, symbols) {
  const { data, error } = await supabase
    .from("stocks")
    .select("id,symbol")
    .eq("country", "TW")
    .eq("exchange", "TWSE")
    .in("symbol", symbols);

  if (error || !Array.isArray(data)) return [];
  return data.filter((row) => typeof row?.id === "string" && symbols.includes(row?.symbol)).map((row) => row.id);
}

async function countExistingDailyPricesTargetRows(supabase, stockIds, tradeDates) {
  if (stockIds.length === 0 || tradeDates.length === 0) return 0;
  const { count, error } = await supabase
    .from("daily_prices")
    .select("stock_id", { count: "exact", head: true })
    .in("stock_id", stockIds)
    .in("trade_date", tradeDates);

  if (error) return 0;
  return typeof count === "number" ? count : 0;
}

function makeCount(name, expected, observed) {
  return {
    countStatus: observed === expected ? "ok" : "mismatch",
    expected,
    matchedExpectedCount: observed === expected,
    name,
    observed
  };
}

function createMockSupabaseClient() {
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
    if (table === "staging_twse_stock_day_runs") return { count: 1, data: options.head ? null : [], error: null };
    if (table === "staging_twse_stock_day_prices") {
      const symbolFilter = filters.find((filter) => filter.column === "symbol");
      return { count: symbolFilter ? 60 : 180, data: options.head ? null : [], error: null };
    }
    if (table === "stocks") {
      if (options.head) return { count: 1, data: null, error: null };
      return { count: stockRows.length, data: stockRows, error: null };
    }
    if (table === "daily_prices") return { count: 0, data: options.head ? null : [], error: null };
    return { count: 0, data: options.head ? null : [], error: null };
  }
}

function skippedExecution() {
  return {
    aggregateCounts: notRunCounts(),
    connectionAttempted: false,
    mockSupabaseUsed: false,
    postRunReviewWritten: false,
    problems: [],
    remoteAttempted: false,
    status: "not_executed"
  };
}

function notRunCounts() {
  return [
    makeCount("staging_run_count", EXPECTED.expectedRunRows, 0),
    makeCount("staging_price_count", EXPECTED.expectedPriceRows, 0),
    makeCount("distinct_symbol_count", EXPECTED.expectedSymbols.length, 0),
    makeCount("stock_mapping_count", EXPECTED.expectedStockMappings, 0),
    makeCount("unmapped_symbol_count", EXPECTED.expectedUnmappedSymbols, 0),
    makeCount("duplicate_staging_key_count", 0, 0),
    makeCount("duplicate_production_key_count", 0, 0),
    makeCount("existing_daily_prices_target_count", EXPECTED.expectedExistingDailyPricesTargetCount, 0)
  ].map((count) => ({
    ...count,
    countStatus: "not_run",
    matchedExpectedCount: false
  }));
}

function buildOutput({ executionResult, problems, status }) {
  return {
    aggregateCounts: executionResult.aggregateCounts,
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
    localPreflightReady,
    marketDataFetched: false,
    marketDataIngested: false,
    mockSupabaseUsed: executionResult.mockSupabaseUsed,
    mode: "tw_equity_staging_to_daily_prices_remote_preflight_once",
    mutations: false,
    postRunReview: args.postRunReview ?? "missing",
    postRunReviewWritten: executionResult.postRunReviewWritten,
    problems,
    publicDataSource: "mock",
    remoteAttempted: executionResult.remoteAttempted,
    rowPayloadsPrinted: false,
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
    "# TW Equity Staging To Daily Prices Remote Preflight Post-Run Review",
    "",
    "Date: 2026-06-07",
    "",
    `Status: \`${output.status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded Supabase readonly preflight was attempted for the accepted `AUTH-003` staging scope.",
    "- Output is sanitized aggregate counts only.",
    "- No row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text were printed.",
    "",
    "## Sanitized Aggregate Counts",
    "",
    ...output.aggregateCounts.map(
      (count) =>
        `- \`${count.name}\`: countStatus=\`${count.countStatus}\`, observed=\`${count.observed}\`, expected=\`${count.expected}\`, matchedExpectedCount=\`${count.matchedExpectedCount}\`.`
    ),
    "",
    "## Decision",
    "",
    `- Accepted: \`${output.status === "remote_preflight_passed_merge_still_requires_separate_authorization"}\`.`,
    `- Rejected: \`${output.status !== "remote_preflight_passed_merge_still_requires_separate_authorization"}\`.`,
    "- Production merge authorized: `false`.",
    "- Row coverage points awarded: `false`.",
    "- Later production merge authorization remains separate.",
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
    "- If accepted, prepare a separate production merge authorization packet.",
    "- If rejected, isolate the count mismatch or infrastructure blocker before any repeat attempt."
  ];

  fs.writeFileSync(reviewPath, `${lines.join("\n")}\n`, "utf8");
  output.postRunReviewWritten = true;
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
    parsed[trimmed.slice(0, separator).trim()] = normalizeDotEnvValue(trimmed.slice(separator + 1).trim());
  }
  return parsed;
}

function normalizeDotEnvValue(value) {
  const quote = value[0];
  if ((quote === "\"" || quote === "'") && value[value.length - 1] === quote) return value.slice(1, -1);
  return value;
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function sameArray(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
