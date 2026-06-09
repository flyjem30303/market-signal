import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-real-handoff-intake-checklist.mjs";
const checkerPath = "scripts/check-twii-real-handoff-intake-checklist.mjs";
const docPath = "docs/TWII_REAL_HANDOFF_INTAKE_CHECKLIST.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "", "checklist report stdout");
if (reportRun.status !== 0) problems.push("handoff intake checklist report must exit 0");
if (report.status !== "twii_real_handoff_intake_checklist_ready") {
  problems.push("handoff intake checklist report must be ready");
}
if (report.outcome !== "accepted_as_local_no_write_intake_checklist") {
  problems.push("handoff intake checklist outcome must be accepted as local no-write checklist");
}
assertSafety(report, "checklist report");

if (pkg.scripts?.["report:twii-real-handoff-intake-checklist"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-real-handoff-intake-checklist`);
}
if (pkg.scripts?.["check:twii-real-handoff-intake-checklist"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-real-handoff-intake-checklist`);
}

for (const phrase of [
  "TWII Real Handoff Intake Checklist",
  "twii_real_handoff_intake_checklist_ready",
  "A1 Data Handoff",
  "D Source Rights Handoff",
  "PM Integration Handoff",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII real handoff intake checklist slice",
  "docs/TWII_REAL_HANDOFF_INTAKE_CHECKLIST.md",
  "twii_real_handoff_intake_checklist_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_REAL_HANDOFF_INTAKE_CHECKLIST.md` is `accepted` as TWII real handoff intake checklist",
  "twii_real_handoff_intake_checklist_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-real-handoff-intake-checklist.mjs",
  "name: \"twii-real-handoff-intake-checklist\"",
  "\"twii-real-handoff-intake-checklist\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["checklist report stdout", reportRun.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_real_handoff_intake_checklist_ready"
    },
    null,
    2
  )
);

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource=supabase is approved/u,
    /scoreSource=real is approved/u,
    /SQL execution is approved/u,
    /Supabase writes are approved/u
  ];
}
