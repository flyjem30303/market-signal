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
const missingFields = requiredFields.filter((field) => !gate.minimum_required_fields?.includes(field));
const hasApprovedSource = Boolean(gate.approved_source);
const hasCandidateSources = Array.isArray(gate.candidate_sources) && gate.candidate_sources.length > 0;
const status = missingFields.length === 0 && hasCandidateSources && hasApprovedSource ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      approved_source: gate.approved_source,
      blockers: gate.blockers ?? [],
      candidate_sources: gate.candidate_sources ?? [],
      decision: gate.decision,
      has_candidate_sources: hasCandidateSources,
      missing_fields: missingFields,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
