import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "cp3-public-claim-approval-checklist",
    command: "scripts/check-cp3-public-claim-approval-checklist.mjs",
    evidence:
      "Public claim checklist defines forbidden claims, scoreSource=real blockers, and role ownership before any public investment wording."
  },
  {
    id: "cp3-public-claim-approval-role-review",
    command: "scripts/check-cp3-public-claim-approval-checklist-role-review.mjs",
    evidence:
      "Role review records PM, Marketing, Investment, Legal, and Design concerns without approving public copy changes."
  },
  {
    id: "cp3-claim-to-runtime-state-mapping",
    command: "scripts/check-cp3-claim-to-runtime-state-mapping.mjs",
    evidence:
      "Public claim categories are mapped to runtime state fields, scoreSource, model approval, and claim approval gates."
  },
  {
    id: "cp3-claim-to-runtime-state-mapping-role-review",
    command: "scripts/check-cp3-claim-to-runtime-state-mapping-role-review.mjs",
    evidence:
      "Runtime-state mapping role review keeps locale, model evidence, and runtime implementation separate."
  },
  {
    id: "investment-formula-downgrade-readiness",
    command: "scripts/check-investment-formula-downgrade-readiness.mjs",
    evidence:
      "Formula and downgrade posture is locally ready, but public score use and formula promotion remain blocked."
  },
  {
    id: "source-rights-public-placement-readiness",
    command: "scripts/check-source-rights-public-placement-readiness.mjs",
    evidence:
      "Public attribution, delay/outage, redistribution/storage, and non-advisory claim placement are mapped for review."
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
  mode: "investment_public_claim_readiness",
  status: allOk ? "local_public_claim_review_ready_not_real_scoring" : "blocked_public_claim_readiness_incomplete",
  owner: "Investment",
  coOwners: ["Legal", "Product"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 12 : 0,
  upgradedReadinessPercent: allOk ? 80 : 68,
  targetForMvpReview: 80,
  mvpMeaning:
    "Investment credibility reaches MVP review target as local public-claim readiness only; it does not approve real scoring, public rankings, advice, performance claims, or source promotion.",
  evidence,
  locallyAccepted: [
    "public claim checklist exists and is explicitly draft/not approved",
    "claim wording has role-review coverage from PM, Marketing, Investment, Legal, and Design",
    "claim categories are mapped to runtime state fields and fail-closed conditions",
    "formula and downgrade copy can be explained without promoting real scoring",
    "source-rights placement is mapped before public source or professional indicator claims"
  ],
  stillNotApproved: [
    "real scoring",
    "scoreSource=real",
    "buy, sell, hold, ranking, suitability, or advice claims",
    "model confidence claims",
    "performance or backtest claims",
    "formula version promotion",
    "public professional indicator claims",
    "publicDataSource=supabase",
    "source promotion"
  ],
  nextAfterMvpReviewTarget: [
    "convert accepted local claim map into final public copy only after Legal and Investment approval",
    "connect future real-score candidacy to source-depth, row coverage, and model validation evidence",
    "keep UI copy as observation prompts while scoreSource remains mock"
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
    "This investment public claim readiness report does not run SQL, connect to Supabase, write data, fetch market data, print secrets, approve advice, approve performance claims, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
