import { getBackfillIngestionDesignGate, type BackfillIngestionDesignGate } from "@/lib/backfill-ingestion-design-gate";
import { getDataCoverageBackfillPlan, type DataCoverageBackfillPlan } from "@/lib/data-coverage-backfill-plan";

export type DataCoverageRouteOption = {
  id: "backfill-ingestion-design-gate" | "mock-runtime-hardening";
  label: string;
  owner: "Data" | "Engineering" | "PM";
  priority: "primary" | "secondary";
  rationale: string;
  nextAction: string;
};

export type DataCoverageRouteDecision = {
  blockedReason: "aggregate_count_incomplete";
  backfillPlan: DataCoverageBackfillPlan;
  designGate: BackfillIngestionDesignGate;
  expectedRows: 360;
  observedRows: 5;
  missingRows: 355;
  options: DataCoverageRouteOption[];
  publicDataSource: "mock";
  recommendation: "prepare_backfill_ingestion_design_gate";
  scoreSource: "mock";
  status: "coverage_route_decision_required";
  stopLine: string;
};

export function getDataCoverageRouteDecision(): DataCoverageRouteDecision {
  return {
    blockedReason: "aggregate_count_incomplete",
    backfillPlan: getDataCoverageBackfillPlan(),
    designGate: getBackfillIngestionDesignGate(),
    expectedRows: 360,
    missingRows: 355,
    observedRows: 5,
    options: [
      {
        id: "backfill-ingestion-design-gate",
        label: "Prepare backfill / ingestion design gate",
        nextAction:
          "Define source rights, target tables, dry-run output, rollback, retention, and no-write preflight before any ingestion.",
        owner: "Data",
        priority: "primary",
        rationale:
          "The bounded readonly attempt proved the remote aggregate path, but row coverage is blocked by missing daily_prices rows."
      },
      {
        id: "mock-runtime-hardening",
        label: "Continue mock runtime hardening",
        nextAction:
          "Keep improving UI truthfulness, diagnostics, and public boundary copy while data coverage remains incomplete.",
        owner: "PM",
        priority: "secondary",
        rationale:
          "This keeps product progress moving without weakening data provenance or real-score boundaries."
      }
    ],
    publicDataSource: "mock",
    recommendation: "prepare_backfill_ingestion_design_gate",
    scoreSource: "mock",
    status: "coverage_route_decision_required",
    stopLine:
      "Do not run SQL, write Supabase, ingest market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real from this route decision."
  };
}
