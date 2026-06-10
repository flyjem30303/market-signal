import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-write-runner-implementation-review-gate.mjs";
const docPath = "docs/TWII_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE.md";
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
const output = parseJson(run.stdout ?? "", "implementation review stdout");
if (run.status !== 0) problems.push("implementation review report must exit 0");
if (output.status !== "twii_write_runner_implementation_review_gate_ready_future_review_no_execution") {
  problems.push("implementation review gate must be ready for future review without execution");
}
if (output.outcome !== "implementation_review_ready_but_real_write_still_blocked") {
  problems.push("implementation review outcome must keep real write blocked");
}
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
assertSafety(output);

if (pkg.scripts?.["report:twii-write-runner-implementation-review-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-write-runner-implementation-review-gate`);
}
if (
  pkg.scripts?.["check:twii-write-runner-implementation-review-gate"] !==
  "node scripts/check-twii-write-runner-implementation-review-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twii-write-runner-implementation-review-gate`);
}

for (const phrase of [
  "TWII Write Runner Implementation Review Gate",
  "twii_write_runner_implementation_review_gate_ready_future_review_no_execution",
  "Current decision: ready for future review, no execution",
  "source-rights decision",
  "field-contract decision",
  "asset-mapping decision",
  "Do not add Supabase client code"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII write runner implementation review gate slice",
  "docs/TWII_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE.md",
  "twii_write_runner_implementation_review_gate_ready_future_review_no_execution",
  "implementation_review_ready_but_real_write_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE.md` is `accepted` as TWII write runner implementation review gate",
  "twii_write_runner_implementation_review_gate_ready_future_review_no_execution",
  "implementation_review_ready_but_real_write_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-write-runner-implementation-review-gate.mjs",
  "name: \"twii-write-runner-implementation-review-gate\"",
  "\"twii-write-runner-implementation-review-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["implementation review stdout", run.stdout ?? ""]
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
      acceptedOutcome: output.outcome,
      implementationAllowedNow: output.implementationAllowedNow,
      writeGateExecutableNow: output.writeGateExecutableNow
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("implementation review must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`implementation review safety.${key} must be false`);
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
