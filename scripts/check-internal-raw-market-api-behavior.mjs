import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const routePath = "src/app/api/internal/raw-market/route.ts";
const previousEnv = {
  INTERNAL_DIAGNOSTICS_ENABLED: process.env.INTERNAL_DIAGNOSTICS_ENABLED,
  INTERNAL_DIAGNOSTICS_TOKEN: process.env.INTERNAL_DIAGNOSTICS_TOKEN,
  NODE_ENV: process.env.NODE_ENV
};
const calls = {
  loader: [],
  score: []
};
const stubs = createStubs(calls);
const { GET } = loadTsModule(routePath, new Map(), stubs);

const cases = [];

process.env.INTERNAL_DIAGNOSTICS_ENABLED = "false";
process.env.INTERNAL_DIAGNOSTICS_TOKEN = "";
calls.loader.length = 0;
cases.push(
  await runCase({
    expectedBody: { status: "disabled" },
    expectedLoaderCalls: 0,
    expectedStatus: 404,
    name: "disabled route returns 404 before loading raw market data",
    request: makeRequest("http://localhost:3000/api/internal/raw-market?symbol=2330")
  })
);

process.env.INTERNAL_DIAGNOSTICS_ENABLED = "true";
process.env.INTERNAL_DIAGNOSTICS_TOKEN = "secret";
calls.loader.length = 0;
cases.push(
  await runCase({
    expectedBody: { status: "unauthorized" },
    expectedLoaderCalls: 0,
    expectedStatus: 401,
    name: "missing token returns 401 before loading raw market data",
    request: makeRequest("http://localhost:3000/api/internal/raw-market?symbol=2330")
  })
);

process.env.INTERNAL_DIAGNOSTICS_ENABLED = "true";
process.env.INTERNAL_DIAGNOSTICS_TOKEN = "secret";
calls.loader.length = 0;
calls.score.length = 0;
cases.push(
  await runCase({
    assert({ body, problems }) {
      if (body.status !== "ok") problems.push(`expected ok body, got ${body.status}`);
      if (body.publicGate?.approved !== false) problems.push("public gate must remain blocked");
      if (body.publicGate?.label !== "blocked") problems.push("public gate label must remain blocked");
      if (!body.publicGate?.blockers?.includes("score-is-mock")) problems.push("public gate should include score-is-mock");
      if (body.mixed?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
      if (body.mixed?.rawDataSource !== "real") problems.push("authorized diagnostic should expose real raw source only internally");
    },
    expectedLoaderCalls: 1,
    expectedStatus: 200,
    name: "authorized token returns internal diagnostic payload with blocked public gate",
    request: makeRequest("http://localhost:3000/api/internal/raw-market?symbol=2330&token=secret")
  })
);

process.env.INTERNAL_DIAGNOSTICS_ENABLED = "true";
process.env.INTERNAL_DIAGNOSTICS_TOKEN = "secret";
calls.loader.length = 0;
cases.push(
  await runCase({
    assert({ body, problems }) {
      if (body.status !== "not_found") problems.push(`expected not_found body, got ${body.status}`);
      if (body.symbol !== "9999") problems.push(`expected symbol 9999, got ${body.symbol}`);
    },
    expectedLoaderCalls: 1,
    expectedStatus: 404,
    name: "authorized missing snapshot returns not_found",
    request: makeRequest("http://localhost:3000/api/internal/raw-market?symbol=9999&token=secret")
  })
);

restoreEnv(previousEnv);

const failed = cases.filter((result) => !result.pass);
const status = failed.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      cases,
      loaderCalls: calls.loader,
      scoreCalls: calls.score,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}

async function runCase({ assert, expectedBody, expectedLoaderCalls, expectedStatus, name, request }) {
  const beforeLoaderCalls = calls.loader.length;
  const response = await GET(request);
  const body = await response.json();
  const loaderCalls = calls.loader.length - beforeLoaderCalls;
  const problems = [];

  if (response.status !== expectedStatus) {
    problems.push(`expected status ${expectedStatus}, got ${response.status}`);
  }

  if (loaderCalls !== expectedLoaderCalls) {
    problems.push(`expected ${expectedLoaderCalls} loader calls, got ${loaderCalls}`);
  }

  if (expectedBody) {
    for (const [key, value] of Object.entries(expectedBody)) {
      if (body[key] !== value) problems.push(`expected body.${key} ${String(value)}, got ${String(body[key])}`);
    }
  }

  assert?.({ body, problems });

  return {
    bodyStatus: body.status,
    httpStatus: response.status,
    loaderCalls,
    name,
    pass: problems.length === 0,
    problems
  };
}

function makeRequest(url, headers = {}) {
  return {
    headers: {
      get(name) {
        return headers[name.toLowerCase()] ?? null;
      }
    },
    nextUrl: new URL(url)
  };
}

function createStubs(calls) {
  return {
    "@/lib/raw-market-loader": {
      async getServerRawMarketOverview(symbol, market) {
        calls.loader.push({ market, symbol });

        if (symbol === "9999") {
          return {
            activeMarkets: [],
            market,
            snapshot: null,
            symbol
          };
        }

        return {
          activeMarkets: [
            {
              country: "TW",
              currency: "TWD",
              displayName: "Taiwan Stock Exchange",
              exchange: "TWSE",
              locale: "zh-TW",
              name: "Taiwan Stock Exchange",
              timezone: "Asia/Taipei"
            }
          ],
          market,
          snapshot: {
            fundamentals: {
              dividendYield: 2.1,
              epsTtm: 32.4,
              pb: 5.2,
              pe: 21.3,
              revenueYoy: 8.5,
              tradeDate: "2026-05-30"
            },
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
              country: "TW",
              currency: "TWD",
              exchange: "TWSE",
              id: "stock-2330",
              industry: "Semiconductor",
              isEtf: false,
              listedDate: "1994-09-05",
              market: "tw_stock",
              name: "TSMC",
              symbol: "2330",
              timezone: "Asia/Taipei"
            }
          },
          symbol
        };
      }
    },
    "@/lib/repositories/mock-market-signal-repository": {
      mockMarketSignalRepository: {
        getSnapshot(symbol, date) {
          calls.score.push({ date, symbol });
          return {
            asset: {
              group: "Stocks",
              id: `twse-${symbol}`,
              name: "TSMC",
              symbol
            },
            compositeScore: 72,
            dataQualityGrade: "B",
            dataQualityScore: 80,
            healthScore: 75,
            modelVersion: "mock-v1",
            riskScore: 28,
            signal: {
              title: "Mock signal"
            }
          };
        }
      }
    }
  };
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
