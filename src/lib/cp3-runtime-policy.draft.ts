export type Cp3ScoreSource = "mock" | "unavailable" | "real_candidate" | "real";

export type Cp3ApprovalState = "not_ready" | "review" | "approved" | "blocked";

export type Cp3ModelApprovalState = "candidate" | "review" | "approved" | "retired";

export type Cp3DataQualityState = "complete" | "partial" | "stale" | "unavailable";

export type Cp3FreshnessState = "fresh" | "stale" | "unknown";

export type Cp3Market = "tw" | "us" | "jp" | "global" | (string & {});

export type Cp3AssetType = "stock" | "etf" | "index" | "fx" | "rate" | "crypto" | (string & {});

export type Cp3Locale = "zh-TW" | "en-US" | (string & {});

export type Cp3RuntimeState = {
  scoreSource: Cp3ScoreSource;
  market: Cp3Market;
  assetType: Cp3AssetType;
  locale: Cp3Locale;
  modelVersion: string;
  modelApprovalState: Cp3ModelApprovalState;
  dataQualityState: Cp3DataQualityState;
  dataQualityScore: number;
  freshnessState: Cp3FreshnessState;
  sourceDepthState: Cp3ApprovalState;
  sourceRightsState: Cp3ApprovalState;
  backtestApprovalState: Cp3ApprovalState;
  disclosureApprovalState: Cp3ApprovalState;
  claimApprovalState: Cp3ApprovalState;
};

export type Cp3PublicDisplayState =
  | "mock"
  | "internal_review"
  | "partial"
  | "stale"
  | "unavailable"
  | "approved";

export function canDisplayPublicRealScore(state: Cp3RuntimeState): boolean {
  return (
    state.scoreSource === "real" &&
    state.modelApprovalState === "approved" &&
    state.dataQualityState === "complete" &&
    state.sourceDepthState === "approved" &&
    state.sourceRightsState === "approved" &&
    state.backtestApprovalState === "approved" &&
    state.disclosureApprovalState === "approved" &&
    state.claimApprovalState === "approved"
  );
}

export function getPublicDisplayState(state: Cp3RuntimeState): Cp3PublicDisplayState {
  if (canDisplayPublicRealScore(state)) {
    return "approved";
  }

  if (state.scoreSource === "mock") {
    return "mock";
  }

  if (state.dataQualityState === "stale") {
    return "stale";
  }

  if (state.dataQualityState === "partial") {
    return "partial";
  }

  if (state.scoreSource === "real_candidate" || state.modelApprovalState === "review") {
    return "internal_review";
  }

  return "unavailable";
}
