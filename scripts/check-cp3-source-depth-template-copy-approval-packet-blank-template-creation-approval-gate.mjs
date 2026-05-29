import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_BLANK_TEMPLATE_CREATION_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth template-copy approval packet blank template creation approval gate recorded",
  "PROCEED",
  "approves creating the actual blank packet template file in a later slice",
  "only as a local-only blank template",
  "does not approve template copy",
  "does not create a real request packet",
  "does not approve creating real evidence artifact files, filling template values, creating the future evidence checker",
  "source-depth approval, or public claims",
  "docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_BLANK_TEMPLATE_DESIGN_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_BLANK_TEMPLATE_DESIGN_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-source-depth-template-copy-approval-packet-blank-template-design-role-review.mjs",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "docs/templates/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_TEMPLATE.md",
  "Packet ID: TODO",
  "Request Date: TODO",
  "Requested Gate Outcome: APPROVE_TEMPLATE_COPY_ONLY",
  "Requested Evidence Category: TODO",
  "SAFE_CATEGORY File Token: TODO",
  "Proposed Artifact Path: TODO",
  "Source-Rights Posture: pending Legal review",
  "Public-Claim Boundary: no public claims approved",
  "Display-State Boundary: non-runtime state labels only",
  "CEO Decision Slot: pending",
  "blank template file only",
  "no real request packet",
  "no evidence artifact",
  "no filled template values",
  "no future evidence checker",
  "no market data values",
  "no field coverage counts",
  "no date range counts",
  "no sample rows",
  "no sample JSON",
  "no sample CSV",
  "no Supabase output",
  "no SQL output",
  "no source-rights approval",
  "no public claim approval",
  "no scoreSource=real approval",
  "template path exists",
  "required blank fields exist",
  "TODO placeholders exist",
  "pending states exist",
  "not_ready boundary exists",
  "no approved state labels exist",
  "no sample market data exists",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "approves only the next local-only creation of the blank packet template file",
  "does not create evidence",
  "does not fill template values",
  "does not create the future evidence checker",
  "does not make source_depth_state reviewable",
  "creating the blank packet template file and its checker",
  "creation approval gate only",
  "do not approve template copy",
  "do not create a real request packet",
  "do not create real evidence artifact files",
  "do not fill template values",
  "do not create future evidence checker beyond blank-template static checker",
  "do not create JSON sample artifacts",
  "do not create JSON market data",
  "do not create CSV market data",
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
  "create CP3 source-depth template-copy approval packet blank template file",
  "add blank-template static checker"
];

const forbiddenPhrases = [
  "template copy approved",
  "real request packet approved",
  "evidence approved",
  "source_depth_state is reviewable",
  "scoreSource=real approved",
  "source-rights are approved",
  "public claims are approved"
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
