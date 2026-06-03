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
    headline: "Runtime quick read: mock only",
    publicDataSource: "mock",
    scoreSource: "mock",
    states: [
      {
        body: "Users can read mock signals, product flow, and local readiness without treating them as live market evidence.",
        label: "Visible now",
        tone: "active",
        value: "publicDataSource=mock"
      },
      {
        body: "Supabase-backed public data, SQL-backed scoring, real market ingestion, and investment-advice claims are blocked.",
        label: "Not live yet",
        tone: "blocked",
        value: "scoreSource=mock"
      },
      {
        body: "CEO must separately name a bounded readonly gate before any runtime transition can be discussed.",
        label: "Next gate",
        tone: "readying",
        value: "claimApproval=not_approved"
      }
    ],
    stopLine:
      "Do not promote public source, real-score wording, market-data coverage, or investment-advice claims from this state.",
    summary:
      "Every public page uses this same quick read before any future Supabase or real-data transition."
  };
}
