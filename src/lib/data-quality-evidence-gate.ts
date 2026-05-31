export type DataQualityEvidenceStatus = "blocked" | "candidate";

export type DataQualityEvidenceInput = {
  claimApprovalState?: "approved" | "not_ready";
  dataQualityScore?: number;
  disclosureApprovalState?: "approved" | "not_ready";
  freshnessState?: "complete" | "mock" | "partial" | "stale" | "unavailable";
  modelApprovalState?: "approved" | "not_ready";
  qaApprovalState?: "approved" | "not_ready";
  sourceDepthState?: "approved" | "not_ready";
  sourceRightsState?: "approved" | "not_ready";
};

export type DataQualityEvidenceGate = {
  canSetScoreSourceReal: false;
  missingEvidence: string[];
  mode: "data_quality_evidence_gate";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: DataQualityEvidenceStatus;
  stopLine: string;
};

const minimumQualityScore = 80;

export function buildDataQualityEvidenceGate(input: DataQualityEvidenceInput = {}): DataQualityEvidenceGate {
  const missingEvidence = [
    input.freshnessState === "complete" ? null : "freshness_state_complete",
    Number.isFinite(input.dataQualityScore) && Number(input.dataQualityScore) >= minimumQualityScore
      ? null
      : "data_quality_score_at_least_80",
    input.sourceDepthState === "approved" ? null : "source_depth_approved",
    input.sourceRightsState === "approved" ? null : "source_rights_approved",
    input.qaApprovalState === "approved" ? null : "qa_approved",
    input.modelApprovalState === "approved" ? null : "model_approved",
    input.disclosureApprovalState === "approved" ? null : "disclosure_approved",
    input.claimApprovalState === "approved" ? null : "claim_approved"
  ].filter((item): item is string => Boolean(item));

  return {
    canSetScoreSourceReal: false,
    missingEvidence,
    mode: "data_quality_evidence_gate",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: missingEvidence.length === 0 ? "candidate" : "blocked",
    stopLine:
      "Data-quality evidence may identify a real-score candidate only; scoreSource=real, public data source changes, SQL, writes, and ingestion remain separate approvals."
  };
}
