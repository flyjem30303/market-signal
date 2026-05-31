import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const modulePath = "src/lib/repositories/supabase-data-freshness-repository.ts";
const { getSupabaseDataFreshnessSnapshot } = loadTsModule(modulePath);

const successfulClient = createFakeClient({
  dataRuns: [
    {
      data_end_date: "2026-05-30",
      row_count: 10,
      source_name: "TWSE OpenAPI",
      status: "success",
      target_table: "daily_prices"
    },
    {
      data_end_date: "2026-05-29",
      row_count: 5,
      source_name: "TWSE OpenAPI stale duplicate",
      status: "success",
      target_table: "daily_prices"
    },
    {
      data_end_date: "2026-05-29",
      row_count: 8,
      source_name: "TWSE OpenAPI",
      status: "success",
      target_table: "daily_fundamentals"
    }
  ],
  market: {
    currency: "TWD",
    exchange: "TWSE",
    timezone: "Asia/Taipei"
  }
});

const snapshot = await getSupabaseDataFreshnessSnapshot(successfulClient.client);
const successProblems = [];

if (snapshot.state !== "complete") successProblems.push(`state expected complete, got ${snapshot.state}`);
if (snapshot.asOfDate !== "2026-05-30") successProblems.push(`asOfDate expected 2026-05-30, got ${snapshot.asOfDate}`);
if (snapshot.scoreSource !== "mock") successProblems.push(`scoreSource expected mock, got ${snapshot.scoreSource}`);
if (snapshot.isMock !== false) successProblems.push(`isMock expected false, got ${String(snapshot.isMock)}`);
if (snapshot.market !== "TWSE") successProblems.push(`market expected TWSE, got ${snapshot.market}`);
if (snapshot.currency !== "TWD") successProblems.push(`currency expected TWD, got ${snapshot.currency}`);
if (snapshot.timezone !== "Asia/Taipei") successProblems.push(`timezone expected Asia/Taipei, got ${snapshot.timezone}`);

const expectedCalls = [
  ["from", "market_exchanges"],
  ["select", "currency, exchange, timezone"],
  ["eq", "country", "TW"],
  ["eq", "exchange", "TWSE"],
  ["maybeSingle"],
  ["from", "data_runs"],
  ["select", "data_end_date, row_count, source_name, status, target_table"],
  ["in", "target_table", ["daily_prices", "daily_fundamentals"]],
  ["order", "finished_at", { ascending: false }]
];
const callProblems = compareCalls(successfulClient.calls, expectedCalls);

const marketError = await captureError(() =>
  getSupabaseDataFreshnessSnapshot(
    createFakeClient({
      marketError: "market unavailable"
    }).client
  )
);
const dataRunsError = await captureError(() =>
  getSupabaseDataFreshnessSnapshot(
    createFakeClient({
      dataRunsError: "runs unavailable"
    }).client
  )
);
const errorProblems = [];

if (!marketError.includes("Failed to load market freshness metadata: market unavailable")) {
  errorProblems.push("market metadata error was not surfaced");
}

if (!dataRunsError.includes("Failed to load data freshness runs: runs unavailable")) {
  errorProblems.push("data runs error was not surfaced");
}

const forbiddenSourcePatterns = [
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /scoreSource:\s*"real"/
];
const source = fs.readFileSync(path.join(root, modulePath), "utf8");
const forbidden = forbiddenSourcePatterns.filter((pattern) => pattern.test(source)).map(String);
const status =
  successProblems.length === 0 && callProblems.length === 0 && errorProblems.length === 0 && forbidden.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      callProblems,
      errorProblems,
      forbidden,
      observedCalls: successfulClient.calls,
      snapshot: {
        asOfDate: snapshot.asOfDate,
        isMock: snapshot.isMock,
        scoreSource: snapshot.scoreSource,
        state: snapshot.state
      },
      status,
      successProblems
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}

function createFakeClient({
  dataRuns = [],
  dataRunsError = null,
  market = null,
  marketError = null
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
                eq(firstColumn, firstValue) {
                  calls.push(["eq", firstColumn, firstValue]);
                  return {
                    eq(secondColumn, secondValue) {
                      calls.push(["eq", secondColumn, secondValue]);
                      return {
                        async maybeSingle() {
                          calls.push(["maybeSingle"]);
                          return {
                            data: market,
                            error: marketError ? { message: marketError } : null
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

        if (table === "data_runs") {
          return {
            select(columns) {
              calls.push(["select", columns]);
              return {
                in(column, values) {
                  calls.push(["in", column, values]);
                  return {
                    async order(columnName, options) {
                      calls.push(["order", columnName, options]);
                      return {
                        data: dataRuns,
                        error: dataRunsError ? { message: dataRunsError } : null
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
