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

export type BlockerAccelerationStep = {
  action: string;
  canRunNow: boolean;
  command: string;
  owner: "CEO" | "PM";
  step: number;
  stillDoesNotAuthorize: string[];
};

export type BlockerClosureGapSummary = {
  a1Support: string;
  a2Support: string;
  blockedPromotionCount: number;
  mode: "pm_acceptance_gap_summary";
  nextPmAcceptanceMove: BlockerReadinessLane["blockerId"];
  overallState: "local_gap_summary_ready_remote_paused";
  remainingBlockers: string[];
  stillMockOnly: true;
  summary: string;
};

export type SourceRightsAcceptanceSummary = {
  acceptedAs: "local_review_packet_only";
  acceptedEvidenceIds: string[];
  blockedDecisions: string[];
  decision: "ACCEPT_SOURCE_RIGHTS_DISCLOSURE_AS_LOCAL_REVIEW_PACKET_ONLY";
  gateDocument: string;
  nextNarrowQuestion: string;
  owner: "Legal";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "local_packet_accepted_external_rights_blocked";
};

export type ModelCredibilityAcceptanceSummary = {
  acceptedAs: "local_investment_review_packet_only";
  acceptedEvidenceIds: string[];
  blockedDecisions: string[];
  decision: "ACCEPT_MODEL_CREDIBILITY_AS_LOCAL_REVIEW_PACKET_ONLY";
  gateDocument: string;
  nextNarrowQuestion: string;
  owner: "Investment";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "local_packet_accepted_real_scoring_blocked";
};

export type DataQualityAcceptanceSummary = {
  acceptedAs: "local_qa_reviewed_spec_only";
  acceptedEvidenceIds: string[];
  blockedDecisions: string[];
  decision: "ACCEPT_FIELD_VALIDITY_AS_LOCAL_QA_REVIEWED_SPEC_ONLY";
  gateDocument: string;
  nextNarrowQuestion: string;
  owner: "Data";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "local_field_validity_accepted_quality_points_blocked";
};

export type BlockerClosureRuntimeRollup = {
  acceptedLocalPackets: number;
  blockedPromotionDecisions: string[];
  mode: "three_lane_blocker_closure_runtime_rollup";
  nextGateCandidate: "bounded_readonly_row_coverage_or_provider_terms_decision";
  nextPmAction: string;
  promotionUnblockedCount: 0;
  readyLocalOwners: Array<"Data" | "Legal" | "Investment">;
  status: "local_acceptance_rollup_ready_promotion_blocked";
  summary: string;
};

export type NextNarrowGateOption = {
  blockerReduced: string;
  canRunLocallyNow: boolean;
  command: string;
  id: "bounded-readonly-row-coverage" | "provider-specific-terms-review";
  owner: "Data" | "Legal";
  requiresRemoteAttempt: boolean;
  risk: "external_terms_uncertainty" | "remote_readonly_execution";
  status: "recommended_local_next" | "ready_but_requires_separate_authorization";
  summary: string;
};

export type NextNarrowGateComparison = {
  ceoRecommendation: string;
  mode: "next_narrow_gate_two_option_comparison";
  options: NextNarrowGateOption[];
  recommendedOption: "provider-specific-terms-review";
  status: "local_comparison_ready_no_execution";
  stopLine: string;
};

export type BlockerReadinessSummary = {
  accelerationPlan: {
    currentBlockers: string[];
    fastestSafePath: BlockerAccelerationStep[];
    recommendedWorkMix: string;
    status: "ready_for_separate_readonly_decision";
  };
  closureGapSummary: BlockerClosureGapSummary;
  closureRuntimeRollup: BlockerClosureRuntimeRollup;
  dataQualityAcceptance: DataQualityAcceptanceSummary;
  firstMove: BlockerPriorityMove & { reason: string };
  lanes: BlockerReadinessLane[];
  modelCredibilityAcceptance: ModelCredibilityAcceptanceSummary;
  nextNarrowGateComparison: NextNarrowGateComparison;
  parallelMoves: BlockerPriorityMove[];
  publicDataSource: "mock";
  scoreSource: "mock";
  sourceRightsAcceptance: SourceRightsAcceptanceSummary;
  status: "local_checklists_ready_remote_paused";
  headline: string;
  stopLine: string;
  ceoRecommendation: string;
};

export function getBlockerReadinessSummary(): BlockerReadinessSummary {
  return {
    accelerationPlan: {
      currentBlockers: [
        "row-coverage-readonly is waiting for one explicit bounded remote approval",
        "data-quality-evidence cannot be lifted until readonly row coverage evidence is accepted",
        "publicDataSource=supabase and scoreSource=real remain blocked until later gates"
      ],
      fastestSafePath: [
        {
          action: "Confirm Legal oral outcome is recorded before reopening source-rights decisions.",
          canRunNow: false,
          command: "npm run report:narrow-approval-post-review-gate",
          owner: "CEO",
          step: 1,
          stillDoesNotAuthorize: ["Supabase reads", "Supabase writes", "market data ingestion"]
        },
        {
          action: "Confirm Investment oral outcome is recorded before reopening model interpretation decisions.",
          canRunNow: false,
          command: "npm run report:narrow-approval-post-review-gate",
          owner: "CEO",
          step: 2,
          stillDoesNotAuthorize: ["scoreSource=real", "buy sell hold advice", "public ranking claim"]
        },
        {
          action: "Re-run post-review and readonly final-prep reports, then keep the result as a decision packet only.",
          canRunNow: true,
          command: "npm run check:narrow-approval-post-review-gate && npm run report:supabase-readonly-final-prep",
          owner: "PM",
          step: 3,
          stillDoesNotAuthorize: ["SQL", "Supabase writes", "ingestion", "scoreSource=real"]
        },
        {
          action: "If final prep remains ready, CEO may separately name exactly one bounded readonly attempt.",
          canRunNow: false,
          command: "npm run db:readonly-validate",
          owner: "CEO",
          step: 4,
          stillDoesNotAuthorize: ["Supabase writes", "market data ingestion", "public source promotion", "real scoring"]
        }
      ],
      recommendedWorkMix: "readonly readiness 55 / runtime hardening 35 / blocker execution 10",
      status: "ready_for_separate_readonly_decision"
    },
    closureGapSummary: {
      a1Support:
        "A1 keeps data-quality evidence, row coverage readiness, field-validity QA, and downgrade-rule handoff warm from local-only or sanitized evidence.",
      a2Support:
        "A2 keeps public readability aligned on mock-only source status, source-rights limits, model credibility, and real-score stop lines.",
      blockedPromotionCount: 5,
      mode: "pm_acceptance_gap_summary",
      nextPmAcceptanceMove: "source-rights-and-disclosure",
      overallState: "local_gap_summary_ready_remote_paused",
      remainingBlockers: [
        "accepted readonly row coverage evidence",
        "provider-specific source-rights approval",
        "data-quality evidence acceptance threshold",
        "model credibility and interpretation approval",
        "public release wording approval for non-advisory claims"
      ],
      stillMockOnly: true,
      summary:
        "PM can keep runtime moving locally, but promotion remains blocked until Legal, Data, and Investment each close one acceptance gap."
    },
    closureRuntimeRollup: {
      acceptedLocalPackets: 3,
      blockedPromotionDecisions: [
        "bounded readonly row coverage evidence",
        "provider-specific source terms approval",
        "source redistribution approval",
        "data-quality threshold evidence",
        "real scoring approval",
        "public release wording approval"
      ],
      mode: "three_lane_blocker_closure_runtime_rollup",
      nextGateCandidate: "bounded_readonly_row_coverage_or_provider_terms_decision",
      nextPmAction:
        "Use the three accepted local packets as the decision baseline, then prepare one narrow CEO choice between bounded row-coverage readonly evidence and provider-specific terms review.",
      promotionUnblockedCount: 0,
      readyLocalOwners: ["Data", "Legal", "Investment"],
      status: "local_acceptance_rollup_ready_promotion_blocked",
      summary:
        "Data, Legal, and Investment local packets are accepted, but no promotion gate is opened; runtime stays mock until row coverage, rights, model, quality, and public-release decisions all pass."
    },
    dataQualityAcceptance: {
      acceptedAs: "local_qa_reviewed_spec_only",
      acceptedEvidenceIds: ["QA-FIELD-001", "QA-FIELD-002", "QA-DOWNGRADE-001", "QA-BOUNDARY-001"],
      blockedDecisions: [
        "data-quality score points",
        "row coverage points",
        "quality score threshold pass",
        "public real-data source claim",
        "Supabase readonly execution",
        "SQL execution",
        "market-data ingestion",
        "scoreSource=real"
      ],
      decision: "ACCEPT_FIELD_VALIDITY_AS_LOCAL_QA_REVIEWED_SPEC_ONLY",
      gateDocument: "docs/reviews/DATA_QUALITY_FIELD_VALIDITY_ACCEPTANCE_GATE_2026-06-02.md",
      nextNarrowQuestion:
        "Can Data keep field validity and downgrade behavior accepted as the local QA baseline while row coverage evidence remains paused and no quality points are awarded?",
      owner: "Data",
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "local_field_validity_accepted_quality_points_blocked"
    },
    ceoRecommendation:
      "Stop expanding governance. Keep blocker execution focused on the fastest safe path, then reopen one separately named readonly decision only if the packet remains ready.",
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
    modelCredibilityAcceptance: {
      acceptedAs: "local_investment_review_packet_only",
      acceptedEvidenceIds: [
        "INVESTMENT-MODEL-001",
        "INVESTMENT-MODEL-002",
        "INVESTMENT-BACKTEST-001",
        "QA-MODEL-001",
        "BOUNDARY-MODEL-001"
      ],
      blockedDecisions: [
        "real scoring",
        "buy/sell/hold advice",
        "public ranking claim",
        "model confidence claim",
        "formula version promotion",
        "Supabase readonly execution",
        "SQL execution",
        "market-data ingestion",
        "scoreSource=real"
      ],
      decision: "ACCEPT_MODEL_CREDIBILITY_AS_LOCAL_REVIEW_PACKET_ONLY",
      gateDocument: "docs/reviews/MODEL_CREDIBILITY_ACCEPTANCE_GATE_2026-06-02.md",
      nextNarrowQuestion:
        "Can Investment accept the score purpose, formula documentation, backtest limitation wording, and downgrade policy for local explanation only without approving real scoring?",
      owner: "Investment",
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "local_packet_accepted_real_scoring_blocked"
    },
    nextNarrowGateComparison: {
      ceoRecommendation:
        "Choose provider-specific terms review as the next mainline slice. Keep bounded readonly row coverage ready, but run it only after CEO explicitly names exactly one remote attempt.",
      mode: "next_narrow_gate_two_option_comparison",
      options: [
        {
          blockerReduced: "source rights, attribution, redistribution limits, and public disclosure wording",
          canRunLocallyNow: true,
          command: "npm run report:source-rights-disclosure-local-review",
          id: "provider-specific-terms-review",
          owner: "Legal",
          requiresRemoteAttempt: false,
          risk: "external_terms_uncertainty",
          status: "recommended_local_next",
          summary:
            "Best next slice because it narrows a real promotion blocker without connecting to Supabase, reading rows, or changing runtime source state."
        },
        {
          blockerReduced: "row coverage evidence for data-quality threshold and future real-score candidacy",
          canRunLocallyNow: false,
          command: "npm run report:row-coverage-readonly-preexecution-packet",
          id: "bounded-readonly-row-coverage",
          owner: "Data",
          requiresRemoteAttempt: true,
          risk: "remote_readonly_execution",
          status: "ready_but_requires_separate_authorization",
          summary:
            "High-value but not automatic; it needs a separately named bounded readonly attempt and immediate post-run review before any evidence can be referenced."
        }
      ],
      recommendedOption: "provider-specific-terms-review",
      status: "local_comparison_ready_no_execution",
      stopLine:
        "This comparison does not run Supabase, run SQL, fetch market data, approve provider terms, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real."
    },
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
    sourceRightsAcceptance: {
      acceptedAs: "local_review_packet_only",
      acceptedEvidenceIds: [
        "LEGAL-SOURCE-001",
        "LEGAL-SOURCE-002",
        "PRODUCT-DISCLOSURE-001",
        "INVESTMENT-CLAIM-001",
        "BOUNDARY-SOURCE-001"
      ],
      blockedDecisions: [
        "external provider terms approval",
        "source license approval",
        "raw market data redistribution",
        "public real-data source claim",
        "public investment interpretation claim",
        "Supabase readonly execution",
        "SQL execution",
        "market-data ingestion",
        "scoreSource=real"
      ],
      decision: "ACCEPT_SOURCE_RIGHTS_DISCLOSURE_AS_LOCAL_REVIEW_PACKET_ONLY",
      gateDocument: "docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md",
      nextNarrowQuestion:
        "Can Legal accept one provider-specific source-terms review for attribution, display limits, and disclosure wording without approving ingestion or real scoring?",
      owner: "Legal",
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "local_packet_accepted_external_rights_blocked"
    },
    status: "local_checklists_ready_remote_paused",
    stopLine: "No SQL, no Supabase writes, no raw market data, no public source promotion, and no scoreSource=real."
  };
}
