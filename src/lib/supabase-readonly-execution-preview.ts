import {
  getSupabaseReadonlyDecision,
  type SupabaseReadonlyDecisionPacket
} from "@/lib/supabase-readonly-decision";

export type SupabaseReadonlyExecutionPreviewStatus = "blocked" | "ready_for_manual_ceo_run";

export type SupabaseReadonlyExecutionPreview = {
  approvalStatus: "hold" | "ready_for_manual_ceo_run";
  blockedPromotions: string[];
  exactCommandPreview: string | null;
  manualApprovalRequired: true;
  manualApprovalState: "blocked" | "pending_ceo_confirmation";
  manualRunPrerequisites: string[];
  mode: "supabase_readonly_execution_preview";
  nextRemoteCommand: string | null;
  postRunAcceptedOutcomeCategories: string[];
  postRunReviewTarget: string;
  preflightStatus: SupabaseReadonlyDecisionPacket["preflightStatus"];
  readinessPromotionBlocked: true;
  requiredConfirmation: "CP3_SUPABASE_READONLY_REMOTE_VALIDATE";
  safety: {
    automatedRemoteRun: false;
    connectionAttempted: false;
    mutations: false;
    rowPayloadsPrinted: false;
    scoreSourceRealEnabled: false;
    secretsPrinted: false;
    sqlExecuted: false;
  };
  status: SupabaseReadonlyExecutionPreviewStatus;
  stopConditions: string[];
  willRunRemoteValidator: false;
};

export function getSupabaseReadonlyExecutionPreview(
  decision: SupabaseReadonlyDecisionPacket = getSupabaseReadonlyDecision()
): SupabaseReadonlyExecutionPreview {
  const ready = decision.status === "ready_for_ceo_decision" && decision.decision === "proceed_to_ceo_review";

  return {
    approvalStatus: ready ? "ready_for_manual_ceo_run" : "hold",
    blockedPromotions: [
      "cp3_readiness",
      "public_data_source",
      "source_depth_production_ready",
      "public_claims",
      "scoreSource=real"
    ],
    exactCommandPreview: ready
      ? "$env:SUPABASE_READONLY_VALIDATE_CONFIRMATION='CP3_SUPABASE_READONLY_REMOTE_VALIDATE'; npm run db:readonly-validate"
      : null,
    manualApprovalRequired: true,
    manualApprovalState: ready ? "pending_ceo_confirmation" : "blocked",
    manualRunPrerequisites: [
      "CEO confirms exactly one manual readonly attempt",
      "command remains process-scoped and unchanged",
      "post-run review captures status without secrets or row payloads",
      "stop immediately if writes, SQL, ingestion, or scoreSource=real appear"
    ],
    mode: "supabase_readonly_execution_preview",
    nextRemoteCommand: ready ? decision.nextRemoteCommand : null,
    postRunAcceptedOutcomeCategories: [
      "ok_object_reachability_only",
      "blocked_access_denied",
      "blocked_missing_credentials",
      "blocked_malformed_output",
      "blocked_sensitive_output"
    ],
    postRunReviewTarget: "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review.mjs",
    preflightStatus: decision.preflightStatus,
    readinessPromotionBlocked: true,
    requiredConfirmation: "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
    safety: {
      automatedRemoteRun: false,
      connectionAttempted: false,
      mutations: false,
      rowPayloadsPrinted: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sqlExecuted: false
    },
    status: ready ? "ready_for_manual_ceo_run" : "blocked",
    stopConditions: [
      "do not run this preview as approval",
      "do not run if the command differs from npm run db:readonly-validate",
      "do not run if confirmation is not process-scoped",
      "do not run if any write, SQL, ingestion, or scoreSource=real request is bundled"
    ],
    willRunRemoteValidator: false
  };
}
