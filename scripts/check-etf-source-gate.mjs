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
