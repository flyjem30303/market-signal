import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const summaryPath = args["summary-path"];
const outputPath =
  args.out ?? path.join("tmp", "twii-bounded-data-acceptance-post-run-review-result.json");

if (!summaryPath) {
  problems.push("summary-path is required");
}

const summary = summaryPath ? readJson(summaryPath) : {};

if (summary.status !== "twii_bounded_data_acceptance_attempt_dry_run_ready_no_write") {
  problems.push("summary.status must be twii_bounded_data_acceptance_attempt_dry_run_ready_no_write");
}
if (summary.mode !== "no-write-preview") problems.push("summary.mode must be no-write-preview");
if (summary.targetLane !== "TWII") problems.push("summary.targetLane must be TWII");
if (summary.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("summary.targetScope must be twii_index_daily_prices_missing_rows");
}
if (summary.candidateArtifact?.rawContentRead !== false) problems.push("candidate artifact raw content must not be read");
if (summary.candidateArtifact?.rawContentParsed !== false) problems.push("candidate artifact raw content must not be parsed");
if (summary.candidateArtifact?.rawPayloadPrinted !== false) problems.push("candidate raw payload must not be printed");
if (summary.dryRunResult?.candidateRowsAcceptedNow !== false) problems.push("candidateRowsAcceptedNow must be false");
if (summary.dryRunResult?.dailyPricesMutated !== false) problems.push("dailyPricesMutated must be false");
if (summary.dryRunResult?.stagingRowsCreated !== false) problems.push("stagingRowsCreated must be false");
if (summary.dryRunResult?.rowCoverageScoringAllowed !== false) problems.push("rowCoverageScoringAllowed must be false");
if (summary.dryRunResult?.publicPromotionAllowed !== false) problems.push("publicPromotionAllowed must be false");

assertSafety(summary);

const reviewResult = {
  status: problems.length === 0 ? "twii_bounded_data_acceptance_post_run_review_accepted_no_write" : "blocked",
  outcome: problems.length === 0 ? "accepted" : "blocked",
  summaryPath: summaryPath ?? null,
  reviewedStatus: summary.status ?? null,
  reviewedMode: summary.mode ?? null,
  acceptedMeaning:
    "The sanitized dry-run summary preserves no-write boundaries only; it does not approve data acceptance, row coverage scoring, Supabase activity, daily_prices mutation, public source promotion, or real score.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateArtifactContentRead: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  nextAllowedStep:
    problems.length === 0
      ? "PM may prepare a separate CEO-named bounded no-write attempt review packet only; write, scoring, promotion, and real source remain blocked."
      : "Repair the dry-run summary or wrapper output before any next attempt review.",
  problems
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(reviewResult, null, 2)}\n`);
console.log(JSON.stringify(reviewResult, null, 2));

if (problems.length > 0) process.exit(1);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("summary safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateArtifactContentRead",
    "candidateRowsAccepted",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`summary.safety.${key} must be false`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push("summary-path must point to valid JSON");
    return {};
  }
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}
