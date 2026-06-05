import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "source-rights-public-placement-readiness",
    command: "scripts/check-source-rights-public-placement-readiness.mjs",
    evidence:
      "Placement map defines page-level attribution, delay/incompleteness/outage wording, redistribution/storage limits, and non-advisory claim placement."
  },
  {
    id: "cp3-public-claim-approval-checklist",
    command: "scripts/check-cp3-public-claim-approval-checklist.mjs",
    evidence:
      "Public claim checklist keeps real-score, advice, performance, and source-backed claims draft/not-approved."
  },
  {
    id: "cp3-claim-to-runtime-state-mapping",
    command: "scripts/check-cp3-claim-to-runtime-state-mapping.mjs",
    evidence:
      "Claim-to-runtime mapping ties public wording to runtime state fields and prevents locale or copy from upgrading readiness."
  },
  {
    id: "stock-investor-action-summary",
    command: "scripts/check-stock-investor-action-summary.mjs",
    evidence:
      "Stock investor action summary keeps user-facing interpretation copy non-advisory and aligned to source and score boundaries."
  },
  {
    id: "trust-runtime-boundary-notice",
    command: "scripts/check-trust-runtime-boundary-notice.mjs",
    evidence:
      "Trust runtime boundary notice is present across methodology, disclaimer, terms, privacy, and weekly pages."
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
  mode: "source_rights_public_copy_acceptance_readiness",
  status: allOk ? "local_public_copy_acceptance_ready_external_rights_unapproved" : "blocked_public_copy_acceptance_incomplete",
  owner: "Legal",
  coOwners: ["Product", "Investment", "PM"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 4 : 0,
  upgradedReadinessPercent: allOk ? 92 : 88,
  targetForMvpReview: 100,
  evidence,
  copyAcceptanceMap: [
    {
      id: "source-attribution-copy",
      pageTargets: ["methodology", "stock", "briefing", "weekly"],
      allowedCopy: "identify source category, mock-only state, delay, incompleteness, and review status",
      blockedCopy: "provider approved, official endorsed, real-time complete, production data active"
    },
    {
      id: "redistribution-retention-copy",
      pageTargets: ["terms", "privacy", "disclaimer"],
      allowedCopy: "state download, export, bulk access, cache, retention, and redistribution remain unavailable until approval",
      blockedCopy: "raw values may be exported, redistributed, cached, or reused commercially"
    },
    {
      id: "investment-claim-copy",
      pageTargets: ["stock", "briefing", "weekly"],
      allowedCopy: "non-advisory observation prompts, mock-only interpretation, and review limitations",
      blockedCopy: "buy, sell, hold, suitability, ranking, performance, professional indicator, or guaranteed outcome"
    },
    {
      id: "runtime-boundary-copy",
      pageTargets: ["all public runtime surfaces"],
      allowedCopy: "publicDataSource stays mock and scoreSource stays mock until a separate promotion gate passes",
      blockedCopy: "publicDataSource=supabase, scoreSource=real, live market data, or source promotion approved"
    }
  ],
  locallyAccepted: [
    "public copy can explain mock-only source boundaries without implying provider approval",
    "public copy can explain delay, incompleteness, outage, and fallback limitations",
    "redistribution, export, cache, retention, and bulk-access wording has a blocked-state placement",
    "investment-facing copy remains non-advisory and tied to runtime state",
    "runtime boundary copy must not upgrade data-source or score-source state"
  ],
  stillNotApproved: [
    "external provider terms",
    "source license approval",
    "raw market data redistribution",
    "download, export, cache, retention, or bulk access",
    "public source promotion",
    "publicDataSource=supabase",
    "SQL execution",
    "Supabase writes",
    "market data ingestion",
    "scoreSource=real",
    "public professional indicator claims",
    "investment advice or performance claims"
  ],
  nextGapsTo100: [
    "Legal accepts provider-specific attribution wording",
    "Product accepts page-level final copy placement",
    "Investment accepts final non-advisory claim wording",
    "Legal accepts redistribution, cache, export, and retention posture",
    "source promotion gate remains separate after public copy acceptance"
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
    "This public copy acceptance readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, approve external provider terms, promote publicDataSource=supabase, approve redistribution, approve public professional indicator claims, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
