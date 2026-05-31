import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const gatePath = "src/lib/data-quality-evidence-gate.ts";
const { buildDataQualityEvidenceGate } = loadTsModule(gatePath);

const approvedInput = {
  claimApprovalState: "approved",
  dataQualityScore: 92,
  disclosureApprovalState: "approved",
  freshnessState: "complete",
  modelApprovalState: "approved",
  qaApprovalState: "approved",
  sourceDepthState: "approved",
  sourceRightsState: "approved"
};

const cases = [
  runCase({
    expectedCompleted: [],
    expectedProgress: 0,
    expectedMissing: [
      "freshness_state_complete",
      "data_quality_score_at_least_80",
      "source_depth_approved",
      "source_rights_approved",
      "qa_approved",
      "model_approved",
      "disclosure_approved",
      "claim_approved"
    ],
    expectedStatus: "blocked",
    input: {},
    name: "empty evidence stays blocked"
  }),
  runCase({
    expectedCompleted: ["freshness_state_complete"],
    expectedProgress: 13,
    expectedMissing: ["data_quality_score_at_least_80"],
    expectedStatus: "blocked",
    input: { ...approvedInput, dataQualityScore: 79 },
    name: "quality score below threshold stays blocked"
  }),
  runCase({
    expectedCompleted: ["freshness_state_complete"],
    expectedProgress: 13,
    expectedMissing: [],
    expectedStatus: "candidate",
    input: approvedInput,
    name: "complete evidence becomes candidate only"
  })
];

const sourceProblems = scanSource();
const failed = cases.filter((result) => !result.pass);
const status = failed.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(JSON.stringify({ cases, sourceProblems, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}

function runCase({ expectedCompleted, expectedMissing, expectedProgress, expectedStatus, input, name }) {
  const gate = buildDataQualityEvidenceGate(input);
  const problems = [];

  if (gate.status !== expectedStatus) {
    problems.push(`expected status ${expectedStatus}, got ${gate.status}`);
  }

  for (const item of expectedMissing) {
    if (!gate.missingEvidence.includes(item)) {
      problems.push(`missing evidence item not reported: ${item}`);
    }
  }

  for (const item of expectedCompleted) {
    if (!gate.completedEvidence.includes(item)) {
      problems.push(`completed evidence item not reported: ${item}`);
    }
  }

  if (gate.completedEvidence.length !== expectedCompleted.length) {
    problems.push(`expected ${expectedCompleted.length} completed evidence items, got ${gate.completedEvidence.length}`);
  }

  if (gate.evidenceProgressPercent !== expectedProgress) {
    problems.push(`expected evidence progress ${expectedProgress}, got ${gate.evidenceProgressPercent}`);
  }

  for (const item of gate.completedEvidence) {
    if (gate.missingEvidence.includes(item)) {
      problems.push(`completed evidence must not remain missing: ${item}`);
    }
  }

  if (gate.missingEvidence.length !== expectedMissing.length) {
    problems.push(`expected ${expectedMissing.length} missing evidence items, got ${gate.missingEvidence.length}`);
  }

  if (gate.canSetScoreSourceReal !== false || gate.scoreSource !== "mock" || gate.publicDataSource !== "mock") {
    problems.push("gate must keep scoreSource real and public data source blocked");
  }

  if (gate.missingActions.length !== gate.missingEvidence.length) {
    problems.push("missing actions must match missing evidence count");
  }

  for (const action of gate.missingActions) {
    if (!action.owner || !action.gate || !action.nextAction) {
      problems.push(`missing action details for ${action.code}`);
    }
  }

  return {
    gate: {
      canSetScoreSourceReal: gate.canSetScoreSourceReal,
      completedEvidence: gate.completedEvidence,
      evidenceProgressPercent: gate.evidenceProgressPercent,
      missingActions: gate.missingActions,
      missingEvidence: gate.missingEvidence,
      publicDataSource: gate.publicDataSource,
      scoreSource: gate.scoreSource,
      status: gate.status
    },
    name,
    pass: problems.length === 0,
    problems
  };
}

function scanSource() {
  const source = fs.readFileSync(path.join(root, gatePath), "utf8");
  const required = [
    "buildDataQualityEvidenceGate",
    "DataQualityEvidenceAction",
    "DataQualityEvidenceCompletedCode",
    "completedEvidence",
    "evidenceProgressPercent",
    "evidenceActions",
    "minimumQualityScore = 80",
    "freshness_state_complete",
    "data_quality_score_at_least_80",
    "source_depth_approved",
    "source_rights_approved",
    "qa_approved",
    "model_approved",
    "disclosure_approved",
    "claim_approved",
    "owner: \"Data\"",
    "owner: \"Engineering\"",
    "owner: \"Investment\"",
    "owner: \"Legal\"",
    "owner: \"PM\"",
    "source-depth",
    "legal-rights",
    "canSetScoreSourceReal: false",
    'publicDataSource: "mock"',
    'scoreSource: "mock"',
    "scoreSource=real, public data source changes, SQL, writes, and ingestion remain separate approvals"
  ];
  const forbidden = [
    "@supabase/supabase-js",
    "createClient",
    "fetch(",
    ".from(",
    ".insert(",
    ".update(",
    ".delete(",
    "canSetScoreSourceReal: true",
    'publicDataSource: "supabase"',
    'scoreSource: "real"'
  ];
  const problems = [];

  for (const phrase of required) {
    if (!source.includes(phrase)) {
      problems.push(`missing:${phrase}`);
    }
  }

  for (const phrase of forbidden) {
    if (source.includes(phrase)) {
      problems.push(`forbidden:${phrase}`);
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
