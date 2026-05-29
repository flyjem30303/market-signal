import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_ROLE_REVIEW_GATE_CHECKER_2026-05-29.md";
const usageRunbookPath = "docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_2026-05-29.md";
const roleReviewPath = "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_ROLE_REVIEW_2026-05-29.md";

const requiredReportPhrases = [
  "Status: CP3 source-depth template-copy approval packet role-review gate checker recorded",
  "REVISE",
  "checker-backed role review",
  "does not approve template copy",
  "does not create a real request packet",
  "does not create real evidence artifact files",
  "does not fill template values",
  "does not create the future evidence checker",
  "does not clear source-depth not_ready",
  usageRunbookPath,
  roleReviewPath,
  "scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook-role-review.mjs",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "usage runbook status is local-only usage runbook recorded",
  "usage runbook role review status is recorded",
  "role review CEO Decision remains REVISE",
  "role review includes all six roles A B C D E F",
  "role review states public data source remains mock",
  "role review states CP3 source-depth production gate remains not_ready",
  "role review states not a template-copy approval",
  "role review states not a real request packet",
  "role review states not an evidence artifact",
  "role review states not a source-depth approval",
  "role review states not a production release approval",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs passes",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook-role-review.mjs passes",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-role-review-gate-checker.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "only verifies the local-only role review chain",
  "does not create evidence",
  "does not make source_depth_state reviewable",
  "role review for this gate checker",
  "gate checker only",
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
  "do not import copy tokens into public pages",
  "do not import copy tokens into public components",
  "do not import policy into public pages",
  "do not import policy into public components",
  "do not wire policy into data fetching",
  "do not implement runtime repository",
  "do not read remote data",
  "do not run validator",
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
  "record CP3 source-depth template-copy approval packet role-review gate checker role review"
];

const requiredUsageRunbookPhrases = [
  "Status: local-only usage runbook recorded",
  "This runbook is not a template-copy approval",
  "not a real request packet",
  "not an evidence artifact",
  "not a source-depth approval",
  "not a production release approval",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const requiredRoleReviewPhrases = [
  "Status: CP3 source-depth template-copy approval packet usage runbook role review recorded",
  "REVISE",
  "A / PM+Dev:",
  "B / Marketing:",
  "C / Investment:",
  "D / Legal:",
  "E / CEO:",
  "F / Design:",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready",
  "not a template-copy approval",
  "not a real request packet",
  "not an evidence artifact",
  "not a source-depth approval",
  "not a production release approval"
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

const read = (path) => (fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "");

const report = read(reportPath);
const usageRunbook = read(usageRunbookPath);
const roleReview = read(roleReviewPath);
const checkedArtifacts = `${usageRunbook}\n${roleReview}`;

const missing = [
  ...requiredReportPhrases
    .filter((phrase) => !report.includes(phrase))
    .map((phrase) => ({ file: reportPath, phrase })),
  ...requiredUsageRunbookPhrases
    .filter((phrase) => !usageRunbook.includes(phrase))
    .map((phrase) => ({ file: usageRunbookPath, phrase })),
  ...requiredRoleReviewPhrases
    .filter((phrase) => !roleReview.includes(phrase))
    .map((phrase) => ({ file: roleReviewPath, phrase }))
];
const forbidden = forbiddenPhrases.filter((phrase) => checkedArtifacts.includes(phrase));

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
