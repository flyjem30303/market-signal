import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZATION_PACKET.md";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-authorization-packet.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-authorization-packet.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "", "authorization packet report stdout");
if (reportRun.status !== 0) problems.push("authorization packet report must exit 0");
if (report.status !== "twii_bounded_readonly_preflight_authorization_packet_ready_not_executed") {
  problems.push("authorization packet report must be ready not executed");
}
if (report.outcome !== "ready_for_ceo_single_bounded_readonly_authorization_not_executed") {
  problems.push("authorization packet outcome must be ready for single authorization not executed");
}
assertSafety(report, "authorization packet report");

if (
  pkg.scripts?.["report:twii-bounded-readonly-preflight-authorization-packet"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-readonly-preflight-authorization-packet`);
}
if (
  pkg.scripts?.["check:twii-bounded-readonly-preflight-authorization-packet"] !==
  `node ${checkerPath}`
) {
  problems.push(`${packagePath} missing check:twii-bounded-readonly-preflight-authorization-packet`);
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Authorization Packet",
  "twii_bounded_readonly_preflight_authorization_packet_ready_not_executed",
  "twii-bounded-readonly-preflight-20260609-a",
  "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE",
  "ready_for_ceo_single_bounded_readonly_authorization_not_executed",
  "No SQL",
  "No Supabase connection in this packet",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight authorization packet slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZATION_PACKET.md",
  "twii_bounded_readonly_preflight_authorization_packet_ready_not_executed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZATION_PACKET.md` is `accepted` as TWII bounded readonly preflight authorization packet",
  "twii_bounded_readonly_preflight_authorization_packet_ready_not_executed"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-authorization-packet.mjs",
  "name: \"twii-bounded-readonly-preflight-authorization-packet\"",
  "\"twii-bounded-readonly-preflight-authorization-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["authorization packet report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_readonly_preflight_authorization_packet_ready_not_executed"
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
    "supabaseConnectionAllowedInThisPacket",
    "supabaseWriteAllowed",
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
