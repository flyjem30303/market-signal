import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-a1-twii-local-evidence-bounded-repair-request.mjs";
const checkPath = "scripts/check-a1-twii-local-evidence-bounded-repair-request.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const projectStatus = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "a1_twii_local_evidence_bounded_repair_request_ready"],
  [reportPath, reportSource, "convert_a1_local_draft_to_minimal_repair_questions"],
  [reportPath, reportSource, "Do not paste copied contract text"],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "a1_twii_local_evidence_bounded_repair_request_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:a1-twii-local-evidence-bounded-repair-request"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-local-evidence-bounded-repair-request"],
  [statusPath, projectStatus, "Latest A1 local evidence bounded repair request slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-twii-local-evidence-bounded-repair-request"] !==
  "node scripts/report-a1-twii-local-evidence-bounded-repair-request.mjs"
) {
  problems.push(`${packagePath} missing report:a1-twii-local-evidence-bounded-repair-request`);
}
if (
  pkg.scripts?.["check:a1-twii-local-evidence-bounded-repair-request"] !==
  "node scripts/check-a1-twii-local-evidence-bounded-repair-request.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-local-evidence-bounded-repair-request`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-twii-local-evidence-bounded-repair-request"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("bounded repair request report should exit 0");
if (!report) {
  problems.push("bounded repair request report should emit JSON");
} else {
  if (report.status !== "a1_twii_local_evidence_bounded_repair_request_ready") {
    problems.push(`unexpected status ${String(report.status)}`);
  }
  if (report.sourceDraft?.status !== "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification") {
    problems.push("sourceDraft must be the PM-classifiable local evidence draft");
  }
  if (!Array.isArray(report.repairRequests) || report.repairRequests.length !== 4) {
    problems.push("repairRequests must contain four TWII slots");
  } else {
    for (const request of report.repairRequests) {
      if (!["needs_bounded_repair", "blocked"].includes(request.currentDraftClassification)) {
        problems.push(`${request.evidenceSlotId} currentDraftClassification must stay repair/block`);
      }
      if (request.noSecretRequired !== true) {
        problems.push(`${request.evidenceSlotId} must require no-secret reply`);
      }
      if (!request.requestedSafeEvidenceSummary || !request.requestedRemainingRisk) {
        problems.push(`${request.evidenceSlotId} must include requested summary and risk prompts`);
      }
    }
  }
  if (!Array.isArray(report.copyableA1Request) || report.copyableA1Request.length < 16) {
    problems.push("copyableA1Request should include four reply blocks");
  }
  for (const flag of [
    "applyCommandEmitted",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "evidenceRecorded",
    "marketDataFetched",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourceRightsApproved",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must remain false`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
}

for (const pattern of [
  /--apply/iu,
  /createClient/iu,
  /\.from\(/iu,
  /\bfetch\(/iu,
  /scoreSource:\s*"real"/u,
  /publicDataSource:\s*"supabase"/u
]) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_twii_local_evidence_bounded_repair_request_guard_ready",
      repairRequestCount: report.repairRequests.length,
      publicDataSource: report.runtimeBoundary.publicDataSource,
      scoreSource: report.runtimeBoundary.scoreSource
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`${filePath} missing`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
