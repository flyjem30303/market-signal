import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessEvidenceBoundarySummary } from "@/lib/freshness-evidence-boundary";
import { getFreshnessInterpretationSummary } from "@/lib/freshness-interpretation";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type FreshnessRuntimeOperationDecisionSummary = {
  attemptCandidate: {
    headline: string;
    items: Array<{
      body: string;
      label: string;
      state: "ready" | "hold" | "blocked";
      value: string;
    }>;
    stopLine: string;
  };
  headline: string;
  decisions: Array<{
    body: string;
    label: string;
    state: "allowed" | "candidate" | "blocked";
    value: string;
  }>;
  nextAction: string;
  stopLine: string;
  summary: string;
};

export function getFreshnessRuntimeOperationDecisionSummary(
  freshness: DataFreshnessSnapshot
): FreshnessRuntimeOperationDecisionSummary {
  const evidenceBoundary = getFreshnessEvidenceBoundarySummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();
  const canExplainDisplayState = freshness.scoreSource === "mock" && freshness.isMock;
  const canPrepareReadonlyAttempt =
    readonlyEvidence.evidenceStatus === "object_reachability_accepted" &&
    interpretation.dataQualityApproval === "not_approved";

  return {
    attemptCandidate: {
      headline: canPrepareReadonlyAttempt
        ? "Readonly attempt candidate is locally discussable"
        : "Readonly attempt candidate remains on hold",
      items: [
        {
          body: readonlyEvidence.acceptedScope,
          label: "Evidence basis",
          state: canPrepareReadonlyAttempt ? "ready" : "hold",
          value: readonlyEvidence.evidenceStatus
        },
        {
          body: "A separate CEO-named action and confirmation token are still required before any remote command.",
          label: "Execution trigger",
          state: "hold",
          value: "separate_ceo_named_action_required"
        },
        {
          body: "A sanitized post-run review must be recorded before any readiness, public-state, or scoring change.",
          label: "Post-run review",
          state: "blocked",
          value: "required_before_promotion"
        }
      ],
      stopLine:
        "This candidate card does not connect remotely, does not inspect rows, does not mutate data, and does not promote scoreSource=real."
    },
    headline: "Runtime operation decision",
    decisions: [
      {
        body: canExplainDisplayState
          ? "Keep the public runtime in mock disclosure while freshness metadata explains display state only."
          : "Display freshness metadata only if scoreSource remains mock and the state does not imply production data.",
        label: "Mock disclosure",
        state: "allowed",
        value: canExplainDisplayState ? "allowed" : "guarded"
      },
      {
        body: canPrepareReadonlyAttempt
          ? "Readonly reachability may support a separately approved bounded attempt candidate, followed by post-run review."
          : "Readonly attempt preparation is blocked until reachability and post-run guardrails remain explicit.",
        label: "Readonly attempt",
        state: canPrepareReadonlyAttempt ? "candidate" : "blocked",
        value: canPrepareReadonlyAttempt ? "candidate_only" : "blocked"
      },
      {
        body: interpretation.stopLine,
        label: "Real score mode",
        state: "blocked",
        value: interpretation.scoreSource
      }
    ],
    nextAction:
      "Prepare only a bounded readonly-attempt decision candidate or continue mock runtime hardening; do not execute remote reads from this UI state.",
    stopLine:
      "No runtime operation decision may trigger SQL, Supabase writes, market-data ingestion, public source promotion, or scoreSource=real.",
    summary: evidenceBoundary.summary
  };
}
