import type { DataFreshnessSnapshot } from "@/lib/data-freshness";

export type FreshnessMetadataBoundaryState =
  | "metadata_mock"
  | "metadata_reachable"
  | "metadata_unavailable"
  | "blocked_real_score";

export type FreshnessMetadataBoundarySummary = {
  allowedPublicClaim: string;
  canDisplayFreshnessMetadata: boolean;
  canPromoteCp3Readiness: false;
  canPromoteDataQuality: false;
  canSetScoreSourceReal: false;
  canSwitchPublicDataSource: false;
  state: FreshnessMetadataBoundaryState;
  stopLine: string;
};

export function getFreshnessMetadataBoundarySummary(
  freshness: DataFreshnessSnapshot
): FreshnessMetadataBoundarySummary {
  const state = resolveState(freshness);

  return {
    allowedPublicClaim:
      state === "metadata_reachable"
        ? "Freshness metadata is reachable; score and public data source remain mock."
        : "Freshness metadata is not approved as real scoring evidence.",
    canDisplayFreshnessMetadata: state === "metadata_mock" || state === "metadata_reachable",
    canPromoteCp3Readiness: false,
    canPromoteDataQuality: false,
    canSetScoreSourceReal: false,
    canSwitchPublicDataSource: false,
    state,
    stopLine:
      "Freshness metadata may inform display state only; it must not approve data quality, public claims, CP3 readiness, or scoreSource=real."
  };
}

function resolveState(freshness: DataFreshnessSnapshot): FreshnessMetadataBoundaryState {
  if (freshness.scoreSource === "real") {
    return "blocked_real_score";
  }

  if (freshness.isMock) {
    return "metadata_mock";
  }

  if (freshness.state === "unavailable") {
    return "metadata_unavailable";
  }

  return "metadata_reachable";
}
