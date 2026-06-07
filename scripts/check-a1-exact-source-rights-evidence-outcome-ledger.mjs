import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md";
const mapPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_INTAKE_COMMAND_MAP.md";
const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const reportPath = "scripts/report-a1-exact-source-rights-evidence-outcome-ledger.mjs";
const recorderPath = "scripts/record-a1-exact-source-rights-evidence-outcome.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const map = read(mapPath);
const reportSource = read(reportPath);
const recorder = read(recorderPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const outcomeData = JSON.parse(read(outcomePath));

const expectedSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "etf-legal-use-evidence",
  "etf-redistribution-evidence",
  "etf-attribution-retention-evidence",
  "etf-derived-analysis-rate-limit-evidence",
  "etf-field-contract-evidence",
  "etf-source-comparison-evidence"
];

for (const phrase of [
  "Status: `a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence`",
  "CEO makes the A1 exact source-rights evidence intake recordable without opening remote execution",
  "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json",
  "TWII slots: `4/4` pending",
  "ETF slots: `6/6` pending",
  "`accepted` classification means only that PM can consider the next named source-rights outcome gate",
  "cmd.exe /c npm run report:a1-exact-source-rights-evidence-outcome-ledger",
  "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome",
  "continue_public_beta_runtime_mainline_mock_visible",
  "publicDataSource=mock",
  "scoreSource=mock",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const slot of expectedSlots) {
  if (!doc.includes(slot)) problems.push(`${docPath} missing slot: ${slot}`);
  if (!map.includes(slot)) problems.push(`${mapPath} missing slot: ${slot}`);
}

if (!Array.isArray(outcomeData.outcomes) || outcomeData.outcomes.length !== expectedSlots.length) {
  problems.push(`${outcomePath} expected ${expectedSlots.length} outcomes`);
} else {
  for (const slot of expectedSlots) {
    const item = outcomeData.outcomes.find((entry) => entry.id === slot);
    if (!item) {
      problems.push(`${outcomePath} missing ${slot}`);
      continue;
    }
    if (!["TWII", "ETF"].includes(item.lane)) problems.push(`${outcomePath} invalid lane for ${slot}`);
    if (!["pending", "accepted", "rejected", "needs_bounded_repair", "blocked", "unavailable"].includes(item.classification)) {
      problems.push(`${outcomePath} invalid classification for ${slot}`);
    }
    if (item.classification === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
      problems.push(`${outcomePath} pending must use not_recorded/null for ${slot}`);
    }
    if (item.pmQuestionResolved !== false && item.classification === "pending") {
      problems.push(`${outcomePath} pending pmQuestionResolved must be false for ${slot}`);
    }
    for (const field of ["sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk", "nextGateCandidate"]) {
      if (typeof item[field] !== "string" || item[field].trim().length < 7) {
        problems.push(`${outcomePath} ${slot} missing ${field}`);
      }
    }
  }
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest A1 exact source-rights evidence outcome ledger slice"],
  [statusPath, status, "a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence"],
  [boardPath, board, "`docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md` is `accepted` as the PM/A1 recordable exact evidence outcome ledger"],
  [boardPath, board, "a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:a1-exact-source-rights-evidence-outcome-ledger"] !==
  "node scripts/report-a1-exact-source-rights-evidence-outcome-ledger.mjs"
) {
  problems.push(`${packagePath} missing report script`);
}
if (
  pkg.scripts?.["record:a1-exact-source-rights-evidence-outcome"] !==
  "node scripts/record-a1-exact-source-rights-evidence-outcome.mjs"
) {
  problems.push(`${packagePath} missing record script`);
}
if (
  pkg.scripts?.["check:a1-exact-source-rights-evidence-outcome-ledger"] !==
  "node scripts/check-a1-exact-source-rights-evidence-outcome-ledger.mjs"
) {
  problems.push(`${packagePath} missing check script`);
}

for (const phrase of [
  "scripts/check-a1-exact-source-rights-evidence-outcome-ledger.mjs",
  "name: \"a1-exact-source-rights-evidence-outcome-ledger\"",
  "\"a1-exact-source-rights-evidence-outcome-ledger\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const reportRun = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-exact-source-rights-evidence-outcome-ledger"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const dryRun = spawnSync(
  "cmd.exe",
  [
    "/c",
    "npm",
    "run",
    "record:a1-exact-source-rights-evidence-outcome",
    "--",
    "--dry-run",
    "--id",
    "etf-legal-use-evidence",
    "--classification",
    "blocked",
    "--recordedBy",
    "PM",
    "--safe-summary",
    "Dry-run only no-secret summary.",
    "--source-reference-label",
    "internal-review-label",
    "--remaining-risk",
    "Rights still blocked.",
    "--next-gate-candidate",
    "blocked"
  ],
  { cwd: process.cwd(), encoding: "utf8", timeout: 120000, windowsHide: true }
);

const report = parseJson(reportRun.stdout ?? "");
const dryRunReport = parseJson(dryRun.stdout ?? "");

if (reportRun.status !== 0 || !report) problems.push("ledger report should emit JSON");
if (dryRun.status !== 0 || !dryRunReport) problems.push("recorder dry-run should emit JSON");

if (report) {
  if (report.status !== "awaiting_a1_exact_source_rights_evidence") problems.push(`unexpected report status ${report.status}`);
  if (report.canOpenTwiiSourceRightsOutcomeGate !== false) problems.push("TWII gate must remain closed");
  if (report.canOpenEtfSourceRightsOutcomeGate !== false) problems.push("ETF gate must remain closed");
  if (report.nextAllowedRoute !== "continue_public_beta_runtime_mainline_mock_visible") {
    problems.push("next route should keep public beta runtime mainline mock visible");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock" || report.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("runtime boundary must remain mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourcePayloadStored",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`report safety ${flag} must be false`);
  }
}

if (dryRunReport) {
  if (dryRunReport.status !== "dry_run") problems.push("recorder default checked mode must be dry_run");
  if (dryRunReport.safety?.publicDataSource !== "mock" || dryRunReport.safety?.scoreSource !== "mock") {
    problems.push("recorder runtime boundary must remain mock");
  }
  if (dryRunReport.safety?.supabaseWritesEnabled !== false || dryRunReport.safety?.supabaseReadsEnabled !== false) {
    problems.push("recorder dry-run must not enable Supabase");
  }
}

for (const [filePath, source] of [
  [docPath, doc],
  [reportPath, reportSource],
  [recorderPath, recorder],
  [JSON.stringify(outcomeData), JSON.stringify(outcomeData)]
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
      guardedStatus: "a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence",
      reportStatus: report.status,
      recorderDryRunStatus: dryRunReport.status
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
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
