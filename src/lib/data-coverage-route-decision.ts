import { getBackfillIngestionDesignGate, type BackfillIngestionDesignGate } from "@/lib/backfill-ingestion-design-gate";
import { getDataCoverageBackfillPlan, type DataCoverageBackfillPlan } from "@/lib/data-coverage-backfill-plan";
import { getDataSourceReadinessPacket, type DataSourceReadinessPacket } from "@/lib/data-source-readiness-packet";

export type DataCoverageRouteOption = {
  id: "twii-coverage-repair-gate" | "etf-source-rights-gate" | "mock-runtime-hardening";
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
  sourceReadinessPacket: DataSourceReadinessPacket;
  expectedRows: 360;
  observedRows: 182;
  missingRows: 178;
  options: DataCoverageRouteOption[];
  publicDataSource: "mock";
  recommendation: "prepare_twii_coverage_repair_gate";
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
    missingRows: 178,
    observedRows: 182,
    options: [
      {
        id: "twii-coverage-repair-gate",
        label: "Prepare TWII coverage repair gate",
        nextAction:
          "Prepare a local-only packet for TWII, daily_prices, and 60 missing rows before any source fetch, SQL, Supabase write, or promotion.",
        owner: "Data",
        priority: "primary",
        rationale:
          "The bounded readonly attempt proved the remote aggregate path. TWII is the smallest meaningful incomplete lane at 0/60 and has more local readiness scaffolding than the ETF lane."
      },
      {
        id: "etf-source-rights-gate",
        label: "Prepare ETF source-rights gate",
        nextAction:
          "Keep 0050 and 006208 on a parallel source-rights, field-contract, and candidate-shape path before any ETF candidate or write gate.",
        owner: "Data",
        priority: "secondary",
        rationale:
          "The ETF lane can close 118 missing rows, but it remains blocked by source-rights and redistribution evidence."
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
    recommendation: "prepare_twii_coverage_repair_gate",
    scoreSource: "mock",
    sourceReadinessPacket: getDataSourceReadinessPacket(),
    status: "coverage_route_decision_required",
    stopLine:
      "Do not run SQL, write Supabase, ingest market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real from this route decision."
  };
}
