export type EtfCandidateSource = {
  automation_status?: string;
  coverage: string;
  evidence_urls?: string[];
  field_coverage?: string[];
  gaps?: string[];
  license_status?: string;
  name: string;
  source_type?: string;
  status: string;
};

export type EtfSourceGate = {
  approved_source: string | null;
  blockers?: string[];
  candidate_sources?: EtfCandidateSource[];
  decision: string;
  minimum_required_fields: string[];
};

export type EtfDueDiligenceCheck = {
  id: string;
  owner_role: string;
  required_for: "ingestion" | "public-release" | "scoring";
  status: string;
};

export type EtfDueDiligence = {
  checks?: EtfDueDiligenceCheck[];
  decision: string;
  priority_candidate: string;
};

export type EtfCandidateScore = EtfCandidateSource & {
  covered_fields: string[];
  field_coverage_ratio: string;
  readiness_score: number;
};

export type EtfSourceReadinessSummary = {
  candidateCoverageGaps: string[];
  candidateScores: EtfCandidateScore[];
  coveredByCandidates: string[];
  ingestionBlockers: string[];
  publicReleaseBlockers: string[];
  scoringBlockers: string[];
  status: "blocked" | "ok";
};

export function buildEtfSourceReadinessSummary({
  dueDiligence,
  sourceGate
}: {
  dueDiligence: EtfDueDiligence;
  sourceGate: EtfSourceGate;
}): EtfSourceReadinessSummary {
  const requiredFields = sourceGate.minimum_required_fields;
  const candidateScores = (sourceGate.candidate_sources ?? [])
    .map((source) => scoreCandidate(source, requiredFields))
    .sort((a, b) => b.readiness_score - a.readiness_score);
  const coveredByCandidates = [
    ...new Set((sourceGate.candidate_sources ?? []).flatMap((source) => source.field_coverage ?? []).filter(Boolean))
  ].sort();
  const candidateCoverageGaps = requiredFields.filter((field) => !coveredByCandidates.includes(field));
  const openChecks = (dueDiligence.checks ?? []).filter((check) => check.status !== "approved");
  const ingestionBlockers = openChecks.filter((check) => check.required_for === "ingestion").map((check) => check.id);
  const scoringBlockers = openChecks.filter((check) => check.required_for === "scoring").map((check) => check.id);
  const publicReleaseBlockers = openChecks.filter((check) => check.required_for === "public-release").map((check) => check.id);
  const status =
    Boolean(sourceGate.approved_source) &&
    candidateCoverageGaps.length === 0 &&
    ingestionBlockers.length === 0 &&
    scoringBlockers.length === 0 &&
    publicReleaseBlockers.length === 0
      ? "ok"
      : "blocked";

  return {
    candidateCoverageGaps,
    candidateScores,
    coveredByCandidates,
    ingestionBlockers,
    publicReleaseBlockers,
    scoringBlockers,
    status
  };
}

function scoreCandidate(source: EtfCandidateSource, requiredFields: string[]): EtfCandidateScore {
  const fieldCoverage = requiredFields.filter((field) => source.field_coverage?.includes(field));
  const fieldScore = Math.round((fieldCoverage.length / requiredFields.length) * 55);
  const trustScore = source.source_type === "official" ? 15 : source.source_type === "vendor" ? 10 : 8;
  const evidenceScore = Math.min(10, (source.evidence_urls?.length ?? 0) * 3);
  const automationScore = source.automation_status === "confirmed" ? 10 : source.automation_status === "unknown" ? 2 : 0;
  const legalScore = source.license_status === "approved" ? 10 : source.license_status === "unknown" ? 0 : -10;
  const readinessScore = Math.max(0, Math.min(100, fieldScore + trustScore + evidenceScore + automationScore + legalScore));

  return {
    ...source,
    covered_fields: fieldCoverage,
    field_coverage_ratio: `${fieldCoverage.length}/${requiredFields.length}`,
    readiness_score: readinessScore
  };
}
