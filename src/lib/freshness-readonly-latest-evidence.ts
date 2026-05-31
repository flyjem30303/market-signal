export type FreshnessReadonlyLatestEvidenceSummary = {
  acceptedScope: string;
  asOfDate: "2026-05-27";
  evidenceStatus: "freshness_readonly_metadata_accepted";
  market: "TWSE";
  nextRuntimeGate: string;
  publicDataSource: "mock";
  safety: {
    ingestionStarted: false;
    publicClaimsChanged: false;
    rowPayloadsPrinted: false;
    scoreSourceRealChanged: false;
    secretsPrinted: false;
    sqlExecuted: false;
    writesEnabled: false;
  };
  scoreSource: "mock";
  sourceName: "TWSE OpenAPI";
  state: "complete";
  stopLine: string;
};

export function getFreshnessReadonlyLatestEvidenceSummary(): FreshnessReadonlyLatestEvidenceSummary {
  return {
    acceptedScope:
      "Latest bounded Supabase freshness metadata read succeeded; this is metadata reachability evidence only, not market-data quality or real-score approval.",
    asOfDate: "2026-05-27",
    evidenceStatus: "freshness_readonly_metadata_accepted",
    market: "TWSE",
    nextRuntimeGate:
      "Use this evidence for runtime status disclosure only; keep data_freshness remote-only until source depth, quality, ingestion, and public-claim gates pass.",
    publicDataSource: "mock",
    safety: {
      ingestionStarted: false,
      publicClaimsChanged: false,
      rowPayloadsPrinted: false,
      scoreSourceRealChanged: false,
      secretsPrinted: false,
      sqlExecuted: false,
      writesEnabled: false
    },
    scoreSource: "mock",
    sourceName: "TWSE OpenAPI",
    state: "complete",
    stopLine:
      "Do not convert this freshness evidence into SQL, writes, ingestion, public source promotion, or scoreSource=real."
  };
}
