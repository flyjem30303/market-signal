const { getMarketSignalSourceStatus } = await import("../src/lib/repositories/market-signal-source-status.ts");

const cases = [
  {
    env: {},
    expected: {
      publicScoreSource: "mock",
      requestedSource: "mock",
      resolvedSource: "mock",
      supabaseRuntimeReads: "disabled"
    },
    name: "default mock"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "mock",
      MARKET_SIGNAL_SUPABASE_READS: "enabled"
    },
    expected: {
      publicScoreSource: "mock",
      requestedSource: "mock",
      resolvedSource: "mock",
      supabaseRuntimeReads: "enabled"
    },
    name: "mock request with reads enabled still mock"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    },
    expected: {
      publicScoreSource: "mock",
      requestedSource: "supabase",
      resolvedSource: "mock",
      supabaseRuntimeReads: "disabled"
    },
    name: "supabase request with reads disabled"
  },
  {
    env: {
      NEXT_PUBLIC_DATA_SOURCE: "supabase",
      MARKET_SIGNAL_SUPABASE_READS: "enabled"
    },
    expected: {
      publicScoreSource: "mock",
      requestedSource: "supabase",
      resolvedSource: "mock",
      supabaseRuntimeReads: "enabled"
    },
    name: "supabase request with reads enabled remains public mock"
  }
];

const results = cases.map((testCase) => {
  const observed = getMarketSignalSourceStatus({ env: testCase.env });
  const pass = Object.entries(testCase.expected).every(([key, value]) => observed[key] === value);

  return {
    expected: testCase.expected,
    name: testCase.name,
    observed,
    pass
  };
});

let invalidSourceError = null;
try {
  getMarketSignalSourceStatus({ env: { NEXT_PUBLIC_DATA_SOURCE: "invalid" } });
} catch (error) {
  invalidSourceError = error instanceof Error ? error.message : String(error);
}

const invalidSourcePass = invalidSourceError?.includes("Unsupported NEXT_PUBLIC_DATA_SOURCE") ?? false;
const failed = results.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      invalidSourceError,
      invalidSourcePass,
      results,
      status: failed.length === 0 && invalidSourcePass ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0 || !invalidSourcePass) {
  process.exitCode = 1;
}
