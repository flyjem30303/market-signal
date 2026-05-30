import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const docPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_WRAPPER_LOCAL_SMOKE_2026-05-30.md";
const sourcePath = "src/lib/data-freshness-source.ts";
const forbiddenEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATA_FRESHNESS_SOURCE",
  "DATA_FRESHNESS_SUPABASE_READS"
];

const requiredDocPhrases = [
  "Status: `CP3 freshness runtime wrapper local smoke recorded`",
  "Decision: `VERIFY_RUNTIME_WRAPPER_BEHAVIOR_LOCALLY_WITH_INJECTED_CLIENT`",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not set `scoreSource=real`",
  "exports `createDataFreshnessSnapshotGetter`",
  "default getter still uses `process.env`",
  "default getter still uses `createServerSupabaseClient` only through a lazy factory",
  "A Supabase client may be created only when `DATA_FRESHNESS_SOURCE=supabase` and `DATA_FRESHNESS_SUPABASE_READS=enabled`",
  "NEXT-SLICE-001 add a read-only runtime activation readiness packet"
];

const requiredSourcePhrases = [
  "export function createDataFreshnessSnapshotGetter",
  "createSupabaseClient = () => createServerSupabaseClient() as unknown as SupabaseDataFreshnessClient",
  "env = process.env",
  "export const getDataFreshnessSnapshot = createDataFreshnessSnapshotGetter();",
  "source: getFreshnessSource(env)",
  "supabaseRuntimeReads: getSupabaseRuntimeReads(env)"
];

const forbiddenSourcePhrases = [
  "DATA_FRESHNESS_SOURCE ?? \"supabase\"",
  "DATA_FRESHNESS_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"enabled\""
];

const doc = fs.readFileSync(path.join(root, docPath), "utf8");
const source = fs.readFileSync(path.join(root, sourcePath), "utf8");
const missing = [
  ...requiredDocPhrases.filter((phrase) => !doc.includes(phrase)).map((phrase) => `${docPath}: ${phrase}`),
  ...requiredSourcePhrases.filter((phrase) => !source.includes(phrase)).map((phrase) => `${sourcePath}: ${phrase}`)
];
const forbidden = forbiddenSourcePhrases.filter((phrase) => source.includes(phrase));

const beforeEnv = Object.fromEntries(forbiddenEnvKeys.map((key) => [key, process.env[key]]));
const freshnessSourceModule = loadTsModule(sourcePath);
const { createDataFreshnessSnapshotGetter } = freshnessSourceModule;

if (typeof createDataFreshnessSnapshotGetter !== "function") {
  missing.push(`${sourcePath}: createDataFreshnessSnapshotGetter export`);
}

const smokeCases = [
  {
    env: {},
    expectedCalls: 0,
    expectedScoreSource: "mock",
    expectedThrows: false,
    name: "default-mock"
  },
  {
    env: {
      DATA_FRESHNESS_SOURCE: "mock",
      DATA_FRESHNESS_SUPABASE_READS: "enabled"
    },
    expectedCalls: 0,
    expectedScoreSource: "mock",
    expectedThrows: false,
    name: "explicit-mock"
  },
  {
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "disabled"
    },
    expectedCalls: 0,
    expectedScoreSource: "mock",
    expectedThrows: false,
    name: "supabase-disabled"
  },
  {
    env: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "enabled"
    },
    expectedCalls: 1,
    expectedScoreSource: "mock",
    expectedThrows: false,
    name: "supabase-enabled-candidate-fallback"
  },
  {
    env: {
      DATA_FRESHNESS_SOURCE: "invalid",
      DATA_FRESHNESS_SUPABASE_READS: "disabled"
    },
    expectedCalls: 0,
    expectedThrows: true,
    name: "invalid-source"
  }
];

const smokeResults = [];

for (const smokeCase of smokeCases) {
  let calls = 0;
  let scoreSource = null;
  let threw = false;
  let message = null;
  const getSnapshot = createDataFreshnessSnapshotGetter({
    createSupabaseClient: () => {
      calls += 1;
      return {
        from() {
          throw new Error("local smoke fallback");
        }
      };
    },
    env: smokeCase.env
  });

  try {
    const snapshot = await getSnapshot();
    scoreSource = snapshot.scoreSource;
  } catch (error) {
    threw = true;
    message = error instanceof Error ? error.message : String(error);
  }

  smokeResults.push({
    calls,
    expectedCalls: smokeCase.expectedCalls,
    expectedScoreSource: smokeCase.expectedScoreSource ?? null,
    expectedThrows: smokeCase.expectedThrows,
    message,
    name: smokeCase.name,
    pass:
      calls === smokeCase.expectedCalls &&
      threw === smokeCase.expectedThrows &&
      (smokeCase.expectedScoreSource === undefined || scoreSource === smokeCase.expectedScoreSource) &&
      (!smokeCase.expectedThrows || String(message).includes("Unsupported DATA_FRESHNESS_SOURCE")),
    scoreSource,
    threw
  });
}

const afterEnv = Object.fromEntries(forbiddenEnvKeys.map((key) => [key, process.env[key]]));
const envMutations = forbiddenEnvKeys.filter((key) => beforeEnv[key] !== afterEnv[key]);
const failedSmoke = smokeResults.filter((result) => !result.pass);
const status = missing.length === 0 && forbidden.length === 0 && envMutations.length === 0 && failedSmoke.length === 0 ? "ok" : "failed";

console.log(
  JSON.stringify(
    {
      envMutations,
      failedSmoke,
      forbidden,
      missing,
      smokeResults,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
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
    if (specifier === "@/lib/supabase/server") {
      return {
        createServerSupabaseClient() {
          throw new Error("real Supabase client is blocked in local smoke");
        }
      };
    }

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
