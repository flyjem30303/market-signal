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
    nextAction:
      "Keep public pages aligned to mock-only, not_ready, and blocked states; continue local guard checks before any remote action.",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 82,
    label: "Supabase object reachability",
    nextAction:
      "Use the accepted readonly reachability evidence only for schema shape, freshness interpretation, and UI state wiring.",
    owner: "Engineering",
    state: "active"
  },
  {
    current: 42,
    label: "Row coverage readiness",
    nextAction:
      "Keep row coverage in local-ready, remote-paused state until a separately named bounded readonly attempt is approved.",
    owner: "Data",
    state: "readying"
  },
  {
    current: 34,
    label: "Public claim boundary",
    nextAction:
      "Public pages may disclose mock-only and blocked boundaries, but must not imply official data, advice, or production readiness.",
    owner: "PM",
    state: "blocked"
  },
  {
    current: 16,
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
