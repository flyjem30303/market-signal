import fs from "node:fs";

const sourceGatePath = "data/source-gates/etf-source-gate.json";
const requiredFields = [
  "fund_category",
  "tracking_index",
  "issuer",
  "expense_ratio",
  "aum",
  "nav",
  "premium_discount",
  "tracking_difference",
  "distribution_frequency",
  "constituent_count",
  "top_holdings"
];

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

const gate = readJson(sourceGatePath);
const configuredMissingFields = requiredFields.filter((field) => !gate.minimum_required_fields?.includes(field));
const candidateScores = (gate.candidate_sources ?? []).map(scoreCandidate).sort((a, b) => b.readiness_score - a.readiness_score);
const coveredByCandidates = [
  ...new Set((gate.candidate_sources ?? []).flatMap((source) => source.field_coverage ?? []).filter(Boolean))
].sort();
const candidateCoverageGaps = requiredFields.filter((field) => !coveredByCandidates.includes(field));
const hasApprovedSource = Boolean(gate.approved_source);
const hasCandidateSources = Array.isArray(gate.candidate_sources) && gate.candidate_sources.length > 0;
const status =
  configuredMissingFields.length === 0 &&
  candidateCoverageGaps.length === 0 &&
  hasCandidateSources &&
  hasApprovedSource
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      approved_source: gate.approved_source,
      blockers: gate.blockers ?? [],
      candidate_sources: gate.candidate_sources ?? [],
      candidate_scores: candidateScores,
      candidate_coverage_gaps: candidateCoverageGaps,
      covered_by_candidates: coveredByCandidates,
      decision: gate.decision,
      has_candidate_sources: hasCandidateSources,
      missing_fields: configuredMissingFields,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}

function scoreCandidate(source) {
  const fieldCoverage = requiredFields.filter((field) => source.field_coverage?.includes(field));
  const fieldScore = Math.round((fieldCoverage.length / requiredFields.length) * 55);
  const trustScore = source.source_type === "official" ? 15 : source.source_type === "vendor" ? 10 : 8;
  const evidenceScore = Math.min(10, (source.evidence_urls?.length ?? 0) * 3);
  const automationScore = source.automation_status === "confirmed" ? 10 : source.automation_status === "unknown" ? 2 : 0;
  const legalScore = source.license_status === "approved" ? 10 : source.license_status === "unknown" ? 0 : -10;
  const readinessScore = Math.max(0, Math.min(100, fieldScore + trustScore + evidenceScore + automationScore + legalScore));

  return {
    automation_status: source.automation_status ?? "unknown",
    coverage: source.coverage,
    covered_fields: fieldCoverage,
    field_coverage_ratio: `${fieldCoverage.length}/${requiredFields.length}`,
    gaps: source.gaps ?? [],
    license_status: source.license_status ?? "unknown",
    name: source.name,
    readiness_score: readinessScore,
    source_type: source.source_type ?? "unknown",
    status: source.status
  };
}
