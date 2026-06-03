import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const { getPromotionPrerequisitesGate } = loadTsModule("src/lib/promotion-prerequisites-gate.ts");
const gate = getPromotionPrerequisitesGate();

const report = {
  mode: "promotion_prerequisites_gate_report",
  status: gate.status,
  headline: gate.headline,
  mainlineUse: gate.nextMainlineUse,
  decisionPacket: {
    canPrepareReadonlyDecisionPacket: gate.canPrepareReadonlyDecisionPacket,
    mustNotExecuteReadonlyAttemptFromThisReport: true,
    publicDataSource: gate.publicDataSource,
    scoreSource: gate.scoreSource
  },
  localOnlyCompleted: gate.items
    .filter((item) => item.state === "complete_local_only")
    .map(({ code, evidence, label, nextAction, owner }) => ({ code, evidence, label, nextAction, owner })),
  remoteEvidenceBlockers: gate.items
    .filter((item) => item.state === "blocked_remote_evidence")
    .map(({ blocker, code, evidence, label, nextAction, owner }) => ({
      blocker,
      code,
      evidence,
      label,
      nextAction,
      owner
    })),
  externalApprovalBlockers: gate.items
    .filter((item) => item.state === "blocked_external")
    .map(({ blocker, code, evidence, label, nextAction, owner }) => ({
      blocker,
      code,
      evidence,
      label,
      nextAction,
      owner
    })),
  postRunReviewRequiredFields: gate.postRunReviewRequiredFields,
  promotionLocks: {
    canAwardDataQualityPoints: gate.canAwardDataQualityPoints,
    canAwardRowCoveragePoints: gate.canAwardRowCoveragePoints,
    canPromotePublicDataSource: gate.canPromotePublicDataSource,
    canSetScoreSourceReal: gate.canSetScoreSourceReal
  },
  safety: {
    rawMarketDataFetched: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    stagingRowsCreated: false,
    supabaseConnected: false,
    supabaseWritten: false
  },
  stopLine: gate.stopLine
};

console.log(JSON.stringify(report, null, 2));

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
