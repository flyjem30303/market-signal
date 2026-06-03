import { getRuntimeExecutionReadinessSummary } from "@/lib/runtime-execution-readiness-summary";
import { getRuntimeReadinessSummary } from "@/lib/runtime-readiness-score";

export type RuntimeActionStatusId = "mock_only" | "readying" | "blocked" | "oral_decision_ready";

export type RuntimeActionStatusItem = {
  allowedAction: string;
  blockedAction: string;
  detail: string;
  id: RuntimeActionStatusId;
  label: string;
  nextGate: string;
  owner: "CEO" | "PM" | "Product" | "Data";
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
        allowedAction: "Keep public pages navigable, readable, and explicitly mock-only.",
        blockedAction: "Do not imply live data, real score, or investment-grade decision support.",
        detail: "Public pages may show mock signals, product flow, risk direction, and disclosure state.",
        id: "mock_only",
        label: "Mock-only runtime",
        nextGate: "Runtime UX hardening",
        owner: "Product",
        tone: "active"
      },
      {
        allowedAction: "Prepare local evidence, static gates, and readonly post-run interpretation rules.",
        blockedAction: "Do not award row coverage points or promote readiness from incomplete evidence.",
        detail: `${readiness.score}% runtime readiness; schema, freshness, and row coverage interpretation are still being prepared.`,
        id: "readying",
        label: "Preparing runtime evidence",
        nextGate: "Readonly evidence interpretation",
        owner: "PM",
        tone: "readying"
      },
      {
        allowedAction: "Show why external-data promotion is blocked and what evidence is missing.",
        blockedAction: "No SQL, Supabase writes, ingestion, real score, or public Supabase source promotion.",
        detail: "Supabase writes, SQL, market-data ingestion, publicDataSource=supabase, scoreSource=real, and investment-grade claims remain blocked.",
        id: "blocked",
        label: "External-data promotion blocked",
        nextGate: "Data quality acceptance",
        owner: "Data",
        tone: "blocked"
      },
      {
        allowedAction: "CEO may name one bounded readonly attempt after immediate local prechecks.",
        blockedAction: "No automatic remote run, no broad probe, no SQL, and no market-data ingestion.",
        detail:
          "Exactly one bounded readonly attempt may be discussed only after CEO oral naming and immediate prechecks.",
        id: "oral_decision_ready",
        label: "CEO oral decision ready",
        nextGate: "CEO named bounded readonly attempt",
        owner: "CEO",
        tone: "readying"
      }
    ],
    stopLine:
      "Status normalization does not execute Supabase, run SQL, write data, fetch market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
