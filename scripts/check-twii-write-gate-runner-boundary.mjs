import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-write-gate-runner-boundary.mjs";
const docPath = "docs/TWII_WRITE_GATE_RUNNER_BOUNDARY.md";
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
const output = parseJson(run.stdout ?? "", "runner boundary stdout");
if (run.status !== 0) problems.push("runner boundary report must exit 0");
if (output.status !== "twii_write_gate_runner_boundary_ready_local_only") {
  problems.push("runner boundary status must be ready local only");
}
if (output.outcome !== "runner_boundary_and_credential_handling_ready_for_future_implementation_review") {
  problems.push("runner boundary outcome must be future implementation review only");
}
if (output.currentBoundary?.writeGateExecutableNow !== false) problems.push("write gate must not be executable now");
if (output.credentialHandlingPolicy?.credentialValuesPrintable !== false) {
  problems.push("credential values must not be printable");
}
assertSafety(output);

if (pkg.scripts?.["report:twii-write-gate-runner-boundary"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-write-gate-runner-boundary`);
}
if (pkg.scripts?.["check:twii-write-gate-runner-boundary"] !== "node scripts/check-twii-write-gate-runner-boundary.mjs") {
  problems.push(`${packagePath} missing check:twii-write-gate-runner-boundary`);
}

for (const phrase of [
  "TWII Write Gate Runner Boundary",
  "twii_write_gate_runner_boundary_ready_local_only",
  "execute=true",
  "service-role credential is server-only and never printed",
  "rollback dry-run is available before mutation",
  "post-write aggregate readback path is named",
  "Current status is only `runner_boundary_ready_local_only`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII write gate runner boundary slice",
  "docs/TWII_WRITE_GATE_RUNNER_BOUNDARY.md",
  "twii_write_gate_runner_boundary_ready_local_only",
  "runner_boundary_and_credential_handling_ready_for_future_implementation_review"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_WRITE_GATE_RUNNER_BOUNDARY.md` is `accepted` as TWII write gate runner boundary",
  "twii_write_gate_runner_boundary_ready_local_only",
  "runner_boundary_and_credential_handling_ready_for_future_implementation_review"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-write-gate-runner-boundary.mjs",
  "name: \"twii-write-gate-runner-boundary\"",
  "\"twii-write-gate-runner-boundary\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["runner boundary stdout", run.stdout ?? ""]
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
      guardedStatus: output.status,
      acceptedOutcome: output.outcome
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("runner boundary must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`runner boundary safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
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
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage scoring is approved/iu
  ];
}

