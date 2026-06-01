export type BlockerReadinessLane = {
  blockerId: "data-quality-evidence" | "source-rights-and-disclosure" | "model-credibility";
  checklistCommand: string;
  label: string;
  owner: "Data" | "Legal" | "Investment";
  readiness: "local_checklist_ready";
  status: "blocked_until_review";
  weight: number;
  nextAction: string;
};

export type BlockerReadinessSummary = {
  lanes: BlockerReadinessLane[];
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "local_checklists_ready_remote_paused";
  headline: string;
  stopLine: string;
  ceoRecommendation: string;
};

export function getBlockerReadinessSummary(): BlockerReadinessSummary {
  return {
    ceoRecommendation:
      "Move Data, Legal, and Investment in parallel locally. Keep row coverage readonly remote execution paused until explicitly requested.",
    headline: "Three blocker checklists are ready for local review",
    lanes: [
      {
        blockerId: "data-quality-evidence",
        checklistCommand: "npm run report:data-quality-evidence-checklist",
        label: "Data quality evidence",
        nextAction: "Finish field validity rules, downgrade behavior, and accepted row coverage evidence before any real-score candidacy.",
        owner: "Data",
        readiness: "local_checklist_ready",
        status: "blocked_until_review",
        weight: 50
      },
      {
        blockerId: "source-rights-and-disclosure",
        checklistCommand: "npm run report:source-rights-disclosure-checklist",
        label: "Source rights and disclosure",
        nextAction: "Review attribution, display limits, delay wording, incompleteness wording, and non-advisory public claims.",
        owner: "Legal",
        readiness: "local_checklist_ready",
        status: "blocked_until_review",
        weight: 25
      },
      {
        blockerId: "model-credibility",
        checklistCommand: "npm run report:model-credibility-checklist",
        label: "Model credibility",
        nextAction: "Approve score purpose, formula documentation, backtest limits, and interpretation downgrade policy.",
        owner: "Investment",
        readiness: "local_checklist_ready",
        status: "blocked_until_review",
        weight: 25
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "local_checklists_ready_remote_paused",
    stopLine: "No SQL, no Supabase writes, no raw market data, no public source promotion, and no scoreSource=real."
  };
}
