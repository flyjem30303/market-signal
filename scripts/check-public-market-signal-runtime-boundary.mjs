import fs from "node:fs";

const repositoryPath = "src/lib/repositories/market-signal-repository.ts";
const repositorySource = fs.readFileSync(repositoryPath, "utf8");

const { getMarketSignalSourceStatus } = await import("../src/lib/repositories/market-signal-source-status.ts");

const forbiddenRepositoryTokens = [
  "createServerSupabaseClient",
  "createSupabaseMarketSignalRepository",
  "supabase-market-signal-repository",
  "@supabase/supabase-js",
  'scoreSource: "real"',
  "scoreSource=\"real\"",
  "scoreSource=real",
  "resolvedSource: \"supabase\"",
  "publicScoreSource: \"real\""
];

const runtimeCases = [
  {
    env: {},
    name: "default runtime remains mock"
  },
  {
    env: {
      MARKET_SIGNAL_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    },
    name: "enabled reads with mock request remains mock"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    name: "supabase request with reads disabled remains mock"
  },
  {
    env: {
      MARKET_SIGNAL_SUPABASE_READS: "enabled",
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    name: "supabase request with enabled reads still returns public mock"
  }
];

const sourceStatusResults = runtimeCases.map((testCase) => {
  const status = getMarketSignalSourceStatus({ env: testCase.env });
  const problems = [];
  if (status.publicScoreSource !== "mock") problems.push(`publicScoreSource=${status.publicScoreSource}`);
  if (status.resolvedSource !== "mock") problems.push(`resolvedSource=${status.resolvedSource}`);

  return {
    name: testCase.name,
    pass: problems.length === 0,
    problems,
    resolvedSource: status.resolvedSource,
    publicScoreSource: status.publicScoreSource,
    supabaseRuntimeReads: status.supabaseRuntimeReads
  };
});

let invalidSourceError = null;
try {
  getMarketSignalSourceStatus({ env: { NEXT_PUBLIC_DATA_SOURCE: "invalid" } });
} catch (error) {
  invalidSourceError = error instanceof Error ? error.message : String(error);
}

const staticResults = [
  {
    pass: repositorySource.includes("return mockMarketSignalRepository;"),
    rule: "public repository returns mockMarketSignalRepository"
  },
  {
    pass: repositorySource.includes("getMarketSignalSourceStatus({ env });"),
    rule: "public repository records source status before returning mock"
  },
  ...forbiddenRepositoryTokens.map((token) => ({
    pass: !repositorySource.includes(token),
    rule: `forbidden repository token absent: ${token}`
  }))
];

const invalidSourcePass = invalidSourceError?.includes("Unsupported NEXT_PUBLIC_DATA_SOURCE") ?? false;
const failed = [
  ...sourceStatusResults.filter((result) => !result.pass),
  ...staticResults.filter((result) => !result.pass),
  ...(invalidSourcePass ? [] : [{ name: "invalid source rejected", pass: false }])
];

console.log(
  JSON.stringify(
    {
      checked_files: [repositoryPath, "src/lib/repositories/market-signal-source-status.ts"],
      invalidSourceError,
      invalidSourcePass,
      sourceStatusResults,
      staticResults,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exitCode = 1;
}
