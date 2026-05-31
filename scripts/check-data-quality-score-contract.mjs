import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const contractPath = "src/lib/data-quality-score-contract.ts";
const { buildDataQualityScoreContract } = loadTsModule(contractPath);
const contract = buildDataQualityScoreContract();

const problems = [];

if (contract.score !== 25) problems.push(`expected local score 25, got ${contract.score}`);
if (contract.passThreshold !== 80) problems.push(`expected pass threshold 80, got ${contract.passThreshold}`);
if (contract.canCountAsRealScoreEvidence !== false) problems.push("contract must not count as real-score evidence");
if (contract.scoreSource !== "mock" || contract.publicDataSource !== "mock") {
  problems.push("contract must keep scoreSource and public source mock");
}
if (!contract.factors.some((factor) => factor.code === "freshness-metadata" && factor.state === "complete")) {
  problems.push("freshness metadata factor must be complete");
}
if (contract.rowCoverage.status !== "not_ready" || contract.rowCoverage.awardedPoints !== 0) {
  problems.push("row coverage must remain not_ready with zero awarded points");
}
if (contract.rowCoverage.requirements.length !== 5) {
  problems.push(`expected 5 row coverage requirements, got ${contract.rowCoverage.requirements.length}`);
}
if (contract.rowCoverage.universePolicy.policyStatus !== "defined_local_only") {
  problems.push("row coverage universe policy must be locally defined");
}
if (contract.rowCoverage.coverageWindowPolicy.policyStatus !== "defined_local_only") {
  problems.push("row coverage window policy must be locally defined");
}
if (contract.rowCoverage.expectedRowPolicy.policyStatus !== "defined_local_only") {
  problems.push("row coverage expected row policy must be locally defined");
}
if (!contract.rowCoverage.requirements.some((requirement) => requirement.code === "symbol-universe-defined" && requirement.state === "complete")) {
  problems.push("data quality contract must see symbol universe as complete");
}
if (!contract.rowCoverage.requirements.some((requirement) => requirement.code === "coverage-window-defined" && requirement.state === "complete")) {
  problems.push("data quality contract must see coverage window as complete");
}
if (!contract.rowCoverage.requirements.some((requirement) => requirement.code === "expected-row-policy-defined" && requirement.state === "complete")) {
  problems.push("data quality contract must see expected row policy as complete");
}
for (const code of ["row-coverage", "field-validity", "downgrade-rules", "source-rights", "public-disclosure"]) {
  if (!contract.factors.some((factor) => factor.code === code && factor.state === "missing" && factor.points === 0)) {
    problems.push(`missing factor not blocked: ${code}`);
  }
}

const source = fs.readFileSync(contractPath, "utf8");
const required = [
  "buildDataQualityScoreContract",
  "DataQualityScoreContract",
  "buildRowCoverageContract",
  "rowCoverage",
  "universePolicy",
  "coverageWindowPolicy",
  "expectedRowPolicy",
  "canCountAsRealScoreEvidence: false",
  "passThreshold: 80",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "freshness-metadata",
  "row-coverage",
  "field-validity",
  "downgrade-rules",
  "source-rights",
  "public-disclosure",
  "do not run SQL, write Supabase, ingest market data, change public source, or set scoreSource=real"
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
  "canCountAsRealScoreEvidence: true",
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
        canCountAsRealScoreEvidence: contract.canCountAsRealScoreEvidence,
        factorCount: contract.factors.length,
        passThreshold: contract.passThreshold,
        publicDataSource: contract.publicDataSource,
        rowCoverageStatus: contract.rowCoverage.status,
        score: contract.score,
        scoreSource: contract.scoreSource
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
