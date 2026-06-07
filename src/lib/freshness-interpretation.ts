export type FreshnessInterpretationSummary = {
  baselineObject: "data_runs";
  currentPublicSource: "mock";
  dataFreshnessObjectRole: "remote_only_candidate";
  dataQualityApproval: "not_approved";
  interpretation: string;
  nextGate: string;
  scoreSource: "mock";
  stopLine: string;
};

export function getFreshnessInterpretationSummary(): FreshnessInterpretationSummary {
  return {
    baselineObject: "data_runs",
    currentPublicSource: "mock",
    dataFreshnessObjectRole: "remote_only_candidate",
    dataQualityApproval: "not_approved",
    interpretation:
      "Freshness metadata can describe data availability, but the public score remains mock until data quality, source rights, and model evidence are approved.",
    nextGate: "Map schema shape and freshness interpretation from data_runs before any runtime dependency on data_freshness.",
    scoreSource: "mock",
    stopLine:
      "不得把新鮮度 metadata、data_freshness 可讀性或 schema shape 視為資料品質或正式分數核准。"
  };
}
