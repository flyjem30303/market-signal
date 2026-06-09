import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-a1-d-write-prerequisite-pm-intake-ledger.mjs";
const docPath = "docs/TWII_A1_D_WRITE_PREREQUISITE_PM_INTAKE_LEDGER.md";
const ledgerPath = "data/source-gates/twii-write-prerequisite-intake-ledger.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const ledger = JSON.parse(read(ledgerPath));
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

const output = parseJson(run.stdout ?? "", "PM intake ledger stdout");
if (run.status !== 0) problems.push("PM intake ledger report must exit 0");
if (output.status !== "twii_a1_d_write_prerequisite_pm_intake_ledger_ready_pending_replies") {
  problems.push("initial PM intake ledger status must be ready pending replies");
}
if (output.outcome !== "implementation_upgrade_still_blocked_waiting_pm_intake") {
  problems.push("initial PM intake ledger outcome must keep implementation blocked");
}
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.futureCandidateGateAllowed !== false) problems.push("futureCandidateGateAllowed must be false until all slots accepted");
if (output.counts?.total !== 6) problems.push("ledger must contain 6 outcomes");
if (output.counts?.pending !== 6) problems.push("initial ledger must keep all 6 outcomes pending");
if (output.counts?.unsafeEntryCount !== 0) problems.push("ledger must have 0 unsafe entries");

for (const slotId of [
  "source-rights-decision",
  "field-contract-decision",
  "asset-mapping-decision",
  "rollback-dry-run-plan",
  "post-write-readback-plan",
  "post-write-review-plan"
]) {
  if (!ledger.outcomes?.some((outcome) => outcome.slotId === slotId)) problems.push(`${ledgerPath} missing slot: ${slotId}`);
  if (!output.requiredSlots?.includes(slotId)) problems.push(`report missing required slot: ${slotId}`);
}

assertSafety(output);

if (pkg.scripts?.["report:twii-a1-d-write-prerequisite-pm-intake-ledger"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-a1-d-write-prerequisite-pm-intake-ledger`);
}
if (
  pkg.scripts?.["check:twii-a1-d-write-prerequisite-pm-intake-ledger"] !==
  "node scripts/check-twii-a1-d-write-prerequisite-pm-intake-ledger.mjs"
) {
  problems.push(`${packagePath} missing check:twii-a1-d-write-prerequisite-pm-intake-ledger`);
}

for (const phrase of [
  "TWII A1/D Write Prerequisite PM Intake Ledger",
  "twii_a1_d_write_prerequisite_pm_intake_ledger_ready_pending_replies",
  "All six slots must be `accepted`",
  "data/source-gates/twii-write-prerequisite-intake-ledger.json",
  "Do not add Supabase client code"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII A1/D write prerequisite PM intake ledger slice",
  "docs/TWII_A1_D_WRITE_PREREQUISITE_PM_INTAKE_LEDGER.md",
  "data/source-gates/twii-write-prerequisite-intake-ledger.json",
  "twii_a1_d_write_prerequisite_pm_intake_ledger_ready_pending_replies"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_A1_D_WRITE_PREREQUISITE_PM_INTAKE_LEDGER.md` is `accepted` as TWII A1/D write prerequisite PM intake ledger",
  "twii_a1_d_write_prerequisite_pm_intake_ledger_ready_pending_replies",
  "implementation_upgrade_still_blocked_waiting_pm_intake"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-a1-d-write-prerequisite-pm-intake-ledger.mjs",
  "name: \"twii-a1-d-write-prerequisite-pm-intake-ledger\"",
  "\"twii-a1-d-write-prerequisite-pm-intake-ledger\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [ledgerPath, JSON.stringify(ledger)],
  ["PM intake ledger stdout", run.stdout ?? ""]
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
      pendingSlots: output.counts.pending
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("PM intake ledger must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`PM intake ledger safety.${key} must be false`);
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

