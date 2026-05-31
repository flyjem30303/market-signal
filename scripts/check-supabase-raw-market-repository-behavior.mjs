import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const modulePath = "src/lib/repositories/supabase-raw-market-repository.ts";
const source = fs.readFileSync(path.join(root, modulePath), "utf8");
const { createSupabaseRawMarketRepository } = loadTsModule(modulePath);

const fake = createFakeClient({
  fundamentals: {
    dividend_yield: 2.1,
    eps_ttm: 32.4,
    pb: 5.2,
    pe: 21.3,
    revenue_yoy: 8.5,
    trade_date: "2026-05-30"
  },
  markets: [
    {
      country: "TW",
      currency: "TWD",
      display_name: "Taiwan Stock Exchange",
      exchange: "TWSE",
      locale: "zh-TW",
      name: "Taiwan Stock Exchange",
      timezone: "Asia/Taipei"
    }
  ],
  price: {
    close: 1000,
    high: 1010,
    low: 990,
    open: 995,
    trade_date: "2026-05-30",
    turnover: 123456789,
    volume: 45678
  },
  stock: {
    asset_type: "stock",
    country: "TW",
    currency: "TWD",
    exchange: "TWSE",
    id: "stock-2330",
    industry: "Semiconductor",
    is_etf: false,
    listed_date: "1994-09-05",
    market: "tw_stock",
    name: "TSMC",
    symbol: "2330",
    timezone: "Asia/Taipei"
  }
});
const repository = createSupabaseRawMarketRepository(fake.client);

const activeMarkets = await repository.getActiveMarkets();
const stock = await repository.getStockBySymbol("2330");
const snapshot = await repository.getLatestSnapshot("2330");

const behaviorProblems = [];
if (activeMarkets[0]?.displayName !== "Taiwan Stock Exchange") behaviorProblems.push("active market mapping failed");
if (activeMarkets[0]?.currency !== "TWD") behaviorProblems.push("active market currency mapping failed");
if (stock?.id !== "stock-2330") behaviorProblems.push("stock id mapping failed");
if (stock?.isEtf !== false) behaviorProblems.push("stock isEtf mapping failed");
if (stock?.listedDate !== "1994-09-05") behaviorProblems.push("stock listedDate mapping failed");
if (snapshot?.stock.symbol !== "2330") behaviorProblems.push("snapshot stock mapping failed");
if (snapshot?.price?.tradeDate !== "2026-05-30") behaviorProblems.push("price tradeDate mapping failed");
if (snapshot?.price?.turnover !== 123456789) behaviorProblems.push("price turnover mapping failed");
if (snapshot?.fundamentals?.dividendYield !== 2.1) behaviorProblems.push("fundamentals dividendYield mapping failed");
if (snapshot?.fundamentals?.revenueYoy !== 8.5) behaviorProblems.push("fundamentals revenueYoy mapping failed");

const expectedCalls = [
  ["from", "market_exchanges"],
  ["select", "country, currency, display_name, exchange, locale, name, timezone"],
  ["eq", "is_active", true],
  ["order", "country", { ascending: true }],
  ["from", "stocks"],
  ["select", "asset_type, country, currency, exchange, id, industry, is_etf, listed_date, market, name, symbol, timezone"],
  ["eq", "symbol", "2330"],
  ["eq", "country", "TW"],
  ["eq", "exchange", "TWSE"],
  ["eq", "is_active", true],
  ["maybeSingle", "stocks"],
  ["from", "stocks"],
  ["select", "asset_type, country, currency, exchange, id, industry, is_etf, listed_date, market, name, symbol, timezone"],
  ["eq", "symbol", "2330"],
  ["eq", "country", "TW"],
  ["eq", "exchange", "TWSE"],
  ["eq", "is_active", true],
  ["maybeSingle", "stocks"],
  ["from", "daily_prices"],
  ["select", "close, high, low, open, trade_date, turnover, volume"],
  ["eq", "stock_id", "stock-2330"],
  ["order", "trade_date", { ascending: false }],
  ["limit", 1],
  ["maybeSingle", "daily_prices"],
  ["from", "daily_fundamentals"],
  ["select", "dividend_yield, eps_ttm, pb, pe, revenue_yoy, trade_date"],
  ["eq", "stock_id", "stock-2330"],
  ["order", "trade_date", { ascending: false }],
  ["limit", 1],
  ["maybeSingle", "daily_fundamentals"]
];
const callProblems = compareCalls(fake.calls, expectedCalls);

const notFound = await createSupabaseRawMarketRepository(createFakeClient({ stock: null }).client).getLatestSnapshot("9999");
if (notFound !== null) behaviorProblems.push("missing stock should return null snapshot");

const activeMarketsError = await captureError(() =>
  createSupabaseRawMarketRepository(createFakeClient({ marketsError: "market failure" }).client).getActiveMarkets()
);
const stockError = await captureError(() =>
  createSupabaseRawMarketRepository(createFakeClient({ stockError: "stock failure" }).client).getStockBySymbol("2330")
);
const priceError = await captureError(() =>
  createSupabaseRawMarketRepository(createFakeClient({ priceError: "price failure" }).client).getLatestSnapshot("2330")
);
const fundamentalsError = await captureError(() =>
  createSupabaseRawMarketRepository(createFakeClient({ fundamentalsError: "fundamentals failure" }).client).getLatestSnapshot("2330")
);
const errorProblems = [];

if (!activeMarketsError.includes("Failed to load active markets: market failure")) {
  errorProblems.push("active market error was not surfaced");
}

if (!stockError.includes("Failed to load stock TW/TWSE/2330: stock failure")) {
  errorProblems.push("stock error was not surfaced");
}

if (!priceError.includes("Failed to load latest daily price for stock stock-2330: price failure")) {
  errorProblems.push("price error was not surfaced");
}

if (!fundamentalsError.includes("Failed to load latest daily fundamentals for stock stock-2330: fundamentals failure")) {
  errorProblems.push("fundamentals error was not surfaced");
}

const forbiddenPatterns = [
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /scoreSource:\s*"real"/
];
const forbidden = forbiddenPatterns.filter((pattern) => pattern.test(source)).map(String);
const status =
  behaviorProblems.length === 0 && callProblems.length === 0 && errorProblems.length === 0 && forbidden.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      behaviorProblems,
      callProblems,
      errorProblems,
      forbidden,
      observedCalls: fake.calls,
      snapshot: snapshot
        ? {
            fundamentals: snapshot.fundamentals,
            price: snapshot.price,
            stock: snapshot.stock
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
  fundamentals = null,
  fundamentalsError = null,
  markets = [],
  marketsError = null,
  price = null,
  priceError = null,
  stock = {
    asset_type: "stock",
    country: "TW",
    currency: "TWD",
    exchange: "TWSE",
    id: "stock-2330",
    industry: "Semiconductor",
    is_etf: false,
    listed_date: "1994-09-05",
    market: "tw_stock",
    name: "TSMC",
    symbol: "2330",
    timezone: "Asia/Taipei"
  },
  stockError = null
} = {}) {
  const calls = [];

  return {
    calls,
    client: {
      from(table) {
        calls.push(["from", table]);

        if (table === "market_exchanges") {
          return {
            select(columns) {
              calls.push(["select", columns]);
              return {
                eq(column, value) {
                  calls.push(["eq", column, value]);
                  return {
                    async order(columnName, options) {
                      calls.push(["order", columnName, options]);
                      return {
                        data: markets,
                        error: marketsError ? { message: marketsError } : null
                      };
                    }
                  };
                }
              };
            }
          };
        }

        if (table === "stocks") {
          const filters = [];

          const query = {
            eq(column, value) {
              calls.push(["eq", column, value]);
              filters.push([column, value]);
              return query;
            },
            async maybeSingle() {
              calls.push(["maybeSingle", "stocks"]);
              return {
                data: stock,
                error: stockError ? { message: stockError } : null
              };
            }
          };

          return {
            select(columns) {
              calls.push(["select", columns]);
              return query;
            }
          };
        }

        if (table === "daily_prices" || table === "daily_fundamentals") {
          const data = table === "daily_prices" ? price : fundamentals;
          const error = table === "daily_prices" ? priceError : fundamentalsError;

          return {
            select(columns) {
              calls.push(["select", columns]);
              return {
                eq(column, value) {
                  calls.push(["eq", column, value]);
                  return {
                    order(columnName, options) {
                      calls.push(["order", columnName, options]);
                      return {
                        limit(count) {
                          calls.push(["limit", count]);
                          return {
                            async maybeSingle() {
                              calls.push(["maybeSingle", table]);
                              return {
                                data,
                                error: error ? { message: error } : null
                              };
                            }
                          };
                        }
                      };
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
