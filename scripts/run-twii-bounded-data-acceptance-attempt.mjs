import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const attemptId = args["attempt-id"];
const candidateArtifactPath = args["candidate-artifact-path"];
const mode = args.mode;
const outputPath =
  args.out ?? path.join("tmp", `twii-bounded-data-acceptance-attempt-${safeFileStamp(attemptId ?? "missing")}.json`);

if (!attemptId || !/^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(attemptId)) {
  problems.push("attempt-id is required and must be a safe 3-81 character id");
}
if (mode !== "no-write-preview") {
  problems.push("mode must be no-write-preview");
}
if (!candidateArtifactPath) {
  problems.push("candidate-artifact-path is required");
}

let artifactStats = null;
let artifactBasename = null;
if (candidateArtifactPath) {
  artifactBasename = path.basename(candidateArtifactPath);
  try {
    artifactStats = fs.statSync(candidateArtifactPath);
    if (!artifactStats.isFile()) problems.push("candidate-artifact-path must point to a local file");
  } catch {
    problems.push("candidate-artifact-path must point to an existing local file");
  }
}

const summary = {
  status: problems.length === 0 ? "twii_bounded_data_acceptance_attempt_dry_run_ready_no_write" : "blocked",
  mode: mode ?? null,
  attemptId: attemptId ?? null,
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  outputPath,
  candidateArtifact: {
    pathProvided: Boolean(candidateArtifactPath),
    basename: artifactBasename,
    exists: Boolean(artifactStats),
    byteSize: artifactStats?.size ?? null,
    modifiedTimeIso: artifactStats ? artifactStats.mtime.toISOString() : null,
    rawContentRead: false,
    rawContentParsed: false,
    rawPayloadPrinted: false
  },
  dryRunResult: {
    candidateRowsReviewed: 0,
    candidateRowsAcceptedNow: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    publicPromotionAllowed: false
  },
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
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    scoreSourceRealAllowed: false
  },
  postRunReviewShell: {
    requiredReviewStatus: "pending_pm_ceo_post_run_review",
    reviewTemplatePath: "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_POST_RUN_REVIEW_TEMPLATE.md",
    noWriteStopLine:
      "No SQL, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, candidate row acceptance, source promotion, or scoreSource=real occurred."
  },
  problems
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));

if (problems.length > 0) process.exit(1);

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

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}
