import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const calls = {
  activeMarkets: 0,
  createClient: 0,
  createRepository: 0,
  latestSnapshot: [],
  noStore: 0
};
const repository = {
  async getActiveMarkets() {
    calls.activeMarkets += 1;
    return [
      {
        country: "TW",
        currency: "TWD",
        displayName: "Taiwan Stock Exchange",
        exchange: "TWSE",
        locale: "zh-TW",
        name: "Taiwan Stock Exchange",
        timezone: "Asia/Taipei"
      }
    ];
  },
  async getLatestSnapshot(symbol, market) {
    calls.latestSnapshot.push({ market, symbol });
    return {
      fundamentals: null,
      price: {
        close: 1000,
        high: 1010,
        low: 990,
        open: 995,
        tradeDate: "2026-05-30",
        turnover: 123456789,
        volume: 45678
      },
      stock: {
        assetType: "stock",
        country: market.country,
        currency: "TWD",
        exchange: market.exchange,
        id: `stock-${symbol}`,
        industry: "Semiconductor",
        isEtf: false,
        listedDate: "1994-09-05",
        market: "tw_stock",
        name: "TSMC",
        symbol,
        timezone: "Asia/Taipei"
      }
    };
  }
};
const client = { id: "server-supabase-client" };
const { createServerRawMarketRepository, getServerRawMarketOverview, getServerRawMarketSnapshot } = loadTsModule(
  "src/lib/raw-market-loader.ts",
  new Map(),
  {
    "@/lib/repositories/supabase-raw-market-repository": {
      createSupabaseRawMarketRepository(observedClient) {
        calls.createRepository += 1;
        if (observedClient !== client) {
          throw new Error("raw market loader did not pass the server Supabase client to the repository factory");
        }
        return repository;
      }
    },
    "@/lib/supabase/server": {
      createServerSupabaseClient() {
        calls.createClient += 1;
        return client;
      }
    },
    "next/cache": {
      unstable_noStore() {
        calls.noStore += 1;
      }
    }
  }
);

const results = [];

resetCalls();
const createdRepository = createServerRawMarketRepository();
results.push(assertCase("repository factory wires server Supabase client", [
  expect(createdRepository === repository, "created repository should be the Supabase raw market repository"),
  expect(calls.createClient === 1, `expected one server client creation, got ${calls.createClient}`),
  expect(calls.createRepository === 1, `expected one repository creation, got ${calls.createRepository}`)
]));

resetCalls();
const snapshot = await getServerRawMarketSnapshot("2330", { country: "TW", exchange: "TWSE" });
results.push(assertCase("snapshot read disables cache and reads one latest snapshot", [
  expect(calls.noStore === 1, `expected one noStore call, got ${calls.noStore}`),
  expect(calls.createClient === 1, `expected one server client creation, got ${calls.createClient}`),
  expect(calls.createRepository === 1, `expected one repository creation, got ${calls.createRepository}`),
  expect(calls.latestSnapshot.length === 1, `expected one latest snapshot read, got ${calls.latestSnapshot.length}`),
  expect(calls.latestSnapshot[0]?.symbol === "2330", `expected symbol 2330, got ${calls.latestSnapshot[0]?.symbol}`),
  expect(snapshot?.stock.symbol === "2330", `expected returned snapshot symbol 2330, got ${snapshot?.stock.symbol}`)
]));

resetCalls();
const overview = await getServerRawMarketOverview("2382", { country: "TW", exchange: "TWSE" });
results.push(assertCase("overview read disables cache and reads market list plus snapshot", [
  expect(calls.noStore === 1, `expected one noStore call, got ${calls.noStore}`),
  expect(calls.createClient === 1, `expected one server client creation, got ${calls.createClient}`),
  expect(calls.createRepository === 1, `expected one repository creation, got ${calls.createRepository}`),
  expect(calls.activeMarkets === 1, `expected one active market read, got ${calls.activeMarkets}`),
  expect(calls.latestSnapshot.length === 1, `expected one latest snapshot read, got ${calls.latestSnapshot.length}`),
  expect(overview.symbol === "2382", `expected overview symbol 2382, got ${overview.symbol}`),
  expect(overview.activeMarkets.length === 1, `expected one active market, got ${overview.activeMarkets.length}`),
  expect(overview.snapshot?.stock.symbol === "2382", `expected returned snapshot symbol 2382, got ${overview.snapshot?.stock.symbol}`)
]));

const sourceProblems = scanLoaderSource();
const failed = results.filter((result) => !result.pass);
const status = failed.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      results,
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

function resetCalls() {
  calls.activeMarkets = 0;
  calls.createClient = 0;
  calls.createRepository = 0;
  calls.latestSnapshot = [];
  calls.noStore = 0;
}

function expect(pass, message) {
  return pass ? null : message;
}

function assertCase(name, checks) {
  const problems = checks.filter(Boolean);

  return {
    name,
    pass: problems.length === 0,
    problems
  };
}

function scanLoaderSource() {
  const source = fs.readFileSync(path.join(root, "src/lib/raw-market-loader.ts"), "utf8");
  const problems = [];
  const requiredPhrases = [
    "unstable_noStore as noStore",
    "createServerSupabaseClient()",
    "createSupabaseRawMarketRepository(client)",
    "noStore();",
    "repository.getActiveMarkets()",
    "repository.getLatestSnapshot(symbol, market)"
  ];
  const forbiddenPatterns = [/\.insert\s*\(/i, /\.update\s*\(/i, /\.delete\s*\(/i, /\.upsert\s*\(/i, /\.rpc\s*\(/i];

  for (const phrase of requiredPhrases) {
    if (!source.includes(phrase)) {
      problems.push(`missing loader phrase: ${phrase}`);
    }
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      problems.push(`forbidden loader mutation pattern: ${String(pattern)}`);
    }
  }

  return problems;
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
