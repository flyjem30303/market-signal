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
    current: 74,
    label: "Mock runtime guard",
    nextAction: "繼續強化公開頁的 mock-only、not-ready 與 blocked 揭露。",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 54,
    label: "Supabase 唯讀 preflight",
    nextAction: "本地 preflight 已可確認 key 存在與安全開關預設；下一步是 CEO 決定是否開一次受控唯讀遠端驗證。",
    owner: "Engineering",
    state: "readying"
  },
  {
    current: 32,
    label: "真實資料來源深度",
    nextAction: "補齊來源授權、欄位、更新頻率、缺漏日與降級策略。",
    owner: "Data",
    state: "readying"
  },
  {
    current: 26,
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
    headline: "Runtime 前置可加速，主系統仍維持 mock-only",
    lanes: runtimeReadinessLanes,
    localPreflightCommand: "npm run report:supabase-readonly-preflight",
    localPreflightState: "本地 preflight 可安全執行，且不連線、不跑 SQL、不印 secrets。",
    nextDecision: "CEO 下一步優先判斷是否開一次受控 Supabase 唯讀遠端驗證；主資料源不切換、不寫資料。",
    nextRemoteCommand: "npm run db:readonly-validate",
    score,
    status: "readying"
  };
}
