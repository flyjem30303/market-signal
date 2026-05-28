export type Cp3UiCopyState =
  | "mock"
  | "internal_review"
  | "partial"
  | "stale"
  | "unavailable"
  | "approved";

export type Cp3UiCopyToken = {
  label: string;
  shortDescription: string;
  disclosure: string;
  claimLimit: string;
};

export const cp3UiCopyTokensDraft: Record<Cp3UiCopyState, Cp3UiCopyToken> = {
  mock: {
    label: "Sample signal",
    shortDescription: "This score is a demo state for product review.",
    disclosure: "This is not a real model score and is not investment advice.",
    claimLimit: "Do not describe as real, validated, or source-backed."
  },
  internal_review: {
    label: "Internal review",
    shortDescription: "This state is for review before public release.",
    disclosure: "Internal review output is not public evidence and is not investment advice.",
    claimLimit: "Do not use in public copy or launch claims."
  },
  partial: {
    label: "Partial data",
    shortDescription: "Some required data is missing or not yet approved.",
    disclosure: "Partial data can change the score context and is not investment advice.",
    claimLimit: "Do not describe as validated or complete."
  },
  stale: {
    label: "Stale data",
    shortDescription: "Some market data may be outdated.",
    disclosure: "Freshness is not confirmed; treat this as context only, not investment advice.",
    claimLimit: "Do not claim daily updated real model output."
  },
  unavailable: {
    label: "Unavailable",
    shortDescription: "A score cannot be shown with the current approval state.",
    disclosure: "The score is unavailable because required data or approvals are missing.",
    claimLimit: "Do not make score, validation, or coverage claims."
  },
  approved: {
    label: "Approved model state",
    shortDescription: "All required model, source, disclosure, and claim gates are approved.",
    disclosure: "Scores are research context only and are not personalized investment advice.",
    claimLimit: "Public wording still must match the approved claim packet."
  }
};

