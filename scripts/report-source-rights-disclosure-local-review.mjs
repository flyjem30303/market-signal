import { spawnSync } from "node:child_process";

const checklistRun = spawnSync(process.execPath, ["scripts/report-source-rights-disclosure-checklist.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (checklistRun.status !== 0) {
  throw new Error(`source-rights checklist failed: ${checklistRun.stderr.trim()}`);
}

const checklist = JSON.parse(checklistRun.stdout);

const review = {
  mode: "local_source_rights_disclosure_review",
  status: "local_review_recorded_external_rights_unverified",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    externalRightsVerified: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  blockerId: checklist.blockerId,
  owner: checklist.owner,
  reviewedSections: checklist.requiredSections.map((section) => ({
    id: section.id,
    owner: section.owner,
    localReviewState: "ready_for_human_terms_review",
    remainingDecision: "requires source-specific terms, attribution, redistribution, disclosure, and public-claim approval"
  })),
  notApproved: [
    "external source rights",
    "raw market data redistribution",
    "public real-data source claim",
    "public investment interpretation claim",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "scoreSource=real"
  ],
  nextGate: "source-specific rights and disclosure approval can be requested only after a human reviews provider terms and page-level public copy.",
  ceoRecommendation:
    "Treat Legal as locally prepared but not externally approved. Continue Investment credibility review in parallel and keep runtime mock until Legal approval is explicit."
};

console.log(JSON.stringify(review, null, 2));
