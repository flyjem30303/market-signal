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
    displayLabel: "Mock runtime guard",
    displayNextAction:
      "維持公開頁面對齊 mock-only、not_ready 與 blocked 狀態；任何遠端動作前都先通過本地 guard checks。",
    label: "Mock runtime guard",
    nextAction:
      "Keep public pages aligned to mock-only, not_ready, and blocked states; continue local guard checks before any remote action.",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 82,
    displayLabel: "Supabase readonly reachability",
    displayNextAction:
      "已接受 readonly object reachability 作為後端證據；只可用於 schema shape、freshness interpretation 與 UI state wiring。",
    label: "Supabase object reachability",
    nextAction:
      "Use the accepted readonly reachability evidence only for schema shape, freshness interpretation, and UI state wiring.",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 42,
    displayLabel: "Row coverage readiness",
    displayNextAction:
      "Row coverage 維持 local-ready、remote-paused；必須等 CEO 另行命名 bounded readonly attempt 才能跨到遠端。",
    label: "Row coverage readiness",
    nextAction:
      "Keep row coverage in local-ready, remote-paused state until a separately named bounded readonly attempt is approved.",
    owner: "Data",
    state: "readying"
  },
  {
    current: 34,
    displayLabel: "Public claim boundary",
    displayNextAction:
      "公開頁面只能揭露 mock-only 與 blocked 邊界；不得暗示正式資料、投資建議或 production readiness。",
    label: "Public claim boundary",
    nextAction:
      "Public pages may disclose mock-only and blocked boundaries, but must not imply official data, advice, or production readiness.",
    owner: "PM",
    state: "blocked"
  },
  {
    current: 16,
    displayLabel: "Investment credibility",
    displayNextAction:
      "source rights、model credibility 與 data-quality evidence 仍封鎖 investment-grade 與 scoreSource=real 宣稱。",
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
    displayHeadline: "Runtime 已通過 Supabase 物件可達性檢查，但公開狀態仍維持 mock-only",
    displayNextDecision:
      "下一步由 PM 收斂 runtime guard summary，並把 schema、freshness、row coverage、data quality 與 source-depth 的後續 gate 保持為另行命名的邊界。",
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
