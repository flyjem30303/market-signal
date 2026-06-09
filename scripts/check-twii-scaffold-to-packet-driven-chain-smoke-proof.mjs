import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/run-twii-scaffold-to-packet-driven-chain-smoke-proof.mjs";
const docPath = "docs/TWII_SCAFFOLD_TO_PACKET_DRIVEN_CHAIN_SMOKE_PROOF.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const artifactPath = path.join(tmpDir, "twii-scaffold-chain-smoke-proof-artifact.valid.json");
const outDir = path.join(tmpDir, "twii-scaffold-chain-smoke-proof");

const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(artifactPath, `${JSON.stringify(validArtifact(), null, 2)}\n`);

const result = spawnSync(
  process.execPath,
  [
    runnerPath,
    "--candidate-artifact-path",
    artifactPath,
    "--attempt-id",
    "twii-scaffold-chain-smoke-proof-check",
    "--decision-id",
    "pm-ceo-smoke-proof-check",
    "--decision-summary",
    "Synthetic checker decision for scaffold to packet-driven no-write chain.",
    "--out-dir",
    outDir
  ],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);

const proof = parseJson(result.stdout ?? "", "smoke proof stdout");
if (result.status !== 0) problems.push("smoke proof runner must exit 0 for valid synthetic artifact");
if (proof.status !== "twii_scaffold_to_packet_driven_chain_smoke_proof_completed_no_write") {
  problems.push("smoke proof must complete no-write");
}
if (proof.outcome !== "accepted_no_write_smoke_proof") problems.push("smoke proof outcome must be accepted");
if (proof.executedSteps?.scaffoldRenderer !== true) problems.push("scaffold renderer must execute");
if (proof.executedSteps?.packetDrivenChain !== true) problems.push("packet-driven chain must execute");
if (proof.reviewedStatuses?.scaffoldStatus !== "twii_bounded_named_packet_scaffold_rendered_for_no_write_chain") {
  problems.push("proof must include rendered scaffold status");
}
if (proof.reviewedStatuses?.packetDrivenChainStatus !== "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write") {
  problems.push("proof must include packet-driven chain completion status");
}
assertSafety(proof, "smoke proof");

if (
  pkg.scripts?.["run:twii-scaffold-to-packet-driven-chain-smoke-proof"] !==
  `node ${runnerPath}`
) {
  problems.push(`${packagePath} missing run:twii-scaffold-to-packet-driven-chain-smoke-proof`);
}
if (
  pkg.scripts?.["check:twii-scaffold-to-packet-driven-chain-smoke-proof"] !==
  "node scripts/check-twii-scaffold-to-packet-driven-chain-smoke-proof.mjs"
) {
  problems.push(`${packagePath} missing check:twii-scaffold-to-packet-driven-chain-smoke-proof`);
}

for (const phrase of [
  "TWII Scaffold To Packet-Driven Chain Smoke Proof",
  "twii_scaffold_to_packet_driven_chain_smoke_proof_ready",
  "twii_scaffold_to_packet_driven_chain_smoke_proof_completed_no_write",
  "run:twii-scaffold-to-packet-driven-chain-smoke-proof",
  "accepted_no_write_smoke_proof",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII scaffold-to-packet-driven chain smoke proof slice",
  "docs/TWII_SCAFFOLD_TO_PACKET_DRIVEN_CHAIN_SMOKE_PROOF.md",
  "twii_scaffold_to_packet_driven_chain_smoke_proof_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SCAFFOLD_TO_PACKET_DRIVEN_CHAIN_SMOKE_PROOF.md` is `accepted` as TWII scaffold-to-packet-driven chain smoke proof",
  "twii_scaffold_to_packet_driven_chain_smoke_proof_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-scaffold-to-packet-driven-chain-smoke-proof.mjs",
  "name: \"twii-scaffold-to-packet-driven-chain-smoke-proof\"",
  "\"twii-scaffold-to-packet-driven-chain-smoke-proof\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runnerPath, runnerSource],
  [docPath, doc],
  ["smoke proof stdout", result.stdout ?? ""]
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
      guardedStatus: "twii_scaffold_to_packet_driven_chain_smoke_proof_ready",
      proofStatus: proof.status
    },
    null,
    2
  )
);

function validArtifact() {
  return {
    artifactId: "twii-scaffold-chain-smoke-proof-check",
    lane: "TWII",
    assetType: "index",
    symbol: "TWII",
    scope: "twii_index_daily_prices_missing_rows",
    sourceLane: "official-exchange-index",
    sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review",
    fieldContractVersion: "twii-v1",
    coverageWindowSessions: 60,
    alreadyObservedRows: 0,
    candidateMissingRows: 60,
    expectedRows: 60,
    reviewOutputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    aggregateValidation: {
      expectedRows: 60,
      candidateRows: 60,
      duplicateRows: 0,
      rejectedRows: 0,
      missingRows: 0,
      fieldNames: ["tradeDate", "open", "high", "low", "close", "volume"],
      validationStatus: "pending_pm_review"
    }
  };
}

function assertSafety(output, label) {
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
