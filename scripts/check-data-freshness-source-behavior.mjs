import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const { createDataFreshnessSnapshotGetter } = loadTsModule("src/lib/data-freshness-source.ts", new Map(), {
  "@/lib/supabase/server": {
    createServerSupabaseClient() {
      throw new Error("real Supabase client is blocked in local freshness source behavior check");
    }
  }
});

const cases = [
  await runCase({
    env: {},
    expectedClientCalls: 0,
    expectedSnapshot: {
      isMock: true,
      scoreSource: "mock",
      state: "mock"
    },
    name: "default source remains mock"
  }),
  await runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "mock",
      DATA_FRESHNESS_SUPABASE_READS: "enabled"
    },
    expectedClientCalls: 0,
    expectedSnapshot: {
      isMock: true,
      scoreSource: "mock",
      state: "mock"
    },
    name: "mock source ignores enabled Supabase reads"
  }),
  await runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "disabled"
    },
    expectedClientCalls: 0,
    expectedSnapshot: {
      isMock: true,
      scoreSource: "mock",
      state: "mock"
    },
    name: "supabase source without runtime read gate falls back to mock"
  }),
  await runCase({
    client: createFakeFreshnessClient({
      dataRuns: [
        {
          data_end_date: "2026-05-30",
          row_count: 1000,
          source_name: "TWSE OpenAPI",
          status: "success",
          target_table: "daily_prices"
        },
        {
          data_end_date: "2026-05-29",
          row_count: 800,
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
    }),
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled"
    },
    expectedClientCalls: 1,
    expectedSnapshot: {
      asOfDate: "2026-05-30",
      isMock: false,
      market: "TWSE",
      scoreSource: "mixed",
      sourceName: "TWSE OpenAPI",
      state: "complete"
    },
    name: "enabled Supabase freshness read maps successful data_runs snapshot"
  }),
  await runCase({
    client: createFakeFreshnessClient({
      dataRuns: [
        {
          data_end_date: "2026-05-30",
          row_count: 1000,
          source_name: "TWSE OpenAPI",
          status: "success",
          target_table: "daily_prices"
        },
        {
          data_end_date: "2026-05-29",
          row_count: 800,
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
    }),
    env: {
      MARKET_SIGNAL_SCORE_SOURCE_GATE: "stage_8_score_source_real_approved",
      MARKET_SIGNAL_SUPABASE_PROMOTION_GATE: "stage_6_public_data_source_supabase_approved",
      MARKET_SIGNAL_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "supabase",
      NEXT_PUBLIC_SCORE_SOURCE: "real"
    },
    expectedClientCalls: 1,
    expectedSnapshot: {
      asOfDate: "2026-05-30",
      isMock: false,
      market: "TWSE",
      scoreSource: "real",
      sourceName: "TWSE OpenAPI",
      state: "complete"
    },
    name: "market runtime promotion defaults freshness to Supabase and applies real score label"
  }),
  await runCase({
    client: createFakeFreshnessClient({ dataRunsError: "data runs failure" }),
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled"
    },
    expectedClientCalls: 1,
    expectedSnapshot: {
      isMock: true,
      scoreSource: "mock",
      state: "mock"
    },
    name: "enabled Supabase freshness read failure degrades to mock"
  }),
  await runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "invalid",
      DATA_FRESHNESS_SUPABASE_READS: "disabled"
    },
    expectedClientCalls: 0,
    expectedError: "Unsupported DATA_FRESHNESS_SOURCE: invalid",
    name: "invalid freshness source is rejected"
  })
];

const sourceProblems = scanSource();
const failed = cases.filter((result) => !result.pass);
const status = failed.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      cases,
      sourceProblems,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}

async function runCase({ client = createFakeFreshnessClient(), env, expectedClientCalls, expectedError, expectedSnapshot, name }) {
  let clientCalls = 0;
  let errorMessage = null;
  let snapshot = null;
  const getSnapshot = createDataFreshnessSnapshotGetter({
    createSupabaseClient: () => {
      clientCalls += 1;
      return client;
    },
    env
  });

  try {
    snapshot = await getSnapshot();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  const problems = [];

  if (clientCalls !== expectedClientCalls) {
    problems.push(`expected ${expectedClientCalls} Supabase client calls, got ${clientCalls}`);
  }

  if (expectedError) {
    if (errorMessage !== expectedError) {
      problems.push(`expected error ${expectedError}, got ${errorMessage}`);
    }
  } else if (errorMessage) {
    problems.push(`unexpected error: ${errorMessage}`);
  }

  if (expectedSnapshot) {
    for (const [key, value] of Object.entries(expectedSnapshot)) {
      if (snapshot?.[key] !== value) {
        problems.push(`expected snapshot.${key} ${String(value)}, got ${String(snapshot?.[key])}`);
      }
    }
  }

  return {
    clientCalls,
    errorMessage,
    name,
    pass: problems.length === 0,
    problems,
    snapshot: snapshot
      ? {
          asOfDate: snapshot.asOfDate,
          isMock: snapshot.isMock,
          market: snapshot.market,
          scoreSource: snapshot.scoreSource,
          sourceName: snapshot.sourceName,
          state: snapshot.state
        }
      : null
  };
}

function createFakeFreshnessClient({
  dataRuns = [],
  dataRunsError = null,
  market = {
    currency: "TWD",
    exchange: "TWSE",
    timezone: "Asia/Taipei"
  },
  marketError = null
} = {}) {
  return {
    from(table) {
      if (table === "market_exchanges") {
        return {
          select() {
            return {
              eq() {
                return {
                  eq() {
                    return {
                      async maybeSingle() {
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
          select() {
            return {
              in() {
                return {
                  async order() {
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
  };
}

function scanSource() {
  const source = fs.readFileSync(path.join(root, "src/lib/data-freshness-source.ts"), "utf8");
  const repository = fs.readFileSync(path.join(root, "src/lib/repositories/freshness-repository.ts"), "utf8");
  const problems = [];
  const requiredSourcePhrases = [
    "env.DATA_FRESHNESS_SOURCE ?? getDefaultFreshnessSource(env)",
    "env.DATA_FRESHNESS_SUPABASE_READS === \"enabled\" || env.MARKET_SIGNAL_SUPABASE_READS === \"enabled\"",
    "applyPublicRuntimeScoreStatus",
    "createDataFreshnessSnapshotGetter",
    "createSupabaseClient = () => createServerSupabaseClient() as unknown as SupabaseDataFreshnessClient"
  ];
  const requiredRepositoryPhrases = [
    'source !== "supabase" || supabaseRuntimeReads !== "enabled"',
    "return createMockFreshnessRepository();",
    "return createDataRunsFreshnessRepository(createSupabaseClient());",
    "return await getSupabaseDataFreshnessSnapshot(client);",
    "return buildMockDataFreshnessSnapshot();"
  ];
  const forbiddenPatterns = [/DATA_FRESHNESS_SOURCE\s*\?\?\s*"supabase"/];

  for (const phrase of requiredSourcePhrases) {
    if (!source.includes(phrase)) {
      problems.push(`missing data freshness source phrase: ${phrase}`);
    }
  }

  for (const phrase of requiredRepositoryPhrases) {
    if (!repository.includes(phrase)) {
      problems.push(`missing freshness repository phrase: ${phrase}`);
    }
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source) || pattern.test(repository)) {
      problems.push(`forbidden freshness source pattern: ${String(pattern)}`);
    }
  }

  return problems;
}

function loadTsModule(relativePath, cache = new Map(), stubs = {}) {
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
  const localRequire = createLocalRequire(relativePath, cache, stubs);
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(localRequire, module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache, stubs) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (stubs[specifier]) {
      return stubs[specifier];
    }

    if (specifier.startsWith("@/")) {
      return loadTsModule(`src/${specifier.slice(2)}.ts`, cache, stubs);
    }

    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      const resolved = path.normalize(path.join(baseDirectory, `${specifier}.ts`));
      return loadTsModule(resolved, cache, stubs);
    }

    return nativeRequire(specifier);
  };
}
