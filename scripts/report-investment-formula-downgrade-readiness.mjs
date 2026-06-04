import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "model-credibility-checklist",
    command: "scripts/check-model-credibility-checklist.mjs",
    evidence:
      "Formula documentation, input fields, weighting approach, normalization approach, missing input behavior, and version naming are locally listed."
  },
  {
    id: "model-credibility-local-review",
    command: "scripts/check-model-credibility-local-review.mjs",
    evidence:
      "Investment review keeps formula version promotion, model confidence, and scoreSource=real blocked."
  },
  {
    id: "model-credibility-acceptance-gate",
    command: "scripts/check-model-credibility-acceptance-gate.mjs",
    evidence:
      "Model credibility is accepted as local review material only, not approval for real scoring."
  },
  {
    id: "data-quality-downgrade-state",
    command: "scripts/check-data-quality-downgrade-state.mjs",
    evidence:
      "Runtime downgrade states keep public score use false and scoreSource mock even when metadata is complete."
  },
  {
    id: "data-quality-score-contract",
    command: "scripts/check-data-quality-score-contract.mjs",
    evidence:
      "Data-quality score contract keeps downgrade rules, row coverage, source rights, and public disclosure as missing before real-score evidence."
  },
  {
    id: "investment-credibility-evidence-upgrade",
    command: "scripts/check-investment-credibility-evidence-upgrade.mjs",
    evidence:
      "Non-advisory, backtest-limit, source-rights, and data readiness evidence are already aligned for local MVP review."
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
  mode: "investment_formula_downgrade_readiness",
  status: allOk ? "local_formula_downgrade_ready_not_real_scoring" : "blocked_formula_downgrade_readiness_incomplete",
  owner: "Investment",
  recommendedBy: "CEO",
  readinessLift: allOk ? 10 : 0,
  upgradedReadinessPercent: allOk ? 68 : 58,
  targetForMvpReview: 80,
  formulaVersionPosture: {
    currentState: "local_documented_not_promoted",
    publicVersionClaimApproved: false,
    requiredBeforePromotion: [
      "accepted formula version name",
      "accepted input and weighting documentation",
      "accepted missing-input behavior",
      "accepted downgrade reason display",
      "data quality and source-rights gates not contradicted"
    ]
  },
  downgradePolicyPosture: {
    currentState: "local_fail_closed_policy_ready",
    canUseForPublicScore: false,
    triggers: [
      "low data quality",
      "missing freshness",
      "source uncertainty",
      "formula version mismatch",
      "row coverage incomplete"
    ]
  },
  evidence,
  stillNotApproved: [
    "formula version promotion",
    "real scoring",
    "scoreSource=real",
    "model confidence claims",
    "performance or backtest claims",
    "buy, sell, hold, ranking, or suitability claims",
    "publicDataSource=supabase"
  ],
  nextGapsTo80: [
    "Legal and Investment jointly accept public claim wording",
    "source-depth and row-coverage evidence are accepted for each promoted indicator family",
    "formula version name and downgrade copy are placed in public runtime UI without implying real scoring"
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
    "This formula and downgrade readiness report does not run SQL, connect to Supabase, write data, fetch market data, print secrets, approve formula promotion, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
