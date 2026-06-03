export type RuntimeReadinessLane = {
  current: number;
  displayLabel: string;
  displayNextAction: string;
  label: string;
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  state: "active" | "blocked" | "readying";
};

export type RuntimeReadinessSummary = {
  displayHeadline: string;
  displayNextDecision: string;
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
    displayLabel: "模擬狀態保護",
    displayNextAction:
      "維持公開頁面只呈現模擬訊號、未完成與暫停狀態；任何遠端動作前都先跑本機檢查。",
    label: "Mock runtime guard",
    nextAction:
      "Keep public pages aligned to mock-only, not_ready, and blocked states; continue local guard checks before any remote action.",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 82,
    displayLabel: "資料表可讀性",
    displayNextAction:
      "已接受的唯讀可達性只能當後端證據，用來整理資料表形狀、資料新鮮度解讀與畫面狀態。",
    label: "Supabase object reachability",
    nextAction:
      "Use the accepted readonly reachability evidence only for schema shape, freshness interpretation, and UI state wiring.",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 42,
    displayLabel: "資料完整度準備",
    displayNextAction:
      "資料列覆蓋率維持本機就緒、遠端暫停；只有在另外授權一次限定唯讀檢查後才能前進。",
    label: "Row coverage readiness",
    nextAction:
      "Keep row coverage in local-ready, remote-paused state until a separately named bounded readonly attempt is approved.",
    owner: "Data",
    state: "readying"
  },
  {
    current: 34,
    displayLabel: "公開宣稱邊界",
    displayNextAction:
      "公開頁可以說明模擬與暫停邊界，但不能暗示官方資料、投資建議或正式上線。",
    label: "Public claim boundary",
    nextAction:
      "Public pages may disclose mock-only and blocked boundaries, but must not imply official data, advice, or production readiness.",
    owner: "PM",
    state: "blocked"
  },
  {
    current: 16,
    displayLabel: "投資可信度",
    displayNextAction:
      "來源權利、模型可信度與資料品質證據仍會阻擋投資級宣稱與真實評分來源。",
    label: "Investment credibility",
    nextAction:
      "Source rights, model credibility, and data-quality evidence still block any investment-grade or scoreSource=real claim.",
    owner: "Investment",
    state: "blocked"
  }
];

export function getRuntimeReadinessSummary(): RuntimeReadinessSummary {
  const score = Math.round(
    runtimeReadinessLanes.reduce((sum, lane) => sum + lane.current, 0) / runtimeReadinessLanes.length
  );

  return {
    displayHeadline: "後端唯讀可達性已確認，但公開網站仍維持模擬訊號",
    displayNextDecision:
      "下一步先整理資料表形狀、資料新鮮度解讀與畫面狀態；新鮮度基準仍看 data_runs，公開資料來源仍維持 mock。",
    headline: "Runtime passed Supabase object reachability, but public runtime remains mock-only",
    lanes: runtimeReadinessLanes,
    localPreflightCommand: "npm run report:supabase-readonly-preflight",
    localPreflightState:
      "Local preflight is available for review only; it must not print secrets, row payloads, SQL, or promote runtime state.",
    nextDecision:
      "CEO keeps the next slice on schema shape, freshness interpretation, and UI state wiring; freshness baseline remains data_runs and public source remains mock.",
    nextRemoteCommand: "npm run db:readonly-validate",
    score,
    status: "readying"
  };
}
