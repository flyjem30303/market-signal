import { buildDataQualityEvidenceGate, type DataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";

export type ProjectProgressLane = {
  current: number;
  label: string;
  note: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  weight: number;
};

export type ProjectProgressSummary = {
  adjustedScore: number;
  dataQualityEvidenceGate: DataQualityEvidenceGate;
  headline: string;
  lanes: ProjectProgressLane[];
  nextLift: string;
  rawScore: number;
  stage: string;
};

export const projectProgressLanes: ProjectProgressLane[] = [
  {
    current: 74,
    label: "可瀏覽 MVP 與主要頁面",
    note: "首頁、briefing、股票頁、方法論與法務頁已可 build 與健康檢查；dev recovery 流程已固定。",
    owner: "PM",
    weight: 15
  },
  {
    current: 78,
    label: "Mock 體驗與決策流程",
    note: "mock runtime、ETF 與股票決策流程已能支撐本地展示；仍不可宣稱真實資料或正式分數。",
    owner: "PM",
    weight: 15
  },
  {
    current: 80,
    label: "Runtime 邊界與 guard",
    note: "mock-only、not_ready、blocked、manual gate 與 review gate 已串起來，可避免未授權升級。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 74,
    label: "Supabase schema / repository readiness",
    note: "schema、repository、validator、本地唯讀 preflight、輸出契約與一次受控 object reachability 已完成。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 40,
    label: "真實市場資料與來源深度",
    note: "freshness interpretation 已切開 data_runs baseline 與 data_freshness candidate；資料品質降級規則與 Supabase readonly runtime activation guard 已進 disclosure，但來源權利、欄位覆蓋與 ingestion 仍未正式開啟。",
    owner: "Data",
    weight: 15
  },
  {
    current: 16,
    label: "模型可信度與回測證據",
    note: "投資模型仍停在 mock，需等真實資料、來源深度、回測與角色覆核完成後才能討論 real score。",
    owner: "Investment",
    weight: 10
  },
  {
    current: 50,
    label: "CEO 授權與治理收斂",
    note: "CEO 已把治理從過細文件轉向較大切片，並完成一次 readonly gate；仍需避免把 reachability 誤當正式授權。",
    owner: "CEO",
    weight: 10
  },
  {
    current: 76,
    label: "DevOps / health / recovery",
    note: "localhost health、build、review gates 與 dev server recovery 已形成穩定節奏。",
    owner: "Engineering",
    weight: 5
  }
];

export function getProjectProgressSummary(): ProjectProgressSummary {
  const dataQualityEvidenceGate = buildDataQualityEvidenceGate();
  const rawScore = projectProgressLanes.reduce((sum, lane) => sum + (lane.current * lane.weight) / 100, 0);
  const adjustedScore = Math.floor(rawScore - 2);

  return {
    adjustedScore,
    dataQualityEvidenceGate,
    headline: `PM 估算目前整體開發進度 ${adjustedScore}%`,
    lanes: projectProgressLanes,
    nextLift: "下一個最能拉高分數的工作，是把 Supabase readonly runtime activation 接成一次性受控 metadata read smoke，仍不升級 public source 或 scoreSource=real。",
    rawScore: Number(rawScore.toFixed(2)),
    stage: "Mock MVP 與 runtime guard 已進入可操作階段；Supabase object reachability 已完成，真實市場資料與 scoreSource=real 尚未開啟。"
  };
}
