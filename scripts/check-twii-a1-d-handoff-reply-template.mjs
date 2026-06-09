import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-a1-d-handoff-reply-template.mjs";
const checkerPath = "scripts/check-twii-a1-d-handoff-reply-template.mjs";
const docPath = "docs/TWII_A1_D_HANDOFF_REPLY_TEMPLATE.md";
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
const report = parseJson(reportRun.stdout ?? "", "handoff reply template report stdout");
if (reportRun.status !== 0) problems.push("handoff reply template report must exit 0");
if (report.status !== "twii_a1_d_handoff_reply_template_ready") {
  problems.push("handoff reply template report must be ready");
}
if (report.outcome !== "accepted_as_no_secret_handoff_reply_template") {
  problems.push("handoff reply template outcome must be accepted as no-secret template");
}
assertSafety(report, "handoff reply template report");

if (pkg.scripts?.["report:twii-a1-d-handoff-reply-template"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-a1-d-handoff-reply-template`);
}
if (pkg.scripts?.["check:twii-a1-d-handoff-reply-template"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-a1-d-handoff-reply-template`);
}

for (const phrase of [
  "TWII A1/D Handoff Reply Template",
  "twii_a1_d_handoff_reply_template_ready",
  "A1 Reply Block",
  "D Reply Blocks",
  "PM Intake Block",
  "candidateArtifactPath",
  "artifactHandoffStatus",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "pmClassificationRequest",
  "accepted | needs_bounded_repair | blocked | rejected",
  "packetScaffoldCommand",
  "namedPacketGateCommand",
  "smokeProofCommand",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation",
  "No copied terms text",
  "No private dashboard links",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII A1/D handoff reply template slice",
  "docs/TWII_A1_D_HANDOFF_REPLY_TEMPLATE.md",
  "twii_a1_d_handoff_reply_template_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_A1_D_HANDOFF_REPLY_TEMPLATE.md` is `accepted` as TWII A1/D handoff reply template",
  "twii_a1_d_handoff_reply_template_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-a1-d-handoff-reply-template.mjs",
  "name: \"twii-a1-d-handoff-reply-template\"",
  "\"twii-a1-d-handoff-reply-template\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["handoff reply template report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_a1_d_handoff_reply_template_ready"
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
    "copiedTermsTextAllowed",
    "privateDashboardLinksAllowed",
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
