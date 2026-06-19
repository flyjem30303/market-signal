import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const problems = [];

loadEnvFile(".env.local");
loadEnvFile(".env");

const { getMarketSignalRuntime } = loadTsModule("src/lib/repositories/market-signal-repository.ts");
const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
const assets = repository.getAssets();
const seriesCounts = assets.map((asset) => repository.getSeries(asset.symbol).length);
const totalSeriesRows = seriesCounts.reduce((total, count) => total + count, 0);

if (marketSignalSourceStatus.resolvedSource !== "supabase") {
  problems.push(`resolvedSource expected supabase, got ${marketSignalSourceStatus.resolvedSource}`);
}

if (marketSignalSourceStatus.publicScoreSource !== "real") {
  problems.push(`publicScoreSource expected real, got ${marketSignalSourceStatus.publicScoreSource}`);
}

if (assets.length === 0) problems.push("expected at least one active asset");
if (totalSeriesRows === 0) problems.push("expected at least one signal snapshot row");

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok ? "phase_1_real_runtime_supabase_load_ok" : "phase_1_real_runtime_supabase_load_blocked",
      resolvedSource: marketSignalSourceStatus.resolvedSource,
      publicScoreSource: marketSignalSourceStatus.publicScoreSource,
      assetCount: assets.length,
      totalSeriesRows,
      rawPayloadOutput: false,
      rowPayloadOutput: false,
      stockIdPayloadOutput: false,
      secretsOutput: false,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/gu, "");
    if (key && process.env[key] == null) process.env[key] = value;
  }
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
