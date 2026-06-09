import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/run-twii-bounded-data-acceptance-packet-driven-chain.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_PACKET_DRIVEN_CHAIN.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const syntheticArtifactPath = path.join(tmpDir, "twii-bounded-packet-driven-synthetic-artifact.safe.json");
const packetPath = path.join(tmpDir, "twii-bounded-packet-driven-packet.safe.json");
const outDir = path.join(tmpDir, "twii-bounded-packet-driven-check");

const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(
  syntheticArtifactPath,
  `${JSON.stringify({ fixtureKind: "synthetic_packet_driven_metadata_only", candidateRows: [] }, null, 2)}\n`
);
fs.writeFileSync(
  packetPath,
  `${JSON.stringify(
    {
      packetKind: "twii_bounded_data_acceptance_named_attempt_packet",
      attemptId: "twii-packet-driven-check",
      candidateArtifactPath: syntheticArtifactPath,
      mode: "no-write-preview",
      targetLane: "TWII",
      targetScope: "twii_index_daily_prices_missing_rows",
      decisionReference: {
        decisionId: "pm-ceo-packet-driven-chain-check",
        owner: "CEO/PM",
        decisionStatus: "accepted_for_no_write_dry_run_chain",
        summary: "Synthetic checker packet for local packet-driven no-write chain."
      },
      commands: {
        chainCommand:
          "cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview",
        postRunReviewCommand:
          "cmd.exe /c npm run report:twii-bounded-data-acceptance-post-run-review -- --summary-path <SUMMARY_JSON_PATH>"
      },
      safety: safePacketSafety()
    },
    null,
    2
  )}\n`
);

const result = spawnSync(
  process.execPath,
  [runnerPath, "--packet-path", packetPath, "--out-dir", outDir],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);

const summary = parseJson(result.stdout ?? "", "packet-driven chain stdout");
if (result.status !== 0) problems.push("packet-driven chain must exit 0 for synthetic safe packet");
if (summary.status !== "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write") {
  problems.push("packet-driven chain must complete no-write");
}
if (summary.outcome !== "accepted_no_write_packet_driven_chain") {
  problems.push("packet-driven chain outcome must be accepted_no_write_packet_driven_chain");
}
if (summary.executedSteps?.namedAttemptPacketGate !== true) problems.push("packet gate must execute");
if (summary.executedSteps?.dryRunReviewChain !== true) problems.push("dry-run review chain must execute");
if (
  summary.reviewedStatuses?.namedAttemptPacketGateStatus !==
  "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain"
) {
  problems.push("summary must include accepted packet gate status");
}
if (
  summary.reviewedStatuses?.dryRunReviewChainStatus !==
  "twii_bounded_data_acceptance_dry_run_review_chain_completed_no_write"
) {
  problems.push("summary must include completed chain status");
}
assertSummarySafety(summary, "packet-driven summary");

if (
  pkg.scripts?.["run:twii-bounded-data-acceptance-packet-driven-chain"] !==
  `node ${runnerPath}`
) {
  problems.push(`${packagePath} missing run:twii-bounded-data-acceptance-packet-driven-chain`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-packet-driven-chain"] !==
  "node scripts/check-twii-bounded-data-acceptance-packet-driven-chain.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-packet-driven-chain`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Packet-Driven Chain",
  "twii_bounded_data_acceptance_packet_driven_chain_ready",
  "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write",
  "run:twii-bounded-data-acceptance-packet-driven-chain",
  "accepted_no_write_packet_driven_chain",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance packet-driven chain slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_PACKET_DRIVEN_CHAIN.md",
  "twii_bounded_data_acceptance_packet_driven_chain_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_PACKET_DRIVEN_CHAIN.md` is `accepted` as TWII bounded data acceptance packet-driven chain",
  "twii_bounded_data_acceptance_packet_driven_chain_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-packet-driven-chain.mjs",
  "name: \"twii-bounded-data-acceptance-packet-driven-chain\"",
  "\"twii-bounded-data-acceptance-packet-driven-chain\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runnerPath, runnerSource],
  [docPath, doc],
  ["packet-driven stdout", result.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "twii_bounded_data_acceptance_packet_driven_chain_ready",
      chainStatus: summary.status
    },
    null,
    2
  )
);

function safePacketSafety() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    sourcePayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  };
}

function assertSummarySafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
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
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u
  ];
}
