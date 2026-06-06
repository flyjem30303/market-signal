import { getPostReadonlyNextGateQueue, type PostReadonlyNextGateItem } from "@/lib/post-readonly-next-gate-queue";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimePromotionReadinessStep = {
  blockedPromotion: string;
  id: PostReadonlyNextGateItem["id"];
  label: string;
  nextAction: string;
  owner: PostReadonlyNextGateItem["owner"];
  priority: PostReadonlyNextGateItem["priority"];
  status: "ready_for_local_use" | "blocked_by_evidence" | "needs_review";
};

export type RuntimePromotionReadinessSummary = {
  blockedReason: "aggregate_count_incomplete";
  currentRoute: "keep_mock_runtime_and_prepare_coverage_route";
  headline: string;
  mockBoundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  mode: "runtime_promotion_readiness_summary";
  nextCeoDecision: string;
  noGoActions: string[];
  overallStatus: "not_ready_for_real_data_promotion";
  readinessCounts: {
    blocked: number;
    needsReview: number;
    ready: number;
    total: number;
  };
  rowCoverage: {
    expectedRows: 360;
    missingRows: 355;
    observedRows: 5;
  };
  steps: RuntimePromotionReadinessStep[];
  stopLine: string;
};

const labels: Record<PostReadonlyNextGateItem["id"], string> = {
  data_quality: "Data quality",
  freshness: "Freshness",
  row_coverage: "Row coverage",
  schema_shape: "Schema shape",
  source_depth: "Source depth"
};

export function getRuntimePromotionReadinessSummary(): RuntimePromotionReadinessSummary {
  const runtime = getPostReadonlyRuntimeState();
  const nextGateQueue = getPostReadonlyNextGateQueue();
  const steps = nextGateQueue.items.map((item): RuntimePromotionReadinessStep => {
    const status =
      item.status === "local_ready"
        ? "ready_for_local_use"
        : item.status === "blocked_waiting_evidence"
          ? "blocked_by_evidence"
          : "needs_review";

    return {
      blockedPromotion: item.blockedPromotion,
      id: item.id,
      label: labels[item.id],
      nextAction:
        item.id === "row_coverage"
          ? "Define source rights, target tables, dry-run output, rollback, retention, and no-write preflight before any ingestion."
          : item.nextAction,
      owner: item.owner,
      priority: item.priority,
      status
    };
  });

  return {
    blockedReason: "aggregate_count_incomplete",
    currentRoute: "keep_mock_runtime_and_prepare_coverage_route",
    headline: "Promotion readiness is visible, but real-data promotion is still blocked",
    mockBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision:
      "Keep the public runtime mock-only while A1/Data prepares the coverage route and PM keeps runtime disclosure aligned.",
    noGoActions: [
      "SQL execution",
      "Supabase writes",
      "market-data ingestion",
      "daily_prices modification",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    overallStatus: "not_ready_for_real_data_promotion",
    readinessCounts: {
      blocked: steps.filter((step) => step.status === "blocked_by_evidence").length,
      needsReview: steps.filter((step) => step.status === "needs_review").length,
      ready: steps.filter((step) => step.status === "ready_for_local_use").length,
      total: steps.length
    },
    rowCoverage: {
      expectedRows: runtime.rowCoverage.expectedRows,
      missingRows: runtime.rowCoverage.missingRows,
      observedRows: runtime.rowCoverage.observedRows
    },
    steps,
    stopLine:
      "This summary does not run SQL, connect to Supabase, write Supabase, fetch market data, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real."
  };
}
