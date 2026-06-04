import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "provider-specific-terms-post-review-rollup",
    command: "scripts/check-provider-specific-terms-post-review-rollup.mjs",
    evidence:
      "Provider-specific terms packet is accepted for local planning only and remains external-rights-unapproved."
  },
  {
    id: "twii-source-rights-field-contract-review-packet",
    command: "scripts/check-twii-source-rights-field-contract-review-packet.mjs",
    evidence:
      "TWII source-rights and field-contract packet records unresolved official-source, access, storage, attribution, retention, and field-mapping questions without probing or ingesting."
  },
  {
    id: "etf-source-rights-review-packet",
    command: "scripts/check-etf-source-rights-review-packet.mjs",
    evidence:
      "ETF source-rights packet records candidate source lanes and blocks ETF row coverage credit until legal and redistribution terms are approved."
  },
  {
    id: "source-rights-public-placement-readiness",
    command: "scripts/check-source-rights-public-placement-readiness.mjs",
    evidence:
      "Public placement map covers attribution, delay/outage, redistribution/storage limits, and non-advisory claim placement."
  },
  {
    id: "data-coverage-backfill-plan",
    command: "scripts/check-data-coverage-backfill-plan.mjs",
    evidence:
      "Backfill plan maps TWII, ETF, and equity source lanes while keeping publicDataSource and scoreSource mock."
  },
  {
    id: "cp3-public-claim-approval-checklist",
    command: "scripts/check-cp3-public-claim-approval-checklist.mjs",
    evidence:
      "Public claim checklist blocks source-backed and professional indicator claims until rights, model, and runtime gates are accepted."
  },
  {
    id: "cp3-claim-to-runtime-state-mapping",
    command: "scripts/check-cp3-claim-to-runtime-state-mapping.mjs",
    evidence:
      "Claim-to-runtime mapping keeps source claims tied to runtime state fields and fail-closed conditions."
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
  mode: "source_rights_specific_classification_readiness",
  status: allOk
    ? "local_source_specific_classification_ready_external_rights_unapproved"
    : "blocked_source_specific_classification_incomplete",
  owner: "Legal",
  coOwners: ["Data", "Product", "Investment"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 10 : 0,
  upgradedReadinessPercent: allOk ? 88 : 78,
  targetForMvpReview: 100,
  mvpMeaning:
    "Source-specific rights classification is locally reviewable for TWII, ETF, source placement, data coverage planning, and public claims, but external provider rights are not approved.",
  evidence,
  locallyAccepted: [
    "provider-specific terms packet is accepted for local planning only",
    "TWII source-rights and field-contract questions are enumerated without remote probing",
    "ETF source-rights candidate lanes and redistribution blockers are enumerated",
    "public source attribution, delay, outage, redistribution, and claim placements are mapped",
    "data coverage source lanes can reference rights blockers without running SQL or fetching data",
    "public claim checklist and runtime mapping prevent source wording from implying professional indicator readiness"
  ],
  stillNotApproved: [
    "external provider terms",
    "source license approval",
    "raw market data redistribution",
    "download, export, cache, or bulk access",
    "TWII official source execution",
    "ETF source execution",
    "equity source execution",
    "public source promotion",
    "publicDataSource=supabase",
    "SQL execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data ingestion",
    "scoreSource=real"
  ],
  nextGapsTo100: [
    "Legal accepts or rejects the actual provider terms source outside the repo",
    "source-specific attribution wording is accepted for TWII, ETF, and equity surfaces",
    "redistribution, retention, cache, export, and derived-data posture is accepted",
    "public legal pages and runtime UI copy are updated after Legal/Product acceptance",
    "source promotion gate remains separate from this local classification readiness"
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
    "This source-specific classification readiness report does not run SQL, connect to Supabase, write data, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, approve external terms, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
