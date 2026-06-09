import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const docPath = "docs/TWII_BOUNDED_READONLY_RESULT_TO_DATA_ROUTE_DECISION.md";
const reportPath = "scripts/report-twii-bounded-readonly-result-to-data-route-decision.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-result-to-data-route-decision.mjs";
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

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "", "route decision report stdout");
if (run.status !== 0) problems.push("route decision report must exit 0");
if (report.status !== "twii_bounded_readonly_result_to_data_route_decision_ready") {
  problems.push("route decision report must be ready");
}
if (report.outcome !== "candidate_acceptance_preparation_with_rights_field_contract_guard") {
  problems.push("route decision outcome must route to guarded candidate acceptance preparation");
}
assertSafety(report, "route decision report");

if (pkg.scripts?.["report:twii-bounded-readonly-result-to-data-route-decision"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-bounded-readonly-result-to-data-route-decision`);
}
if (pkg.scripts?.["check:twii-bounded-readonly-result-to-data-route-decision"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:twii-bounded-readonly-result-to-data-route-decision`);
}

for (const phrase of [
  "TWII Bounded Readonly Result To Data Route Decision",
  "twii_bounded_readonly_result_to_data_route_decision_ready",
  "candidate_acceptance_preparation_with_rights_field_contract_guard",
  "readonly proof succeeded",
  "No candidate row acceptance",
  "No row coverage scoring",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly result-to-data route decision slice",
  "docs/TWII_BOUNDED_READONLY_RESULT_TO_DATA_ROUTE_DECISION.md",
  "twii_bounded_readonly_result_to_data_route_decision_ready",
  "candidate_acceptance_preparation_with_rights_field_contract_guard"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_RESULT_TO_DATA_ROUTE_DECISION.md` is `accepted` as TWII bounded readonly result-to-data route decision",
  "twii_bounded_readonly_result_to_data_route_decision_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-result-to-data-route-decision.mjs",
  "name: \"twii-bounded-readonly-result-to-data-route-decision\"",
  "\"twii-bounded-readonly-result-to-data-route-decision\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

scanForbidden([
  [docPath, doc],
  [reportPath, reportSource],
  ["route decision report stdout", run.stdout ?? ""]
]);

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_bounded_readonly_result_to_data_route_decision_ready"
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
    "sqlExecuted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function scanForbidden(entries) {
  for (const [filePath, text] of entries) {
    for (const pattern of [
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
      /Supabase writes are approved/u,
      /row coverage scoring is approved/u
    ]) {
      if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
    }
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
