import fs from "node:fs";

const sourceGatePath = "data/source-gates/etf-source-gate.json";
const dueDiligencePath = "data/source-gates/etf-source-due-diligence.json";
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

function scoreCandidate(source) {
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

function list(items) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${item}`).join("\n");
}

function table(rows) {
  const header = "| Candidate | Score | Coverage | Automation | License |";
  const separator = "|---|---:|---|---|---|";
  return [header, separator, ...rows.map((row) => `| ${row.name} | ${row.readiness_score} | ${row.field_coverage_ratio} | ${row.automation_status ?? "unknown"} | ${row.license_status ?? "unknown"} |`)].join("\n");
}

const sourceGate = readJson(sourceGatePath);
const dueDiligence = readJson(dueDiligencePath);
const candidateScores = (sourceGate.candidate_sources ?? []).map(scoreCandidate).sort((a, b) => b.readiness_score - a.readiness_score);
const coveredByCandidates = [
  ...new Set((sourceGate.candidate_sources ?? []).flatMap((source) => source.field_coverage ?? []).filter(Boolean))
].sort();
const candidateCoverageGaps = requiredFields.filter((field) => !coveredByCandidates.includes(field));
const checks = dueDiligence.checks ?? [];
const openChecks = checks.filter((check) => check.status !== "approved");
const ingestionBlockers = openChecks.filter((check) => check.required_for === "ingestion").map((check) => check.id);
const scoringBlockers = openChecks.filter((check) => check.required_for === "scoring").map((check) => check.id);
const publicReleaseBlockers = openChecks.filter((check) => check.required_for === "public-release").map((check) => check.id);
const generatedAt = new Intl.DateTimeFormat("sv-SE", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: "Asia/Taipei"
}).format(new Date());

const report = `# ETF Source Readiness Report

Generated at: ${generatedAt} Asia/Taipei

## CEO Status

\`\`\`text
${sourceGate.decision?.toUpperCase?.() ?? "BLOCKED"}
\`\`\`

No ETF source is approved. ETF ingestion, ETF scoring, and public ETF interpretation remain blocked.

## Candidate Scores

${table(candidateScores)}

## Candidate Coverage Gaps

${list(candidateCoverageGaps)}

## Priority Candidate

\`\`\`text
${dueDiligence.priority_candidate}
\`\`\`

## Ingestion Blockers

${list(ingestionBlockers)}

## Scoring Blockers

${list(scoringBlockers)}

## Public Release Blockers

${list(publicReleaseBlockers)}

## Next Allowed Work

- Confirm machine-readable TWSE / ETFortune endpoints.
- Review TWSE / ETFortune usage and redistribution terms.
- Map missing ETF fields to official, issuer, or vendor sources.
- Keep public release blocked until the CEO checkpoint changes.
`;

console.log(report);
