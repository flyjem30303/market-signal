export type BlockerReadinessLane = {
  approvedScope: string;
  blockerId: "data-quality-evidence" | "source-rights-and-disclosure" | "model-credibility";
  checklistCommand: string;
  label: string;
  localReviewState:
    | "local_review_recorded_external_rights_unverified"
    | "local_review_recorded_model_not_approved_for_real_scoring"
    | "qa_review_recorded_no_points_awarded";
  owner: "Data" | "Legal" | "Investment";
  readiness: "local_checklist_ready";
  remainingDecision: string;
  status: "blocked_until_review";
  weight: number;
  nextAction: string;
};

export type BlockerPriorityMove = {
  command: string;
  id: BlockerReadinessLane["blockerId"];
  owner: BlockerReadinessLane["owner"];
  targetSections: string[];
};

export type BlockerReadinessSummary = {
  firstMove: BlockerPriorityMove & { reason: string };
  lanes: BlockerReadinessLane[];
  parallelMoves: BlockerPriorityMove[];
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
    firstMove: {
      command: "npm run report:source-rights-disclosure-local-review",
      id: "source-rights-and-disclosure",
      owner: "Legal",
      reason:
        "Data field-validity is locally specified and QA-reviewed; source rights are now the highest-value blocker that can still move without a remote run.",
      targetSections: ["source-attribution", "redistribution-display-limits", "delay-incompleteness-disclosure"]
    },
    headline: "Three blocker checklists are ready for local review",
    lanes: [
      {
        approvedScope: "QA-reviewed local field-validity specification only; no data-quality points awarded.",
        blockerId: "data-quality-evidence",
        checklistCommand: "npm run report:data-quality-evidence-checklist",
        label: "Data quality evidence",
        localReviewState: "qa_review_recorded_no_points_awarded",
        nextAction: "Finish field validity rules, downgrade behavior, and accepted row coverage evidence before any real-score candidacy.",
        owner: "Data",
        readiness: "local_checklist_ready",
        remainingDecision: "Needs row coverage evidence, source-rights approval, model credibility, and public release approval.",
        status: "blocked_until_review",
        weight: 50
      },
      {
        approvedScope: "Local disclosure review recorded; external provider rights remain unverified.",
        blockerId: "source-rights-and-disclosure",
        checklistCommand: "npm run report:source-rights-disclosure-checklist",
        label: "Source rights and disclosure",
        localReviewState: "local_review_recorded_external_rights_unverified",
        nextAction: "Review attribution, display limits, delay wording, incompleteness wording, and non-advisory public claims.",
        owner: "Legal",
        readiness: "local_checklist_ready",
        remainingDecision: "Needs provider-specific terms, attribution, redistribution, disclosure, and public-claim approval.",
        status: "blocked_until_review",
        weight: 25
      },
      {
        approvedScope: "Local investment review recorded; model is not approved for real scoring.",
        blockerId: "model-credibility",
        checklistCommand: "npm run report:model-credibility-checklist",
        label: "Model credibility",
        localReviewState: "local_review_recorded_model_not_approved_for_real_scoring",
        nextAction: "Approve score purpose, formula documentation, backtest limits, and interpretation downgrade policy.",
        owner: "Investment",
        readiness: "local_checklist_ready",
        remainingDecision: "Needs approved score purpose, formula documentation, backtest limitation wording, and downgrade policy.",
        status: "blocked_until_review",
        weight: 25
      }
    ],
    parallelMoves: [
      {
        command: "npm run report:model-credibility-local-review",
        id: "model-credibility",
        owner: "Investment",
        targetSections: ["score-purpose", "interpretation-downgrade-policy"]
      },
      {
        command: "npm run report:data-quality-field-validity-qa-review",
        id: "data-quality-evidence",
        owner: "Data",
        targetSections: ["field-validity-rules", "downgrade-behavior", "readonly-evidence-paused"]
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "local_checklists_ready_remote_paused",
    stopLine: "No SQL, no Supabase writes, no raw market data, no public source promotion, and no scoreSource=real."
  };
}
