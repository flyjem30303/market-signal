import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const board = read(boardPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "Status: `a1_twii_etf_source_rights_evidence_intake_packet_ready_local_only_not_filled`",
  "CEO assigns A1 to one shared evidence-intake packet",
  "`TWII`: `0/60`, missing `60` rows",
  "ETF: `2/120`, missing `118` rows",
  "Accepted current total: `182/360`",
  "TW equity sub-scope: `2330`, `2382`, `2308` accepted at `180/180`",
  "Runtime boundary: `publicDataSource=mock`",
  "Score boundary: `scoreSource=mock`",
  "`not_approved_for_probe_or_ingestion`",
  "`legal_and_redistribution_terms_unapproved`",
  "`accepted`, `rejected`, `needs_bounded_repair`, or `blocked`",
  "TWII Evidence Fields",
  "ETF Evidence Fields",
  "PM Acceptance Rule",
  "Route Selection Rule",
  "twii_or_etf_candidate_artifact_gate_after_pm_acceptance",
  "continue_public_beta_runtime_mainline_mock_visible"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "This packet does not allow:",
  "remote source probing",
  "market-data fetch",
  "market-data ingestion",
  "raw market-data storage",
  "candidate artifact generation from source data",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "row payload output",
  "stock id payload output",
  "secret output",
  "row coverage point award",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "`docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md` is `accepted` as A1 shared source-rights evidence intake",
  "source_rights_evidence_intake_for_twii_and_etf",
  "twii_or_etf_candidate_artifact_gate_after_pm_acceptance",
  "continue_public_beta_runtime_mainline_mock_visible"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest A1 TWII / ETF source-rights evidence intake packet slice",
  "docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md",
  "a1_twii_etf_source_rights_evidence_intake_packet_ready_local_only_not_filled",
  "TWII remains `0/60`",
  "ETF remains `2/120`",
  "full MVP coverage remains `182/360`"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:a1-twii-etf-source-rights-evidence-intake-packet"] !==
  "node scripts/check-a1-twii-etf-source-rights-evidence-intake-packet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-etf-source-rights-evidence-intake-packet`);
}

if (!reviewGate.includes("scripts/check-a1-twii-etf-source-rights-evidence-intake-packet.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}
if (!reviewGate.includes('"a1-twii-etf-source-rights-evidence-intake-packet"')) {
  problems.push(`${reviewGatePath} missing checker name`);
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\bfetch\s*\(/u,
  /process\.env/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /source rights are approved/iu,
  /candidate generation is approved/iu,
  /SQL execution is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
  /row coverage points awarded/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
