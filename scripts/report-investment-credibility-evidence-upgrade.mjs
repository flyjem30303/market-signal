import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "investment-non-advisory-outcome-ledger",
    command: "scripts/check-narrow-approval-outcome-ledger.mjs",
    evidence:
      "Investment non-advisory interpretation is accepted for local planning only, without scoreSource=real, ranking, advice, or recommendation approval."
  },
  {
    id: "tw-stock-backtest-method-draft",
    command: "scripts/check-cp3-tw-stock-backtest-method.mjs",
    evidence:
      "Backtest method draft names sample windows, transaction cost, false positives, false negatives, survivorship limits, and not-investment-advice boundaries."
  },
  {
    id: "stock-investor-action-summary",
    command: "scripts/check-stock-investor-action-summary.mjs",
    evidence:
      "Stock page investor action summary keeps observation, risk, stop-condition, publicDataSource=mock, and scoreSource=mock boundaries visible."
  },
  {
    id: "briefing-market-action-summary",
    command: "scripts/check-briefing-market-action-summary.mjs",
    evidence:
      "Briefing market action summary preserves mock runtime and non-advisory public wording around market action copy."
  },
  {
    id: "source-rights-mvp-readiness",
    command: "scripts/check-source-rights-mvp-readiness.mjs",
    evidence:
      "Investment claims are tied to source-rights readiness and cannot advance beyond local review while provider rights remain unapproved."
  },
  {
    id: "data-goal-readiness",
    command: "scripts/check-data-goal-readiness.mjs",
    evidence:
      "Investment interpretation remains tied to data readiness, aggregate row coverage limits, and mock score boundaries."
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
  mode: "investment_credibility_evidence_upgrade",
  status: allOk ? "local_investment_evidence_upgraded_not_real_scoring" : "blocked_investment_evidence_upgrade_incomplete",
  owner: "Investment",
  recommendedBy: "CEO",
  readinessLift: allOk ? 12 : 0,
  upgradedReadinessPercent: allOk ? 58 : 46,
  targetForMvpReview: 80,
  evidence,
  upgradedBecause: [
    "non-advisory interpretation outcome is recorded for local planning only",
    "backtest method draft documents limitations before performance claims",
    "stock investor action summary keeps observation and stop-condition wording bounded",
    "briefing market action copy remains mock-only and non-advisory",
    "source-rights readiness blocks public professional indicator claims",
    "data readiness blocks confidence or real-score claims until row coverage is complete"
  ],
  stillNotApproved: [
    "real scoring",
    "scoreSource=real",
    "buy, sell, hold, ranking, or suitability claims",
    "model confidence claims",
    "performance or backtest claims",
    "publicDataSource=supabase",
    "public professional indicator claims"
  ],
  nextGapsTo80: [
    "formula version documentation accepted by Investment",
    "data-quality downgrade policy wired into public interpretation copy",
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
    "This investment credibility evidence upgrade does not run SQL, connect to Supabase, write data, fetch market data, print secrets, approve advice, approve performance claims, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
