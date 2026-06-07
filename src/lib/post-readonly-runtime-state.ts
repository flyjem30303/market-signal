import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type PostReadonlyRuntimeState = {
  acceptedEvidence: string;
  headline: string;
  nextGate: string;
  objectsReachable: number;
  publicDataSource: "mock";
  rowCoverage: {
    coverageStatus: "blocked";
    expectedRows: 360;
    missingRows: 178;
    observedRows: 182;
    reason: "aggregate_count_incomplete";
    summary: string;
  };
  scoreSource: "mock";
  state: "readonly_verified_mock_only";
  stopLine: string;
  userFacingSummary: string;
};

export function getPostReadonlyRuntimeState(): PostReadonlyRuntimeState {
  const evidence = getSupabaseReadonlyEvidenceSummary();

  return {
    acceptedEvidence: evidence.acceptedScope,
    headline: "First closed-loop evidence accepted; runtime remains mock-only",
    nextGate: evidence.nextRuntimeGate,
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: "blocked",
      expectedRows: 360,
      missingRows: 178,
      observedRows: 182,
      reason: "aggregate_count_incomplete",
      summary:
        "Accepted first closed-loop evidence now covers 182 of 360 expected Level 1 rows. TWII and ETF coverage remain incomplete, so runtime promotion stays blocked."
    },
    scoreSource: "mock",
    state: "readonly_verified_mock_only",
    stopLine:
      "Do not convert readonly reachability into writes, ingestion, publicDataSource=supabase, or scoreSource=real.",
    userFacingSummary:
      "The first TW equity closed loop is accepted as backend evidence only. The public product still shows mock scoring until coverage, data quality, freshness, source-depth, and promotion gates separately pass."
  };
}
