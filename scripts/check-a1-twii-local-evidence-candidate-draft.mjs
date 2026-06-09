import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const reportPath = "scripts/report-a1-twii-local-evidence-candidate-draft.mjs";
const checkPath = "scripts/check-a1-twii-local-evidence-candidate-draft.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const ledgerPath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const ledgerBefore = read(ledgerPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "a1_twii_local_evidence_candidate_draft"],
  [reportPath, reportSource, "move_a1_from_blank_waiting_to_pm_classifiable_local_no_secret_draft"],
  [reportPath, reportSource, "vendor-terms-evidence"],
  [reportPath, reportSource, "internal-feed-owner-evidence"],
  [reportPath, reportSource, "field-contract-evidence"],
  [reportPath, reportSource, "asset-mapping-evidence"],
  [reportPath, reportSource, "suggestedPmClassification"],
  [reportPath, reportSource, "needs_bounded_repair"],
  [reportPath, reportSource, "blocked"],
  [reportPath, reportSource, "This report does not record A1 evidence."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "a1_twii_local_evidence_candidate_draft_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:a1-twii-local-evidence-candidate-draft"],
  [packagePath, JSON.stringify(pkg), "check:a1-twii-local-evidence-candidate-draft"],
  [statusPath, status, "Latest A1 TWII local evidence candidate draft slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-twii-local-evidence-candidate-draft"] !==
  "node scripts/report-a1-twii-local-evidence-candidate-draft.mjs"
) {
  problems.push(`${packagePath} missing report:a1-twii-local-evidence-candidate-draft`);
}

if (
  pkg.scripts?.["check:a1-twii-local-evidence-candidate-draft"] !==
  "node scripts/check-a1-twii-local-evidence-candidate-draft.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twii-local-evidence-candidate-draft`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-twii-local-evidence-candidate-draft"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:a1-twii-local-evidence-candidate-draft should exit 0");
if (!report) {
  problems.push("report:a1-twii-local-evidence-candidate-draft should emit JSON");
} else {
  if (report.status !== "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification") {
    problems.push(`unexpected report.status ${String(report.status)}`);
  }
  if (report.currentLedgerState?.pendingCount !== 4) {
    problems.push("current ledger should still have four pending TWII slots");
  }
  if (report.currentLedgerState?.ledgerModified !== false) {
    problems.push("report must declare ledgerModified false");
  }
  if (!Array.isArray(report.candidateSlots) || report.candidateSlots.length !== 4) {
    problems.push("candidateSlots should contain exactly four slots");
  }

  const slots = new Map(report.candidateSlots?.map((slot) => [slot.evidenceSlotId, slot]) ?? []);
  for (const slotId of [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]) {
    const slot = slots.get(slotId);
    if (!slot) {
      problems.push(`missing candidate slot ${slotId}`);
      continue;
    }
    for (const field of ["sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk", "suggestedPmClassification", "reason"]) {
      if (!slot[field]) problems.push(`${slotId} missing ${field}`);
    }
    if (slot.noSecret !== true) problems.push(`${slotId} must be noSecret true`);
    if (slot.forbiddenContentIncluded !== false) problems.push(`${slotId} must not include forbidden content`);
    if (!["needs_bounded_repair", "blocked"].includes(slot.suggestedPmClassification)) {
      problems.push(`${slotId} suggestedPmClassification must be repair/block only`);
    }
    if (slot.nextGateCandidate === "twii_source_rights_outcome_gate") {
      problems.push(`${slotId} must not point directly to source-rights outcome gate from this draft`);
    }
  }

  if (!report.pmClassificationOptions?.includes("accepted")) problems.push("pmClassificationOptions should include accepted");
  if (!report.pmClassificationOptions?.includes("needs_bounded_repair")) {
    problems.push("pmClassificationOptions should include needs_bounded_repair");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");

  for (const [flag, expected] of Object.entries({
    candidateArtifactGenerated: false,
    connectionAttempted: false,
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    publicSourcePromoted: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`safety.${flag} must be ${String(expected)}`);
  }
}

if (read(ledgerPath) !== ledgerBefore) {
  problems.push("report must not modify the real A1 evidence ledger");
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} forbidden pattern ${String(pattern)}`);
  if (pattern.test(run.stdout ?? "")) problems.push(`report output forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a1_twii_local_evidence_candidate_draft_guard_ready",
      candidateSlotCount: report.candidateSlots.length,
      publicDataSource: report.runtimeBoundary.publicDataSource,
      scoreSource: report.runtimeBoundary.scoreSource
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
    /git",\s*"add"/iu,
    /git",\s*"commit"/iu,
    /git",\s*"push"/iu,
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /https:\/\/[a-z0-9-]+\.supabase\.co/iu,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /raw market payload approved/iu
  ];
}
