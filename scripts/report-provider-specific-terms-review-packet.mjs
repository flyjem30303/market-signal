import { spawnSync } from "node:child_process";

const reviewRun = spawnSync(process.execPath, ["scripts/report-source-rights-disclosure-local-review.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (reviewRun.status !== 0) {
  throw new Error(`source-rights local review failed: ${reviewRun.stderr.trim()}`);
}

const review = JSON.parse(reviewRun.stdout);

const packet = {
  mode: "provider_specific_terms_review_packet",
  status: "local_terms_review_packet_ready_no_terms_approval",
  owner: "Legal",
  recommendedBy: "CEO",
  selectedGate: "provider-specific-terms-review",
  basedOn: ["scripts/report-source-rights-disclosure-local-review.mjs", "docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md"],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    externalTermsApproved: false,
    ingestionStarted: false,
    providerTermsFetched: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  decisionQuestion:
    "Can Legal review one provider-specific terms source and classify attribution, display limits, redistribution, retention, and public disclosure wording for local planning only?",
  reviewScope: [
    {
      id: "provider-identity-and-officialness",
      requiredDecision: "provider role and officialness wording classified without claiming endorsement"
    },
    {
      id: "attribution-placement",
      requiredDecision: "page-level, API/file, and missing-attribution fallback wording classified"
    },
    {
      id: "display-and-redistribution-limits",
      requiredDecision: "raw value display, derived metric display, download/export, cache, and retention posture classified"
    },
    {
      id: "delay-incompleteness-and-outage-copy",
      requiredDecision: "delay, missing field, partial coverage, source outage, and freshness-state wording classified"
    },
    {
      id: "non-advisory-public-claim-copy",
      requiredDecision: "public claim wording remains informational and avoids buy, sell, hold, ranking, or suitability instruction"
    }
  ],
  evidenceFromLocalReview: review.reviewedSections.map((section) => ({
    id: section.id,
    localReviewState: section.localReviewState,
    remainingDecision: section.remainingDecision
  })),
  acceptanceCriteria: [
    "Legal names the provider-specific terms source reviewed without copying raw terms into the repo",
    "attribution wording and placement are classified",
    "redistribution, display, export, cache, and retention limits are classified",
    "delay, incompleteness, outage, and freshness disclosure wording are classified",
    "the outcome states whether runtime must remain mock, internal-only, delayed, derived-only, or eligible for a later source gate"
  ],
  notApproved: [
    "provider terms approval",
    "source license approval",
    "raw market data redistribution",
    "public real-data source claim",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "row coverage points",
    "scoreSource=real"
  ],
  nextOutcomeRecord:
    "If reviewed, record only an accepted or rejected local planning outcome for legal-source-terms-review; do not promote runtime state.",
  ceoRecommendation:
    "Proceed with this local Legal packet before any row coverage remote attempt because it narrows a promotion blocker without remote execution."
};

console.log(JSON.stringify(packet, null, 2));
