import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md";
const ledgerPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md";
const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const ledger = read(ledgerPath);
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
  packageJson.scripts?.["check:a1-exact-source-rights-evidence-worksheet"] !==
  "node scripts/check-a1-exact-source-rights-evidence-worksheet.mjs"
) {
  problems.push(`${packagePath} missing check:a1-exact-source-rights-evidence-worksheet`);
}

for (const phrase of [
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

for (const [filePath, source] of [
  [docPath, doc],
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
