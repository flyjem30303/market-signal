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
    label: "產品原型與頁面可瀏覽",
    note: "核心頁面、健康檢查與 dev recovery 已可支撐日常瀏覽。",
    owner: "PM",
    weight: 15
  },
  {
    current: 75,
    label: "Mock 訊號體驗與台股頁流程",
    note: "台指、個股與 ETF 的 mock decision flow 已成形。",
    owner: "PM",
    weight: 15
  },
  {
    current: 68,
    label: "Runtime 邊界與防誤導",
    note: "mock-only、not_ready、blocked 與 scoreSource 邊界已在前台顯示。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 45,
    label: "Supabase schema / repository 前置",
    note: "schema、repository、validator 與唯讀路徑已準備，但仍需受控 gate。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 15,
    label: "真實市場資料接軌",
    note: "來源深度、權利、品質降級與 ingestion 尚未正式開啟。",
    owner: "Data",
    weight: 15
  },
  {
    current: 10,
    label: "scoreSource=real / 模型可信度",
    note: "模型、回測、公開宣稱與投資角色證據仍未核准。",
    owner: "Investment",
    weight: 10
  },
  {
    current: 25,
    label: "全球化架構準備",
    note: "策略已納入全球市場與多國使用者，但 runtime 尚以台股起步。",
    owner: "CEO",
    weight: 10
  },
  {
    current: 58,
    label: "DevOps / health / recovery",
    note: "localhost health、build 後 recovery 與 review gates 已能支撐迭代。",
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
    stage: "Mock MVP 與 runtime 邊界進入中段；尚未進入正式真實資料與 scoreSource=real。"
  };
}
