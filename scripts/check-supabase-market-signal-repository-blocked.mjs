import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const modulePath = "src/lib/repositories/supabase-market-signal-repository.ts";
const source = fs.readFileSync(path.join(root, modulePath), "utf8");
const { createSupabaseMarketSignalRepository } = loadTsModule(modulePath);

const calls = [];
const client = {
  from(table) {
    calls.push(["from", table]);
    throw new Error(`client should not be used: ${table}`);
  }
};
const repository = createSupabaseMarketSignalRepository(client);

const methodCases = [
  {
    args: [],
    name: "getAssets"
  },
  {
    args: ["2330"],
    name: "getAssetBySymbol"
  },
  {
    args: ["2330", "2026-05-30"],
    name: "getSnapshot"
  },
  {
    args: ["2330", { endDate: "2026-05-30", startDate: "2026-05-01" }],
    name: "getSeries"
  },
  {
    args: ["2330", "2026-05-30"],
    name: "getRelatedNews"
  },
  {
    args: ["2330"],
    name: "getBacktestBuckets"
  }
];

const results = methodCases.map((testCase) => {
  let message = null;
  let threw = false;

  try {
    repository[testCase.name](...testCase.args);
  } catch (error) {
    threw = true;
    message = error instanceof Error ? error.message : String(error);
  }

  const pass = threw && message === "Supabase repository is not implemented yet.";

  return {
    message,
    name: testCase.name,
    pass,
    threw
  };
});

const forbiddenPatterns = [
  /\.select\s*\(/i,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /scoreSource:\s*"real"/,
  /resolvedSource:\s*"supabase"/,
  /publicScoreSource:\s*"real"/
];
const requiredPhrases = [
  "export type SupabaseClientLike",
  "from(table: string): unknown;",
  "createSupabaseMarketSignalRepository",
  "throw new Error(\"Supabase repository is not implemented yet.\");"
];
const forbidden = forbiddenPatterns.filter((pattern) => pattern.test(source)).map(String);
const missing = requiredPhrases.filter((phrase) => !source.includes(phrase));
const failed = results.filter((result) => !result.pass);
const status = calls.length === 0 && failed.length === 0 && forbidden.length === 0 && missing.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      clientCalls: calls,
      failed,
      forbidden,
      missing,
      results,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
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
