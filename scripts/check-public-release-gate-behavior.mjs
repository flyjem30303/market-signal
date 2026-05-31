import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const filesUnderCheck = [
  "src/lib/mixed-market-adapter.ts",
  "src/lib/mixed-data-quality.ts",
  "src/lib/public-release-gate.ts"
];
const { buildMixedMarketSnapshot } = loadTsModule("src/lib/mixed-market-adapter.ts");
const { buildMixedDataQualitySummary } = loadTsModule("src/lib/mixed-data-quality.ts");
const { buildPublicReleaseGate } = loadTsModule("src/lib/public-release-gate.ts");

const score = {
  asset: {
    group: "Stocks",
    id: "twse-2330",
    name: "TSMC",
    symbol: "2330"
  }
};
const fullRaw = {
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
};
const etfRaw = {
  fundamentals: null,
  price: fullRaw.price,
  stock: {
    ...fullRaw.stock,
    assetType: "etf",
    id: "stock-0050",
    industry: null,
    isEtf: true,
    name: "Yuanta Taiwan 50",
    symbol: "0050"
  }
};

const cases = [
  {
    assert({ gate, mixed, problems, quality }) {
      expect(mixed.rawDataSource, "real", "full raw source", problems);
      expect(mixed.scoreSource, "mock", "full raw score source", problems);
      expect(quality.qualityLabel, "internal-only", "full raw quality label", problems);
      expect(quality.scoreCanBeShownPublicly, false, "full raw public score flag", problems);
      expect(gate.approved, false, "full raw gate approved flag", problems);
      expect(gate.label, "blocked", "full raw gate label", problems);
      requireIncludes(gate.blockers, "score-is-mock", "full raw gate blockers", problems);
      requireIncludes(gate.blockers, "score-not-approved-for-public-use", "full raw gate blockers", problems);
      requireExcludes(gate.blockers, "raw-market-data-not-real", "full raw gate blockers", problems);
    },
    name: "real raw data with mock score stays blocked",
    raw: fullRaw
  },
  {
    assert({ gate, mixed, problems, quality }) {
      expect(mixed.rawDataSource, "unavailable", "missing raw source", problems);
      expect(quality.qualityLabel, "unavailable", "missing raw quality label", problems);
      requireIncludes(mixed.warnings, "raw-market-data-unavailable", "missing raw warnings", problems);
      requireIncludes(mixed.warnings, "latest-price-unavailable", "missing raw warnings", problems);
      requireIncludes(gate.blockers, "raw-market-data-not-real", "missing raw gate blockers", problems);
      requireIncludes(gate.blockers, "raw-market-data-unavailable", "missing raw gate blockers", problems);
      requireIncludes(gate.blockers, "latest-price-unavailable", "missing raw gate blockers", problems);
      requireIncludes(gate.blockers, "score-is-mock", "missing raw gate blockers", problems);
    },
    name: "missing raw data is unavailable and blocked",
    raw: null
  },
  {
    assert({ gate, mixed, problems, quality }) {
      expect(mixed.stock.isEtf, true, "ETF stock type", problems);
      expect(quality.qualityLabel, "internal-only", "ETF quality label", problems);
      requireIncludes(mixed.warnings, "fundamentals-not-applicable-for-etf", "ETF warnings", problems);
      requireExcludes(gate.blockers, "fundamentals-not-applicable-for-etf", "ETF gate blockers", problems);
      requireExcludes(gate.blockers, "latest-fundamentals-unavailable", "ETF gate blockers", problems);
    },
    name: "ETF missing fundamentals is informational only",
    raw: etfRaw
  }
].map((testCase) => {
  const mixed = buildMixedMarketSnapshot({
    raw: testCase.raw,
    score
  });
  const quality = buildMixedDataQualitySummary(mixed);
  const gate = buildPublicReleaseGate({ mixed, quality });
  const problems = [];

  testCase.assert({ gate, mixed, problems, quality });

  return {
    blockers: gate.blockers,
    name: testCase.name,
    pass: problems.length === 0,
    problems,
    qualityLabel: quality.qualityLabel,
    rawDataSource: mixed.rawDataSource,
    scoreSource: mixed.scoreSource,
    warnings: mixed.warnings
  };
});

const nullQuality = buildMixedDataQualitySummary(null);
const nullGate = buildPublicReleaseGate({ mixed: null, quality: nullQuality });
const forcedGate = buildPublicReleaseGate({
  mixed: {
    ...buildMixedMarketSnapshot({ raw: fullRaw, score }),
    scoreSource: "real"
  },
  quality: {
    ...buildMixedDataQualitySummary(buildMixedMarketSnapshot({ raw: fullRaw, score })),
    caveats: [],
    scoreCanBeShownPublicly: true
  }
});
const invariantProblems = [];

expect(nullQuality.qualityLabel, "unavailable", "null quality label", invariantProblems);
requireIncludes(nullGate.blockers, "mixed-snapshot-unavailable", "null gate blockers", invariantProblems);
expect(forcedGate.approved, false, "forced gate approved flag", invariantProblems);
expect(forcedGate.label, "blocked", "forced gate label", invariantProblems);
requireIncludes(forcedGate.blockers, "score-source-not-approved", "forced gate blockers", invariantProblems);

const sourceProblems = scanSources();
const failed = cases.filter((result) => !result.pass);
const status = failed.length === 0 && invariantProblems.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      cases,
      invariantProblems,
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

function expect(actual, expected, label, problems) {
  if (actual !== expected) {
    problems.push(`${label} expected ${String(expected)}, got ${String(actual)}`);
  }
}

function requireIncludes(values, expected, label, problems) {
  if (!values.includes(expected)) {
    problems.push(`${label} should include ${expected}`);
  }
}

function requireExcludes(values, expected, label, problems) {
  if (values.includes(expected)) {
    problems.push(`${label} should not include ${expected}`);
  }
}

function scanSources() {
  const problems = [];

  for (const file of filesUnderCheck) {
    const sourceText = fs.readFileSync(path.join(root, file), "utf8");
    const forbiddenPatterns = [
      /approved:\s*true/,
      /scoreCanBeShownPublicly:\s*true/,
      /scoreSource:\s*"real"/
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(sourceText)) {
        problems.push(`${file} contains forbidden public-release pattern ${String(pattern)}`);
      }
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
