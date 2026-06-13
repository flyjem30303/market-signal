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
    acceptedScope: "僅接受後端物件可讀性；不代表資料完整性、資料品質、來源深度或正式分數核准。",
    evidenceStatus: "object_reachability_accepted",
    nextRuntimeGate: "下一步仍需確認資料覆蓋、品質、來源條件與公開說明，才能評估正式資料啟用。",
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
    stopLine: "後端可讀性不能直接轉成正式資料、正式分數或公開投資訊號。"
  };
}
