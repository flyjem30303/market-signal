import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const REQUIRED_CONFIRMATION = "CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT";
const root = process.cwd();

if (process.env.FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION !== REQUIRED_CONFIRMATION) {
  printSanitized({
    reason: "missing_confirmation",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

if (process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock") {
  printSanitized({
    reason: "public_data_source_not_mock",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

if (process.env.DATA_FRESHNESS_SOURCE !== "supabase" || process.env.DATA_FRESHNESS_SUPABASE_READS !== "enabled") {
  printSanitized({
    reason: "freshness_runtime_gate_not_enabled",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

try {
  const { getDataFreshnessSnapshot } = loadTsModule("src/lib/data-freshness-source.ts");
  const snapshot = await getDataFreshnessSnapshot();

  printSanitized({
    asOfDate: snapshot.asOfDate,
    isMock: snapshot.isMock,
    market: snapshot.market,
    remoteAttempted: true,
    scoreSource: snapshot.scoreSource,
    sourceName: snapshot.sourceName,
    state: snapshot.state,
    status: "ok"
  });
} catch (error) {
  printSanitized({
    errorCategory: categorizeError(error),
    remoteAttempted: true,
    status: "failed"
  });
  process.exit(1);
}

function categorizeError(error) {
  const message = error instanceof Error ? error.message : String(error);

  if (/missing .*supabase/i.test(message)) return "missing_supabase_credentials";
  if (/network|fetch|connection|timeout|dns|getaddrinfo/i.test(message)) return "connection_error";
  if (/schema|column|relation|table/i.test(message)) return "schema_error";
  return "runtime_error";
}

function printSanitized(payload) {
  const allowed = {
    asOfDate: payload.asOfDate,
    errorCategory: payload.errorCategory,
    isMock: payload.isMock,
    market: payload.market,
    reason: payload.reason,
    remoteAttempted: payload.remoteAttempted,
    scoreSource: payload.scoreSource,
    sourceName: payload.sourceName,
    state: payload.state,
    status: payload.status
  };

  for (const key of Object.keys(allowed)) {
    if (allowed[key] === undefined) {
      delete allowed[key];
    }
  }

  console.log(JSON.stringify(allowed, null, 2));
}

function loadTsModule(relativePath, cache = new Map()) {
  const normalizedPath = path.normalize(relativePath);
  const absolutePath = path.join(root, normalizedPath);

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
