import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const modulePath = "src/lib/repositories/supabase-market-signal-repository.ts";
const source = fs.readFileSync(path.join(root, modulePath), "utf8");
const { createLoadedSupabaseMarketSignalRepository, createSupabaseMarketSignalRepository } = loadTsModule(modulePath);

const fake = createFakeClient();
const repository = await createLoadedSupabaseMarketSignalRepository(fake.client);
const assets = repository.getAssets();
const asset = repository.getAssetBySymbol("2330");
const snapshot = repository.getSnapshot("2330", "2026-06-15");
const series = repository.getSeries("2330", { startDate: "2026-06-01", endDate: "2026-06-30" });
const backtest = repository.getBacktestBuckets("2330");
const relatedNews = repository.getRelatedNews("2330", "2026-06-15");

const behaviorProblems = [];
if (assets.length !== 1) behaviorProblems.push("expected one mapped asset");
if (asset?.name !== "台積電") behaviorProblems.push("asset name mapping failed");
if (asset?.group !== "半導體") behaviorProblems.push("asset group mapping failed");
if (asset?.type !== "stock") behaviorProblems.push("asset type mapping failed");
if (snapshot?.asset.symbol !== "2330") behaviorProblems.push("snapshot asset mapping failed");
if (snapshot?.signal.title !== "偏多") behaviorProblems.push("signal mapping failed");
if (snapshot?.compositeScore !== 81) behaviorProblems.push("score mapping failed");
if (snapshot?.marketFacts[0]?.value !== "945 元") behaviorProblems.push("price fact mapping failed");
if (series.length !== 1) behaviorProblems.push("series range mapping failed");
if (backtest.length === 0) behaviorProblems.push("backtest buckets should still be available");
if (relatedNews.length !== 0) behaviorProblems.push("Supabase adapter should not synthesize related news");

const expectedCalls = [
  ["from", "stocks"],
  ["select", "asset_type, country, exchange, id, industry, is_etf, name, symbol"],
  ["eq", "country", "TW"],
  ["eq", "exchange", "TWSE"],
  ["eq", "is_active", true],
  ["order", "symbol", { ascending: true }],
  ["range", 0, 999],
  ["from", "daily_prices"],
  ["select", "close, high, low, open, stock_id, trade_date, turnover, volume"],
  ["in", "stock_id", ["stock-2330"]],
  ["order", "trade_date", { ascending: false }],
  ["range", 0, 2],
  ["from", "daily_scores"],
  [
    "select",
    "composite_score, data_quality_grade, data_quality_score, health_score, last_updated_at, missing_module_flags, model_version, risk_score, signal, stale_data_flags, stock_id, trade_date"
  ],
  ["in", "stock_id", ["stock-2330"]],
  ["order", "trade_date", { ascending: false }],
  ["range", 0, 2]
];
const callProblems = compareCalls(fake.calls, expectedCalls);

const factoryError = captureSyncError(() => createSupabaseMarketSignalRepository(fake.client));
const stockError = await captureError(() => createLoadedSupabaseMarketSignalRepository(createFakeClient({ stockError: "stock failure" }).client));
const priceError = await captureError(() => createLoadedSupabaseMarketSignalRepository(createFakeClient({ priceError: "price failure" }).client));
const scoreError = await captureError(() => createLoadedSupabaseMarketSignalRepository(createFakeClient({ scoreError: "score failure" }).client));
const errorProblems = [];
if (!factoryError.includes("Use createLoadedSupabaseMarketSignalRepository()")) {
  errorProblems.push("direct factory should fail closed");
}
if (!stockError.includes("Failed to load market-signal stocks: stock failure")) {
  errorProblems.push("stock query error was not surfaced");
}
if (!priceError.includes("Failed to load market-signal daily prices: price failure")) {
  errorProblems.push("price query error was not surfaced");
}
if (!scoreError.includes("Failed to load market-signal latest daily scores: score failure")) {
  errorProblems.push("score query error was not surfaced");
}

const requiredPhrases = [
  "createLoadedSupabaseMarketSignalRepository",
  ".from(\"stocks\")",
  ".from(\"daily_prices\")",
  ".from(\"daily_scores\")",
  ".select(\"asset_type, country, exchange, id, industry, is_etf, name, symbol\")",
  ".select(\"close, high, low, open, stock_id, trade_date, turnover, volume\")",
  "Failed to load market-signal daily prices",
  "Use createLoadedSupabaseMarketSignalRepository() to preload readonly Supabase rows before use."
];
const forbiddenPatterns = [
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /process\.env/,
  /scoreSource:\s*"real"/,
  /publicDataSource:\s*"supabase"/
];
const missing = requiredPhrases.filter((phrase) => !source.includes(phrase));
const forbidden = forbiddenPatterns.filter((pattern) => pattern.test(source)).map(String);
const status =
  behaviorProblems.length === 0 &&
  callProblems.length === 0 &&
  errorProblems.length === 0 &&
  missing.length === 0 &&
  forbidden.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      behaviorProblems,
      callProblems,
      errorProblems,
      forbidden,
      missing,
      observedCalls: fake.calls,
      snapshot: snapshot
        ? {
            asset: snapshot.asset,
            compositeScore: snapshot.compositeScore,
            date: snapshot.date,
            marketFacts: snapshot.marketFacts,
            signal: snapshot.signal.title
          }
        : null,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}

function createFakeClient({
  priceError = null,
  scoreError = null,
  stockError = null,
  stocks = [
    {
      asset_type: "stock",
      country: "TW",
      exchange: "TWSE",
      id: "stock-2330",
      industry: "半導體",
      is_etf: false,
      name: "台積電",
      symbol: "2330"
    }
  ],
  prices = [
    {
      close: 950,
      high: 960,
      low: 940,
      open: 945,
      stock_id: "stock-2330",
      trade_date: "2026-06-15",
      turnover: 123456789,
      volume: 12345
    }
  ],
  scores = [
    {
      composite_score: 81,
      data_quality_grade: "A",
      data_quality_score: 92,
      health_score: 86,
      last_updated_at: "2026-06-15T14:30:00+08:00",
      missing_module_flags: [],
      model_version: "phase1-real-readonly-test",
      risk_score: 28,
      signal: "green",
      stale_data_flags: [],
      stock_id: "stock-2330",
      trade_date: "2026-06-15"
    }
  ]
} = {}) {
  const calls = [];

  return {
    calls,
    client: {
      from(table) {
        calls.push(["from", table]);

        if (table === "stocks") {
          const query = {
            eq(column, value) {
              calls.push(["eq", column, value]);
              return query;
            },
            order(column, options) {
              calls.push(["order", column, options]);
              return withRange({ calls, error: stockError, rows: stocks });
            }
          };

          return {
            select(columns) {
              calls.push(["select", columns]);
              return query;
            }
          };
        }

        if (table === "daily_prices" || table === "daily_scores") {
          const rows = table === "daily_prices" ? prices : scores;
          const error = table === "daily_prices" ? priceError : scoreError;

          return {
            select(columns) {
              calls.push(["select", columns]);
              return {
                in(column, values) {
                  calls.push(["in", column, values]);
                  return {
                    order(columnName, options) {
                      calls.push(["order", columnName, options]);
                      return withRange({ calls, error, rows });
                    }
                  };
                }
              };
            }
          };
        }

        throw new Error(`Unexpected table: ${table}`);
      }
    }
  };
}

function withRange({ calls, error, rows }) {
  const result = Promise.resolve({ data: rows, error: error ? { message: error } : null });
  result.range = async (from, to) => {
    calls.push(["range", from, to]);
    return { data: rows.slice(from, to + 1), error: error ? { message: error } : null };
  };
  return result;
}

function compareCalls(actual, expected) {
  const problems = [];

  if (actual.length !== expected.length) {
    problems.push(`expected ${expected.length} calls, got ${actual.length}`);
  }

  for (let index = 0; index < Math.max(actual.length, expected.length); index += 1) {
    if (JSON.stringify(actual[index]) !== JSON.stringify(expected[index])) {
      problems.push(`call ${index} expected ${JSON.stringify(expected[index])}, got ${JSON.stringify(actual[index])}`);
    }
  }

  return problems;
}

async function captureError(action) {
  try {
    await action();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }

  return "";
}

function captureSyncError(action) {
  try {
    action();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }

  return "";
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
