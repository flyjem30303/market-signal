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

export type DataQualityEvidenceMissingCode =
  | "claim_approved"
  | "data_quality_score_at_least_80"
  | "disclosure_approved"
  | "freshness_state_complete"
  | "model_approved"
  | "qa_approved"
  | "source_depth_approved"
  | "source_rights_approved";

export type DataQualityEvidenceAction = {
  code: DataQualityEvidenceMissingCode;
  gate: string;
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM";
};

export type DataQualityEvidenceGate = {
  canSetScoreSourceReal: false;
  missingActions: DataQualityEvidenceAction[];
  missingEvidence: string[];
  mode: "data_quality_evidence_gate";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: DataQualityEvidenceStatus;
  stopLine: string;
};

const minimumQualityScore = 80;
const evidenceActions: Record<DataQualityEvidenceMissingCode, Omit<DataQualityEvidenceAction, "code">> = {
  claim_approved: {
    gate: "public-claim",
    nextAction: "Define which public claims can be made after data, model, legal, and disclosure gates pass.",
    owner: "PM"
  },
  data_quality_score_at_least_80: {
    gate: "qa",
    nextAction: "Prove row coverage, field validity, freshness, and downgrade rules produce quality score at least 80.",
    owner: "Data"
  },
  disclosure_approved: {
    gate: "disclosure",
    nextAction: "Approve user-facing wording that separates metadata reachability from real-score readiness.",
    owner: "Legal"
  },
  freshness_state_complete: {
    gate: "runtime",
    nextAction: "Confirm runtime freshness metadata is complete without promoting market-data quality.",
    owner: "Engineering"
  },
  model_approved: {
    gate: "model",
    nextAction: "Review model behavior, backtest limits, and interpretation rules before any real-score candidate.",
    owner: "Investment"
  },
  qa_approved: {
    gate: "qa",
    nextAction: "Run local validation and review edge cases before production score candidacy.",
    owner: "Engineering"
  },
  source_depth_approved: {
    gate: "source-depth",
    nextAction: "Complete source-depth evidence for fields, date handling, missing rows, and market calendar alignment.",
    owner: "Data"
  },
  source_rights_approved: {
    gate: "legal-rights",
    nextAction: "Confirm source rights, attribution, redistribution limits, and allowed public usage.",
    owner: "Legal"
  }
};

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
  ].filter((item): item is DataQualityEvidenceMissingCode => Boolean(item));
  const missingActions = missingEvidence.map((code) => ({
    code,
    ...evidenceActions[code]
  }));

  return {
    canSetScoreSourceReal: false,
    missingActions,
    missingEvidence,
    mode: "data_quality_evidence_gate",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: missingEvidence.length === 0 ? "candidate" : "blocked",
    stopLine:
      "Data-quality evidence may identify a real-score candidate only; scoreSource=real, public data source changes, SQL, writes, and ingestion remain separate approvals."
  };
}
