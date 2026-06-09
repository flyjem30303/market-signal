import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-write-readiness-packet-consolidation.mjs";
const docPath = "docs/TWII_WRITE_READINESS_PACKET_CONSOLIDATION.md";
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

const output = parseJson(run.stdout ?? "", "write readiness consolidation stdout");
if (run.status !== 0) problems.push("write readiness consolidation report must exit 0");
if (output.status !== "twii_write_readiness_packet_consolidation_ready_blocked_prerequisites_mapped") {
  problems.push("write readiness consolidation status must map blocked prerequisites");
}
if (output.outcome !== "write_readiness_owner_action_map_ready_no_real_write") {
  problems.push("write readiness consolidation outcome must remain no-real-write");
}
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.readyLocalCount !== 4) problems.push("readyLocalCount must be 4");
if (output.blockedPrerequisiteCount !== 6) problems.push("blockedPrerequisiteCount must be 6");
if (!Array.isArray(output.readinessItems) || output.readinessItems.length !== 10) {
  problems.push("readinessItems must contain 10 rows");
}

for (const item of [
  "source-rights decision",
  "field-contract decision",
  "asset-mapping decision",
  "write-gate packet",
  "runner boundary",
  "credential handling",
  "rollback dry-run",
  "post-write readback",
  "post-write review",
  "fail-closed tests"
]) {
  if (!output.readinessItems?.some((row) => row.item === item)) problems.push(`missing readiness row: ${item}`);
}

assertSafety(output);

if (pkg.scripts?.["report:twii-write-readiness-packet-consolidation"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-write-readiness-packet-consolidation`);
}
if (
  pkg.scripts?.["check:twii-write-readiness-packet-consolidation"] !==
  "node scripts/check-twii-write-readiness-packet-consolidation.mjs"
) {
  problems.push(`${packagePath} missing check:twii-write-readiness-packet-consolidation`);
}

for (const phrase of [
  "TWII Write Readiness Packet Consolidation",
  "twii_write_readiness_packet_consolidation_ready_blocked_prerequisites_mapped",
  "Owner Dispatch",
  "A1 next: source-rights, field-contract, and asset-mapping evidence only",
  "Do not add Supabase client code"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII write readiness packet consolidation slice",
  "docs/TWII_WRITE_READINESS_PACKET_CONSOLIDATION.md",
  "twii_write_readiness_packet_consolidation_ready_blocked_prerequisites_mapped",
  "write_readiness_owner_action_map_ready_no_real_write"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_WRITE_READINESS_PACKET_CONSOLIDATION.md` is `accepted` as TWII write readiness packet consolidation",
  "twii_write_readiness_packet_consolidation_ready_blocked_prerequisites_mapped",
  "write_readiness_owner_action_map_ready_no_real_write"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-write-readiness-packet-consolidation.mjs",
  "name: \"twii-write-readiness-packet-consolidation\"",
  "\"twii-write-readiness-packet-consolidation\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["write readiness consolidation stdout", run.stdout ?? ""]
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
      readyLocalCount: output.readyLocalCount,
      blockedPrerequisiteCount: output.blockedPrerequisiteCount
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("write readiness consolidation must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`write readiness consolidation safety.${key} must be false`);
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

