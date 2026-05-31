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
if (contract.expectedRowPolicy.policyStatus !== "defined_local_only") {
  problems.push(`expected row policy defined_local_only, got ${contract.expectedRowPolicy.policyStatus}`);
}
if (contract.expectedRowPolicy.expectedRowsPerSymbol !== 60) {
  problems.push(`expected 60 rows per symbol, got ${contract.expectedRowPolicy.expectedRowsPerSymbol}`);
}
if (contract.expectedRowPolicy.expectedTotalRows !== 360) {
  problems.push(`expected total rows 360, got ${contract.expectedRowPolicy.expectedTotalRows}`);
}
if (contract.expectedRowPolicy.provesCoverage !== false) {
  problems.push("expected row policy must not prove coverage");
}
if (contract.missingRowTolerancePolicy.policyStatus !== "defined_local_only") {
  problems.push(`expected missing-row tolerance policy defined_local_only, got ${contract.missingRowTolerancePolicy.policyStatus}`);
}
if (contract.missingRowTolerancePolicy.maxMissingRowsForCoverage !== 0) {
  problems.push(`expected zero missing rows for coverage, got ${contract.missingRowTolerancePolicy.maxMissingRowsForCoverage}`);
}
if (contract.missingRowTolerancePolicy.maxMissingRowsForScoreSourceReal !== 0) {
  problems.push(
    `expected zero missing rows for scoreSource real, got ${contract.missingRowTolerancePolicy.maxMissingRowsForScoreSourceReal}`
  );
}
if (contract.missingRowTolerancePolicy.actionWhenMissingRowsDetected !== "block real-score evidence") {
  problems.push("missing rows must block real-score evidence");
}
if (contract.missingRowTolerancePolicy.requiresOwnerReviewWhenMissingRowsDetected !== true) {
  problems.push("missing rows must require owner review");
}
if (contract.marketCalendarPolicy.policyStatus !== "defined_local_only") {
  problems.push(`expected market-calendar policy defined_local_only, got ${contract.marketCalendarPolicy.policyStatus}`);
}
if (contract.marketCalendarPolicy.calendarScope !== "TW exchange trading sessions") {
  problems.push(`expected TW exchange trading sessions, got ${contract.marketCalendarPolicy.calendarScope}`);
}
if (contract.marketCalendarPolicy.excludesWeekends !== true) problems.push("market calendar must exclude weekends");
if (contract.marketCalendarPolicy.excludesExchangeHolidays !== true) {
  problems.push("market calendar must exclude exchange holidays");
}
if (contract.marketCalendarPolicy.excludesAdHocClosures !== true) {
  problems.push("market calendar must exclude ad hoc closures");
}
if (contract.marketCalendarPolicy.usesSyntheticRows !== false) {
  problems.push("market calendar must not allow synthetic rows");
}
if (contract.marketCalendarPolicy.unresolvedCalendarAction !== "block real-score evidence") {
  problems.push("unresolved market calendar must block real-score evidence");
}
if (!contract.requirements.some((requirement) => requirement.code === "symbol-universe-defined" && requirement.state === "complete")) {
  problems.push("symbol universe requirement must be complete");
}
if (!contract.requirements.some((requirement) => requirement.code === "coverage-window-defined" && requirement.state === "complete")) {
  problems.push("coverage window requirement must be complete");
}
if (!contract.requirements.some((requirement) => requirement.code === "expected-row-policy-defined" && requirement.state === "complete")) {
  problems.push("expected row policy requirement must be complete");
}
if (!contract.requirements.some((requirement) => requirement.code === "missing-row-tolerance-defined" && requirement.state === "complete")) {
  problems.push("missing-row tolerance requirement must be complete");
}
if (!contract.requirements.some((requirement) => requirement.code === "market-calendar-treatment-defined" && requirement.state === "complete")) {
  problems.push("market-calendar treatment requirement must be complete");
}
if (contract.requirements.some((requirement) => requirement.state === "missing")) {
  problems.push("all row coverage policy requirements must be complete before read-only validation");
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
  "expectedRowPolicy",
  "missingRowTolerancePolicy",
  "marketCalendarPolicy",
  "defined_local_only",
  "Taiwan MVP watchlist universe",
  "MVP rolling 60 trading sessions",
  "latest approved freshness metadata date",
  "requiredTradingSessions: 60",
  "timezone: \"Asia/Taipei\"",
  "excludesNonTradingDays: true",
  "doesNotValidateRowCount: true",
  "expectedRowsPerSymbol: 60",
  "expectedTotalRows: 360",
  "symbol count x required trading sessions",
  "provesCoverage: false",
  "one row per symbol per trading session",
  "maxMissingRowsForCoverage: 0",
  "maxMissingRowsForScoreSourceReal: 0",
  "block real-score evidence",
  "requiresOwnerReviewWhenMissingRowsDetected: true",
  "zero missing rows before real-score evidence",
  "TW exchange trading sessions",
  "excludesWeekends: true",
  "excludesExchangeHolidays: true",
  "excludesAdHocClosures: true",
  "usesSyntheticRows: false",
  "unresolvedCalendarAction: \"block real-score evidence\"",
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
  "Row coverage policies are complete but local-only",
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
        expectedTotalRows: contract.expectedRowPolicy.expectedTotalRows,
        marketCalendarScope: contract.marketCalendarPolicy.calendarScope,
        maxPoints: contract.maxPoints,
        maxMissingRowsForCoverage: contract.missingRowTolerancePolicy.maxMissingRowsForCoverage,
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
