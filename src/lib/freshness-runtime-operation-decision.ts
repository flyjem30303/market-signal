import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessEvidenceBoundarySummary } from "@/lib/freshness-evidence-boundary";
import { getFreshnessInterpretationSummary } from "@/lib/freshness-interpretation";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type FreshnessRuntimeOperationDecisionSummary = {
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
