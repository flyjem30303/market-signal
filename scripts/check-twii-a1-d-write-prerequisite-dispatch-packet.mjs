import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-a1-d-write-prerequisite-dispatch-packet.mjs";
const docPath = "docs/TWII_A1_D_WRITE_PREREQUISITE_DISPATCH_PACKET.md";
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

const output = parseJson(run.stdout ?? "", "A1/D prerequisite dispatch stdout");
if (run.status !== 0) problems.push("A1/D prerequisite dispatch report must exit 0");
if (output.status !== "twii_a1_d_write_prerequisite_dispatch_packet_ready_local_only") {
  problems.push("A1/D prerequisite dispatch status must be ready local-only");
}
if (output.outcome !== "a1_d_prerequisite_reply_contract_ready_no_execution") {
  problems.push("A1/D prerequisite dispatch outcome must remain no-execution");
}
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.slotCount !== 6) problems.push("slotCount must be 6");
if (output.a1SlotCount !== 5) problems.push("a1SlotCount must be 5");
if (output.dSlotCount !== 1) problems.push("dSlotCount must be 1");
if (output.pmSlotCount !== 3) problems.push("pmSlotCount must be 3");
if (!Array.isArray(output.slots) || output.slots.length !== 6) problems.push("slots must contain 6 rows");

for (const slotId of [
  "source-rights-decision",
  "field-contract-decision",
  "asset-mapping-decision",
  "rollback-dry-run-plan",
  "post-write-readback-plan",
  "post-write-review-plan"
]) {
  if (!output.slots?.some((slot) => slot.slotId === slotId)) problems.push(`missing slot: ${slotId}`);
}

for (const value of ["accepted", "needs_bounded_repair", "blocked", "rejected"]) {
  if (!output.pmClassificationValues?.includes(value)) problems.push(`missing PM classification value: ${value}`);
}

assertSafety(output);

if (pkg.scripts?.["report:twii-a1-d-write-prerequisite-dispatch-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-a1-d-write-prerequisite-dispatch-packet`);
}
if (
  pkg.scripts?.["check:twii-a1-d-write-prerequisite-dispatch-packet"] !==
  "node scripts/check-twii-a1-d-write-prerequisite-dispatch-packet.mjs"
) {
  problems.push(`${packagePath} missing check:twii-a1-d-write-prerequisite-dispatch-packet`);
}

for (const phrase of [
  "TWII A1/D Write Prerequisite Dispatch Packet",
  "twii_a1_d_write_prerequisite_dispatch_packet_ready_local_only",
  "A1 Reply Shape",
  "D Reply Shape",
  "All six slots must be `accepted`",
  "Do not add Supabase client code"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII A1/D write prerequisite dispatch packet slice",
  "docs/TWII_A1_D_WRITE_PREREQUISITE_DISPATCH_PACKET.md",
  "twii_a1_d_write_prerequisite_dispatch_packet_ready_local_only",
  "a1_d_prerequisite_reply_contract_ready_no_execution"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_A1_D_WRITE_PREREQUISITE_DISPATCH_PACKET.md` is `accepted` as TWII A1/D write prerequisite dispatch packet",
  "twii_a1_d_write_prerequisite_dispatch_packet_ready_local_only",
  "a1_d_prerequisite_reply_contract_ready_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-a1-d-write-prerequisite-dispatch-packet.mjs",
  "name: \"twii-a1-d-write-prerequisite-dispatch-packet\"",
  "\"twii-a1-d-write-prerequisite-dispatch-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["A1/D prerequisite dispatch stdout", run.stdout ?? ""]
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
      slotCount: output.slotCount
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("A1/D prerequisite dispatch must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`A1/D dispatch safety.${key} must be false`);
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

