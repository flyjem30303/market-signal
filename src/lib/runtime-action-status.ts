import { getRuntimeExecutionReadinessSummary } from "@/lib/runtime-execution-readiness-summary";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";

export type RuntimeActionStatusId = "mock_only" | "readying" | "blocked" | "oral_decision_ready";

export type RuntimeActionStatusItem = {
  detail: string;
  id: RuntimeActionStatusId;
  label: string;
  tone: "active" | "blocked" | "readying";
};

export type RuntimeActionStatusSummary = {
  headline: string;
  mode: "runtime_action_status_normalization";
  nextAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  statuses: RuntimeActionStatusItem[];
  stopLine: string;
};

export function getRuntimeActionStatusSummary(): RuntimeActionStatusSummary {
  const readiness = getRuntimeReadinessSummary();
  const executionReadiness = getRuntimeExecutionReadinessSummary();

  return {
    headline: "Runtime action states are normalized across public and internal surfaces.",
    mode: "runtime_action_status_normalization",
    nextAction:
      "Use these four labels when wiring Home, Stock, Briefing, readonly attempt gates, and post-run review states.",
    publicDataSource: executionReadiness.publicDataSource,
    scoreSource: executionReadiness.scoreSource,
    statuses: [
      {
        detail: "Public pages may show mock signals, product flow, risk direction, and disclosure state.",
        id: "mock_only",
        label: "Mock-only runtime",
        tone: "active"
      },
      {
        detail: `${readiness.score}% runtime readiness; schema, freshness, and row coverage interpretation are still being prepared.`,
        id: "readying",
        label: "Preparing runtime evidence",
        tone: "readying"
      },
      {
        detail: "Supabase writes, SQL, market-data ingestion, publicDataSource=supabase, scoreSource=real, and investment-grade claims remain blocked.",
        id: "blocked",
        label: "External-data promotion blocked",
        tone: "blocked"
      },
      {
        detail:
          "Exactly one bounded readonly attempt may be discussed only after CEO oral naming and immediate prechecks.",
        id: "oral_decision_ready",
        label: "CEO oral decision ready",
        tone: "readying"
      }
    ],
    stopLine:
      "Status normalization does not execute Supabase, run SQL, write data, fetch market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
