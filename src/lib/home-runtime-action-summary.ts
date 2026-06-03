export type HomeRuntimeActionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  nextAction: "post-readonly runtime decision";
  nextLift: string;
  safetyStopLine: string;
  stage: string;
};

export function getHomeRuntimeActionSummary(): HomeRuntimeActionSummary {
  return {
    blockedTransition: "real-score transition",
    currentProgressPercent: 72,
    nextAction: "post-readonly runtime decision",
    nextLift:
      "Translate verified object reachability into schema shape, freshness, row coverage, data quality, source-depth, and UI runtime interpretation decisions without promoting public source or scoreSource=real.",
    safetyStopLine:
      "Supabase readonly evidence can inform review, but cannot promote publicDataSource or scoreSource without a separate gate.",
    stage:
      "Supabase object reachability is verified as backend evidence only. Runtime remains mock-only; ingestion, SQL, publicDataSource=supabase, and scoreSource=real remain blocked."
  };
}
