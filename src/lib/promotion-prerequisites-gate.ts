import { getBlockerClosureReadinessGate } from "@/lib/blocker-closure-readiness-gate";
import { buildDataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";
import { buildDataQualityScoreContract } from "@/lib/data-quality-score-contract";
import { buildRowCoverageContract } from "@/lib/row-coverage-contract";

export type PromotionPrerequisiteCode =
  | "row-coverage-policy"
  | "row-coverage-readonly-evidence"
  | "field-validity-spec"
  | "data-quality-threshold"
  | "source-rights"
  | "model-credibility"
  | "public-release";

export type PromotionPrerequisiteItem = {
  blocker: string;
  code: PromotionPrerequisiteCode;
  evidence: string;
  label: string;
  nextAction: string;
  owner: "Data" | "Engineering" | "Investment" | "Legal" | "PM" | "QA";
  state: "complete_local_only" | "blocked_external" | "blocked_remote_evidence";
};

export type PromotionPostRunReviewFieldCode =
  | "attempt_id"
  | "authorized_by"
  | "authorization_scope"
  | "executed_command"
  | "started_at"
  | "finished_at"
  | "universe_policy"
  | "coverage_window"
  | "expected_rows"
  | "observed_rows"
  | "missing_rows"
  | "missing_row_tolerance"
  | "market_calendar_policy"
  | "sanitized_output_only"
  | "no_write_attestation"
  | "data_quality_decision"
  | "promotion_decision"
  | "follow_up_owner";

export type PromotionPostRunReviewField = {
  code: PromotionPostRunReviewFieldCode;
  label: string;
  requiredBeforeNextAttempt: true;
  source: "operator_attestation" | "readonly_aggregate" | "local_policy";
};

export type PromotionPrerequisitesGate = {
  canAwardDataQualityPoints: false;
  canAwardRowCoveragePoints: false;
  canPrepareReadonlyDecisionPacket: true;
  canPromotePublicDataSource: false;
  canSetScoreSourceReal: false;
  completedLocalCount: number;
  headline: string;
  items: PromotionPrerequisiteItem[];
  mode: "local_promotion_prerequisites_gate";
  nextMainlineUse: string;
  postRunReviewRequiredFields: PromotionPostRunReviewField[];
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "local_prerequisites_defined_remote_evidence_missing";
  stopLine: string;
  totalCount: 7;
};

export function getPromotionPrerequisitesGate(): PromotionPrerequisitesGate {
  const rowCoverage = buildRowCoverageContract();
  const quality = buildDataQualityScoreContract();
  const evidence = buildDataQualityEvidenceGate({
    dataQualityScore: quality.score,
    freshnessState: "complete"
  });
  const blockerClosure = getBlockerClosureReadinessGate();
  const completeLocalRequirements = rowCoverage.requirements.filter((requirement) => requirement.state === "complete");
  const sourceRights = blockerClosure.items.find((item) => item.blockerId === "source-rights-and-disclosure");
  const modelCredibility = blockerClosure.items.find((item) => item.blockerId === "model-credibility");

  const items: PromotionPrerequisiteItem[] = [
    {
      blocker: "Policy definition does not prove stored row coverage.",
      code: "row-coverage-policy",
      evidence: `${completeLocalRequirements.length}/${rowCoverage.requirements.length} row coverage policies are defined local-only for ${rowCoverage.universePolicy.symbols.length} TW MVP symbols and ${rowCoverage.coverageWindowPolicy.requiredTradingSessions} trading sessions.`,
      label: "Row coverage policy bundle defined",
      nextAction: "Keep the policy as packet context; do not award row coverage points until accepted readonly evidence exists.",
      owner: "Data",
      state: "complete_local_only"
    },
    {
      blocker: "Current-scope row coverage is accepted, but runtime promotion remains separate.",
      code: "row-coverage-readonly-evidence",
      evidence:
        "Current-scope bounded insert-missing post-run review accepted 240/240 candidate-key rows across TWII plus listed-stock daily close scope; missing rows after readback 0.",
      label: "Row coverage evidence accepted for current Phase 1 scope",
      nextAction:
        "Use accepted coverage evidence for runtime promotion review context; do not promote public source or score until quality, freshness, disclosure, rollback, and public-copy gates pass.",
      owner: "Data",
      state: "complete_local_only"
    },
    {
      blocker: "Field rules are specified but not approved for scoring.",
      code: "field-validity-spec",
      evidence: `${quality.fieldValidity.fieldRules.length} field rules and ${quality.fieldValidity.downgradeRules.length} downgrade rules exist; approval state ${quality.fieldValidity.approvalState}.`,
      label: "Field validity spec defined",
      nextAction: "Use field validity as QA context only; keep data-quality points at zero for this factor.",
      owner: "QA",
      state: "complete_local_only"
    },
    {
      blocker: "Data quality threshold is locally accepted; source and public promotion remain separate.",
      code: "data-quality-threshold",
      evidence: `Current local score ${quality.score}/${quality.passThreshold}; missing ${evidence.missingEvidence.length} evidence groups.`,
      label: "Data quality threshold locally accepted",
      nextAction: quality.nextLift,
      owner: "Data",
      state: "complete_local_only"
    },
    {
      blocker: sourceRights?.promotionBlocked ?? "Source rights and disclosure approval remain external.",
      code: "source-rights",
      evidence: sourceRights?.evidence ?? "Source-rights local evidence is not loaded.",
      label: "Source rights external approval pending",
      nextAction: sourceRights?.nextAction ?? "Record provider-specific rights and public disclosure approval before promotion.",
      owner: "Legal",
      state: "blocked_external"
    },
    {
      blocker: modelCredibility?.promotionBlocked ?? "Model credibility approval remains external.",
      code: "model-credibility",
      evidence: modelCredibility?.evidence ?? "Model credibility local evidence is not loaded.",
      label: "Model credibility approval pending",
      nextAction: modelCredibility?.nextAction ?? "Approve score purpose, formula limits, downgrade behavior, and interpretation rules.",
      owner: "Investment",
      state: "blocked_external"
    },
    {
      blocker: "Public release, disclosure, and claim approval remain blocked.",
      code: "public-release",
      evidence: "Public claim and disclosure approvals are still missing from the data-quality evidence gate.",
      label: "Public release gate blocked",
      nextAction: "Prepare release wording only after source rights, model credibility, row coverage, and QA evidence are accepted.",
      owner: "PM",
      state: "blocked_external"
    }
  ];
  const completedLocalCount = items.filter((item) => item.state === "complete_local_only").length;
  const postRunReviewRequiredFields: PromotionPostRunReviewField[] = [
    {
      code: "attempt_id",
      label: "Unique bounded readonly attempt identifier",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "authorized_by",
      label: "CEO or mainline PM authorization record",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "authorization_scope",
      label: "Named readonly-only scope and forbidden actions",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "executed_command",
      label: "Exact approved readonly command, with secrets redacted",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "started_at",
      label: "Attempt start timestamp",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "finished_at",
      label: "Attempt finish timestamp",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "universe_policy",
      label: "Universe policy used for the aggregate check",
      requiredBeforeNextAttempt: true,
      source: "local_policy"
    },
    {
      code: "coverage_window",
      label: "Coverage window and timezone used for the aggregate check",
      requiredBeforeNextAttempt: true,
      source: "local_policy"
    },
    {
      code: "expected_rows",
      label: "Expected aggregate row count",
      requiredBeforeNextAttempt: true,
      source: "local_policy"
    },
    {
      code: "observed_rows",
      label: "Observed aggregate row count only, with no raw rows",
      requiredBeforeNextAttempt: true,
      source: "readonly_aggregate"
    },
    {
      code: "missing_rows",
      label: "Missing aggregate row count",
      requiredBeforeNextAttempt: true,
      source: "readonly_aggregate"
    },
    {
      code: "missing_row_tolerance",
      label: "Zero-missing-row tolerance decision",
      requiredBeforeNextAttempt: true,
      source: "local_policy"
    },
    {
      code: "market_calendar_policy",
      label: "Market calendar policy and unresolved-calendar treatment",
      requiredBeforeNextAttempt: true,
      source: "local_policy"
    },
    {
      code: "sanitized_output_only",
      label: "Attestation that output contains aggregate counts only",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "no_write_attestation",
      label: "Attestation of no SQL, no writes, no staging rows, and no daily_prices mutation",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "data_quality_decision",
      label: "Data decision: still blocked, candidate packet, or rejected",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "promotion_decision",
      label: "Promotion decision remains mock unless separately approved",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    },
    {
      code: "follow_up_owner",
      label: "Named owner for missing evidence or next blocker",
      requiredBeforeNextAttempt: true,
      source: "operator_attestation"
    }
  ];

  return {
    canAwardDataQualityPoints: false,
    canAwardRowCoveragePoints: false,
    canPrepareReadonlyDecisionPacket: true,
    canPromotePublicDataSource: false,
    canSetScoreSourceReal: false,
    completedLocalCount,
    headline:
      "Promotion prerequisites are organized for the next decision packet, but remote evidence and external approvals still block every promotion.",
    items,
    mode: "local_promotion_prerequisites_gate",
    nextMainlineUse:
      "Mainline can use this gate to decide whether to present a bounded readonly packet; it must not execute Supabase or change runtime source state from this gate.",
    postRunReviewRequiredFields,
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "local_prerequisites_defined_remote_evidence_missing",
    stopLine:
      "Promotion prerequisites gate does not run SQL, connect to Supabase, write Supabase, create staging rows, modify daily_prices, fetch or ingest market data, print secrets, award row coverage points, raise data-quality score, promote publicDataSource=supabase, or set scoreSource=real.",
    totalCount: 7
  };
}
