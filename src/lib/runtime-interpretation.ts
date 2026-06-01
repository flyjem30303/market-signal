export type RuntimeInterpretationSummary = {
  blockers: string[];
  decision: "mock_runtime_hardening";
  headline: string;
  laneRatio: {
    mockRuntimeHardening: number;
    supabaseReadonlyPreparation: number;
  };
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getRuntimeInterpretationSummary(): RuntimeInterpretationSummary {
  return {
    blockers: [
      "Supabase row coverage attempt must be a separately named readonly action",
      "source rights and disclosure are not approved for public promotion",
      "model credibility and backtest evidence are not approved for real-score claims",
      "data quality evidence is not sufficient for scoreSource=real"
    ],
    decision: "mock_runtime_hardening",
    headline: "Mock runtime hardening is the active CEO track",
    laneRatio: {
      mockRuntimeHardening: 70,
      supabaseReadonlyPreparation: 30
    },
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "Do not promote publicDataSource=supabase or scoreSource=real until source rights, model credibility, data quality, and public-claim gates are accepted."
  };
}
