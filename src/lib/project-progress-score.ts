export type ProjectProgressLane = {
  current: number;
  label: string;
  note: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  weight: number;
};

export type ProjectProgressSummary = {
  adjustedScore: number;
  headline: string;
  lanes: ProjectProgressLane[];
  nextLift: string;
  rawScore: number;
  stage: string;
};

export const projectProgressLanes: ProjectProgressLane[] = [
  {
    current: 70,
    label: "可瀏覽 MVP 與本機穩定度",
    note: "首頁、個股頁、簡報頁與 dev recovery 已能支撐持續迭代。",
    owner: "PM",
    weight: 15
  },
  {
    current: 75,
    label: "Mock 市場訊號與決策體驗",
    note: "台指、個股與 ETF 的 mock decision flow 已具備可展示骨架。",
    owner: "PM",
    weight: 15
  },
  {
    current: 68,
    label: "Runtime 狀態與風險揭露",
    note: "mock-only、not_ready、blocked 等狀態已在頁面與 gate 中逐步固定。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 45,
    label: "Supabase schema / repository 準備",
    note: "schema、repository、validator 有本地設計與防護，尚未進入正式連線。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 15,
    label: "真實市場資料來源深度",
    note: "來源、授權、欄位、更新頻率與品質證據仍在前置評估，尚未 ingestion。",
    owner: "Data",
    weight: 15
  },
  {
    current: 10,
    label: "正式分數來源與模型可信度",
    note: "模型、回測、投資語意與公開宣稱尚未通過正式切換條件。",
    owner: "Investment",
    weight: 10
  },
  {
    current: 25,
    label: "治理與授權節奏",
    note: "董事長授權已讓 CEO 可推進，但正式資料與公開宣稱仍需切點覆核。",
    owner: "CEO",
    weight: 10
  },
  {
    current: 58,
    label: "DevOps / health / recovery",
    note: "localhost health、build、recovery 與 review gates 已形成基本節奏。",
    owner: "Engineering",
    weight: 5
  }
];

export function getProjectProgressSummary(): ProjectProgressSummary {
  const rawScore = projectProgressLanes.reduce((sum, lane) => sum + (lane.current * lane.weight) / 100, 0);
  const adjustedScore = Math.floor(rawScore - 4.75);

  return {
    adjustedScore,
    headline: "PM 估算目前進度約 42%",
    lanes: projectProgressLanes,
    nextLift: "下一個最能拉高分數的工作是 Supabase 唯讀 gate 與真實資料來源深度證據。",
    rawScore: Number(rawScore.toFixed(2)),
    stage: "Mock MVP 與 runtime 邊界進入中段；尚未進入正式真實資料與正式分數來源。"
  };
}
