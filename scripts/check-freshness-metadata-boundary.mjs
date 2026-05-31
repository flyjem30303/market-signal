import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const modulePath = "src/lib/freshness-metadata-boundary.ts";
const stripPath = "src/components/data-freshness-strip.tsx";
const { getFreshnessMetadataBoundarySummary } = loadTsModule(modulePath);

const baseSnapshot = {
  asOfDate: "2026-05-30",
  currency: "TWD",
  description: "metadata only",
  isMock: false,
  market: "TWSE",
  scoreSource: "mock",
  scoreSourceLabel: "mock",
  sourceName: "TWSE OpenAPI",
  state: "complete",
  stateLabel: "complete",
  timezone: "Asia/Taipei"
};

const cases = [
  runCase({
    expectedState: "metadata_mock",
    name: "mock metadata remains display-only",
    snapshot: { ...baseSnapshot, isMock: true, sourceName: "Mock repository", state: "mock" }
  }),
  runCase({
    expectedState: "metadata_reachable",
    name: "reachable metadata does not promote score or quality",
    snapshot: baseSnapshot
  }),
  runCase({
    expectedDisplay: false,
    expectedState: "metadata_unavailable",
    name: "unavailable metadata blocks display approval",
    snapshot: { ...baseSnapshot, state: "unavailable" }
  }),
  runCase({
    expectedDisplay: false,
    expectedState: "blocked_real_score",
    name: "real score metadata is blocked",
    snapshot: { ...baseSnapshot, scoreSource: "real" }
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
  process.exit(1);
}

function runCase({ expectedDisplay = true, expectedState, name, snapshot }) {
  const summary = getFreshnessMetadataBoundarySummary(snapshot);
  const problems = [];

  if (summary.state !== expectedState) {
    problems.push(`expected state ${expectedState}, got ${summary.state}`);
  }

  if (summary.canDisplayFreshnessMetadata !== expectedDisplay) {
    problems.push(`expected display ${expectedDisplay}, got ${summary.canDisplayFreshnessMetadata}`);
  }

  const falseFlags = [
    "canPromoteCp3Readiness",
    "canPromoteDataQuality",
    "canSetScoreSourceReal",
    "canSwitchPublicDataSource"
  ];

  for (const flag of falseFlags) {
    if (summary[flag] !== false) {
      problems.push(`${flag} must remain false`);
    }
  }

  return {
    name,
    pass: problems.length === 0,
    problems,
    summary: {
      canDisplayFreshnessMetadata: summary.canDisplayFreshnessMetadata,
      canPromoteCp3Readiness: summary.canPromoteCp3Readiness,
      canPromoteDataQuality: summary.canPromoteDataQuality,
      canSetScoreSourceReal: summary.canSetScoreSourceReal,
      canSwitchPublicDataSource: summary.canSwitchPublicDataSource,
      state: summary.state
    }
  };
}

function scanSource() {
  const source = fs.readFileSync(path.join(root, modulePath), "utf8");
  const strip = fs.readFileSync(path.join(root, stripPath), "utf8");
  const required = [
    [modulePath, source, "getFreshnessMetadataBoundarySummary"],
    [modulePath, source, "canPromoteCp3Readiness: false"],
    [modulePath, source, "canPromoteDataQuality: false"],
    [modulePath, source, "canSetScoreSourceReal: false"],
    [modulePath, source, "canSwitchPublicDataSource: false"],
    [modulePath, source, "Freshness metadata may inform display state only"],
    [stripPath, strip, "getFreshnessMetadataBoundarySummary"],
    [stripPath, strip, "Metadata boundary:"],
    [stripPath, strip, "metadataBoundary.stopLine"]
  ];
  const forbidden = [
    [modulePath, source, "canSetScoreSourceReal: true"],
    [modulePath, source, "canPromoteDataQuality: true"],
    [modulePath, source, "canPromoteCp3Readiness: true"],
    [modulePath, source, "canSwitchPublicDataSource: true"],
    [modulePath, source, "@supabase/supabase-js"],
    [modulePath, source, "createClient"],
    [modulePath, source, "fetch("],
    [modulePath, source, ".from("],
    [modulePath, source, ".insert("],
    [modulePath, source, ".update("],
    [modulePath, source, ".delete("]
  ];
  const problems = [];

  for (const [file, content, phrase] of required) {
    if (!content.includes(phrase)) {
      problems.push(`missing ${file}: ${phrase}`);
    }
  }

  for (const [file, content, phrase] of forbidden) {
    if (content.includes(phrase)) {
      problems.push(`forbidden ${file}: ${phrase}`);
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
