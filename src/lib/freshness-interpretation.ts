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
      "資料更新線索可以說明資料是否可讀，但在資料品質、來源權利與模型證據被接受前，公開分數仍維持 mock。",
    nextGate: "先確認資料結構與更新線索的解讀方式，再決定是否納入公開頁讀取流程。",
    scoreSource: "mock",
    stopLine:
      "不得把新鮮度 metadata、data_freshness 可讀性或 schema shape 視為資料品質或正式分數核准。"
  };
}
