import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-bounded-data-acceptance-no-write-chain-run-20260609.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_NO_WRITE_CHAIN_RUN_20260609.md";
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
const output = parseJson(run.stdout ?? "", "no-write chain run stdout");
if (run.status !== 0) problems.push("no-write chain run report must exit 0");
if (output.status !== "twii_bounded_data_acceptance_no_write_chain_run_20260609_accepted") {
  problems.push("no-write chain run status must be accepted");
}
if (output.outcome !== "accepted_no_write_chain_with_post_run_review") {
  problems.push("no-write chain run outcome must be accepted with post-run review");
}
assertSafety(output);

if (
  pkg.scripts?.["report:twii-bounded-data-acceptance-no-write-chain-run-20260609"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-data-acceptance-no-write-chain-run-20260609`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-no-write-chain-run-20260609"] !==
  "node scripts/check-twii-bounded-data-acceptance-no-write-chain-run-20260609.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-no-write-chain-run-20260609`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance No-Write Chain Run 20260609",
  "twii_bounded_data_acceptance_no_write_chain_run_20260609_accepted",
  "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write",
  "accepted_no_write_packet_driven_chain",
  "twii_bounded_data_acceptance_post_run_review_accepted_no_write",
  "No SQL",
  "Supabase read/write",
  "candidate row acceptance",
  "row coverage scoring"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance no-write chain run slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_NO_WRITE_CHAIN_RUN_20260609.md",
  "twii_bounded_data_acceptance_no_write_chain_run_20260609_accepted",
  "accepted_no_write_chain_with_post_run_review"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_NO_WRITE_CHAIN_RUN_20260609.md` is `accepted` as TWII bounded data acceptance no-write chain run 20260609",
  "twii_bounded_data_acceptance_no_write_chain_run_20260609_accepted",
  "accepted_no_write_chain_with_post_run_review"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-no-write-chain-run-20260609.mjs",
  "name: \"twii-bounded-data-acceptance-no-write-chain-run-20260609\"",
  "\"twii-bounded-data-acceptance-no-write-chain-run-20260609\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["no-write chain run stdout", run.stdout ?? ""]
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
    problems.push("run record must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`run record safety.${key} must be false`);
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

