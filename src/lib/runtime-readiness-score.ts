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
  localPreflightCommand: string;
  localPreflightState: string;
  nextDecision: string;
  nextRemoteCommand: string;
  score: number;
  status: "mock_only" | "readying" | "blocked";
};

export const runtimeReadinessLanes: RuntimeReadinessLane[] = [
  {
    current: 76,
    label: "Mock runtime guard",
    nextAction: "本地 mock-only、not_ready 與 blocked 狀態已能穩定呈現；下一步是維持 guard 並避免誤升級。",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 82,
    label: "Supabase 唯讀 object reachability",
    nextAction: "一次受控唯讀 gate 已完成，五個目標物件可達；下一步改做 schema shape、freshness 與 UI 狀態接線。",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 42,
    label: "來源深度證據",
    nextAction: "補齊來源權利、欄位覆蓋、更新頻率、缺漏規則與降級矩陣，避免把 reachability 誤當資料品質。",
    owner: "Data",
    state: "readying"
  },
  {
    current: 34,
    label: "公開資訊階層",
    nextAction: "公開頁面可揭露 mock-only 與 blocked 邊界，但不能宣稱正式資料源、投資建議或 production readiness。",
    owner: "PM",
    state: "blocked"
  },
  {
    current: 16,
    label: "模型與回測證據",
    nextAction: "在真實資料、來源深度與回測證據完成前，Investment 仍需把模型可信度維持 blocked。",
    owner: "Investment",
    state: "blocked"
  }
];

export function getRuntimeReadinessSummary(): RuntimeReadinessSummary {
  const score = Math.round(
    runtimeReadinessLanes.reduce((sum, lane) => sum + lane.current, 0) / runtimeReadinessLanes.length
  );

  return {
    headline: "Runtime 已通過 Supabase object reachability，但仍維持 mock-only",
    lanes: runtimeReadinessLanes,
    localPreflightCommand: "npm run report:supabase-readonly-preflight",
    localPreflightState: "本地 preflight 只檢查環境與安全開關，不連線、不印 secrets、不跑 SQL。",
    nextDecision:
      "CEO 下一步改推 schema shape、freshness interpretation 與 UI state wiring；主資料源不切換、不寫資料、不升級公開宣稱。",
    nextRemoteCommand: "npm run db:readonly-validate",
    score,
    status: "readying"
  };
}
