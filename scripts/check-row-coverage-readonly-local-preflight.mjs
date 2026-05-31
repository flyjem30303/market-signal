import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const preflightPath = "src/lib/row-coverage-readonly-local-preflight.ts";
const packageJsonPath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const { getRowCoverageReadonlyLocalPreflight } = loadTsModule(preflightPath);
const problems = [];

const blocked = getRowCoverageReadonlyLocalPreflight({});
const ready = getRowCoverageReadonlyLocalPreflight({
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-placeholder",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_DATA_SOURCE: "mock",
  ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION: "CP3_ROW_COVERAGE_READONLY_VALIDATE",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-placeholder"
});

if (blocked.status !== "blocked") problems.push(`empty env must be blocked, got ${blocked.status}`);
if (blocked.connectionAttempted !== false) problems.push("blocked preflight must not attempt connection");
if (blocked.sqlExecuted !== false || blocked.mutations !== false || blocked.filesWritten !== false) {
  problems.push("blocked preflight must not run SQL, mutate, or write files");
}
if (!blocked.missingEnv.includes("ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION")) {
  problems.push("blocked preflight must require row coverage confirmation env");
}
if (blocked.nextRemoteCommand !== null) problems.push("blocked preflight must not expose a remote command");

if (ready.status !== "ready_for_guarded_readonly_decision") problems.push(`ready fixture status mismatch: ${ready.status}`);
if (ready.mode !== "row_coverage_readonly_local_preflight") problems.push(`unexpected mode: ${ready.mode}`);
if (ready.targetRelation !== "daily_prices") problems.push(`expected daily_prices target relation, got ${ready.targetRelation}`);
if (ready.nextLocalAction !== "create guarded row coverage read-only runner") {
  problems.push(`unexpected next local action: ${ready.nextLocalAction}`);
}
if (ready.nextRemoteCommand !== null) problems.push("ready preflight must still not create a remote command");
if (ready.scoreSource !== "mock" || ready.publicDataSource !== "mock") {
  problems.push("ready preflight must keep scoreSource and public source mock");
}
for (const flag of [
  "canAwardRowCoveragePoints",
  "canClaimCoverage",
  "canSetScoreSourceReal",
  "connectionAttempted",
  "filesWritten",
  "mutations",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "sqlExecuted"
]) {
  if (ready[flag] !== false) problems.push(`${flag} must remain false`);
}
for (const boundary of ["main_market_signal_source", "row_coverage_confirmation", "remote_connection"]) {
  if (!ready.boundaries.some((item) => item.name === boundary && item.status === "ok")) {
    problems.push(`missing ready boundary: ${boundary}`);
  }
}

const source = fs.readFileSync(preflightPath, "utf8");
const requiredPhrases = [
  "getRowCoverageReadonlyLocalPreflight",
  "RowCoverageReadonlyLocalPreflight",
  "buildRowCoverageReadonlyValidationContract",
  "row_coverage_readonly_local_preflight",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE",
  "ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION",
  "CP3_ROW_COVERAGE_READONLY_VALIDATE",
  "targetRelation: \"daily_prices\"",
  "nextLocalAction: \"create guarded row coverage read-only runner\"",
  "nextRemoteCommand: null",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "mutations: false",
  "filesWritten: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "canAwardRowCoveragePoints: false",
  "canClaimCoverage: false",
  "canSetScoreSourceReal: false",
  "scoreSource: \"mock\"",
  "publicDataSource: \"mock\""
];
const forbiddenPhrases = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(",
  ".select(",
  ".insert(",
  ".update(",
  ".delete(",
  ".rpc(",
  "writeFileSync",
  "appendFileSync",
  "nextRemoteCommand: \"npm run",
  "canSetScoreSourceReal: true",
  "canAwardRowCoveragePoints: true",
  "scoreSource: \"real\"",
  "publicDataSource: \"supabase\""
];

for (const phrase of requiredPhrases) {
  if (!source.includes(phrase)) problems.push(`missing:${phrase}`);
}
for (const phrase of forbiddenPhrases) {
  if (source.includes(phrase)) problems.push(`forbidden:${phrase}`);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const packageScript = packageJson.scripts?.["check:row-coverage-readonly-local-preflight"];
if (packageScript !== "node scripts/check-row-coverage-readonly-local-preflight.mjs") {
  problems.push(`package script mismatch: ${packageScript ?? "missing"}`);
}
if (!reviewGate.includes("scripts/check-row-coverage-readonly-local-preflight.mjs")) {
  problems.push("review gate does not include row coverage readonly local preflight checker");
}

console.log(
  JSON.stringify(
    {
      blockedStatus: blocked.status,
      problems,
      readyStatus: ready.status,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
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
