import fs from "node:fs";
import path from "node:path";

const inputPath = process.env.A1_FULL_TWSE_EQUITY_CANDIDATE_ARTIFACT_PATH ?? latestCandidatePath();
const artifact = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const rows = Array.isArray(artifact.candidatePrices) ? artifact.candidatePrices : [];
const dedupedRows = [];
const seen = new Set();
let duplicateSymbolDateRowsRemoved = 0;

for (const row of rows) {
  const key = `${row.symbol}|${row.trade_date}`;
  if (seen.has(key)) {
    duplicateSymbolDateRowsRemoved += 1;
    continue;
  }
  seen.add(key);
  dedupedRows.push(row);
}

const cleaned = {
  ...artifact,
  cleanup: {
    sourceArtifactPath: inputPath,
    duplicateSymbolDateRowsRemoved,
    rowsBeforeCleanup: rows.length,
    rowsAfterCleanup: dedupedRows.length,
    sourcePayloadStored: false,
    sourceUrlPayloadPrinted: false,
    stockIdListPrinted: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    dailyPricesMutation: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  candidateRun: {
    ...artifact.candidateRun,
    total_candidate_row_count: dedupedRows.length,
    duplicate_trade_dates: 0,
    review_status: "pending_post_run_review",
    decision: "candidate_artifact_cleaned_no_staging_write"
  },
  candidatePrices: dedupedRows
};

const outputPath = inputPath.replace(/-candidate\.json$/u, "-cleaned-candidate.json");
fs.writeFileSync(outputPath, `${JSON.stringify(cleaned, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      status: "a1_full_twse_equity_candidate_artifact_cleaned",
      inputPath,
      outputPath,
      rowsBeforeCleanup: rows.length,
      rowsAfterCleanup: dedupedRows.length,
      duplicateSymbolDateRowsRemoved,
      filesWritten: true,
      sqlExecuted: false,
      supabaseConnectionAttempted: false,
      supabaseWrite: false,
      stagingRowsCreated: false,
      dailyPricesMutation: false,
      sourcePayloadStored: false,
      sourceUrlPayloadPrinted: false,
      stockIdListPrinted: false,
      secretsPrinted: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function latestCandidatePath() {
  const dir = "tmp/a1-full-twse-equity-candidates";
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith("-candidate.json") && !file.endsWith("-cleaned-candidate.json"))
    .sort();
  if (files.length === 0) throw new Error(`No source candidate artifacts found in ${dir}`);
  return path.join(dir, files.at(-1));
}
