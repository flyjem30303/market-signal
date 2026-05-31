export type SupabaseReadonlyEvidenceObject = {
  countStatus: "ok";
  name: "daily_prices" | "twse_stock_day_staging" | "market_assets" | "model_runs" | "data_freshness";
  reachable: "ok";
};

export type SupabaseReadonlyEvidenceSummary = {
  acceptedScope: string;
  evidenceStatus: "object_reachability_accepted";
  nextRuntimeGate: string;
  objects: SupabaseReadonlyEvidenceObject[];
  safety: {
    filesWritten: false;
    mutations: false;
    publicClaimsChanged: false;
    rowPayloadsPrinted: false;
    scoreSourceRealChanged: false;
    secretsPrinted: false;
    sqlExecuted: false;
  };
  stopLine: string;
};

export function getSupabaseReadonlyEvidenceSummary(): SupabaseReadonlyEvidenceSummary {
  return {
    acceptedScope: "Supabase object reachability only; not data completeness, data quality, source-depth, or real-score approval.",
    evidenceStatus: "object_reachability_accepted",
    nextRuntimeGate: "schema shape, freshness interpretation, and UI state wiring without writes or scoreSource=real",
    objects: [
      { countStatus: "ok", name: "daily_prices", reachable: "ok" },
      { countStatus: "ok", name: "twse_stock_day_staging", reachable: "ok" },
      { countStatus: "ok", name: "market_assets", reachable: "ok" },
      { countStatus: "ok", name: "model_runs", reachable: "ok" },
      { countStatus: "ok", name: "data_freshness", reachable: "ok" }
    ],
    safety: {
      filesWritten: false,
      mutations: false,
      publicClaimsChanged: false,
      rowPayloadsPrinted: false,
      scoreSourceRealChanged: false,
      secretsPrinted: false,
      sqlExecuted: false
    },
    stopLine: "Do not convert object reachability into SQL, writes, ingestion, public claims, or scoreSource=real."
  };
}
