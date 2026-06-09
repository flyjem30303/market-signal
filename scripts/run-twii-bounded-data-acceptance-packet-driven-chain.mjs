import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const packetPath = args["packet-path"];
const outDir = args["out-dir"] ?? "tmp";

if (!packetPath) problems.push("packet-path is required");

const packet = packetPath ? readJson(packetPath) : {};
const attemptId = packet.attemptId;
const candidateArtifactPath = packet.candidateArtifactPath;
const mode = packet.mode;
const safeAttemptId = safeFileStamp(attemptId ?? "missing");
const packetGateOutputPath = path.join(outDir, `twii-bounded-packet-gate-${safeAttemptId}.json`);
const chainSummaryPath = path.join(outDir, `twii-bounded-data-acceptance-chain-${safeAttemptId}.json`);
const packetDrivenSummaryPath = path.join(outDir, `twii-bounded-packet-driven-chain-${safeAttemptId}.json`);

let packetGate = {};
let chain = {};
let packetGateExitCode = null;
let chainExitCode = null;

if (problems.length === 0) {
  const packetGateResult = spawnSync(
    process.execPath,
    [
      "scripts/report-twii-bounded-data-acceptance-named-attempt-packet.mjs",
      "--packet-path",
      packetPath,
      "--out",
      packetGateOutputPath
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  packetGateExitCode = packetGateResult.status;
  packetGate = parseJson(packetGateResult.stdout ?? "", "packet gate stdout");
  if (packetGateResult.status !== 0) problems.push("named attempt packet gate failed");
}

if (problems.length === 0) {
  const chainResult = spawnSync(
    process.execPath,
    [
      "scripts/run-twii-bounded-data-acceptance-dry-run-review-chain.mjs",
      "--attempt-id",
      attemptId,
      "--candidate-artifact-path",
      candidateArtifactPath,
      "--mode",
      mode,
      "--out-dir",
      outDir
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  chainExitCode = chainResult.status;
  chain = parseJson(chainResult.stdout ?? "", "chain stdout");
  if (chainResult.status !== 0) problems.push("dry-run review chain failed");
}

const summary = {
  status:
    problems.length === 0 &&
    packetGate.status === "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain" &&
    chain.status === "twii_bounded_data_acceptance_dry_run_review_chain_completed_no_write"
      ? "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write"
      : "blocked",
  outcome: problems.length === 0 ? "accepted_no_write_packet_driven_chain" : "blocked",
  packetPath: packetPath ?? null,
  attemptId: attemptId ?? null,
  mode: mode ?? null,
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  candidateArtifactBasename: candidateArtifactPath ? path.basename(candidateArtifactPath) : null,
  outputs: {
    packetGateOutputPath,
    chainSummaryPath,
    packetDrivenSummaryPath
  },
  executedSteps: {
    namedAttemptPacketGate: packetGateExitCode === 0,
    dryRunReviewChain: chainExitCode === 0
  },
  reviewedStatuses: {
    namedAttemptPacketGateStatus: packetGate.status ?? null,
    dryRunReviewChainStatus: chain.status ?? null
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
  stopLine:
    "No SQL, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, candidate row acceptance, row coverage scoring, source promotion, or scoreSource=real occurred.",
  problems
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(packetDrivenSummaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));

if (summary.status === "blocked") process.exit(1);

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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push("packet-path must point to valid JSON");
    return {};
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}
