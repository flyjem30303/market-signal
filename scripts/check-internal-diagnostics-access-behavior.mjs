import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const previousEnv = {
  INTERNAL_DIAGNOSTICS_ENABLED: process.env.INTERNAL_DIAGNOSTICS_ENABLED,
  INTERNAL_DIAGNOSTICS_TOKEN: process.env.INTERNAL_DIAGNOSTICS_TOKEN
};
const notFoundCalls = [];
const { assertInternalDiagnosticsAccess } = loadTsModule("src/lib/internal-diagnostics.ts", new Map(), {
  "next/navigation": {
    notFound() {
      notFoundCalls.push({ index: notFoundCalls.length });
      throw new Error("NEXT_NOT_FOUND");
    }
  }
});

const cases = [
  {
    enabled: "false",
    expected: "not_found",
    name: "disabled diagnostics always notFound",
    token: undefined,
    tokenEnv: ""
  },
  {
    enabled: "true",
    expected: "allowed",
    name: "enabled diagnostics without token env allows local access",
    token: undefined,
    tokenEnv: ""
  },
  {
    enabled: "true",
    expected: "not_found",
    name: "enabled diagnostics rejects missing token when token env is set",
    token: undefined,
    tokenEnv: "secret"
  },
  {
    enabled: "true",
    expected: "not_found",
    name: "enabled diagnostics rejects wrong token",
    token: "wrong",
    tokenEnv: "secret"
  },
  {
    enabled: "true",
    expected: "allowed",
    name: "enabled diagnostics accepts matching token",
    token: "secret",
    tokenEnv: "secret"
  }
].map((testCase) => runCase(testCase));

restoreEnv(previousEnv);

const failed = cases.filter((result) => !result.pass);
const sourceProblems = scanInternalSource();
const status = failed.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      cases,
      notFoundCalls: notFoundCalls.length,
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

function runCase({ enabled, expected, name, token, tokenEnv }) {
  process.env.INTERNAL_DIAGNOSTICS_ENABLED = enabled;
  process.env.INTERNAL_DIAGNOSTICS_TOKEN = tokenEnv;

  const beforeCalls = notFoundCalls.length;
  let observed = "allowed";

  try {
    assertInternalDiagnosticsAccess(token);
  } catch (error) {
    observed = error instanceof Error && error.message === "NEXT_NOT_FOUND" ? "not_found" : `error:${String(error)}`;
  }

  const callDelta = notFoundCalls.length - beforeCalls;
  const problems = [];

  if (observed !== expected) {
    problems.push(`expected ${expected}, got ${observed}`);
  }

  if (expected === "not_found" && callDelta !== 1) {
    problems.push(`expected one notFound call, got ${callDelta}`);
  }

  if (expected === "allowed" && callDelta !== 0) {
    problems.push(`expected no notFound call, got ${callDelta}`);
  }

  return {
    name,
    observed,
    pass: problems.length === 0,
    problems
  };
}

function scanInternalSource() {
  const source = fs.readFileSync(path.join(root, "src/lib/internal-diagnostics.ts"), "utf8");
  const problems = [];
  const enabledIndex = source.indexOf('process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true"');
  const tokenIndex = source.indexOf("const expectedToken = process.env.INTERNAL_DIAGNOSTICS_TOKEN");
  const tokenCompareIndex = source.indexOf("if (expectedToken && token !== expectedToken)");

  if (!(enabledIndex >= 0 && tokenIndex > enabledIndex && tokenCompareIndex > tokenIndex)) {
    problems.push("internal diagnostics must check enabled state before token comparison");
  }

  if (!source.includes("notFound();")) {
    problems.push("internal diagnostics must use Next notFound boundary");
  }

  return problems;
}

function restoreEnv(previousEnv) {
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function loadTsModule(relativePath, cache = new Map(), stubs = {}) {
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
  const localRequire = createLocalRequire(relativePath, cache, stubs);
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(localRequire, module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache, stubs) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (stubs[specifier]) {
      return stubs[specifier];
    }

    if (specifier.startsWith("@/")) {
      return loadTsModule(`src/${specifier.slice(2)}.ts`, cache, stubs);
    }

    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      const resolved = path.normalize(path.join(baseDirectory, `${specifier}.ts`));
      return loadTsModule(resolved, cache, stubs);
    }

    return nativeRequire(specifier);
  };
}
