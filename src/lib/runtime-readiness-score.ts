export type RuntimeReadinessLane = {
  current: number;
  label: string;
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  state: "active" | "blocked" | "readying";
};

export type RuntimeReadinessSummary = {
  headline: string;
  lanes: RuntimeReadinessLane[];
  nextDecision: string;
  score: number;
  status: "mock_only" | "readying" | "blocked";
};

export const runtimeReadinessLanes: RuntimeReadinessLane[] = [
  {
    current: 72,
    label: "Mock runtime guard",
    nextAction: "繼續強化公開頁的 mock-only 與 not-ready 揭露。",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 48,
    label: "Supabase 唯讀路徑",
    nextAction: "準備只讀 preflight 與回報格式；未授權前不連線。",
    owner: "Engineering",
    state: "readying"
  },
  {
    current: 30,
    label: "真實資料來源深度",
    nextAction: "補齊來源授權、欄位、更新頻率、缺漏日與降級策略。",
    owner: "Data",
    state: "readying"
  },
  {
    current: 24,
    label: "公開宣稱邊界",
    nextAction: "公開文字只說 mock 與候選狀態，不說已完成正式資料切換。",
    owner: "PM",
    state: "blocked"
  },
  {
    current: 12,
    label: "正式分數來源",
    nextAction: "等模型可信度、回測、法務與投資語意覆核後再開 gate。",
    owner: "Investment",
    state: "blocked"
  }
];

export function getRuntimeReadinessSummary(): RuntimeReadinessSummary {
  const score = Math.round(
    runtimeReadinessLanes.reduce((sum, lane) => sum + lane.current, 0) / runtimeReadinessLanes.length
  );

  return {
    headline: "Runtime 進入可加速前置，但仍維持 mock-only",
    lanes: runtimeReadinessLanes,
    nextDecision: "CEO 下一步優先推 Supabase 唯讀 preflight 與來源深度證據，不切主資料源、不寫資料。",
    score,
    status: "readying"
  };
}
