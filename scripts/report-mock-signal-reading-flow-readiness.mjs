import { spawnSync } from "node:child_process";

const evidenceChecks = [
  {
    id: "first-screen-action-summary",
    command: "scripts/check-stock-first-screen-action-summary.mjs",
    proves: "stock first-screen signal reading has runtime summary, decision aid groups, mock-only limits, and next-step copy"
  },
  {
    id: "investor-action-summary",
    command: "scripts/check-stock-investor-action-summary.mjs",
    proves: "stock action summary separates observation, primary risk, stop condition, and safety line without advice"
  },
  {
    id: "runtime-product-summary",
    command: "scripts/check-runtime-product-summary.mjs",
    proves: "home and stock runtime summary explain what can be used now, what is not live, and which gate comes next"
  },
  {
    id: "investment-public-claim-readiness",
    command: "scripts/check-investment-public-claim-readiness.mjs",
    proves: "public investment wording remains non-advisory and blocks ranking, advice, model confidence, and performance claims"
  },
  {
    id: "source-rights-public-copy-acceptance",
    command: "scripts/check-source-rights-public-copy-acceptance-readiness.mjs",
    proves: "source, redistribution, retention, investment-claim, and runtime-boundary copy are accepted for mock MVP public placement"
  },
  {
    id: "public-language-quality",
    command: "scripts/check-public-visible-language-quality.mjs",
    proves: "public-facing language remains readable enough for MVP validation"
  }
];

const evidence = evidenceChecks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    ...check,
    ok: run.status === 0,
    exitCode: run.status,
    stderr: run.status === 0 ? "" : run.stderr.trim().slice(0, 240)
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "mock_signal_reading_flow_readiness",
  status: allOk ? "mock_signal_reading_flow_mvp_review_ready" : "mock_signal_reading_flow_blocked",
  generatedAt: new Date().toISOString(),
  owner: "PM",
  coOwners: ["CEO", "Investment", "Legal", "Engineering"],
  readinessLift: allOk ? 9 : 0,
  previousMockSignalReadingFlowPercent: 86,
  upgradedMockSignalReadingFlowPercent: allOk ? 95 : 86,
  targetForMvpReview: 95,
  readingFlowContract: [
    {
      id: "read-the-state",
      userQuestion: "What is the current mock signal saying?",
      allowedReading: "Use mock composite score, risk direction, runtime status, and data-quality context for product validation only.",
      blockedReading: "Do not treat the mock signal as a buy, sell, ranking, model-confidence, or real-data claim."
    },
    {
      id: "check-the-limits",
      userQuestion: "Why might this signal be incomplete?",
      allowedReading: "Show missing modules, stale-data flags, source-rights limits, row coverage limits, and mock scoreSource boundaries.",
      blockedReading: "Do not hide incomplete data behind professional-sounding claims or imply backtested accuracy."
    },
    {
      id: "decide-the-next-review",
      userQuestion: "What needs review before this becomes real?",
      allowedReading: "Route to data coverage, source rights, model credibility, public claim, and real-source promotion gates.",
      blockedReading: "Do not promote publicDataSource=supabase or scoreSource=real from this mock reading flow."
    },
    {
      id: "stop-when-conditions-fail",
      userQuestion: "When should the user stop interpreting the signal?",
      allowedReading: "Stop when data is stale, source rights are unresolved, coverage is incomplete, or safety gates are blocked.",
      blockedReading: "Do not continue into investment advice, performance projection, or hidden raw data assumptions."
    }
  ],
  userFacingMvpPromise:
    "The MVP can explain mock signal state, risk direction, missing evidence, and next review gates in a readable, non-advisory way.",
  nonGoals: [
    "no real scoring",
    "no investment advice",
    "no ranking or recommendation",
    "no public performance claim",
    "no raw market-data evidence",
    "no source promotion"
  ],
  evidence,
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This mock signal reading flow readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, print row payloads, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
