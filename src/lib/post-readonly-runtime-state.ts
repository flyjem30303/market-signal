import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type PostReadonlyRuntimeState = {
  acceptedEvidence: string;
  headline: string;
  nextGate: string;
  objectsReachable: number;
  publicDataSource: "mock";
  scoreSource: "mock";
  state: "readonly_verified_mock_only";
  stopLine: string;
  userFacingSummary: string;
};

export function getPostReadonlyRuntimeState(): PostReadonlyRuntimeState {
  const evidence = getSupabaseReadonlyEvidenceSummary();

  return {
    acceptedEvidence: evidence.acceptedScope,
    headline: "Readonly verified; runtime remains mock-only",
    nextGate: evidence.nextRuntimeGate,
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    scoreSource: "mock",
    state: "readonly_verified_mock_only",
    stopLine:
      "Do not convert readonly reachability into writes, ingestion, publicDataSource=supabase, or scoreSource=real.",
    userFacingSummary:
      "Supabase reachability is accepted as backend evidence only. The public product still shows mock scoring until the next gate separately accepts data quality, freshness, and source-depth evidence."
  };
}
