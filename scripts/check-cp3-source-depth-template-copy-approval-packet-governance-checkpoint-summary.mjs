import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_GOVERNANCE_CHECKPOINT_SUMMARY_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth template-copy approval packet governance checkpoint summary recorded",
  "REVISE",
  "closes the local-only governance chain",
  "does not approve template copy",
  "does not create a real request packet",
  "does not create real evidence artifact files",
  "does not fill template values",
  "does not create the future evidence checker",
  "does not clear source-depth not_ready",
  "docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_DESIGN_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_DESIGN_ROLE_REVIEW_2026-05-29.md",
  "docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_BLANK_TEMPLATE_DESIGN_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_BLANK_TEMPLATE_DESIGN_ROLE_REVIEW_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_BLANK_TEMPLATE_CREATION_APPROVAL_GATE_2026-05-29.md",
  "docs/templates/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_TEMPLATE.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_TEMPLATE_ROLE_REVIEW_2026-05-29.md",
  "docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_ROLE_REVIEW_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_ROLE_REVIEW_GATE_CHECKER_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_ROLE_REVIEW_GATE_CHECKER_ROLE_REVIEW_2026-05-29.md",
  "template-copy workflow design is documented",
  "blank template file exists",
  "usage runbook is documented",
  "role-review gate checker exists",
  "review gates include the governance chain checks",
  "template copy is not approved",
  "real request packet is not created",
  "real evidence artifact files are not created",
  "template values are not filled",
  "future evidence checker is not created",
  "market data is not fetched",
  "market rows are not parsed",
  "Supabase is not connected",
  "SQL is not run",
  "Supabase is not written",
  "staging rows are not written",
  "daily_prices is not written",
  "seed SQL is not created",
  "scoreSource=real is not set",
  "source-depth not_ready is not cleared",
  "public claims are not made",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready",
  "local-only governance chain",
  "not a data ingestion workflow",
  "no user-facing claim",
  "no market rows",
  "no rights approval",
  "internal governance handoff",
  "no public UI wiring",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary.mjs passes",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-role-review-gate-checker-role-review.mjs passes",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-role-review-gate-checker.mjs passes",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "complete as local-only decision-quality work",
  "ready for handoff review",
  "not ready for template-copy approval",
  "not ready for evidence artifact creation",
  "not ready for real data collection",
  "not ready for Supabase validation",
  "not ready for source-depth production approval",
  "not ready for scoreSource=real",
  "not ready for public claims",
  "checkpoint summary only",
  "do not approve template copy",
  "do not create a real request packet",
  "do not create real evidence artifact files",
  "do not fill template values",
  "do not create future evidence checker",
  "do not add example market data",
  "do not add sample rows",
  "do not add sample JSON",
  "do not add sample CSV",
  "do not add Supabase output",
  "do not add SQL output",
  "do not fetch market data",
  "do not parse market rows",
  "do not run source-depth validator against Supabase",
  "do not connect to Supabase",
  "do not run SQL",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not commit CSV / JSON market data files",
  "do not set scoreSource=real",
  "do not make public backtest claims",
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "record CP3 source-depth template-copy approval packet governance checkpoint summary role review"
];

const forbiddenPhrases = [
  "Status: approved",
  "CEO Decision: APPROVE",
  "Approval Status: approved",
  "template copy approved",
  "source_depth_state is reviewable",
  "scoreSource=real approved",
  "source-rights are approved",
  "public claims are approved",
  "Supabase read output:",
  "SQL execution output:",
  "raw OHLCV",
  "daily_prices sample"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: reportPath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
