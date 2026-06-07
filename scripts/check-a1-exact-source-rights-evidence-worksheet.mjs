import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md";
const ledgerPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md";
const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const reportPath = "scripts/report-a1-exact-source-rights-evidence-worksheet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const ledger = read(ledgerPath);
const reportSource = read(reportPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const board = read(boardPath);
const outcomeData = JSON.parse(read(outcomePath));

const slots = [
  ["vendor-terms-evidence", "TWII", "twii_source_rights_outcome_gate"],
  ["internal-feed-owner-evidence", "TWII", "twii_source_rights_outcome_gate"],
  ["field-contract-evidence", "TWII", "twii_source_rights_outcome_gate"],
  ["asset-mapping-evidence", "TWII", "twii_source_rights_outcome_gate"],
  ["etf-legal-use-evidence", "ETF", "etf_source_rights_outcome_gate"],
  ["etf-redistribution-evidence", "ETF", "etf_source_rights_outcome_gate"],
  ["etf-attribution-retention-evidence", "ETF", "etf_source_rights_outcome_gate"],
  ["etf-derived-analysis-rate-limit-evidence", "ETF", "etf_source_rights_outcome_gate"],
  ["etf-field-contract-evidence", "ETF", "etf_source_rights_outcome_gate"],
  ["etf-source-comparison-evidence", "ETF", "etf_source_rights_outcome_gate"]
];

for (const phrase of [
  "Status: `a1_exact_source_rights_evidence_worksheet_ready_pending_fill`",
  "CEO turns the existing exact source-rights evidence ledger into a fillable no-secret worksheet",
  "This worksheet does not approve source rights",
  "Evidence slot id",
  "Source reference label",
  "Safe evidence summary",
  "Remaining risk",
  "PM may classify a slot as `accepted` only when",
  "PM should classify a slot as `blocked`, `rejected`, `unavailable`, or `needs_bounded_repair`",
  "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome",
  "cmd.exe /c npm run report:a1-source-rights-next-action",
  "publicDataSource=mock",
  "scoreSource=mock",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [slot, lane, gate] of slots) {
  if (!doc.includes(slot)) problems.push(`${docPath} missing slot ${slot}`);
  if (!doc.includes(gate)) problems.push(`${docPath} missing gate ${gate}`);
  if (!ledger.includes(slot)) problems.push(`${ledgerPath} missing slot ${slot}`);

  const entry = outcomeData.outcomes?.find((item) => item.id === slot);
  if (!entry) {
    problems.push(`${outcomePath} missing slot ${slot}`);
    continue;
  }
  if (entry.lane !== lane) problems.push(`${outcomePath} ${slot} expected lane ${lane}`);
  if (entry.classification !== "pending") problems.push(`${outcomePath} ${slot} should still be pending`);
}

if (
  packageJson.scripts?.["report:a1-exact-source-rights-evidence-worksheet"] !==
  "node scripts/report-a1-exact-source-rights-evidence-worksheet.mjs"
) {
  problems.push(`${packagePath} missing report:a1-exact-source-rights-evidence-worksheet`);
}

if (
  packageJson.scripts?.["check:a1-exact-source-rights-evidence-worksheet"] !==
  "node scripts/check-a1-exact-source-rights-evidence-worksheet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-exact-source-rights-evidence-worksheet`);
}

for (const phrase of [
  "scripts/report-a1-exact-source-rights-evidence-worksheet.mjs",
  "scripts/check-a1-exact-source-rights-evidence-worksheet.mjs",
  "name: \"a1-exact-source-rights-evidence-worksheet\"",
  "\"a1-exact-source-rights-evidence-worksheet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest A1 exact source-rights evidence worksheet slice"],
  [statusPath, status, "a1_exact_source_rights_evidence_worksheet_ready_pending_fill"],
  [boardPath, board, "`docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md` is `accepted` as the PM/A1 fillable exact evidence worksheet"],
  [boardPath, board, "a1_exact_source_rights_evidence_worksheet_ready_pending_fill"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "source-rights approval",
  "remote source probing",
  "market-data fetch",
  "market-data ingestion",
  "raw market-data storage",
  "candidate artifact generation from source data",
  "SQL execution",
  "Supabase connection",
  "Supabase read",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw payload output",
  "row payload output",
  "stock id payload output",
  "secret output",
  "row coverage point award",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "public real-data claim",
  "investment advice claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop ${phrase}`);
}

const reportRun = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-exact-source-rights-evidence-worksheet"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "");

if (reportRun.status !== 0 || !report) {
  problems.push("worksheet report should emit JSON");
} else {
  if (report.status !== "pending_fill_handoff_ready") problems.push(`unexpected report status ${report.status}`);
  if (report.pendingCount !== slots.length) problems.push(`expected ${slots.length} pending report slots`);
  if (report.pendingByLane?.TWII?.length !== 4) problems.push("report should group four pending TWII slots");
  if (report.pendingByLane?.ETF?.length !== 6) problems.push("report should group six pending ETF slots");
  if (report.recommendedBatch?.batchId !== "twii_source_rights_unblock_first_batch") {
    problems.push("report should recommend the TWII source-rights unblock first batch");
  }
  if (report.recommendedBatch?.lane !== "TWII") problems.push("recommended batch lane should be TWII");
  if (report.recommendedBatch?.slotIds?.length !== 4) problems.push("recommended TWII batch should include four slots");
  if (report.recommendedBatch?.nextAfterBatch !== "cmd.exe /c npm run report:a1-source-rights-readiness-summary") {
    problems.push("recommended batch should route back to the A1 readiness summary");
  }
  if (report.recommendedBatch?.executable !== false) problems.push("recommended batch must be non-executable");
  if (!Array.isArray(report.pendingSlots) || report.pendingSlots.length !== slots.length) {
    problems.push("report pendingSlots should match expected slots");
  } else {
    for (const [slot, lane, gate] of slots) {
      const item = report.pendingSlots.find((entry) => entry.id === slot);
      if (!item) {
        problems.push(`report missing pending slot ${slot}`);
        continue;
      }
      if (item.lane !== lane) problems.push(`report ${slot} expected lane ${lane}`);
      if (item.nextGateCandidate !== gate) problems.push(`report ${slot} expected gate ${gate}`);
      for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
        if (!item.requiredFields?.includes(field)) problems.push(`report ${slot} missing required field ${field}`);
      }
      if (!item.dryRunCommandTemplate?.includes("--dry-run")) problems.push(`report ${slot} must be dry-run`);
      if (item.dryRunCommandTemplate?.includes("--apply")) problems.push(`report ${slot} must not include apply`);
    }
  }
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("report runtime boundary must remain mock");
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
    if (report.safety?.[flag] !== false) problems.push(`report safety ${flag} must be false`);
  }
}

for (const [filePath, source] of [
  [docPath, doc],
  [reportPath, reportSource],
  [outcomePath, JSON.stringify(outcomeData)]
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
      guardedStatus: "a1_exact_source_rights_evidence_worksheet_ready_pending_fill",
      checkedSlots: slots.length,
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
