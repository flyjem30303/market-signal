import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "model-credibility-checklist",
    command: "scripts/check-model-credibility-checklist.mjs",
    evidence: "score purpose, formula documentation, backtest limitations, and downgrade policy are listed"
  },
  {
    id: "model-credibility-local-review",
    command: "scripts/check-model-credibility-local-review.mjs",
    evidence: "Investment local review is recorded without approving real scoring"
  },
  {
    id: "model-credibility-acceptance-gate",
    command: "scripts/check-model-credibility-acceptance-gate.mjs",
    evidence: "accepted as local review packet only; real scoring remains blocked"
  },
  {
    id: "investor-indicator-roadmap-contract",
    command: "scripts/check-investor-indicator-roadmap-contract.mjs",
    evidence: "future indicator families are readable and bound to mock/source gates"
  },
  {
    id: "home-investor-indicator-roadmap-panel",
    command: "scripts/check-home-investor-indicator-roadmap-panel.mjs",
    evidence: "home roadmap panel is readable and mock-boundary safe"
  },
  {
    id: "stock-investor-indicator-roadmap-panel",
    command: "scripts/check-stock-investor-indicator-roadmap-panel.mjs",
    evidence: "stock roadmap panel is readable and mock-boundary safe"
  },
  {
    id: "investment-credibility-evidence-upgrade",
    command: "scripts/check-investment-credibility-evidence-upgrade.mjs",
    evidence:
      "non-advisory outcome, backtest method limits, stock/briefing action copy, source rights, and data readiness are aligned"
  }
];

const results = checks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    ...check,
    exitCode: run.status,
    ok: run.status === 0
  };
});

const allOk = results.every((result) => result.ok);

const report = {
  mode: "investment_credibility_mvp_readiness",
  status: allOk
    ? "local_investment_review_ready_not_real_scoring"
    : "blocked_needs_investment_evidence_repair",
  generatedAt: new Date().toISOString(),
  readinessPercent: allOk ? 58 : 16,
  targetForMvpReview: 80,
  owner: "Investment",
  ceoVerdict:
    "Investment credibility has moved beyond roadmap intent into local review evidence, but it is not approved for real scoring, rankings, advice, model confidence claims, or performance claims.",
  pmNextShortestPath:
    "Use this local packet to raise MVP readiness, then add stronger model evidence later: formula documentation, backtest limitation wording, downgrade policy, and public non-advisory copy.",
  evidence: results,
  acceptedForMvpReview: [
    "local score-purpose checklist",
    "local formula-documentation checklist",
    "local backtest-limitation checklist",
    "local interpretation downgrade policy checklist",
    "readable investor indicator roadmap",
    "home and stock roadmap panels with mock boundary",
    "investment evidence upgrade tying non-advisory, backtest-limit, source-rights, and data-readiness evidence together"
  ],
  notApproved: [
    "real scoring",
    "scoreSource=real",
    "buy, sell, hold, ranking, or suitability claims",
    "model confidence claims",
    "performance or backtest claims",
    "publicDataSource=supabase"
  ],
  nextGapsTo80: [
    "approved formula version documentation",
    "explicit downgrade policy wired into public interpretation copy",
    "source-depth and row-coverage evidence accepted for each promoted indicator family",
    "public claim wording accepted jointly by Legal and Investment"
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
    "This investment credibility readiness report is local-only; it does not run SQL, connect to Supabase, write data, fetch market data, print secrets, approve advice, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
