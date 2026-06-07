import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-a1-exact-source-rights-evidence-recording-commands.mjs";
const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const ledgerDocPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md";

const reportSource = read(reportPath);
const outcomes = JSON.parse(read(outcomePath)).outcomes ?? [];
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const ledgerDoc = read(ledgerDocPath);

for (const phrase of [
  "a1_exact_source_rights_evidence_recording_commands",
  "pending_slot_dry_run_commands_ready",
  "record:a1-exact-source-rights-evidence-outcome",
  "--dry-run",
  "--apply",
  "REPLACE_WITH_NO_SECRET_SUMMARY",
  "REPLACE_WITH_NO_SECRET_REMAINING_RISK",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "connectionAttempted: false",
  "supabaseReadsEnabled: false",
  "supabaseWritesEnabled: false",
  "marketDataFetched: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-exact-source-rights-evidence-recording-commands"] !==
  "node scripts/report-a1-exact-source-rights-evidence-recording-commands.mjs"
) {
  problems.push(`${packagePath} missing report:a1-exact-source-rights-evidence-recording-commands`);
}

if (
  pkg.scripts?.["check:a1-exact-source-rights-evidence-recording-commands"] !==
  "node scripts/check-a1-exact-source-rights-evidence-recording-commands.mjs"
) {
  problems.push(`${packagePath} missing check:a1-exact-source-rights-evidence-recording-commands`);
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest A1 exact evidence recording command helper slice"],
  [boardPath, board, "A1 exact evidence recording command helper"],
  [ledgerDocPath, ledgerDoc, "cmd.exe /c npm run report:a1-exact-source-rights-evidence-recording-commands"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-exact-source-rights-evidence-recording-commands"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});

if (run.status !== 0) problems.push("recording command report should exit 0");

const report = parseJson(run.stdout ?? "");
if (!report) {
  problems.push("recording command report should emit JSON");
} else {
  const pendingCount = outcomes.filter((item) => item.classification === "pending").length;
  if (report.status !== (pendingCount === 0 ? "no_pending_slots" : "pending_slot_dry_run_commands_ready")) {
    problems.push(`unexpected report status ${report.status}`);
  }
  if (report.pendingCount !== pendingCount) problems.push("pendingCount must match outcome file");
  if (report.commandCount !== pendingCount) problems.push("commandCount must match pending slots");
  if (!Array.isArray(report.commands)) problems.push("commands must be an array");
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("runtime boundary must remain mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
  for (const command of report.commands ?? []) {
    if (!command.recommendedDryRunCommand?.includes("--dry-run")) problems.push(`${command.id} missing dry-run command`);
    if (command.recommendedDryRunCommand?.includes("--apply")) problems.push(`${command.id} recommended command must not apply`);
    if (!command.applyInstruction?.includes("PM/CEO reviews no-secret evidence")) {
      problems.push(`${command.id} missing apply review instruction`);
    }
  }
}

for (const [filePath, source] of [
  [reportPath, reportSource],
  [JSON.stringify(report), JSON.stringify(report)]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "a1_exact_source_rights_evidence_recording_commands_ready",
      pendingCount: report.pendingCount,
      commandCount: report.commandCount
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
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage points awarded/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
