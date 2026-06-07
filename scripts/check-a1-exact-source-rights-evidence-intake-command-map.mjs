import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_INTAKE_COMMAND_MAP.md";
const packetPath = "docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md";
const nextActionPath = "docs/A1_SOURCE_RIGHTS_NEXT_ACTION_REPORT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const reportPath = "scripts/report-a1-exact-source-rights-evidence-intake-command-map.mjs";

const doc = read(docPath);
const packet = read(packetPath);
const nextAction = read(nextActionPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-exact-source-rights-evidence-intake-command-map"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:a1-exact-source-rights-evidence-intake-command-map should exit 0");
if (report?.status !== "a1_exact_source_rights_evidence_intake_command_map_ready_local_only_not_filled") {
  problems.push("report should expose exact intake command map status");
}
if (report?.runtimeBoundary?.publicDataSource !== "mock") problems.push("report must preserve publicDataSource mock");
if (report?.runtimeBoundary?.scoreSource !== "mock") problems.push("report must preserve scoreSource mock");
if (report?.twii?.requiredSlotCount !== 4) problems.push("report must keep four TWII slots");
if (report?.etf?.requiredSlots?.length !== 6) problems.push("report must keep six ETF slots");
if (report?.twii?.nextGateAllowed !== false) problems.push("TWII next gate should currently remain blocked");
if (report?.etf?.nextGateAllowed !== false) problems.push("ETF next gate should currently remain blocked");

for (const phrase of [
  "Status: `a1_exact_source_rights_evidence_intake_command_map_ready_local_only_not_filled`",
  "CEO converts the current A1 next action into an exact intake command map",
  "Current PM route: `keep_beta_mainline_moving_and_assign_a1_exact_twii_etf_source_rights_evidence_intake`",
  "MVP coverage baseline: `182/360`",
  "`TWII`: `0/60`, missing `60`",
  "ETF: `2/120`, missing `118`",
  "Runtime boundary: `publicDataSource=mock`",
  "Score boundary: `scoreSource=mock`",
  "`vendor-terms-evidence`",
  "`internal-feed-owner-evidence`",
  "`field-contract-evidence`",
  "`asset-mapping-evidence`",
  "`etf-legal-use-evidence`",
  "`etf-redistribution-evidence`",
  "`etf-attribution-retention-evidence`",
  "`etf-derived-analysis-rate-limit-evidence`",
  "`etf-field-contract-evidence`",
  "`etf-source-comparison-evidence`",
  "`TWSE official ETF disclosures`, `Issuer official ETF pages`, and `Paid market data vendor`",
  "\"classification\": \"accepted | rejected | needs_bounded_repair | blocked | unavailable\"",
  "PM may open a later source-rights outcome gate only if:",
  "continue_public_beta_runtime_mainline_mock_visible"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "remote source probing",
  "market-data fetch",
  "market-data ingestion",
  "raw market-data storage",
  "candidate artifact generation from source data",
  "SQL execution",
  "Supabase connection",
  "Supabase read",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "row payload output",
  "stock id payload output",
  "secret output",
  "row coverage point award",
  "source-rights approval claim",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [packetPath, packet, "PM must classify the outcome before it affects the mainline"],
  [nextActionPath, nextAction, "keep_beta_mainline_moving_and_assign_a1_exact_twii_etf_source_rights_evidence_intake"],
  [statusPath, status, "Latest A1 exact source-rights evidence intake command map slice"],
  [statusPath, status, "a1_exact_source_rights_evidence_intake_command_map_ready_local_only_not_filled"],
  [boardPath, board, "`docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_INTAKE_COMMAND_MAP.md` is `accepted` as the PM/A1 exact evidence-intake command map"],
  [boardPath, board, "a1_exact_twii_etf_source_rights_evidence_intake_then_separate_outcome_gate"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-exact-source-rights-evidence-intake-command-map"] !==
  "node scripts/report-a1-exact-source-rights-evidence-intake-command-map.mjs"
) {
  problems.push(`${packagePath} missing report:a1-exact-source-rights-evidence-intake-command-map`);
}
if (
  pkg.scripts?.["check:a1-exact-source-rights-evidence-intake-command-map"] !==
  "node scripts/check-a1-exact-source-rights-evidence-intake-command-map.mjs"
) {
  problems.push(`${packagePath} missing check:a1-exact-source-rights-evidence-intake-command-map`);
}

for (const phrase of [
  "scripts/check-a1-exact-source-rights-evidence-intake-command-map.mjs",
  "name: \"a1-exact-source-rights-evidence-intake-command-map\"",
  "\"a1-exact-source-rights-evidence-intake-command-map\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "No SQL is executed by this report.",
  "No Supabase connection, read, or write is executed by this report.",
  "No staging rows or daily_prices rows are created or modified by this report.",
  "No remote market data is fetched, stored, ingested, or committed by this report.",
  "No secrets, source bodies, raw payloads, row payloads, or stock id payloads are printed by this report.",
  "No TWII or ETF candidate artifact is generated from source data by this report.",
  "No row coverage points are awarded by this report.",
  "No source-rights approval is claimed by this report.",
  "publicDataSource remains mock and scoreSource remains mock."
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing stop line: ${phrase}`);
  if (!run.stdout.includes(phrase)) problems.push(`${reportPath} output missing stop line: ${phrase}`);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
  if (pattern.test(reportSource)) problems.push(`${reportPath} contains forbidden pattern: ${pattern}`);
  if (pattern.test(run.stdout ?? "")) problems.push(`${reportPath} emitted forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: report.status,
      pmRoute: report.pmRoute,
      twiiPendingSlots: report.twii.pendingSlots,
      etfBlockers: report.etf.blockers
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /source rights (are )?approved/iu,
    /candidate generation is approved/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /daily_prices mutation is approved/iu,
    /row coverage points awarded/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
