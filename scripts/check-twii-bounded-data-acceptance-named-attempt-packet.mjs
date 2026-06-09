import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-bounded-data-acceptance-named-attempt-packet.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_NAMED_ATTEMPT_PACKET_GATE.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const syntheticArtifactPath = path.join(tmpDir, "twii-bounded-named-attempt-synthetic-artifact.safe.json");
const safePacketPath = path.join(tmpDir, "twii-bounded-named-attempt-packet.safe.json");
const safeResultPath = path.join(tmpDir, "twii-bounded-named-attempt-packet.safe.result.json");
const unsafePacketPath = path.join(tmpDir, "twii-bounded-named-attempt-packet.unsafe.json");
const unsafeResultPath = path.join(tmpDir, "twii-bounded-named-attempt-packet.unsafe.result.json");

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(
  syntheticArtifactPath,
  `${JSON.stringify({ fixtureKind: "synthetic_named_attempt_metadata_only", candidateRows: [] }, null, 2)}\n`
);

const safePacket = {
  packetKind: "twii_bounded_data_acceptance_named_attempt_packet",
  attemptId: "twii-named-attempt-check",
  candidateArtifactPath: syntheticArtifactPath,
  mode: "no-write-preview",
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  decisionReference: {
    decisionId: "pm-ceo-local-no-write-chain-check",
    owner: "CEO/PM",
    decisionStatus: "accepted_for_no_write_dry_run_chain",
    summary: "Synthetic checker packet for local no-write chain preflight only."
  },
  commands: {
    chainCommand:
      "cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview",
    postRunReviewCommand:
      "cmd.exe /c npm run report:twii-bounded-data-acceptance-post-run-review -- --summary-path <SUMMARY_JSON_PATH>"
  },
  safety: safeSafety()
};
fs.writeFileSync(safePacketPath, `${JSON.stringify(safePacket, null, 2)}\n`);

const safeRun = spawnSync(
  process.execPath,
  [reportPath, "--packet-path", safePacketPath, "--out", safeResultPath],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const safeResult = parseJson(safeRun.stdout ?? "", "safe packet stdout");
if (safeRun.status !== 0) problems.push("safe named attempt packet must exit 0");
if (safeResult.status !== "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain") {
  problems.push("safe named attempt packet must be accepted for no-write chain");
}
if (safeResult.outcome !== "accepted") problems.push("safe named attempt packet outcome must be accepted");
assertResultSafety(safeResult, "safe result");

const unsafePacket = {
  ...safePacket,
  attemptId: "twii-named-attempt-unsafe-check",
  safety: {
    ...safeSafety(),
    supabaseAllowed: true,
    dailyPricesMutationAllowed: true
  }
};
fs.writeFileSync(unsafePacketPath, `${JSON.stringify(unsafePacket, null, 2)}\n`);
const unsafeRun = spawnSync(
  process.execPath,
  [reportPath, "--packet-path", unsafePacketPath, "--out", unsafeResultPath],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const unsafeResult = parseJson(unsafeRun.stdout ?? "", "unsafe packet stdout");
if (unsafeRun.status === 0) problems.push("unsafe named attempt packet must fail closed");
if (unsafeResult.status !== "blocked" || unsafeResult.outcome !== "blocked") {
  problems.push("unsafe named attempt packet must be blocked");
}

if (
  pkg.scripts?.["report:twii-bounded-data-acceptance-named-attempt-packet"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-data-acceptance-named-attempt-packet`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-named-attempt-packet"] !==
  "node scripts/check-twii-bounded-data-acceptance-named-attempt-packet.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-named-attempt-packet`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Named Attempt Packet Gate",
  "twii_bounded_data_acceptance_named_attempt_packet_gate_ready",
  "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain",
  "accepted_for_no_write_dry_run_chain",
  "run:twii-bounded-data-acceptance-dry-run-review-chain",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance named attempt packet gate slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_NAMED_ATTEMPT_PACKET_GATE.md",
  "twii_bounded_data_acceptance_named_attempt_packet_gate_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_NAMED_ATTEMPT_PACKET_GATE.md` is `accepted` as TWII bounded data acceptance named attempt packet gate",
  "twii_bounded_data_acceptance_named_attempt_packet_gate_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-named-attempt-packet.mjs",
  "name: \"twii-bounded-data-acceptance-named-attempt-packet\"",
  "\"twii-bounded-data-acceptance-named-attempt-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["safe packet stdout", safeRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_data_acceptance_named_attempt_packet_gate_ready",
      acceptedStatus: safeResult.status,
      blockedFixtureStatus: unsafeResult.status
    },
    null,
    2
  )
);

function safeSafety() {
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

function assertResultSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "sourcePayloadOutputAllowed",
    "secretOutputAllowed",
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
