import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_SOURCE_RIGHTS_NEXT_ACTION_REPORT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const reportPath = "scripts/report-a1-source-rights-next-action.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-source-rights-next-action"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});

const report = parseJson(run.stdout ?? "");
if (run.status !== 0) problems.push("report:a1-source-rights-next-action should exit 0");
if (report?.status !== "blocked_waiting_source_rights_evidence") {
  problems.push("report should currently route to blocked_waiting_source_rights_evidence");
}
if (report?.currentState?.runtimeBoundary?.publicDataSource !== "mock") {
  problems.push("report should preserve publicDataSource mock boundary");
}
if (report?.currentState?.runtimeBoundary?.scoreSource !== "mock") {
  problems.push("report should preserve scoreSource mock boundary");
}
if (report?.currentState?.twii?.pendingEvidenceCount !== 4) {
  problems.push("TWII should currently show four pending evidence items");
}
if (report?.currentState?.etf?.decision !== "blocked") {
  problems.push("ETF gate should currently remain blocked");
}
if (report?.currentState?.exactLedger?.status !== "awaiting_a1_exact_source_rights_evidence") {
  problems.push("exact ledger should currently await A1 exact source-rights evidence");
}
if (report?.currentState?.exactLedger?.twiiPendingCount !== 4) {
  problems.push("exact ledger should currently show four pending TWII slots");
}
if (report?.currentState?.exactLedger?.etfPendingCount !== 6) {
  problems.push("exact ledger should currently show six pending ETF slots");
}
if (report?.a1NextCommand !== "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet") {
  problems.push("A1 next command should route directly to the exact source-rights evidence worksheet report");
}

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `a1_source_rights_next_action_report_ready_source_rights_pending`"],
  [docPath, doc, "CEO decision: `route_a1_source_rights_next_action_without_reopening_governance`"],
  [docPath, doc, "Current outcome: `blocked_waiting_source_rights_evidence`"],
  [docPath, doc, "PM next action: `keep_beta_mainline_moving_and_assign_a1_exact_twii_etf_source_rights_evidence_intake`"],
  [docPath, doc, "A1 next action: `collect_or_classify_twii_vendor_terms_internal_owner_field_contract_asset_mapping_and_etf_legal_redistribution_evidence`"],
  [docPath, doc, "A1 next command: `cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet`"],
  [docPath, doc, "cmd.exe /c npm run report:a1-source-rights-next-action"],
  [docPath, doc, "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [docPath, doc, "TWII pending evidence count: `4/4`"],
  [docPath, doc, "ETF current decision: `blocked`"],
  [docPath, doc, "Exact outcome ledger status: `awaiting_a1_exact_source_rights_evidence`"],
  [docPath, doc, "Exact TWII pending slots: `4/4`"],
  [docPath, doc, "Exact ETF pending slots: `6/6`"],
  [statusPath, status, "Latest A1 source-rights next-action report slice"],
  [statusPath, status, "A1 next command is `cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet`"],
  [statusPath, status, "a1_source_rights_next_action_report_ready_source_rights_pending"],
  [boardPath, board, "`docs/A1_SOURCE_RIGHTS_NEXT_ACTION_REPORT.md` is `accepted` as PM/A1 source-rights next-action router"],
  [boardPath, board, "`report:a1-source-rights-next-action` routes blocked A1 work directly to `report:a1-exact-source-rights-evidence-worksheet`"],
  [boardPath, board, "blocked_waiting_source_rights_evidence"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:a1-source-rights-next-action"] !== "node scripts/report-a1-source-rights-next-action.mjs") {
  problems.push(`${packagePath} missing report:a1-source-rights-next-action script`);
}
if (pkg.scripts?.["check:a1-source-rights-next-action"] !== "node scripts/check-a1-source-rights-next-action.mjs") {
  problems.push(`${packagePath} missing check:a1-source-rights-next-action script`);
}

for (const phrase of [
  "scripts/check-a1-source-rights-next-action.mjs",
  "expectStatus: \"ok\"",
  "name: \"a1-source-rights-next-action\"",
  "\"a1-source-rights-next-action\""
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
  if (!doc.includes(phrase)) problems.push(`${docPath} missing stop line: ${phrase}`);
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
      guardedStatus: "a1_source_rights_next_action_report_ready_source_rights_pending",
      reportStatus: report.status,
      pmNextAction: report.pmNextAction
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
    /legal_and_redistribution_terms_approved/u,
    /candidate generation is approved/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage points awarded/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
