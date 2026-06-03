export type HomeRuntimeActionSummary = {
  blockedTransition: string;
  currentProgressPercent: 68;
  nextAction: "mock runtime hardening";
  nextLift: string;
  safetyStopLine: string;
  stage: string;
};

export function getHomeRuntimeActionSummary(): HomeRuntimeActionSummary {
  return {
    blockedTransition: "real-score transition",
    currentProgressPercent: 68,
    nextAction: "mock runtime hardening",
    nextLift:
      "Use the accepted freshness readonly metadata only to improve runtime wording, source-state consistency, and blocked-state clarity; do not promote public source or scoreSource=real.",
    safetyStopLine:
      "Supabase readonly evidence can inform review, but cannot promote publicDataSource or scoreSource without a separate gate.",
    stage:
      "Mock MVP runtime guard is active. Supabase object reachability and freshness readonly metadata are review evidence only; ingestion, SQL, publicDataSource=supabase, and scoreSource=real remain blocked."
  };
}
