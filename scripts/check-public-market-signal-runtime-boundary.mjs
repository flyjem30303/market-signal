import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const repositoryPath = "src/lib/repositories/market-signal-repository.ts";
const repositorySource = fs.readFileSync(path.join(root, repositoryPath), "utf8");
const { getMarketSignalSourceStatus } = loadTsModule("src/lib/repositories/market-signal-source-status.ts");

const runtimeCases = [
  {
    env: {},
    expected: {
      publicScoreSource: "mock",
      resolvedSource: "mock"
    },
    name: "default runtime remains mock"
  },
  {
    env: {
      MARKET_SIGNAL_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    expected: {
      publicScoreSource: "mock",
      resolvedSource: "mock"
    },
    name: "enabled reads with mock request remains mock"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    expected: {
      failClosedReason: "supabase_reads_disabled",
      publicScoreSource: "mock",
      resolvedSource: "mock"
    },
    name: "supabase request with reads disabled fails closed"
  },
  {
    env: {
      MARKET_SIGNAL_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    expected: {
      failClosedReason: "stage_6_promotion_gate_missing",
      publicScoreSource: "mock",
      resolvedSource: "mock"
    },
    name: "supabase request without stage 6 gate fails closed"
  },
  {
    env: {
      MARKET_SIGNAL_SCORE_SOURCE_GATE: "stage_8_score_source_real_approved",
      MARKET_SIGNAL_SUPABASE_PROMOTION_GATE: "stage_6_public_data_source_supabase_approved",
      MARKET_SIGNAL_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "supabase",
      NEXT_PUBLIC_SCORE_SOURCE: "real"
    },
    expected: {
      publicScoreSource: "real",
      resolvedSource: "supabase"
    },
    name: "stage 6 plus stage 8 can promote source and score"
  }
];

const sourceStatusResults = runtimeCases.map((testCase) => {
  const status = getMarketSignalSourceStatus({ env: testCase.env });
  const problems = Object.entries(testCase.expected)
    .filter(([key, value]) => status[key] !== value)
    .map(([key, value]) => `${key} expected ${value}, got ${status[key]}`);

  return {
    name: testCase.name,
    pass: problems.length === 0,
    problems,
    publicScoreSource: status.publicScoreSource,
    resolvedSource: status.resolvedSource,
    supabaseRuntimeReads: status.supabaseRuntimeReads
  };
});

let invalidSourceError = null;
try {
  getMarketSignalSourceStatus({ env: { NEXT_PUBLIC_DATA_SOURCE: "invalid" } });
} catch (error) {
  invalidSourceError = error instanceof Error ? error.message : String(error);
}

const staticResults = [
  {
    pass: repositorySource.includes("getMarketSignalRuntime"),
    rule: "public runtime exposes async server runtime factory"
  },
  {
    pass: repositorySource.includes("createLoadedSupabaseMarketSignalRepository"),
    rule: "public runtime can load readonly Supabase repository after gate"
  },
  {
    pass: repositorySource.includes("createServerSupabaseClient"),
    rule: "public runtime uses server-only Supabase client"
  },
  {
    pass: repositorySource.includes("Supabase readonly data could not be loaded"),
    rule: "Supabase read errors fail closed to mock data"
  },
  {
    pass: !repositorySource.includes(".insert(") && !repositorySource.includes(".upsert(") && !repositorySource.includes(".delete("),
    rule: "public runtime repository boundary does not write"
  }
];

const invalidSourcePass = invalidSourceError?.includes("Unsupported NEXT_PUBLIC_DATA_SOURCE") ?? false;
const failed = [
  ...sourceStatusResults.filter((result) => !result.pass),
  ...staticResults.filter((result) => !result.pass),
  ...(invalidSourcePass ? [] : [{ name: "invalid source rejected", pass: false }])
];

console.log(
  JSON.stringify(
    {
      checked_files: [repositoryPath, "src/lib/repositories/market-signal-source-status.ts"],
      invalidSourceError,
      invalidSourcePass,
      sourceStatusResults,
      staticResults,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exitCode = 1;
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
