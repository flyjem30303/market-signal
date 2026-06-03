import { buildDataQualityScoreContract } from "@/lib/data-quality-score-contract";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getSchemaShapeAcceptanceContract } from "@/lib/schema-shape-acceptance-contract";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type DataFoundationGateItem = {
  blocker: string;
  evidence: string;
  id:
    | "object-reachability"
    | "schema-shape-baseline"
    | "freshness-metadata"
    | "row-coverage"
    | "data-quality-threshold"
    | "source-depth";
  label: string;
  nextAction: string;
  owner: "Data" | "Engineering" | "Investment" | "Legal" | "QA";
  state: "accepted" | "blocked" | "readying";
};

export type DataFoundationGate = {
  acceptedCount: number;
  foundationPercent: number;
  headline: string;
  mode: "local_data_foundation_gate";
  nextGate: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "foundation_partially_accepted_remote_paused";
  stopLine: string;
  totalCount: 6;
  items: DataFoundationGateItem[];
};

export function getDataFoundationGate(): DataFoundationGate {
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();
  const schema = getSchemaShapeAcceptanceContract();
  const freshness = getFreshnessReadonlyLatestEvidenceSummary();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const quality = buildDataQualityScoreContract();
  const dailyPricesShape = schema.objects.find((object) => object.name === "daily_prices");

  const items: DataFoundationGateItem[] = [
    {
      blocker: "data completeness, source rights, and real-score promotion remain separate",
      evidence: `${readonlyEvidence.objects.length} Supabase objects reachable; accepted scope is object reachability only.`,
      id: "object-reachability",
      label: "Object reachability accepted",
      nextAction: readonlyEvidence.nextRuntimeGate,
      owner: "Engineering",
      state: "accepted"
    },
    {
      blocker: dailyPricesShape?.blockedPromotion ?? "row coverage points",
      evidence: dailyPricesShape
        ? `${dailyPricesShape.name} shape accepted for ${dailyPricesShape.acceptedFields.length} fields.`
        : "daily_prices shape evidence not loaded.",
      id: "schema-shape-baseline",
      label: "Runtime schema baseline accepted",
      nextAction: schema.nextDefaultAction,
      owner: "Engineering",
      state: dailyPricesShape?.status === "accepted_for_runtime_shape" ? "accepted" : "readying"
    },
    {
      blocker: "market-data quality, public freshness claim, and scoreSource=real",
      evidence: `${freshness.market} freshness metadata accepted as of ${freshness.asOfDate}; source ${freshness.sourceName}.`,
      id: "freshness-metadata",
      label: "Freshness metadata accepted",
      nextAction: freshness.nextRuntimeGate,
      owner: "QA",
      state: "accepted"
    },
    {
      blocker: "row coverage points, publicDataSource=supabase, and scoreSource=real",
      evidence: `${rowCoverage.latestAttempt.observedTotalRows}/${rowCoverage.latestAttempt.expectedTotalRows} rows observed; ${rowCoverage.latestAttempt.missingRows} missing.`,
      id: "row-coverage",
      label: "Row coverage still blocked",
      nextAction: rowCoverage.nextDecision,
      owner: "Data",
      state: "blocked"
    },
    {
      blocker: "data quality pass and real-score evidence threshold",
      evidence: `${quality.score}/${quality.passThreshold} local quality score; quality cannot count as real-score evidence.`,
      id: "data-quality-threshold",
      label: "Data quality threshold still blocked",
      nextAction: quality.nextLift,
      owner: "Data",
      state: "blocked"
    },
    {
      blocker: "source-rights approval, model credibility, and public claim approval",
      evidence: "Source-depth evidence remains blocked until Legal, Investment, QA, and PM gates accept the source and interpretation.",
      id: "source-depth",
      label: "Source depth still blocked",
      nextAction:
        "Close source rights, model credibility, downgrade rules, and public disclosure before any real-score candidacy.",
      owner: "Investment",
      state: "blocked"
    }
  ];
  const acceptedCount = items.filter((item) => item.state === "accepted").length;

  return {
    acceptedCount,
    foundationPercent: Math.round((acceptedCount / items.length) * 100),
    headline: "Data foundation gate accepts schema and freshness evidence while keeping runtime promotion blocked.",
    items,
    mode: "local_data_foundation_gate",
    nextGate:
      "Use the accepted foundation to prepare row coverage and data-quality review; remote reads still require a separately named bounded attempt.",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "foundation_partially_accepted_remote_paused",
    stopLine:
      "Data foundation gate does not run SQL, write Supabase, fetch or ingest market data, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real.",
    totalCount: 6
  };
}
