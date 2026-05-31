import {
  getSupabaseReadonlyLocalPreflight,
  type SupabaseReadonlyLocalPreflight
} from "@/lib/supabase-readonly-local-preflight";

export type SupabaseReadonlyDecisionStatus = "blocked" | "ready_for_ceo_decision";
export type SupabaseReadonlyDecision = "hold" | "proceed_to_ceo_review";

export type SupabaseReadonlyWorkMix = {
  runtime: number;
  supabaseReadonly: number;
};

export type SupabaseReadonlyDecisionPacket = {
  decision: SupabaseReadonlyDecision;
  mode: "supabase_readonly_decision_packet";
  nextRemoteCommand: string | null;
  preflightStatus: SupabaseReadonlyLocalPreflight["status"];
  recommendedWorkMix: SupabaseReadonlyWorkMix;
  requiredHumanStep: string;
  safety: {
    connectionAttempted: false;
    mutations: false;
    publicClaimsChanged: false;
    rowPayloadsPrinted: false;
    scoreSourceRealEnabled: false;
    secretsPrinted: false;
    sqlExecuted: false;
  };
  status: SupabaseReadonlyDecisionStatus;
  stopConditions: string[];
  warningCount: number;
};

export function getSupabaseReadonlyDecision(
  preflight: SupabaseReadonlyLocalPreflight = getSupabaseReadonlyLocalPreflight()
): SupabaseReadonlyDecisionPacket {
  const warningCount = preflight.boundaries.filter((boundary) => boundary.status === "warning").length;
  const blocked =
    preflight.status !== "ready_for_guarded_readonly_decision" ||
    preflight.connectionAttempted !== false ||
    preflight.sqlExecuted !== false ||
    preflight.mutations !== false ||
    preflight.secretsPrinted !== false ||
    preflight.rowPayloadsPrinted !== false ||
    preflight.boundaries.some((boundary) => boundary.status !== "ok");

  return {
    decision: blocked ? "hold" : "proceed_to_ceo_review",
    mode: "supabase_readonly_decision_packet",
    nextRemoteCommand: blocked ? null : preflight.nextRemoteCommand,
    preflightStatus: preflight.status,
    recommendedWorkMix: blocked ? { runtime: 80, supabaseReadonly: 20 } : { runtime: 60, supabaseReadonly: 40 },
    requiredHumanStep: blocked
      ? "PM fixes local blockers before any remote run"
      : "CEO reviews one guarded read-only run",
    safety: {
      connectionAttempted: false,
      mutations: false,
      publicClaimsChanged: false,
      rowPayloadsPrinted: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sqlExecuted: false
    },
    status: blocked ? "blocked" : "ready_for_ceo_decision",
    stopConditions: [
      "missing required Supabase env",
      "NEXT_PUBLIC_DATA_SOURCE is not mock",
      "Supabase read switch is enabled without a one-run gate",
      "any request to write Supabase, run SQL, ingest market rows, or set scoreSource=real"
    ],
    warningCount
  };
}
