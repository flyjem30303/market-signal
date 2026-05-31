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
    current: 72,
    label: "可瀏覽 MVP 與主要頁面",
    note: "首頁、briefing、股票頁、方法論與法務頁已可 build 與健康檢查；dev recovery 流程已固定。",
    owner: "PM",
    weight: 15
  },
  {
    current: 76,
    label: "Mock 體驗與決策流程",
    note: "mock runtime、ETF 與股票決策流程已能支撐本地展示；仍不可宣稱真實資料或正式分數。",
    owner: "PM",
    weight: 15
  },
  {
    current: 72,
    label: "Runtime 邊界與 guard",
    note: "mock-only、not_ready、blocked、manual gate 與 review gate 已串起來，可避免未授權升級。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 58,
    label: "Supabase schema / repository readiness",
    note: "schema、repository、validator、本地唯讀 preflight 與輸出契約已具備；遠端唯讀仍需 CEO 單次 gate。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 18,
    label: "真實市場資料與來源深度",
    note: "來源權利、欄位覆蓋、更新頻率、缺漏規則、資料品質與 ingestion 仍未正式開啟。",
    owner: "Data",
    weight: 15
  },
  {
    current: 12,
    label: "模型可信度與回測證據",
    note: "投資模型仍停在 mock，需等真實資料、來源深度、回測與角色覆核完成後才能討論 real score。",
    owner: "Investment",
    weight: 10
  },
  {
    current: 34,
    label: "CEO 授權與治理收斂",
    note: "CEO 已把治理從過細文件轉向較大切片；仍需避免把預檢或 reachability 誤當正式授權。",
    owner: "CEO",
    weight: 10
  },
  {
    current: 64,
    label: "DevOps / health / recovery",
    note: "localhost health、build、review gates 與 dev server recovery 已形成穩定節奏。",
    owner: "Engineering",
    weight: 5
  }
];

export function getProjectProgressSummary(): ProjectProgressSummary {
  const rawScore = projectProgressLanes.reduce((sum, lane) => sum + (lane.current * lane.weight) / 100, 0);
  const adjustedScore = Math.floor(rawScore - 4.75);

  return {
    adjustedScore,
    headline: `PM 估算目前整體開發進度 ${adjustedScore}%`,
    lanes: projectProgressLanes,
    nextLift: "下一個最能拉高分數的工作，是受控 Supabase 唯讀遠端驗證後的來源深度證據與資料品質判讀。",
    rawScore: Number(rawScore.toFixed(2)),
    stage: "Mock MVP 與 runtime guard 已進入可操作階段；Supabase 仍在唯讀受控 gate，真實市場資料與 scoreSource=real 尚未開啟。"
  };
}
