import { spawnSync } from "node:child_process";

const checklistRun = spawnSync(process.execPath, ["scripts/report-model-credibility-checklist.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (checklistRun.status !== 0) {
  throw new Error(`model credibility checklist failed: ${checklistRun.stderr.trim()}`);
}

const checklist = JSON.parse(checklistRun.stdout);

const review = {
  mode: "local_model_credibility_review",
  status: "local_review_recorded_model_not_approved_for_real_scoring",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
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
    localReviewState: "ready_for_investment_human_review",
    remainingDecision: "requires approved score purpose, formula documentation, backtest limitation wording, and downgrade policy"
  })),
  notApproved: [
    "real scoring",
    "buy sell hold advice",
    "public ranking claim",
    "model confidence claim",
    "formula version promotion",
    "Supabase readonly execution",
    "market data ingestion",
    "scoreSource=real"
  ],
  nextGate: "Investment can review this packet after Legal source-rights review is visible and Data quality remains downgrade-safe.",
  ceoRecommendation:
    "Treat Investment as locally prepared but not approved for real scoring. Keep public copy non-advisory and keep runtime mock until Data, Legal, and Investment gates all pass."
};

console.log(JSON.stringify(review, null, 2));
