export type Cp3MockOnlyApprovalState = "not_ready";

export type Cp3MockOnlyDataQualityState = "partial" | "stale" | "unavailable";

export type Cp3MockOnlyFreshnessState = "stale" | "unknown";

export type Cp3MockOnlyRuntimeState = {
  assetType: "stock" | "etf" | "index";
  backtestApprovalState: Cp3MockOnlyApprovalState;
  claimApprovalState: Cp3MockOnlyApprovalState;
  dataQualityScore: number;
  dataQualityState: Cp3MockOnlyDataQualityState;
  disclosureApprovalState: Cp3MockOnlyApprovalState;
  freshnessState: Cp3MockOnlyFreshnessState;
  locale: "zh-TW";
  market: "tw";
  modelApprovalState: "candidate";
  modelVersion: string;
  scoreSource: "mock";
  sourceDepthState: Cp3MockOnlyApprovalState;
  sourceRightsState: Cp3MockOnlyApprovalState;
};

export type Cp3MockOnlyDisplayState = "mock" | "partial" | "stale" | "unavailable";

export type Cp3MockOnlyUiCopyToken = {
  claimLimit: string;
  disclosure: string;
  label: string;
  shortDescription: string;
};

export const cp3MockOnlyUiCopyTokens: Record<Cp3MockOnlyDisplayState, Cp3MockOnlyUiCopyToken> = {
  mock: {
    claimLimit: "Do not describe as real, validated, or source-backed.",
    disclosure: "This is not a real model score and is not investment advice.",
    label: "Sample signal",
    shortDescription: "This score is a mock-only runtime state for product review."
  },
  partial: {
    claimLimit: "Do not describe as validated or complete.",
    disclosure: "Partial data can change the score context and is not investment advice.",
    label: "Partial data",
    shortDescription: "Some required data is missing or not yet approved."
  },
  stale: {
    claimLimit: "Do not claim daily updated real model output.",
    disclosure: "Freshness is not confirmed; treat this as context only, not investment advice.",
    label: "Stale data",
    shortDescription: "Some market data may be outdated."
  },
  unavailable: {
    claimLimit: "Do not make score, validation, or coverage claims.",
    disclosure: "The score is unavailable because required data or approvals are missing.",
    label: "Unavailable",
    shortDescription: "A score cannot be shown with the current approval state."
  }
};

export function getMockOnlyPublicDisplayState(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyDisplayState {
  if (state.scoreSource === "mock") return "mock";
  if (state.dataQualityState === "stale") return "stale";
  if (state.dataQualityState === "partial") return "partial";

  return "unavailable";
}
