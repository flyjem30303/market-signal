import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";
import {
  localhostContentForbidden,
  localhostContentHealthChecks,
  localhostStatusHealthPaths
} from "./localhost-health-config.mjs";

const root = process.cwd();
const contractPath = "src/lib/row-coverage-contract.ts";
const configPath = "scripts/localhost-health-config.mjs";
const healthPath = "scripts/check-localhost-health.mjs";
const contentHealthPath = "scripts/check-localhost-content-health.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const { buildRowCoverageContract } = loadTsModule(contractPath);
const contract = buildRowCoverageContract();
const config = fs.readFileSync(configPath, "utf8");
const health = fs.readFileSync(healthPath, "utf8");
const contentHealth = fs.readFileSync(contentHealthPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const expectedStockPaths = contract.universePolicy.symbols.map((symbol) => `/stocks/${symbol}`);
const contentPaths = localhostContentHealthChecks.map((check) => check.path);
const missing = [];
const blocked = [];

for (const route of expectedStockPaths) {
  if (!localhostStatusHealthPaths.includes(route)) {
    missing.push(`${configPath}: status route ${route}`);
  }
  if (!contentPaths.includes(route)) {
    missing.push(`${configPath}: content route ${route}`);
  }
}

for (const route of ["/", "/briefing", "/weekly", "/robots.txt"]) {
  if (!localhostStatusHealthPaths.includes(route)) {
    missing.push(`${configPath}: status route ${route}`);
  }
}

for (const route of ["/", "/briefing", "/weekly"]) {
  if (!contentPaths.includes(route)) {
    missing.push(`${configPath}: content route ${route}`);
  }
}

for (const phrase of [
  "Runtime At A Glance",
  "local_ready_remote_paused",
  "Internal Server Error",
  "Supabase readonly attempt"
]) {
  if (!config.includes(phrase)) {
    missing.push(`${configPath}: ${phrase}`);
  }
}

if (!localhostContentForbidden.includes("Internal Server Error")) {
  missing.push(`${configPath}: Internal Server Error forbidden token`);
}

for (const phrase of [
  "localhostStatusHealthPaths",
  "new URL(path, baseUrl)",
  "cache: \"no-store\"",
  "recoveryHint"
]) {
  if (!health.includes(phrase)) {
    missing.push(`${healthPath}: ${phrase}`);
  }
}

for (const phrase of [
  "localhostContentHealthChecks",
  "localhostContentForbidden",
  "new URL(check.path, baseUrl)",
  "cache: \"no-store\""
]) {
  if (!contentHealth.includes(phrase)) {
    missing.push(`${contentHealthPath}: ${phrase}`);
  }
}

for (const phrase of [
  "@supabase/supabase-js",
  "createClient",
  ".from(",
  ".insert(",
  ".update(",
  ".delete(",
  "scoreSource: \"real\"",
  "publicDataSource: \"supabase\""
]) {
  for (const [file, source] of [
    [configPath, config],
    [healthPath, health],
    [contentHealthPath, contentHealth]
  ]) {
    if (source.includes(phrase)) {
      blocked.push(`${file}: ${phrase}`);
    }
  }
}

if (!packageJson.includes("\"check:row-coverage-health-route-alignment\": \"node scripts/check-row-coverage-health-route-alignment.mjs\"")) {
  missing.push(`${packagePath}: check:row-coverage-health-route-alignment`);
}

if (!reviewGate.includes("scripts/check-row-coverage-health-route-alignment.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-row-coverage-health-route-alignment.mjs`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      expectedStockPaths,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
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
    }
  }).outputText;

  const dirname = path.dirname(absolutePath);
  const requireFromFile = Module.createRequire(absolutePath);
  const localRequire = (specifier) => {
    if (specifier.startsWith(".")) {
      const resolved = requireFromFile.resolve(specifier);
      const relativeResolved = path.relative(root, resolved);
      return loadTsModule(relativeResolved, cache);
    }
    return requireFromFile(specifier);
  };

  const wrapper = new Function("exports", "require", "module", "__filename", "__dirname", transpiled);
  wrapper(module.exports, localRequire, module, absolutePath, dirname);

  return module.exports;
}
