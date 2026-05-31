export type SourceDepthBlockerState = "blocked" | "not_ready";

export type SourceDepthBlocker = {
  id: string;
  label: string;
  owner: "Data" | "Engineering" | "Investment" | "Legal";
  reason: string;
  state: SourceDepthBlockerState;
};

export type SourceDepthBlockerSummary = {
  blockers: SourceDepthBlocker[];
  headline: string;
  nextAction: string;
  readinessLabel: "not_ready";
  scoreSource: "mock";
  sourceDepthState: "not_ready";
  stopLine: string;
};

export function getSourceDepthBlockerSummary(): SourceDepthBlockerSummary {
  const blockers: SourceDepthBlocker[] = [
    {
      id: "history-depth",
      label: "歷史深度不足",
      owner: "Data",
      reason: "價格與基本面歷史深度尚未達到 CP3 正式化門檻，不能支持真實模型解讀。",
      state: "not_ready"
    },
    {
      id: "source-rights",
      label: "來源權利未完成",
      owner: "Legal",
      reason: "公開展示、再散布、商用使用與引用方式仍需完成權利確認。",
      state: "blocked"
    },
    {
      id: "quality-downgrade",
      label: "資料品質降級規則未覆核",
      owner: "Investment",
      reason: "缺漏、延遲、ETF 與個股欄位差異尚未完成角色覆核，不能切換正式分數。",
      state: "blocked"
    },
    {
      id: "remote-read-evidence",
      label: "遠端唯讀證據未轉成品質證據",
      owner: "Engineering",
      reason: "Supabase reachability 只能證明物件可讀，不等於資料完整、正確或可公開使用。",
      state: "blocked"
    }
  ];

  return {
    blockers,
    headline: "來源深度仍是 scoreSource=real 前的主要阻塞",
    nextAction: "下一步應先把來源深度、來源權利與資料品質降級規則整理成可覆核證據，再討論真實資料與正式分數。",
    readinessLabel: "not_ready",
    scoreSource: "mock",
    sourceDepthState: "not_ready",
    stopLine: "不得因 UI、metadata reachability、schema shape 或 Supabase object reachability 而升級公開宣稱。"
  };
}
