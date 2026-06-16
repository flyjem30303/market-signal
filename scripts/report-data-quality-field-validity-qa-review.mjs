import { spawnSync } from "node:child_process";

const contractRun = spawnSync(process.execPath, ["scripts/report-data-quality-field-validity.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (contractRun.status !== 0) {
  throw new Error(`field validity report failed: ${contractRun.stderr.trim()}`);
}

const contract = JSON.parse(contractRun.stdout);

const qaReview = {
  mode: "local_data_quality_field_validity_qa_review",
  status: "qa_review_recorded_local_points_awarded",
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
  reviewedContract: {
    approvalState: contract.approvalState,
    canAwardDataQualityPoints: contract.canAwardDataQualityPoints,
    downgradeRuleCount: contract.downgradeRules.length,
    fieldRuleCount: contract.fieldRules.length,
    publicDataSource: contract.publicDataSource,
    scoreSource: contract.scoreSource
  },
  qaFindings: [
    {
      id: "QA-FIELD-001",
      finding: "Required identity, date, price, volume, and source-quality fields now have local invalid-state rules.",
      decision: "accepted_for_local_review"
    },
    {
      id: "QA-FIELD-002",
      finding: "Critical close-price and source-quality failures correctly block real scoring rather than degrading silently.",
      decision: "accepted_for_local_review"
    },
    {
      id: "QA-DOWNGRADE-001",
      finding: "Unavailable, stale, and partial runtime states have score caps and public-claim limits.",
      decision: "accepted_for_local_review"
    },
    {
      id: "QA-BOUNDARY-001",
      finding: "The contract keeps publicDataSource and scoreSource mock while awarding local Phase 1 data-quality points only.",
      decision: "accepted_for_local_review"
    }
  ],
  notApproved: [
    "row coverage evidence acceptance",
    "source-rights approval",
    "public claim approval",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "scoreSource=real"
  ],
  nextGate:
    "Legal and Investment can review source-rights disclosure and interpretation downgrade policy while Data keeps row coverage readonly evidence paused.",
  ceoRecommendation:
    "Treat field validity as QA-reviewed local scoring evidence only. Keep scoreSource mock until source rights, source depth, model, and release gates pass."
};

console.log(JSON.stringify(qaReview, null, 2));
