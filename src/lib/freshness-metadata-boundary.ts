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
        ? "新鮮度 metadata 可讀；分數與公開資料來源仍維持示範狀態。"
        : "新鮮度 metadata 尚未核准作為正式分數證據。",
    canDisplayFreshnessMetadata: state === "metadata_mock" || state === "metadata_reachable",
    canPromoteCp3Readiness: false,
    canPromoteDataQuality: false,
    canSetScoreSourceReal: false,
    canSwitchPublicDataSource: false,
    state,
    stopLine:
      "新鮮度 metadata 只能輔助顯示狀態；不得因此核准資料品質、公開宣稱、CP3 準備度或正式分數。"
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
