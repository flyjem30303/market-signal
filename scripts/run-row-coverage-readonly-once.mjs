import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const REQUIRED_CONFIRMATION = "CP3_ROW_COVERAGE_READONLY_VALIDATE";
const root = process.cwd();

if (process.env.ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION !== REQUIRED_CONFIRMATION) {
  printSanitized({
    mode: "row_coverage_guarded_readonly_runner",
    reason: "missing_confirmation",
    remoteAttempted: false,
    status: "blocked"
  });
  process.exit(1);
}

const { getRowCoverageReadonlyLocalPreflight } = loadTsModule("src/lib/row-coverage-readonly-local-preflight.ts");
const preflight = getRowCoverageReadonlyLocalPreflight(process.env);

if (preflight.status !== "ready_for_guarded_readonly_decision") {
  printSanitized({
    mode: "row_coverage_guarded_readonly_runner",
    preflightStatus: preflight.status,
    reason: "preflight_blocked",
    remoteAttempted: false,
    status: "blocked",
    targetRelation: preflight.targetRelation
  });
  process.exit(1);
}

printSanitized({
  mode: "row_coverage_guarded_readonly_runner",
  preflightStatus: preflight.status,
  reason: "runner_skeleton_no_remote_execution",
  remoteAttempted: false,
  status: "blocked",
  targetRelation: preflight.targetRelation
});
process.exit(1);

function printSanitized(payload) {
  console.log(
    JSON.stringify(
      {
        ...payload,
        canAwardRowCoveragePoints: false,
        canClaimCoverage: false,
        canSetScoreSourceReal: false,
        connectionAttempted: false,
        filesWritten: false,
        mutations: false,
        publicDataSource: "mock",
        rowPayloadsPrinted: false,
        scoreSource: "mock",
        secretsPrinted: false,
        sqlExecuted: false
      },
      null,
      2
    )
  );
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
