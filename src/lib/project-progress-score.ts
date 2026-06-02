import { buildDataQualityEvidenceGate, type DataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";
import { buildDataQualityScoreContract, type DataQualityScoreContract } from "@/lib/data-quality-score-contract";
import { getDataCoverageRouteDecision, type DataCoverageRouteDecision } from "@/lib/data-coverage-route-decision";

export type ProjectProgressLane = {
  current: number;
  label: string;
  note: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  weight: number;
};

export type ProjectProgressSummary = {
  adjustedScore: number;
  dataCoverageRouteDecision: DataCoverageRouteDecision;
  dataQualityEvidenceGate: DataQualityEvidenceGate;
  dataQualityScoreContract: DataQualityScoreContract;
  headline: string;
  lanes: ProjectProgressLane[];
  networkBlocker: {
    currentFinding: string;
    impact: string;
    nextAction: string;
    status: "blocked";
  };
  nextLift: string;
  rawScore: number;
  stage: string;
};

export const projectProgressLanes: ProjectProgressLane[] = [
  {
    current: 74,
    label: "Mock MVP 體驗骨架",
    note:
      "首頁、briefing、個股頁與 runtime 狀態面板已可展示；目前仍以 mock 訊號支撐產品流程，build、health 與 dev recovery 已納入日常驗證。",
    owner: "PM",
    weight: 15
  },
  {
    current: 78,
    label: "Mock 訊號與資料揭露",
    note:
      "mock runtime、ETF/股票頁與資料來源邊界已能被前台看見；仍需把假資料、未驗證資料、正式資料的差異講得更清楚。",
    owner: "PM",
    weight: 15
  },
  {
    current: 86,
    label: "Runtime 狀態與 guard",
    note:
      "mock-only、not_ready、blocked 與 manual gate 已被 review gate 保護；下一步是讓使用者更快理解 blocked 的原因與可行下一步。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 88,
    label: "Supabase schema / repository readiness",
    note:
      "schema、repository、validator 與 readonly preflight 已建立；最新 Supabase network diagnostic 顯示 DNS 可解析，但 TCP 443 被阻擋，遠端表級驗證需先排除本機網路層問題。",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 55,
    label: "資料品質與新鮮度證據",
    note:
      "freshness interpretation、data_runs baseline、data_freshness candidate 與資料品質降級規則已有本地合約；Supabase readonly runtime activation 因 TCP 443 阻塞暫停，scoreSource mock 仍維持，不能啟動 ingestion。",
    owner: "Data",
    weight: 15
  },
  {
    current: 16,
    label: "投資專業與模型可信度",
    note:
      "目前可展示 mock 決策輔助方向，但尚未完成專業指標、回測可信度、風險解釋與 real score 審核；這條線不能因 UI 好看就提前放行。",
    owner: "Investment",
    weight: 10
  },
  {
    current: 73,
    label: "CEO 決策與節奏控管",
    note:
      "CEO 已將治理切片收斂為較大的 runtime product slice；目前阻塞焦點從 generic readonly attempt 改為 TCP 443 / firewall / proxy 根因排除。",
    owner: "CEO",
    weight: 10
  },
  {
    current: 80,
    label: "DevOps / health / recovery",
    note:
      "localhost health、build、review gates 與 dev server recovery 已可穩定重跑；後續要降低 .next 與 dev server 互相干擾的機率。",
    owner: "Engineering",
    weight: 5
  }
];

export function getProjectProgressSummary(): ProjectProgressSummary {
  const dataQualityScoreContract = buildDataQualityScoreContract();
  const dataCoverageRouteDecision = getDataCoverageRouteDecision();
  const dataQualityEvidenceGate = buildDataQualityEvidenceGate({
    dataQualityScore: dataQualityScoreContract.score,
    freshnessState: "complete"
  });
  const rawScore = projectProgressLanes.reduce((sum, lane) => sum + (lane.current * lane.weight) / 100, 0);
  const adjustedScore = Math.floor(rawScore - 2);

  return {
    adjustedScore,
    dataCoverageRouteDecision,
    dataQualityEvidenceGate,
    dataQualityScoreContract,
    headline: `PM 估算整體開發進度 ${adjustedScore}%`,
    lanes: projectProgressLanes,
    networkBlocker: {
      currentFinding: "Supabase network diagnostic: DNS ok, TCP 443 blocked before TLS and REST.",
      impact:
        "這表示目前卡在本機網路層，不適合重複做表級 readonly attempt；publicDataSource 與 scoreSource 必須維持 mock。",
      nextAction: "先排查防火牆、Proxy、VPN、端點防護或公司網路政策，再重新評估一次 bounded readonly gate。",
      status: "blocked"
    },
    nextLift:
      "下一個有效提升點是先解決 TCP 443 / firewall / proxy 連線根因；在此之前主線改推 runtime mock hardening、資料品質證據與 UI 可讀性，不提升 public source 或 scoreSource=real。",
    rawScore: Number(rawScore.toFixed(2)),
    stage:
      "Mock MVP 與 runtime guard 已進入可展示狀態；Supabase object reachability 的最新根因是 TCP 443 blocked，資料品質、ingestion 與 scoreSource=real 仍未放行。"
  };
}
