import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import ts from "typescript";

const REQUIRED_CONFIRMATION = "CP3_ROW_COVERAGE_READONLY_VALIDATE";
const ALLOWED_SYMBOLS = ["TWII", "0050", "006208", "2330", "2382", "2308"];
const DOTENV_LOCAL_ALLOWED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE"
];
const EXPECTED_SYMBOL_COUNT = 6;
const REQUIRED_TRADING_SESSIONS = 60;
const EXPECTED_TOTAL_ROWS = EXPECTED_SYMBOL_COUNT * REQUIRED_TRADING_SESSIONS;
const root = process.cwd();

if (process.env.ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION !== REQUIRED_CONFIRMATION) {
  printSanitized({
    mode: "row_coverage_guarded_readonly_runner",
    reason: "missing_confirmation",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

loadProcessEnvFromDotEnvLocal();

const { getRowCoverageReadonlyLocalPreflight } = loadTsModule("src/lib/row-coverage-readonly-local-preflight.ts");
const preflight = getRowCoverageReadonlyLocalPreflight(process.env);

if (preflight.status !== "ready_for_guarded_readonly_decision") {
  printSanitized({
    mode: "row_coverage_guarded_readonly_runner",
    preflightStatus: preflight.status,
    reason: "preflight_blocked",
    remoteAttempted: false,
    status: "blocked",
    targetRelation: preflight.targetRelation
  });
  process.exit(1);
}

const remoteResult = await validateRemoteRowCoverage(preflight);
printSanitized(remoteResult);
process.exit(remoteResult.status === "ok" ? 0 : 1);

async function validateRemoteRowCoverage(preflight) {
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
  const counts = [];
  const problems = [];
  const stockIdBySymbol = new Map();

  const { data: stocks, error: stockLookupError } = await client
    .from("stocks")
    .select("id, symbol")
    .in("symbol", ALLOWED_SYMBOLS);

  if (stockLookupError) {
    return {
      calendarStatus: "not_run",
      coverageStatus: "blocked",
      expectedSymbolCount: EXPECTED_SYMBOL_COUNT,
      expectedTotalRows: EXPECTED_TOTAL_ROWS,
      mode: "row_coverage_readonly_remote_validation",
      missingRows: EXPECTED_TOTAL_ROWS,
      observedTotalRows: 0,
      preflightStatus: preflight.status,
      problems: ALLOWED_SYMBOLS.map((symbol) => `${symbol}: stock_mapping_unavailable`),
      reason: "stock_mapping_unavailable",
      remoteAttempted: true,
      requiredTradingSessions: REQUIRED_TRADING_SESSIONS,
      status: "blocked",
      symbolsChecked: [],
      targetRelation: preflight.targetRelation
    };
  }

  for (const stock of stocks ?? []) {
    if (typeof stock?.symbol === "string" && typeof stock?.id === "string" && ALLOWED_SYMBOLS.includes(stock.symbol)) {
      stockIdBySymbol.set(stock.symbol, stock.id);
    }
  }

  for (const symbol of ALLOWED_SYMBOLS) {
    const stockId = stockIdBySymbol.get(symbol);
    if (!stockId) {
      problems.push(`${symbol}: stock_mapping_missing`);
      continue;
    }

    const { count, error } = await client
      .from("daily_prices")
      .select("stock_id", { count: "exact", head: true })
      .eq("stock_id", stockId);

    if (error) {
      problems.push(`${symbol}: count_unavailable`);
      continue;
    }

    counts.push({ count: typeof count === "number" ? count : 0, symbol });
  }

  const observedTotalRows = counts.reduce((total, item) => total + item.count, 0);
  const missingRows = Math.max(EXPECTED_TOTAL_ROWS - observedTotalRows, 0);
  const coverageStatus = problems.length === 0 && missingRows === 0 ? "ok" : "blocked";

  return {
    calendarStatus: "not_run",
    coverageStatus,
    expectedSymbolCount: EXPECTED_SYMBOL_COUNT,
    expectedTotalRows: EXPECTED_TOTAL_ROWS,
    mode: "row_coverage_readonly_remote_validation",
    missingRows,
    observedTotalRows,
    preflightStatus: preflight.status,
    problems,
    reason: coverageStatus === "ok" ? "aggregate_count_complete" : "aggregate_count_incomplete",
    remoteAttempted: true,
    requiredTradingSessions: REQUIRED_TRADING_SESSIONS,
    status: coverageStatus,
    symbolsChecked: counts.map((item) => ({
      observedRows: item.count,
      symbol: item.symbol
    })),
    targetRelation: preflight.targetRelation
  };
}

function printSanitized(payload) {
  console.log(
    JSON.stringify(
      {
        ...payload,
        canAwardRowCoveragePoints: false,
        canClaimCoverage: false,
        canSetScoreSourceReal: false,
        connectionAttempted: payload.remoteAttempted === true,
        filesWritten: false,
        mutations: false,
        publicDataSource: "mock",
        rowPayloadsPrinted: false,
        scoreSource: "mock",
        secretsPrinted: false,
        sqlExecuted: false
      },
      null,
      2
    )
  );
}

function loadProcessEnvFromDotEnvLocal() {
  const envPath = path.join(root, ".env.local");
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
  const quote = value[0];
  if ((quote === "\"" || quote === "'") && value[value.length - 1] === quote) {
    return value.slice(1, -1);
  }
  return value;
}

function loadTsModule(relativePath, cache = new Map()) {
  const absolutePath = path.join(root, relativePath);
  const normalizedPath = path.normalize(relativePath);

  if (cache.has(normalizedPath)) {
    return cache.get(normalizedPath).exports;
  }

  const module = { exports: {} };
  cache.set(normalizedPath, module);
  const sourceText = fs.readFileSync(absolutePath, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: absolutePath
  }).outputText;
  const localRequire = createLocalRequire(relativePath, cache);
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(localRequire, module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (specifier.startsWith("@/")) {
      return loadTsModule(`src/${specifier.slice(2)}.ts`, cache);
    }

    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      const resolved = path.normalize(path.join(baseDirectory, `${specifier}.ts`));
      return loadTsModule(resolved, cache);
    }

    return nativeRequire(specifier);
  };
}
