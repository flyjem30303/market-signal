import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const { getMarketSignalSourceStatus } = loadTsModule("src/lib/repositories/market-signal-source-status.ts");

const cases = [
  {
    env: {},
    expected: {
      publicScoreSource: "mock",
      requestedScoreSource: "mock",
      requestedSource: "mock",
      resolvedScoreSource: "mock",
      resolvedSource: "mock",
      supabasePromotionGate: "disabled",
      supabaseRuntimeReads: "disabled"
    },
    name: "default mock"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "mock",
      MARKET_SIGNAL_SUPABASE_READS: "enabled"
    },
    expected: {
      publicScoreSource: "mock",
      requestedScoreSource: "mock",
      requestedSource: "mock",
      resolvedScoreSource: "mock",
      resolvedSource: "mock",
      supabasePromotionGate: "disabled",
      supabaseRuntimeReads: "enabled"
    },
    name: "mock request with reads enabled still mock"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    expected: {
      publicScoreSource: "mock",
      requestedScoreSource: "mock",
      requestedSource: "supabase",
      resolvedScoreSource: "mock",
      resolvedSource: "mock",
      supabasePromotionGate: "disabled",
      supabaseRuntimeReads: "disabled"
    },
    name: "supabase request with reads disabled"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase",
      MARKET_SIGNAL_SUPABASE_READS: "enabled"
    },
    expected: {
      publicScoreSource: "mock",
      requestedScoreSource: "mock",
      requestedSource: "supabase",
      resolvedScoreSource: "mock",
      resolvedSource: "mock",
      supabasePromotionGate: "disabled",
      supabaseRuntimeReads: "enabled"
    },
    name: "supabase request with enabled reads remains public mock without stage 6 gate"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase",
      MARKET_SIGNAL_SUPABASE_PROMOTION_GATE: "stage_6_public_data_source_supabase_approved",
      MARKET_SIGNAL_SUPABASE_READS: "enabled"
    },
    expected: {
      publicScoreSource: "mock",
      requestedScoreSource: "mock",
      requestedSource: "supabase",
      resolvedScoreSource: "mock",
      resolvedSource: "supabase",
      supabasePromotionGate: "stage_6_public_data_source_supabase_approved",
      supabaseRuntimeReads: "enabled"
    },
    name: "stage 6 promoted source still keeps public score mock"
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
      requestedScoreSource: "real",
      requestedSource: "supabase",
      resolvedScoreSource: "real",
      resolvedSource: "supabase",
      scorePromotionGate: "stage_8_score_source_real_approved",
      supabasePromotionGate: "stage_6_public_data_source_supabase_approved",
      supabaseRuntimeReads: "enabled"
    },
    name: "stage 6 plus stage 8 promotes source and score"
  }
];

const results = cases.map((testCase) => {
  const observed = getMarketSignalSourceStatus({ env: testCase.env });
  const pass = Object.entries(testCase.expected).every(([key, value]) => observed[key] === value);

  return {
    expected: testCase.expected,
    name: testCase.name,
    observed,
    pass
  };
});

let invalidSourceError = null;
try {
  getMarketSignalSourceStatus({ env: { NEXT_PUBLIC_DATA_SOURCE: "invalid" } });
} catch (error) {
  invalidSourceError = error instanceof Error ? error.message : String(error);
}

const invalidSourcePass = invalidSourceError?.includes("Unsupported NEXT_PUBLIC_DATA_SOURCE") ?? false;
const failed = results.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      invalidSourceError,
      invalidSourcePass,
      results,
      status: failed.length === 0 && invalidSourcePass ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0 || !invalidSourcePass) {
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
