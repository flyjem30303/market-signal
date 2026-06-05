import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "data-coverage-backfill-plan",
    command: "scripts/check-data-coverage-backfill-plan.mjs",
    routeUse:
      "Defines expected rows, observed rows, missing rows, TWII/ETF/equity source lanes, and report-only next steps."
  },
  {
    id: "backfill-ingestion-design-gate",
    command: "scripts/check-backfill-ingestion-design-gate.mjs",
    routeUse:
      "Defines source-rights, target relation boundary, dry-run report, rollback/retention, and post-run review requirements before execution."
  },
  {
    id: "source-specific-backfill-design-packet",
    command: "scripts/check-source-specific-backfill-design-packet.mjs",
    routeUse:
      "Splits TWII, ETF, equity, storage-boundary, and QA acceptance decisions while keeping every future execution behind a separate gate."
  },
  {
    id: "promotion-prerequisites-gate",
    command: "scripts/check-promotion-prerequisites-gate.mjs",
    routeUse:
      "Keeps remote evidence blockers, external approval blockers, post-run review fields, and promotion locks explicit."
  },
  {
    id: "source-rights-specific-classification-readiness",
    command: "scripts/check-source-rights-specific-classification-readiness.mjs",
    routeUse:
      "Connects source-specific rights classification to data coverage planning before public source wording or source promotion."
  },
  {
    id: "source-specific-acceptance-packets-readiness",
    command: "scripts/check-source-specific-acceptance-packets-readiness.mjs",
    routeUse:
      "Consolidates TWII, ETF, equity, storage-boundary, and QA acceptance packet states into one no-write decision map."
  }
];

const evidence = checks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    id: check.id,
    ok: run.status === 0,
    routeUse: check.routeUse
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "data_coverage_quality_route_readiness",
  status: allOk ? "no_write_coverage_quality_route_ready_for_review" : "blocked_route_inputs_incomplete",
  owner: "Data",
  coOwners: ["Engineering", "Legal", "QA", "PM"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 24 : 0,
  upgradedReadinessPercent: allOk ? 88 : 64,
  targetForMvpReview: 95,
  routeDecision:
    "Use the accepted aggregate-incomplete readonly evidence to prepare source-specific, report-only coverage and quality decisions before any SQL, write, ingestion, or public promotion.",
  evidence,
  localRouteReady: [
    "TWII remains the clearest missing-row blocker and requires source selection before parser or public coverage claims",
    "ETF coverage remains source-rights gated before dry-run implementation",
    "Equity coverage can reuse existing TWSE STOCK_DAY design evidence for a report-only dry-run packet",
    "future mutation target must be decided separately, preferably staging-first unless CEO accepts direct-write risk",
    "QA thresholds, rollback, retention, sanitized output, and post-run review are required before any row coverage point award",
    "source-specific acceptance packets are reviewable as a no-write decision map before execution"
  ],
  stillNotApproved: [
    "SQL execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data fetch",
    "market data ingestion",
    "raw market data storage",
    "row coverage points",
    "data-quality score increase",
    "publicDataSource=supabase",
    "scoreSource=real",
    "public coverage claims"
  ],
  nextGapsTo95: [
    "human acceptance of TWII source candidate and rights terms",
    "ETF source-rights and field-coverage acceptance",
    "equity report-only dry-run acceptance criteria",
    "staging-first versus direct-write decision packet",
    "QA threshold acceptance for row coverage and data-quality lift"
  ],
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
    "This coverage and quality route readiness report does not connect to Supabase, run SQL, write Supabase, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, print row payloads, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
