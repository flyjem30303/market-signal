import Module from "node:module";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const { buildFreshnessReadonlySmokeReport } = loadTsModule("src/lib/freshness-readonly-smoke-report.ts");

const completeSnapshot = {
  asOfDate: "2026-05-30",
  currency: "TWD",
  description: "sanitized test snapshot",
  isMock: false,
  market: "TWSE",
  scoreSource: "mock",
  scoreSourceLabel: "mock score",
  sourceName: "TWSE OpenAPI",
  state: "complete",
  stateLabel: "complete",
  timezone: "Asia/Taipei"
};

const cases = [
  runCase({
    env: {},
    expected: {
      outcome: "mock_only",
      state: "mock_only"
    },
    name: "default smoke report is mock only"
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    expected: {
      metadataState: "complete",
      outcome: "metadata_ready",
      state: "readonly_metadata_open"
    },
    name: "readonly metadata open accepts sanitized mock-scored metadata",
    snapshot: completeSnapshot
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    expected: {
      outcome: "blocked",
      state: "blocked"
    },
    name: "public source supabase stays blocked",
    snapshot: completeSnapshot
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    expected: {
      outcome: "blocked",
      state: "readonly_metadata_open"
    },
    name: "real score metadata is blocked",
    snapshot: {
      ...completeSnapshot,
      scoreSource: "real"
    }
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
  process.exitCode = 1;
}

function runCase({ env, expected, name, snapshot = null }) {
  const report = buildFreshnessReadonlySmokeReport({ env, snapshot });
  const problems = [];

  if (report.outcome !== expected.outcome) {
    problems.push(`expected outcome ${expected.outcome}, got ${report.outcome}`);
  }

  if (report.activation.state !== expected.state) {
    problems.push(`expected activation state ${expected.state}, got ${report.activation.state}`);
  }

  if (expected.metadataState && report.metadata?.state !== expected.metadataState) {
    problems.push(`expected metadata state ${expected.metadataState}, got ${String(report.metadata?.state)}`);
  }

  const forbiddenFlags = {
    automatedRemoteRun: report.activation.automatedRemoteRun,
    connectionAttempted: report.activation.connectionAttempted,
    rowPayloadsPrinted: report.safety.rowPayloadsPrinted,
    scoreSourceRealEnabled: report.activation.scoreSourceRealEnabled,
    secretsPrinted: report.safety.secretsPrinted,
    sqlExecuted: report.activation.sqlExecuted,
    writesEnabled: report.activation.writesEnabled
  };

  for (const [key, value] of Object.entries(forbiddenFlags)) {
    if (value !== false) {
      problems.push(`expected ${key} false, got ${String(value)}`);
    }
  }

  return {
    name,
    pass: problems.length === 0,
    problems,
    report: {
      activation: report.activation,
      metadata: report.metadata,
      outcome: report.outcome,
      safety: report.safety
    }
  };
}

function scanSource() {
  const source = fs.readFileSync(path.join(root, "src/lib/freshness-readonly-smoke-report.ts"), "utf8");
  const problems = [];
  const requiredPhrases = [
    "buildFreshnessReadonlySmokeReport",
    "rowPayloadsPrinted: false",
    "secretsPrinted: false",
    "metadata_ready",
    "Smoke report is a sanitized contract only"
  ];
  const forbiddenPatterns = [
    /@supabase\/supabase-js/,
    /createClient/,
    /fetch\(/,
    /\.from\(/,
    /\.insert\(/,
    /\.update\(/,
    /\.delete\(/,
    /rowPayloadsPrinted:\s*true/,
    /secretsPrinted:\s*true/,
    /scoreSourceRealEnabled:\s*true/,
    /sqlExecuted:\s*true/,
    /writesEnabled:\s*true/
  ];

  for (const phrase of requiredPhrases) {
    if (!source.includes(phrase)) {
      problems.push(`missing smoke report phrase: ${phrase}`);
    }
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      problems.push(`forbidden smoke report source pattern: ${String(pattern)}`);
    }
  }

  return problems;
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
