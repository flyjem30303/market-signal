import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const candidateArtifactPath = args["candidate-artifact-path"];
const attemptId = args["attempt-id"];
const decisionId = args["decision-id"];
const decisionSummary = args["decision-summary"];
const outDir = args["out-dir"] ?? "tmp";

if (!candidateArtifactPath) problems.push("candidate-artifact-path is required");
if (!attemptId || !/^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(attemptId)) {
  problems.push("attempt-id is required and must be a safe 3-81 character id");
}
if (!safeText(decisionId)) problems.push("decision-id is required");
if (!safeText(decisionSummary)) problems.push("decision-summary is required");

const safeAttemptId = safeFileStamp(attemptId ?? "missing");
const packetPath = path.join(outDir, `twii-bounded-named-attempt-packet-${safeAttemptId}.json`);
const smokeProofPath = path.join(outDir, `twii-scaffold-to-packet-driven-chain-smoke-proof-${safeAttemptId}.json`);

let scaffold = {};
let chain = {};
let scaffoldExitCode = null;
let chainExitCode = null;

if (problems.length === 0) {
  const scaffoldRun = spawnSync(
    process.execPath,
    [
      "scripts/render-twii-bounded-data-acceptance-named-packet-scaffold.mjs",
      "--candidate-artifact-path",
      candidateArtifactPath,
      "--attempt-id",
      attemptId,
      "--decision-id",
      decisionId,
      "--decision-summary",
      decisionSummary,
      "--out",
      packetPath
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  scaffoldExitCode = scaffoldRun.status;
  scaffold = parseJson(scaffoldRun.stdout ?? "", "scaffold stdout");
  if (scaffoldRun.status !== 0) problems.push("named packet scaffold renderer failed");
}

if (problems.length === 0) {
  const chainRun = spawnSync(
    process.execPath,
    [
      "scripts/run-twii-bounded-data-acceptance-packet-driven-chain.mjs",
      "--packet-path",
      packetPath,
      "--out-dir",
      outDir
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  chainExitCode = chainRun.status;
  chain = parseJson(chainRun.stdout ?? "", "packet-driven chain stdout");
  if (chainRun.status !== 0) problems.push("packet-driven chain failed");
}

const proof = {
  status:
    problems.length === 0 &&
    scaffold.status === "twii_bounded_named_packet_scaffold_rendered_for_no_write_chain" &&
    chain.status === "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write"
      ? "twii_scaffold_to_packet_driven_chain_smoke_proof_completed_no_write"
      : "blocked",
  outcome: problems.length === 0 ? "accepted_no_write_smoke_proof" : "blocked",
  attemptId: attemptId ?? null,
  candidateArtifactPathProvided: Boolean(candidateArtifactPath),
  outputs: {
    packetPath,
    smokeProofPath,
    packetDrivenSummaryPath: chain.outputs?.packetDrivenSummaryPath ?? null
  },
  executedSteps: {
    scaffoldRenderer: scaffoldExitCode === 0,
    packetDrivenChain: chainExitCode === 0
  },
  reviewedStatuses: {
    scaffoldStatus: scaffold.status ?? null,
    packetDrivenChainStatus: chain.status ?? null
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
fs.writeFileSync(smokeProofPath, `${JSON.stringify(proof, null, 2)}\n`);
console.log(JSON.stringify(proof, null, 2));

if (proof.status === "blocked") process.exit(1);

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

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 240;
}

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}
