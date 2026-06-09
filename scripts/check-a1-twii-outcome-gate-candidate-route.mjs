import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-a1-twii-outcome-gate-candidate-route.mjs";
const checkPath = "scripts/check-a1-twii-outcome-gate-candidate-route.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "a1_twii_outcome_gate_candidate_route"],
  [reportPath, reportSource, "prepare_the_next_twii_gate_route_without_opening_execution_or_real_data"],
  [reportPath, reportSource, "report:a1-source-rights-readiness-summary"],
  [reportPath, reportSource, "report:twii-source-rights-outcome-gate-bridge"],
  [reportPath, reportSource, "report:a1-source-rights-next-action"],
  [reportPath, reportSource, "blocked_waiting_four_twii_accepted_no_secret_evidence_slots"],
  [reportPath, reportSource, "ready_to_prepare_separate_twii_source_rights_outcome_gate_candidate"],
  [reportPath, reportSource, "No source-rights approval is granted by this report."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "a1_twii_outcome_gate_candidate_route_ready"],
  [packagePath, JSON.stringify(pkg), "report:a1-twii-outcome-gate-candidate-route"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-outcome-gate-candidate-route"],
  [reviewGatePath, reviewGate, "name: \"a1-twii-outcome-gate-candidate-route\""],
  [reviewGatePath, reviewGate, "scripts/check-a1-twii-outcome-gate-candidate-route.mjs"],
  [statusPath, status, "Latest A1 TWII outcome gate candidate route slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-twii-outcome-gate-candidate-route"] !==
  "node scripts/report-a1-twii-outcome-gate-candidate-route.mjs"
) {
  problems.push(`${packagePath} missing report:a1-twii-outcome-gate-candidate-route`);
}

if (
  pkg.scripts?.["check:a1-twii-outcome-gate-candidate-route"] !==
  "node scripts/check-a1-twii-outcome-gate-candidate-route.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-outcome-gate-candidate-route`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 240000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push(`${reportPath} should exit 0`);
if (!report) {
  problems.push(`${reportPath} should emit JSON`);
} else {
  if (![
    "blocked_waiting_four_twii_accepted_no_secret_evidence_slots",
    "ready_to_prepare_separate_twii_source_rights_outcome_gate_candidate"
  ].includes(report.status)) {
    problems.push(`unexpected current status, got ${String(report.status)}`);
  }
  if (report.mode !== "a1_twii_outcome_gate_candidate_route") {
    problems.push("report mode mismatch");
  }
  if (report.status === "ready_to_prepare_separate_twii_source_rights_outcome_gate_candidate") {
    if (report.currentEvidence?.exactLedger?.acceptedCount !== 4) {
      problems.push("ready route should have exact ledger acceptedCount 4");
    }
    if (report.currentEvidence?.exactLedger?.pendingCount !== 0) {
      problems.push("ready route should have exact ledger pendingCount 0");
    }
    if (report.currentEvidence?.exactLedger?.canOpenOutcomeGate !== true) {
      problems.push("exact ledger should open only the separate TWII outcome gate candidate route");
    }
    if (report.currentEvidence?.bridge?.canOpenTwiiSourceRightsOutcomeGate !== true) {
      problems.push("bridge should open only the separate TWII source-rights outcome gate candidate route");
    }
    if (report.pmRoute?.nextAction !== "prepare_separate_twii_source_rights_outcome_gate_candidate") {
      problems.push("ready route should prepare the separate TWII source-rights outcome gate candidate");
    }
    for (const command of [
      "cmd.exe /c npm run check:a1-source-rights-readiness-summary",
      "cmd.exe /c npm run check:twii-source-rights-outcome-gate-bridge",
      "cmd.exe /c npm run report:a1-source-rights-next-action"
    ]) {
      if (!report.pmRoute?.commands?.includes(command)) problems.push(`ready route missing command ${command}`);
    }
  } else {
    if (report.currentEvidence?.exactLedger?.acceptedCount !== 0) {
      problems.push("blocked exact ledger acceptedCount should currently be 0");
    }
    if (report.currentEvidence?.exactLedger?.pendingCount !== 4) {
      problems.push("blocked exact ledger pendingCount should currently be 4");
    }
    if (report.currentEvidence?.exactLedger?.canOpenOutcomeGate !== false) {
      problems.push("blocked exact ledger must not open the TWII outcome gate yet");
    }
    if (report.currentEvidence?.bridge?.canOpenTwiiSourceRightsOutcomeGate !== false) {
      problems.push("blocked bridge must not open the TWII source-rights outcome gate yet");
    }
    if (report.pmRoute?.nextAction !== "keep_twii_outcome_gate_closed_and_wait_for_all_four_no_secret_slots") {
      problems.push("blocked route should keep TWII outcome gate closed");
    }
    if (!report.pmRoute?.commands?.includes("cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route")) {
      problems.push("blocked route should return PM to the A1 classification route");
    }
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  for (const sourceReport of [
    "a1SourceRightsReadinessSummary",
    "twiiSourceRightsOutcomeGateBridge",
    "a1SourceRightsNextAction"
  ]) {
    if (!report.sourceReports?.[sourceReport]?.parsedJson) {
      problems.push(`sourceReports.${sourceReport} should parse`);
    }
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
      guardedStatus: "a1_twii_outcome_gate_candidate_route_ready",
      reportStatus: report.status,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
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
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /source rights (are )?approved/iu,
    /candidate generation is approved/iu,
    /row coverage points awarded/iu
  ];
}
