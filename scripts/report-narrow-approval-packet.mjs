import { spawnSync } from "node:child_process";

const resolutionRun = spawnSync(process.execPath, ["scripts/report-blocker-resolution-plan.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (resolutionRun.status !== 0) {
  throw new Error(`blocker resolution plan failed: ${resolutionRun.stderr.trim()}`);
}

const resolution = JSON.parse(resolutionRun.stdout);

const packet = {
  mode: "local_narrow_approval_packet",
  status: "ready_for_ceo_or_chairman_oral_review",
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
  source: {
    blockerResolutionStatus: resolution.unblockDecisionReadiness.status,
    canRequestHumanApproval: resolution.unblockDecisionReadiness.canRequestHumanApproval
  },
  approvalRequest: {
    scope: "narrow_human_review_only",
    requestedBy: "CEO",
    canApprove: [
      {
        id: "legal-source-terms-review",
        owner: "Legal",
        approvalMeaning: "Legal may review source-specific terms, attribution placement, redistribution limits, and delay/incompleteness disclosure wording.",
        doesNotAuthorize: ["Supabase reads", "Supabase writes", "market data ingestion", "public real-data source claim"]
      },
      {
        id: "investment-non-advisory-interpretation-review",
        owner: "Investment",
        approvalMeaning: "Investment may review score purpose, formula explanation, backtest limitation wording, and non-advisory interpretation boundaries.",
        doesNotAuthorize: ["scoreSource=real", "buy sell hold advice", "public ranking claim", "model confidence claim"]
      }
    ],
    cannotApprove: [
      "SQL execution",
      "Supabase writes",
      "market data ingestion",
      "raw market data fetch",
      "publicDataSource=supabase",
      "scoreSource=real",
      "data quality score lift",
      "public investment recommendation"
    ]
  },
  proceedAfterApproval: [
    "Record approval outcome in a local post-review gate.",
    "Keep runtime public source mock.",
    "If Legal and Investment outcomes are accepted, CEO may separately decide whether to request exactly one bounded Supabase readonly attempt.",
    "Do not combine this oral review with SQL, ingestion, Supabase write, or real-score activation."
  ],
  ceoRecommendation:
    "Use this packet to ask only for Legal source-terms review and Investment non-advisory interpretation review. Keep Supabase readonly as a separate later decision."
};

console.log(JSON.stringify(packet, null, 2));
