import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";

export type PostReadonlyRuntimeState = {
  acceptedEvidence: string;
  headline: string;
  nextGate: string;
  objectsReachable: number;
  publicDataSource: "mock";
  rowCoverage: {
    coverageStatus: "blocked";
    expectedRows: 360;
    missingRows: 355;
    observedRows: 5;
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
  const rowCoverage = getRowCoverageSecondAttemptReadiness();

  return {
    acceptedEvidence: evidence.acceptedScope,
    headline: "Readonly verified; runtime remains mock-only",
    nextGate: evidence.nextRuntimeGate,
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: rowCoverage.latestAttempt.coverageStatus,
      expectedRows: rowCoverage.latestAttempt.expectedTotalRows,
      missingRows: rowCoverage.latestAttempt.missingRows,
      observedRows: rowCoverage.latestAttempt.observedTotalRows,
      reason: rowCoverage.latestAttempt.reason,
      summary:
        "Row coverage readonly evidence is incomplete: 5 of 360 expected rows are observed, so runtime promotion stays blocked."
    },
    scoreSource: "mock",
    state: "readonly_verified_mock_only",
    stopLine:
      "Do not convert readonly reachability into writes, ingestion, publicDataSource=supabase, or scoreSource=real.",
    userFacingSummary:
      "Supabase reachability is accepted as backend evidence only. The public product still shows mock scoring until the next gate separately accepts data quality, freshness, and source-depth evidence."
  };
}
