export type PublicClaimRuntimeState = {
  claimApprovalState: "not_approved";
  headline: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  states: Array<{
    body: string;
    label: string;
    tone: "active" | "readying" | "blocked";
    value: string;
  }>;
  stopLine: string;
  summary: string;
};

export function getPublicClaimRuntimeState(): PublicClaimRuntimeState {
  return {
    claimApprovalState: "not_approved",
    headline: "Public runtime state: mock only",
    publicDataSource: "mock",
    scoreSource: "mock",
    states: [
      {
        body: "Public pages may show the mock research experience and local readiness only.",
        label: "Public data",
        tone: "active",
        value: "publicDataSource=mock"
      },
      {
        body: "Scores are product-flow demonstrations, not real market-data evidence.",
        label: "Score source",
        tone: "active",
        value: "scoreSource=mock"
      },
      {
        body: "Real-data, official ranking, and investment-advice claims remain blocked until separate accepted gates pass.",
        label: "Claims",
        tone: "blocked",
        value: "claimApproval=not_approved"
      }
    ],
    stopLine:
      "Do not promote public source, real-score wording, market-data coverage, or investment-advice claims from this state.",
    summary:
      "This strip aligns every public surface to the same runtime interpretation before any future Supabase or real-data transition."
  };
}
