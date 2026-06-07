import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const reportPath = "scripts/report-a1-source-rights-evidence-batch-brief.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);

if (
  pkg.scripts?.["report:a1-source-rights-evidence-batch-brief"] !==
  "node scripts/report-a1-source-rights-evidence-batch-brief.mjs"
) {
  problems.push(`${packagePath} missing report:a1-source-rights-evidence-batch-brief`);
}

if (
  pkg.scripts?.["check:a1-source-rights-evidence-batch-brief"] !==
  "node scripts/check-a1-source-rights-evidence-batch-brief.mjs"
) {
  problems.push(`${packagePath} missing check:a1-source-rights-evidence-batch-brief`);
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest A1 source-rights evidence batch brief slice"],
  [boardPath, board, "`report:a1-source-rights-evidence-batch-brief` is `accepted` as the PM/A1 TWII evidence batch brief"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "a1_source_rights_evidence_batch_brief",
  "twii_source_rights_unblock_first_batch",
  "record:a1-exact-source-rights-evidence-outcome",
  "publicDataSource",
  "scoreSource",
  "evidenceRecorded: false",
  "marketDataFetched: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false",
  "scoreSourceRealEnabled: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-source-rights-evidence-batch-brief"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0 || !report) {
  problems.push("report:a1-source-rights-evidence-batch-brief should emit JSON");
} else {
  if (report.status !== "twii_batch_brief_ready_pending_no_secret_evidence") {
    problems.push(`unexpected status ${report.status}`);
  }
  if (report.batch?.batchId !== "twii_source_rights_unblock_first_batch") {
    problems.push("batch should keep TWII first");
  }
  if (report.batch?.lane !== "TWII") problems.push("batch lane should be TWII");
  if (report.batch?.pendingCount !== 4) problems.push("TWII batch should contain four pending slots");
  if (report.batch?.executable !== false) problems.push("batch must be non-executable");
  if (report.batch?.nextAfterEvidenceReview !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
    problems.push("batch should route back to A1 readiness summary");
  }
  for (const id of [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]) {
    const slot = report.slots?.find((item) => item.id === id);
    if (!slot) {
      problems.push(`missing TWII slot ${id}`);
      continue;
    }
    if (slot.lane !== "TWII") problems.push(`${id} lane must be TWII`);
    if (slot.currentClassification !== "pending") problems.push(`${id} should remain pending`);
    if (!slot.recorderDryRunTemplate?.includes("--dry-run")) problems.push(`${id} template must be dry-run`);
    if (slot.recorderDryRunTemplate?.includes("--apply")) problems.push(`${id} template must not apply`);
    if (!slot.recorderDryRunTemplate?.includes("twii_source_rights_outcome_gate")) {
      problems.push(`${id} template should route to TWII source-rights outcome gate`);
    }
  }
  if (report.assignmentForA1?.role !== "A1 Data / Supabase / Market Evidence") {
    problems.push("assignmentForA1 role mismatch");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock" || report.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("runtime boundary must remain mock/mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "evidenceRecorded",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "rawPayloadPrinted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_source_rights_evidence_batch_brief_ready",
      checkedSlots: 4,
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      }
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /source rights (are )?approved/iu,
    /candidate generation is approved/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /daily_prices mutation is approved/iu,
    /row coverage points awarded/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
