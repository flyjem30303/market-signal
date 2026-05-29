import fs from "node:fs";

const templatePath = "docs/templates/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_TEMPLATE.md";

const requiredPhrases = [
  "# CP3 Source-Depth Template-Copy Approval Packet",
  "Status: not_ready",
  "Packet ID: TODO",
  "Request Date: TODO",
  "Requested Gate Outcome: APPROVE_TEMPLATE_COPY_ONLY",
  "Requested Evidence Category: TODO",
  "SAFE_CATEGORY File Token: TODO",
  "Proposed Artifact Path: TODO",
  "Market And Asset Scope: TODO",
  "Symbol Scope Policy: TODO",
  "Date Range Policy: TODO",
  "Field Availability Policy: TODO",
  "Missing-Date Policy: TODO",
  "Corporate-Action Policy: TODO",
  "Inactive And Delisted Symbol Policy: TODO",
  "Source-Rights Posture: pending Legal review",
  "Public-Claim Boundary: no public claims approved",
  "Display-State Boundary: non-runtime state labels only",
  "A / PM+Dev: TODO",
  "B / Marketing: TODO",
  "C / Investment: TODO",
  "D / Legal: TODO",
  "E / CEO: TODO",
  "F / Design: TODO",
  "ready_for_ceo_review",
  "revise_packet",
  "blocked",
  "no raw market rows included",
  "no CSV market data included",
  "no JSON market data included",
  "no Supabase read output included",
  "no SQL execution output included",
  "no scoreSource=real approval requested",
  "no public backtest claims requested",
  "no source-rights approval requested",
  "no public claim approval requested",
  "no runtime repository wiring requested",
  "no public UI wiring requested",
  "no source-depth not_ready clearing requested",
  "REVISE_PACKET",
  "CEO Decision Slot: pending",
  "Approval Status: not_ready",
  "blank template only",
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
  "Keep public data source mock"
];

const forbiddenPhrases = [
  "Status: approved",
  "CEO Decision Slot: approved",
  "Approval Status: approved",
  "source_depth_state is reviewable",
  "scoreSource=real approved",
  "source-rights are approved",
  "public claims are approved",
  "template copy approved",
  "Supabase read output:",
  "SQL execution output:",
  "raw OHLCV",
  "daily_prices sample"
];

const template = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !template.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => template.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: templatePath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
