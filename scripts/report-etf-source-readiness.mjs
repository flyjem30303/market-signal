import fs from "node:fs";
import { buildEtfSourceReadinessSummary } from "../src/lib/etf-source-readiness.ts";

const sourceGatePath = "data/source-gates/etf-source-gate.json";
const dueDiligencePath = "data/source-gates/etf-source-due-diligence.json";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
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
const summary = buildEtfSourceReadinessSummary({ dueDiligence, sourceGate });
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

${table(summary.candidateScores)}

## Candidate Coverage Gaps

${list(summary.candidateCoverageGaps)}

## Priority Candidate

\`\`\`text
${dueDiligence.priority_candidate}
\`\`\`

## Ingestion Blockers

${list(summary.ingestionBlockers)}

## Scoring Blockers

${list(summary.scoringBlockers)}

## Public Release Blockers

${list(summary.publicReleaseBlockers)}

## Next Allowed Work

- Confirm machine-readable TWSE / ETFortune endpoints.
- Review TWSE / ETFortune usage and redistribution terms.
- Map missing ETF fields to official, issuer, or vendor sources.
- Keep public release blocked until the CEO checkpoint changes.
`;

console.log(report);
