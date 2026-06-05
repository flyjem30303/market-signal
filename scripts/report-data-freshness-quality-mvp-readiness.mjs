import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "data-quality-field-validity-acceptance-gate",
    command: "scripts/check-data-quality-field-validity-acceptance-gate.mjs",
    evidence:
      "Field validity rules and downgrade behavior are accepted as local QA-reviewed spec only, without awarding data-quality points."
  },
  {
    id: "data-quality-score-contract",
    command: "scripts/check-data-quality-score-contract.mjs",
    evidence:
      "Data-quality score contract defines row coverage, field validity, downgrade rules, source rights, and disclosure blockers while keeping scoreSource mock."
  },
  {
    id: "data-coverage-backfill-plan",
    command: "scripts/check-data-coverage-backfill-plan.mjs",
    evidence:
      "Backfill plan defines report-only source lanes, expected rows, missing rows, and no-write/no-ingestion stop lines."
  },
  {
    id: "row-coverage-evidence-acceptance",
    command: "scripts/check-row-coverage-evidence-acceptance.mjs",
    evidence:
      "Row coverage evidence is accepted for next decision only; it does not award row coverage points or approve runtime promotion."
  },
  {
    id: "data-goal-readiness",
    command: "scripts/check-data-goal-readiness.mjs",
    evidence:
      "Data goal readiness has accepted bounded readonly post-run review, but aggregate row coverage remains incomplete."
  },
  {
    id: "source-rights-public-placement-readiness",
    command: "scripts/check-source-rights-public-placement-readiness.mjs",
    evidence:
      "Source-rights placement maps attribution, delay/outage, redistribution, storage, and non-advisory claim boundaries for public data wording."
  },
  {
    id: "promotion-prerequisites-gate",
    command: "scripts/check-promotion-prerequisites-gate.mjs",
    evidence:
      "Promotion prerequisites gate defines completed local prerequisites, remote evidence blockers, external approval blockers, post-run review fields, and promotion locks before any readonly decision packet."
  },
  {
    id: "data-coverage-quality-route-readiness",
    command: "scripts/check-data-coverage-quality-route-readiness.mjs",
    evidence:
      "No-write coverage and quality route readiness consolidates source-specific backfill planning, design-gate requirements, source-rights inputs, QA thresholds, and promotion locks."
  },
  {
    id: "source-specific-acceptance-packets-readiness",
    command: "scripts/check-source-specific-acceptance-packets-readiness.mjs",
    evidence:
      "Source-specific acceptance packets readiness consolidates TWII, ETF, equity, storage-boundary, and QA acceptance states without authorizing execution."
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
    evidence: check.evidence
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "data_freshness_quality_mvp_readiness",
  status: allOk ? "local_data_quality_route_ready_promotion_blocked" : "blocked_data_quality_route_incomplete",
  owner: "Data",
  coOwners: ["QA", "Legal", "Engineering"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 24 : 0,
  upgradedReadinessPercent: allOk ? 88 : 64,
  targetForMvpReview: 95,
  mvpMeaning:
    "Data freshness and quality evidence has a local reviewable route, but it is not ready for public source promotion, data-quality score lift, ingestion, SQL, or real scoring.",
  evidence,
  locallyAccepted: [
    "field validity and downgrade behavior are locally QA-reviewed",
    "data quality score contract identifies the exact blockers before real-score candidacy",
    "coverage/backfill plan maps source lanes, expected rows, observed rows, and missing rows without writes",
    "row coverage evidence is accepted as next-decision material only",
    "bounded readonly post-run review is accepted but aggregate coverage remains incomplete",
    "source-rights public placement is mapped before any public data wording",
    "promotion prerequisites define post-run review fields and promotion locks before any readonly decision packet",
    "no-write coverage and quality route is reviewable before any SQL, write, ingestion, or public promotion",
    "source-specific acceptance packets are reviewable without authorizing execution or promotion"
  ],
  stillNotApproved: [
    "data-quality score increase",
    "row coverage points",
    "publicDataSource=supabase",
    "scoreSource=real",
    "SQL execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data ingestion",
    "raw market data storage",
    "public real-data claims"
  ],
  nextGapsTo95: [
    "source-specific human terms classification",
    "coverage/backfill route approval for missing aggregate rows",
    "field validity evidence from accepted source lanes",
    "QA acceptance of data-quality score threshold without override",
    "public disclosure acceptance for freshness, quality, and source limitations"
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
    "This data freshness and quality readiness report does not run SQL, connect to Supabase, write data, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, award data-quality points, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
