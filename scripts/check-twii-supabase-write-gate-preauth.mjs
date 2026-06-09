import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-supabase-write-gate-preauth.mjs";
const docPath = "docs/TWII_SUPABASE_WRITE_GATE_PREAUTH.md";
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
const output = parseJson(run.stdout ?? "", "write gate preauth stdout");
if (run.status !== 0) problems.push("write gate preauth report must exit 0");
if (output.status !== "twii_supabase_write_gate_preauth_ready_for_chairman_authorization") {
  problems.push("write gate preauth status must be ready for chairman authorization");
}
if (output.outcome !== "preauth_ready_for_separate_explicit_write_gate_packet") {
  problems.push("write gate preauth outcome must require separate explicit write-gate packet");
}
if (output.currentBoundary?.writeGateExecutableNow !== false) {
  problems.push("write gate must not be executable now");
}
assertSafety(output);

if (pkg.scripts?.["report:twii-supabase-write-gate-preauth"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-supabase-write-gate-preauth`);
}
if (pkg.scripts?.["check:twii-supabase-write-gate-preauth"] !== "node scripts/check-twii-supabase-write-gate-preauth.mjs") {
  problems.push(`${packagePath} missing check:twii-supabase-write-gate-preauth`);
}

for (const phrase of [
  "TWII Supabase Write Gate Preauthorization",
  "twii_supabase_write_gate_preauth_ready_for_chairman_authorization",
  "Required Future Authorization Packet",
  "`chairmanDecision=accepted`",
  "`ceoDecision=accepted`",
  "`targetTable=daily_prices`",
  "`writeMode=bounded_insert_missing_only`",
  "Rollback / No-Write Stop Line",
  "Post-Write Readback Plan",
  "Current output is only `preauth_ready_for_chairman_authorization`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII Supabase write gate preauthorization slice",
  "docs/TWII_SUPABASE_WRITE_GATE_PREAUTH.md",
  "twii_supabase_write_gate_preauth_ready_for_chairman_authorization",
  "preauth_ready_for_separate_explicit_write_gate_packet"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SUPABASE_WRITE_GATE_PREAUTH.md` is `accepted` as TWII Supabase write gate preauthorization",
  "twii_supabase_write_gate_preauth_ready_for_chairman_authorization",
  "preauth_ready_for_separate_explicit_write_gate_packet"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-supabase-write-gate-preauth.mjs",
  "name: \"twii-supabase-write-gate-preauth\"",
  "\"twii-supabase-write-gate-preauth\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["write gate preauth stdout", run.stdout ?? ""]
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
    problems.push("write gate preauth must stay mock/mock");
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
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`write gate preauth safety.${key} must be false`);
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

