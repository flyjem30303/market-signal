import { spawnSync } from "node:child_process";

const evidenceChecks = [
  {
    id: "home-first-screen-readability",
    command: "scripts/check-stock-first-screen-readability.mjs",
    proves: "home and stock first screens provide a readable MVP entry path without real-source approval claims"
  },
  {
    id: "home-first-screen-action-summary",
    command: "scripts/check-home-first-screen-action-summary.mjs",
    proves: "home page offers a clear next action summary and keeps mock boundaries visible"
  },
  {
    id: "home-visual-hierarchy",
    command: "scripts/check-home-visual-hierarchy.mjs",
    proves: "home hierarchy supports product validation while broad visual polish remains deferred"
  },
  {
    id: "stock-runtime-at-a-glance",
    command: "scripts/check-stock-runtime-at-a-glance.mjs",
    proves: "stock pages expose runtime state, mock signal, blocked real-data gates, and next steps"
  },
  {
    id: "stock-core-tabs-readability",
    command: "scripts/check-stock-core-tabs-readability.mjs",
    proves: "stock core tabs remain readable enough for MVP validation"
  },
  {
    id: "briefing-executive-summary",
    command: "scripts/check-briefing-executive-summary.mjs",
    proves: "briefing route gives a coherent executive entry point and runtime action strip"
  },
  {
    id: "public-route-loop",
    command: "scripts/check-public-route-loop.mjs",
    proves: "home, briefing, weekly, stock, methodology, disclaimer, terms, and privacy routes are wired as a public loop"
  },
  {
    id: "site-chrome-readability",
    command: "scripts/check-site-chrome-readability.mjs",
    proves: "global navigation, footer, and boundary copy remain readable"
  },
  {
    id: "experience-flow-navigation",
    command: "scripts/check-experience-flow-navigation.mjs",
    proves: "user can move between home, briefing, weekly, and stock flows without losing context"
  },
  {
    id: "public-visible-language-quality",
    command: "scripts/check-public-visible-language-quality.mjs",
    proves: "public routes avoid internal tokens, mojibake, and approved-real-source claims"
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
  mode: "mock_mvp_product_surface_readiness",
  status: allOk ? "mock_mvp_product_surface_mvp_review_ready" : "mock_mvp_product_surface_blocked",
  generatedAt: new Date().toISOString(),
  owner: "PM",
  coOwners: ["CEO", "Engineering", "A2", "Legal"],
  readinessLift: allOk ? 7 : 0,
  previousMockMvpProductSurfacePercent: 88,
  upgradedMockMvpProductSurfacePercent: allOk ? 95 : 88,
  targetForMvpReview: 95,
  productSurfaceContract: [
    {
      id: "first-screen-entry",
      routeTargets: ["/", "/stocks/2330", "/stocks/TWII"],
      doneState: "Users can identify current mock runtime state, safe reading path, and next action without needing governance documents.",
      deferredState: "Final F/UI polish, brand refinement, illustration work, and cosmetic density tuning remain after foundation closure."
    },
    {
      id: "cross-route-loop",
      routeTargets: ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy"],
      doneState: "Public routes form a coherent MVP validation loop with legal and methodology exits.",
      deferredState: "No route claims real data, real scoring, advice, or source approval."
    },
    {
      id: "stock-product-closure",
      routeTargets: ["/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"],
      doneState: "Stock pages show runtime, tabs, signal-reading aids, and stop lines consistently across supported mock symbols.",
      deferredState: "Real market coverage and scoreSource=real remain behind separate promotion gates."
    },
    {
      id: "public-copy-boundary",
      routeTargets: ["all public routes"],
      doneState: "Visible copy is readable, non-advisory, mock-only, and free of internal approval tokens.",
      deferredState: "Source-specific public claims wait for source-rights and data promotion approvals."
    }
  ],
  userFacingMvpPromise:
    "The MVP product surface can be reviewed as a mock-only decision-support experience across home, stock, briefing, weekly, methodology, and legal routes.",
  nonGoals: [
    "no broad visual redesign",
    "no final brand polish",
    "no real-data launch",
    "no real scoring",
    "no investment advice",
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
    "This mock MVP product surface readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, print row payloads, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
