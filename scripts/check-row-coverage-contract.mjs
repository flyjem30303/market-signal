import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const contractPath = "src/lib/row-coverage-contract.ts";
const { buildRowCoverageContract } = loadTsModule(contractPath);
const contract = buildRowCoverageContract();
const problems = [];

if (contract.status !== "not_ready") problems.push(`expected status not_ready, got ${contract.status}`);
if (contract.maxPoints !== 20) problems.push(`expected max points 20, got ${contract.maxPoints}`);
if (contract.awardedPoints !== 0) problems.push(`expected awarded points 0, got ${contract.awardedPoints}`);
if (contract.scoreSource !== "mock" || contract.publicDataSource !== "mock") {
  problems.push("row coverage contract must keep scoreSource and public source mock");
}
if (contract.universePolicy.policyStatus !== "defined_local_only") {
  problems.push(`expected universe policy defined_local_only, got ${contract.universePolicy.policyStatus}`);
}
if (contract.universePolicy.market !== "TW") problems.push(`expected universe market TW, got ${contract.universePolicy.market}`);
for (const symbol of ["TWII", "0050", "006208", "2330", "2382", "2308"]) {
  if (!contract.universePolicy.symbols.includes(symbol)) problems.push(`missing universe symbol: ${symbol}`);
}
if (contract.coverageWindowPolicy.policyStatus !== "defined_local_only") {
  problems.push(`expected window policy defined_local_only, got ${contract.coverageWindowPolicy.policyStatus}`);
}
if (contract.coverageWindowPolicy.requiredTradingSessions !== 60) {
  problems.push(`expected 60 required trading sessions, got ${contract.coverageWindowPolicy.requiredTradingSessions}`);
}
if (contract.coverageWindowPolicy.timezone !== "Asia/Taipei") {
  problems.push(`expected Asia/Taipei timezone, got ${contract.coverageWindowPolicy.timezone}`);
}
if (contract.coverageWindowPolicy.excludesNonTradingDays !== true) {
  problems.push("coverage window must exclude non-trading days");
}
if (contract.coverageWindowPolicy.doesNotValidateRowCount !== true) {
  problems.push("coverage window policy must not validate row count");
}
if (!contract.requirements.some((requirement) => requirement.code === "symbol-universe-defined" && requirement.state === "complete")) {
  problems.push("symbol universe requirement must be complete");
}
if (!contract.requirements.some((requirement) => requirement.code === "coverage-window-defined" && requirement.state === "complete")) {
  problems.push("coverage window requirement must be complete");
}

for (const code of [
  "expected-row-policy-defined",
  "missing-row-tolerance-defined",
  "market-calendar-treatment-defined"
]) {
  if (!contract.requirements.some((requirement) => requirement.code === code && requirement.state === "missing")) {
    problems.push(`missing requirement not tracked: ${code}`);
  }
}

const source = fs.readFileSync(contractPath, "utf8");
const required = [
  "buildRowCoverageContract",
  "RowCoverageContract",
  "awardedPoints: 0",
  "maxPoints: 20",
  "status: \"not_ready\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "universePolicy",
  "coverageWindowPolicy",
  "defined_local_only",
  "Taiwan MVP watchlist universe",
  "MVP rolling 60 trading sessions",
  "latest approved freshness metadata date",
  "requiredTradingSessions: 60",
  "timezone: \"Asia/Taipei\"",
  "excludesNonTradingDays: true",
  "doesNotValidateRowCount: true",
  "TWII",
  "0050",
  "006208",
  "2330",
  "2382",
  "2308",
  "symbol-universe-defined",
  "coverage-window-defined",
  "expected-row-policy-defined",
  "missing-row-tolerance-defined",
  "market-calendar-treatment-defined",
  "Row coverage universe and window policies are local-only",
  "do not fetch market data, run SQL, write Supabase, claim coverage, or set scoreSource=real"
];
const forbidden = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(",
  ".insert(",
  ".update(",
  ".delete(",
  "writeFileSync",
  "awardedPoints: 20",
  "status: \"approved\"",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"real\""
];

for (const phrase of required) {
  if (!source.includes(phrase)) problems.push(`missing:${phrase}`);
}
for (const phrase of forbidden) {
  if (source.includes(phrase)) problems.push(`forbidden:${phrase}`);
}

console.log(
  JSON.stringify(
    {
      contract: {
        awardedPoints: contract.awardedPoints,
        coverageWindowSessions: contract.coverageWindowPolicy.requiredTradingSessions,
        maxPoints: contract.maxPoints,
        symbolCount: contract.universePolicy.symbols.length,
        requirementCount: contract.requirements.length,
        status: contract.status
      },
      problems,
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
