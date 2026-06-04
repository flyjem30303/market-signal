import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "provider-specific-terms-review-packet",
    command: "scripts/check-provider-specific-terms-review-packet.mjs",
    evidence:
      "Provider-specific packet defines attribution placement, display and redistribution limits, delay/incompleteness/outage copy, and non-advisory claim copy."
  },
  {
    id: "provider-specific-terms-post-review-rollup",
    command: "scripts/check-provider-specific-terms-post-review-rollup.mjs",
    evidence:
      "Post-review rollup keeps Legal source-terms outcome local-planning-only and does not approve provider terms."
  },
  {
    id: "trust-runtime-boundary-notice",
    command: "scripts/check-trust-runtime-boundary-notice.mjs",
    evidence:
      "Trust boundary notice is present on methodology, disclaimer, terms, privacy, and weekly pages."
  },
  {
    id: "briefing-boundary-disclosure",
    command: "scripts/check-briefing-boundary-disclosure.mjs",
    evidence:
      "Briefing page carries publicDataSource=mock and scoreSource=mock boundary disclosure."
  },
  {
    id: "stock-investor-action-summary",
    command: "scripts/check-stock-investor-action-summary.mjs",
    evidence:
      "Stock action summary keeps user-facing source and score boundaries near interpretation copy."
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
  mode: "source_rights_public_placement_readiness",
  status: allOk
    ? "local_public_placement_ready_external_rights_unapproved"
    : "blocked_public_placement_readiness_incomplete",
  owner: "Legal",
  coOwners: ["Product", "Investment"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 10 : 0,
  upgradedReadinessPercent: allOk ? 78 : 68,
  targetForMvpReview: 100,
  evidence,
  placementMap: [
    {
      id: "page-level-attribution",
      placement: "methodology, stock pages, briefing, and legal trust notice area",
      allowedCopy: "name the source category and mock runtime state without implying endorsement or active provider approval",
      blockedCopy: "official endorsement, provider terms approved, publicDataSource=supabase, real market data active"
    },
    {
      id: "delay-incompleteness-outage",
      placement: "freshness strip, briefing data panels, stock data boundary area",
      allowedCopy: "show delay, missing field, partial coverage, outage, and fallback wording as limitations",
      blockedCopy: "fresh, complete, production-ready, or investment-grade source claims"
    },
    {
      id: "redistribution-storage",
      placement: "terms, internal data gate, source-rights packet",
      allowedCopy: "state that download, export, bulk access, cache, retention, and redistribution remain blocked until approval",
      blockedCopy: "raw market data redistribution approved, export allowed, bulk access available"
    },
    {
      id: "public-investment-claim",
      placement: "stock action summary, weekly, briefing, investor roadmap",
      allowedCopy: "non-advisory observation prompts and mock-only interpretation boundaries",
      blockedCopy: "buy, sell, hold, ranking, suitability, performance, or professional indicator claims"
    }
  ],
  stillNotApproved: [
    "external provider terms",
    "source license approval",
    "raw market data redistribution",
    "download, export, or bulk access",
    "public source promotion",
    "publicDataSource=supabase",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "scoreSource=real",
    "public professional indicator claims"
  ],
  nextGapsTo100: [
    "source-specific human terms classification per selected provider",
    "actual public legal copy rewrite for disclaimer, terms, methodology, and stock pages",
    "provider-specific attribution wording accepted by Legal",
    "redistribution and retention posture accepted by Legal",
    "Legal and Investment jointly accept public claim wording"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    externalRightsVerified: false,
    externalTermsApproved: false,
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
    "This public placement readiness report does not run SQL, connect to Supabase, fetch provider terms, write data, fetch market data, print secrets, approve provider terms, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
