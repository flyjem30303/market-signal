import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const contractPath = "src/lib/row-coverage-readonly-validation-contract.ts";
const { buildRowCoverageReadonlyValidationContract } = loadTsModule(contractPath);
const contract = buildRowCoverageReadonlyValidationContract();
const problems = [];

if (contract.status !== "not_ready") problems.push(`expected status not_ready, got ${contract.status}`);
if (contract.mode !== "row_coverage_readonly_validation_contract") problems.push(`unexpected mode: ${contract.mode}`);
if (contract.validationSource !== "local_contract_only") problems.push(`unexpected validation source: ${contract.validationSource}`);
if (contract.outputShapeStatus !== "defined_local_only") problems.push(`unexpected output shape status: ${contract.outputShapeStatus}`);
if (contract.remoteConnection !== "not_run") problems.push(`remote connection must be not_run, got ${contract.remoteConnection}`);
if (contract.targetRelation !== "daily_prices") problems.push(`expected daily_prices target relation, got ${contract.targetRelation}`);
if (contract.expectedSymbolCount !== 6) problems.push(`expected symbol count 6, got ${contract.expectedSymbolCount}`);
if (contract.requiredTradingSessions !== 60) {
  problems.push(`expected required trading sessions 60, got ${contract.requiredTradingSessions}`);
}
if (contract.expectedTotalRows !== 360) problems.push(`expected total rows 360, got ${contract.expectedTotalRows}`);
if (contract.maxMissingRowsForCoverage !== 0) {
  problems.push(`expected zero missing row tolerance, got ${contract.maxMissingRowsForCoverage}`);
}
if (contract.rowCoverageStatus !== "not_ready") problems.push(`row coverage must remain not_ready, got ${contract.rowCoverageStatus}`);
if (contract.scoreSource !== "mock" || contract.publicDataSource !== "mock") {
  problems.push("scoreSource and public data source must remain mock");
}
for (const flag of ["canAwardRowCoveragePoints", "canClaimCoverage", "canSetScoreSourceReal"]) {
  if (contract[flag] !== false) problems.push(`${flag} must remain false`);
}

const requiredFields = [
  "status",
  "mode",
  "remoteConnection",
  "symbolsChecked",
  "expectedTotalRows",
  "observedTotalRows",
  "missingRows",
  "calendarStatus",
  "canAwardRowCoveragePoints",
  "canSetScoreSourceReal",
  "problems"
];
for (const field of requiredFields) {
  if (!contract.requiredOutputFields.includes(field)) problems.push(`missing required output field: ${field}`);
}

const source = fs.readFileSync(contractPath, "utf8");
const requiredPhrases = [
  "buildRowCoverageReadonlyValidationContract",
  "RowCoverageReadonlyValidationContract",
  "buildRowCoverageContract",
  "row_coverage_readonly_validation_contract",
  "local_contract_only",
  "defined_local_only",
  "remoteConnection: \"not_run\"",
  "targetRelation: \"daily_prices\"",
  "expectedSymbolCount: 6",
  "expectedTotalRows: 360",
  "requiredTradingSessions: 60",
  "maxMissingRowsForCoverage: 0",
  "canAwardRowCoveragePoints: false",
  "canClaimCoverage: false",
  "canSetScoreSourceReal: false",
  "scoreSource: \"mock\"",
  "publicDataSource: \"mock\"",
  "Row coverage read-only validation output contract is local-only",
  "do not connect Supabase, run SQL, fetch market data, write daily_prices, claim coverage, award points, or set scoreSource=real"
];
const forbiddenPhrases = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(",
  ".insert(",
  ".update(",
  ".delete(",
  "writeFileSync",
  "remoteConnection: \"connected\"",
  "canAwardRowCoveragePoints: true",
  "canClaimCoverage: true",
  "canSetScoreSourceReal: true",
  "scoreSource: \"real\"",
  "publicDataSource: \"supabase\"",
  "status: \"approved\""
];

for (const phrase of requiredPhrases) {
  if (!source.includes(phrase)) problems.push(`missing:${phrase}`);
}
for (const phrase of forbiddenPhrases) {
  if (source.includes(phrase)) problems.push(`forbidden:${phrase}`);
}

console.log(
  JSON.stringify(
    {
      contract: {
        expectedSymbolCount: contract.expectedSymbolCount,
        expectedTotalRows: contract.expectedTotalRows,
        outputFieldCount: contract.requiredOutputFields.length,
        remoteConnection: contract.remoteConnection,
        status: contract.status,
        targetRelation: contract.targetRelation
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
