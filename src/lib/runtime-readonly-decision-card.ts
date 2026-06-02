import {
  getSupabaseReadonlyDecision,
  type SupabaseReadonlyDecisionPacket
} from "@/lib/supabase-readonly-decision";
import {
  getSupabaseReadonlyExecutionPreview,
  type SupabaseReadonlyExecutionPreview
} from "@/lib/supabase-readonly-execution-preview";
import {
  getSupabaseReadonlyLocalPreflight,
  type SupabaseReadonlyLocalPreflight
} from "@/lib/supabase-readonly-local-preflight";

export type RuntimeReadonlyDecisionCard = {
  allowedLocalChecks: string[];
  automatedRemoteRun: false;
  blockedRemoteActions: string[];
  decisionState: "hold" | "ready_for_ceo_oral_review";
  exactCommandPreview: string | null;
  headline: string;
  postRunReviewRequirement: string;
  requiredCeoWording: string;
  safetyLine: string;
  statusLine: string;
};

export function getRuntimeReadonlyDecisionCard(
  preflight: SupabaseReadonlyLocalPreflight = getSupabaseReadonlyLocalPreflight(),
  decision: SupabaseReadonlyDecisionPacket = getSupabaseReadonlyDecision(preflight),
  executionPreview: SupabaseReadonlyExecutionPreview = getSupabaseReadonlyExecutionPreview(decision)
): RuntimeReadonlyDecisionCard {
  const ready =
    preflight.status === "ready_for_guarded_readonly_decision" &&
    decision.status === "ready_for_ceo_decision" &&
    executionPreview.status === "ready_for_manual_ceo_run";

  return {
    allowedLocalChecks: [
      "local preflight",
      "readonly execution preview",
      "public runtime boundary checks",
      "full review gate",
      "production build"
    ],
    automatedRemoteRun: false,
    blockedRemoteActions: [
      "automatic Supabase connection",
      "SQL execution",
      "Supabase writes",
      "row payload printing",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    decisionState: ready ? "ready_for_ceo_oral_review" : "hold",
    exactCommandPreview: executionPreview.exactCommandPreview,
    headline: ready
      ? "Readonly attempt is locally prepared but still requires CEO oral naming"
      : "Readonly attempt remains on hold until local preflight is ready",
    postRunReviewRequirement:
      "After exactly one manually named readonly attempt, record a sanitized post-run review before any readiness or public-state change.",
    requiredCeoWording:
      "CEO must explicitly name one bounded Supabase readonly attempt and the confirmation token before any remote command is run.",
    safetyLine:
      "This card does not run Supabase, does not run SQL, does not ingest market data, and does not promote scoreSource=real.",
    statusLine: `preflight ${preflight.status}; decision ${decision.status}; execution preview ${executionPreview.status}.`
  };
}
