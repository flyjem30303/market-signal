import Module from "node:module";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const { getFreshnessRuntimeActivationSummary } = loadTsModule("src/lib/freshness-runtime-activation.ts");

const cases = [
  runCase({
    env: {},
    expected: {
      state: "mock_only",
      dataFreshnessSource: "mock",
      supabaseRuntimeReads: "disabled",
      publicDataSource: "mock"
    },
    name: "default environment remains mock only"
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    expected: {
      state: "readonly_metadata_open",
      dataFreshnessSource: "supabase",
      supabaseRuntimeReads: "enabled",
      publicDataSource: "mock"
    },
    name: "bounded readonly metadata opens only when freshness source and read gate are enabled"
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    expected: {
      state: "blocked",
      nextPublicDataSource: "mock"
    },
    name: "public source supabase remains blocked"
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "invalid",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    expected: {
      state: "blocked"
    },
    name: "invalid freshness source is blocked"
  }),
  runCase({
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "invalid",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    expected: {
      state: "blocked"
    },
    name: "invalid read gate is blocked"
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

function runCase({ env, expected, name }) {
  const summary = getFreshnessRuntimeActivationSummary(env);
  const problems = [];

  for (const [key, value] of Object.entries(expected)) {
    if (summary[key] !== value) {
      problems.push(`expected ${key} ${String(value)}, got ${String(summary[key])}`);
    }
  }

  const invariantChecks = {
    automatedRemoteRun: false,
    connectionAttempted: false,
    nextPublicDataSource: "mock",
    scoreSourceRealEnabled: false,
    sqlExecuted: false,
    writesEnabled: false
  };

  for (const [key, value] of Object.entries(invariantChecks)) {
    if (summary[key] !== value) {
      problems.push(`expected invariant ${key} ${String(value)}, got ${String(summary[key])}`);
    }
  }

  return {
    name,
    pass: problems.length === 0,
    problems,
    summary: {
      automatedRemoteRun: summary.automatedRemoteRun,
      connectionAttempted: summary.connectionAttempted,
      nextPublicDataSource: summary.nextPublicDataSource,
      scoreSourceRealEnabled: summary.scoreSourceRealEnabled,
      sqlExecuted: summary.sqlExecuted,
      state: summary.state,
      writesEnabled: summary.writesEnabled
    }
  };
}

function scanSource() {
  const source = fs.readFileSync(path.join(root, "src/lib/freshness-runtime-activation.ts"), "utf8");
  const problems = [];
  const forbiddenPatterns = [
    /@supabase\/supabase-js/,
    /createClient/,
    /fetch\(/,
    /\.from\(/,
    /\.insert\(/,
    /\.update\(/,
    /\.delete\(/,
    /automatedRemoteRun:\s*true/,
    /connectionAttempted:\s*true/,
    /sqlExecuted:\s*true/,
    /writesEnabled:\s*true/,
    /scoreSourceRealEnabled:\s*true/,
    /nextPublicDataSource:\s*"supabase"/
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      problems.push(`forbidden activation source pattern: ${String(pattern)}`);
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
