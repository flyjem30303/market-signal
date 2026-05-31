import {
  getSupabaseReadonlyDecision,
  type SupabaseReadonlyDecisionPacket
} from "@/lib/supabase-readonly-decision";

export type SupabaseReadonlyExecutionPreviewStatus = "blocked" | "ready_for_manual_ceo_run";

export type SupabaseReadonlyExecutionPreview = {
  approvalStatus: "hold" | "ready_for_manual_ceo_run";
  exactCommandPreview: string | null;
  manualApprovalRequired: true;
  manualApprovalState: "blocked" | "pending_ceo_confirmation";
  mode: "supabase_readonly_execution_preview";
  nextRemoteCommand: string | null;
  preflightStatus: SupabaseReadonlyDecisionPacket["preflightStatus"];
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
    exactCommandPreview: ready
      ? "$env:SUPABASE_READONLY_VALIDATE_CONFIRMATION='CP3_SUPABASE_READONLY_REMOTE_VALIDATE'; npm run db:readonly-validate"
      : null,
    manualApprovalRequired: true,
    manualApprovalState: ready ? "pending_ceo_confirmation" : "blocked",
    mode: "supabase_readonly_execution_preview",
    nextRemoteCommand: ready ? decision.nextRemoteCommand : null,
    preflightStatus: decision.preflightStatus,
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
