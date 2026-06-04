import fs from "node:fs";

const helperPath = "src/lib/blocker-readiness.ts";
const componentPath = "src/components/blocker-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, componentPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);
const missing = [];
const blocked = [];

for (const [file, phrase] of [
  [helperPath, "getBlockerReadinessSummary"],
  [helperPath, "local_checklists_ready_remote_paused"],
  [helperPath, "local_review_recorded_external_rights_unverified"],
  [helperPath, "local_review_recorded_model_not_approved_for_real_scoring"],
  [helperPath, "qa_review_recorded_no_points_awarded"],
  [helperPath, "approvedScope"],
  [helperPath, "remainingDecision"],
  [helperPath, "data-quality-evidence"],
  [helperPath, "source-rights-and-disclosure"],
  [helperPath, "model-credibility"],
  [helperPath, "npm run report:data-quality-evidence-checklist"],
  [helperPath, "npm run report:source-rights-disclosure-checklist"],
  [helperPath, "npm run report:model-credibility-checklist"],
  [helperPath, "firstMove"],
  [helperPath, "parallelMoves"],
  [helperPath, "accelerationPlan"],
  [helperPath, "closureGapSummary"],
  [helperPath, "BlockerClosureGapSummary"],
  [helperPath, "pm_acceptance_gap_summary"],
  [helperPath, "local_gap_summary_ready_remote_paused"],
  [helperPath, "nextPmAcceptanceMove"],
  [helperPath, "BlockerClosureRuntimeRollup"],
  [helperPath, "closureRuntimeRollup"],
  [helperPath, "three_lane_blocker_closure_runtime_rollup"],
  [helperPath, "local_acceptance_rollup_ready_promotion_blocked"],
  [helperPath, "acceptedLocalPackets: 3"],
  [helperPath, "promotionUnblockedCount: 0"],
  [helperPath, "bounded_readonly_row_coverage_or_provider_terms_decision"],
  [helperPath, "Data, Legal, and Investment local packets are accepted"],
  [helperPath, "NextNarrowGateComparison"],
  [helperPath, "nextNarrowGateComparison"],
  [helperPath, "next_narrow_gate_two_option_comparison"],
  [helperPath, "local_comparison_ready_no_execution"],
  [helperPath, "provider-specific-terms-review"],
  [helperPath, "bounded-readonly-row-coverage"],
  [helperPath, "recommended_local_next"],
  [helperPath, "ready_but_requires_separate_authorization"],
  [helperPath, "requiresRemoteAttempt: true"],
  [helperPath, "requiresRemoteAttempt: false"],
  [helperPath, "This comparison does not run Supabase"],
  [helperPath, "NextExecutablePacket"],
  [helperPath, "nextExecutablePacket"],
  [helperPath, "provider-specific-terms-review-packet"],
  [helperPath, "ready_for_local_review_no_terms_approval"],
  [helperPath, "npm run report:provider-specific-terms-review-packet"],
  [helperPath, "npm run check:provider-specific-terms-review-packet"],
  [helperPath, "Running this packet does not fetch provider terms"],
  [helperPath, "A1 keeps data-quality evidence"],
  [helperPath, "A2 keeps public readability aligned"],
  [helperPath, "stillMockOnly: true"],
  [helperPath, "DataQualityAcceptanceSummary"],
  [helperPath, "dataQualityAcceptance"],
  [helperPath, "local_field_validity_accepted_quality_points_blocked"],
  [helperPath, "ACCEPT_FIELD_VALIDITY_AS_LOCAL_QA_REVIEWED_SPEC_ONLY"],
  [helperPath, "local_qa_reviewed_spec_only"],
  [helperPath, "docs/reviews/DATA_QUALITY_FIELD_VALIDITY_ACCEPTANCE_GATE_2026-06-02.md"],
  [helperPath, "QA-FIELD-001"],
  [helperPath, "QA-BOUNDARY-001"],
  [helperPath, "Can Data keep field validity and downgrade behavior accepted"],
  [helperPath, "SourceRightsAcceptanceSummary"],
  [helperPath, "sourceRightsAcceptance"],
  [helperPath, "local_packet_accepted_external_rights_blocked"],
  [helperPath, "ACCEPT_SOURCE_RIGHTS_DISCLOSURE_AS_LOCAL_REVIEW_PACKET_ONLY"],
  [helperPath, "local_review_packet_only"],
  [helperPath, "docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md"],
  [helperPath, "LEGAL-SOURCE-001"],
  [helperPath, "BOUNDARY-SOURCE-001"],
  [helperPath, "Can Legal accept one provider-specific source-terms review"],
  [helperPath, "ModelCredibilityAcceptanceSummary"],
  [helperPath, "modelCredibilityAcceptance"],
  [helperPath, "local_packet_accepted_real_scoring_blocked"],
  [helperPath, "ACCEPT_MODEL_CREDIBILITY_AS_LOCAL_REVIEW_PACKET_ONLY"],
  [helperPath, "local_investment_review_packet_only"],
  [helperPath, "docs/reviews/MODEL_CREDIBILITY_ACCEPTANCE_GATE_2026-06-02.md"],
  [helperPath, "INVESTMENT-MODEL-001"],
  [helperPath, "BOUNDARY-MODEL-001"],
  [helperPath, "Can Investment accept the score purpose"],
  [helperPath, "ready_for_separate_readonly_decision"],
  [helperPath, "fastestSafePath"],
  [helperPath, "readonly readiness 55 / runtime hardening 35 / blocker execution 10"],
  [helperPath, "npm run check:narrow-approval-post-review-gate && npm run report:supabase-readonly-final-prep"],
  [helperPath, "npm run report:source-rights-disclosure-local-review"],
  [helperPath, "npm run report:model-credibility-local-review"],
  [helperPath, "npm run report:data-quality-field-validity-qa-review"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [componentPath, "BlockerReadinessPanel"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "blocker-readiness-panel"],
  [componentPath, "Runtime unblock acceleration"],
  [componentPath, "PM acceptance gap summary"],
  [componentPath, "blocker-closure-gap-summary"],
  [componentPath, "summary.closureGapSummary.remainingBlockers.join"],
  [componentPath, "summary.closureGapSummary.nextPmAcceptanceMove"],
  [componentPath, "Blocker closure runtime rollup"],
  [componentPath, "blocker-closure-runtime-rollup"],
  [componentPath, "summary.closureRuntimeRollup.acceptedLocalPackets"],
  [componentPath, "summary.closureRuntimeRollup.promotionUnblockedCount"],
  [componentPath, "summary.closureRuntimeRollup.blockedPromotionDecisions.join"],
  [componentPath, "Next narrow gate comparison"],
  [componentPath, "next-narrow-gate-comparison"],
  [componentPath, "summary.nextNarrowGateComparison.recommendedOption"],
  [componentPath, "summary.nextNarrowGateComparison.options.map"],
  [componentPath, "option.requiresRemoteAttempt ? \"yes\" : \"no\""],
  [componentPath, "Next executable local packet"],
  [componentPath, "next-executable-packet"],
  [componentPath, "summary.nextExecutablePacket.reportCommand"],
  [componentPath, "summary.nextExecutablePacket.checkCommand"],
  [componentPath, "Data quality local acceptance summary"],
  [componentPath, "data-quality-acceptance-summary"],
  [componentPath, "summary.dataQualityAcceptance.acceptedEvidenceIds.join"],
  [componentPath, "summary.dataQualityAcceptance.blockedDecisions.join"],
  [componentPath, "Source rights local acceptance summary"],
  [componentPath, "source-rights-acceptance-summary"],
  [componentPath, "summary.sourceRightsAcceptance.acceptedEvidenceIds.join"],
  [componentPath, "summary.sourceRightsAcceptance.blockedDecisions.join"],
  [componentPath, "Model credibility local acceptance summary"],
  [componentPath, "model-credibility-acceptance-summary"],
  [componentPath, "summary.modelCredibilityAcceptance.acceptedEvidenceIds.join"],
  [componentPath, "summary.modelCredibilityAcceptance.blockedDecisions.join"],
  [componentPath, "Fastest safe unblock path"],
  [componentPath, "summary.accelerationPlan.fastestSafePath.map"],
  [componentPath, "blocker-priority-strip"],
  [componentPath, "summary.firstMove"],
  [componentPath, "summary.parallelMoves.map"],
  [componentPath, "summary.lanes.map"],
  [componentPath, "lane.localReviewState"],
  [componentPath, "lane.approvedScope"],
  [componentPath, "lane.remainingDecision"],
  [briefingPath, "import { BlockerReadinessPanel }"],
  [briefingPath, "<BlockerReadinessPanel />"],
  [cssPath, ".blocker-readiness-panel"],
  [cssPath, ".blocker-acceleration-strip"],
  [cssPath, ".blocker-closure-gap-summary"],
  [cssPath, ".blocker-closure-runtime-rollup"],
  [cssPath, ".next-narrow-gate-comparison"],
  [cssPath, ".next-narrow-gate-comparison article.recommended_local_next"],
  [cssPath, ".next-narrow-gate-comparison article.ready_but_requires_separate_authorization"],
  [cssPath, ".next-executable-packet"],
  [cssPath, ".data-quality-acceptance-summary"],
  [cssPath, ".source-rights-acceptance-summary"],
  [cssPath, ".model-credibility-acceptance-summary"],
  [cssPath, ".blocker-fastest-path"],
  [cssPath, ".blocker-priority-strip"],
  [cssPath, ".blocker-readiness-grid"],
  [cssPath, ".blocker-readiness-grid em"],
  [packagePath, "\"check:blocker-readiness-panel\": \"node scripts/check-blocker-readiness-panel.mjs\""],
  [reviewGatePath, "scripts/check-blocker-readiness-panel.mjs"]
]) {
  if (!read(file).includes(phrase)) missing.push(`${file}: ${phrase}`);
}

for (const [file, phrase] of [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "writeFileSync"],
  [componentPath, "fetch("],
  [componentPath, "process.env"],
  [componentPath, "createClient"],
  [briefingPath, "scoreSource=\"real\""]
]) {
  if (read(file).includes(phrase)) blocked.push(`${file}: ${phrase}`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}
