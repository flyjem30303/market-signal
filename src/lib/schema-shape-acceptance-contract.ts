export type SchemaShapeObjectStatus =
  | "accepted_for_runtime_shape"
  | "needs_reconciliation"
  | "remote_only_pending_contract";

export type SchemaShapeRuntimeObject = {
  acceptedFields: string[];
  blockedPromotion: string;
  evidenceSource: "schema_shape_sanitized_run_2026_05_31";
  gap: string;
  name: "daily_prices" | "twse_stock_day_staging" | "market_assets" | "model_runs" | "data_freshness";
  nextAction: string;
  owner: "Data" | "Engineering" | "PM" | "QA";
  status: SchemaShapeObjectStatus;
};

export type SchemaShapeAcceptanceContract = {
  acceptedCount: number;
  blockedActions: string[];
  mode: "schema_shape_acceptance_contract";
  nextDefaultAction: string;
  objects: SchemaShapeRuntimeObject[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getSchemaShapeAcceptanceContract(): SchemaShapeAcceptanceContract {
  const objects: SchemaShapeRuntimeObject[] = [
    {
      acceptedFields: ["stock_id", "trade_date", "open", "high", "low", "close", "volume", "turnover"],
      blockedPromotion: "row coverage points",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      gap: "Shape is accepted, but row completeness, freshness, source rights, and data quality remain unproven.",
      name: "daily_prices",
      nextAction:
        "Use daily_prices as the local runtime shape baseline while keeping public source and scoring mock-only.",
      owner: "Engineering",
      status: "accepted_for_runtime_shape"
    },
    {
      acceptedFields: [],
      blockedPromotion: "staging-to-production mapping",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      gap:
        "Remote object is reachable, but local baseline uses staging_twse_stock_day_runs and staging_twse_stock_day_prices.",
      name: "twse_stock_day_staging",
      nextAction:
        "Create a reconciliation action map before any migration, staging write, or daily_prices write is considered.",
      owner: "Data",
      status: "needs_reconciliation"
    },
    {
      acceptedFields: ["asset identity category", "market category", "display category", "activation category"],
      blockedPromotion: "global asset runtime dependency",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      gap: "Fields are sanitized categories only; local migration, generated types, and owner review are not accepted.",
      name: "market_assets",
      nextAction:
        "Keep market_assets remote-only until global asset identity semantics are locally contracted.",
      owner: "PM",
      status: "remote_only_pending_contract"
    },
    {
      acceptedFields: ["model version category", "run status category", "review status category", "source mode category"],
      blockedPromotion: "score provenance claim",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      gap: "Shape categories do not prove model credibility, backtest validity, or scoreSource=real readiness.",
      name: "model_runs",
      nextAction:
        "Keep model_runs as score provenance candidate only until Investment and QA gates accept semantics.",
      owner: "QA",
      status: "remote_only_pending_contract"
    },
    {
      acceptedFields: ["freshness status category", "latest data date category", "target table category", "run status category"],
      blockedPromotion: "freshness-based public claim",
      evidenceSource: "schema_shape_sanitized_run_2026_05_31",
      gap: "data_freshness is not mapped to data_runs and cannot replace the current freshness repository boundary.",
      name: "data_freshness",
      nextAction:
        "Map data_freshness to data_runs before any runtime repository dependency or public freshness claim.",
      owner: "Engineering",
      status: "remote_only_pending_contract"
    }
  ];

  return {
    acceptedCount: objects.filter((object) => object.status === "accepted_for_runtime_shape").length,
    blockedActions: [
      "SQL execution",
      "Supabase writes",
      "staging row writes",
      "daily_prices writes",
      "market-data fetch or ingestion",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    mode: "schema_shape_acceptance_contract",
    nextDefaultAction:
      "Reconcile twse_stock_day_staging naming and contract status before freshness, row coverage, data quality, or source-depth promotion work.",
    objects,
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "Schema shape acceptance does not approve row completeness, data freshness, data quality, source-depth, public claims, SQL, writes, ingestion, or scoreSource=real."
  };
}
