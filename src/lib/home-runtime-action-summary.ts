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
      "把 freshness read-only metadata evidence 轉成更清楚的 runtime 狀態揭露與來源深度待辦，仍不升級 public source 或 scoreSource=real。",
    safetyStopLine:
      "Supabase readonly evidence can inform review, but cannot promote publicDataSource or scoreSource without a separate gate.",
    stage:
      "Mock MVP 與 runtime guard 已進入可操作階段；Supabase object reachability 與 freshness read-only metadata run 已完成，真實市場資料 ingestion 與 scoreSource=real 尚未開啟。"
  };
}
