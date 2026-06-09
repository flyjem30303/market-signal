import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const renderPath = "scripts/render-twii-bounded-data-acceptance-named-packet-scaffold.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_NAMED_PACKET_SCAFFOLD.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const artifactPath = path.join(tmpDir, "twii-named-packet-scaffold-artifact.valid.json");
const packetPath = path.join(tmpDir, "twii-named-packet-scaffold.packet.json");

const renderSource = read(renderPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(artifactPath, `${JSON.stringify(validArtifact(), null, 2)}\n`);

const renderRun = spawnSync(
  process.execPath,
  [
    renderPath,
    "--candidate-artifact-path",
    artifactPath,
    "--attempt-id",
    "twii-named-packet-scaffold-check",
    "--decision-id",
    "pm-ceo-scaffold-check",
    "--decision-summary",
    "Synthetic checker decision for no-write packet scaffold.",
    "--out",
    packetPath
  ],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const renderResult = parseJson(renderRun.stdout ?? "", "render stdout");
if (renderRun.status !== 0) problems.push("packet scaffold renderer must exit 0 for valid sanitized artifact");
if (renderResult.status !== "twii_bounded_named_packet_scaffold_rendered_for_no_write_chain") {
  problems.push("packet scaffold renderer must report rendered status");
}
if (renderResult.packetWritten !== true) problems.push("packet scaffold renderer must write packet");
assertSafety(renderResult, "render result");

const packetGateRun = spawnSync(
  process.execPath,
  [
    "scripts/report-twii-bounded-data-acceptance-named-attempt-packet.mjs",
    "--packet-path",
    packetPath
  ],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const packetGate = parseJson(packetGateRun.stdout ?? "", "packet gate stdout");
if (packetGateRun.status !== 0) problems.push("rendered packet must pass named attempt packet gate");
if (packetGate.status !== "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain") {
  problems.push("rendered packet must be accepted for no-write chain");
}

if (
  pkg.scripts?.["render:twii-bounded-data-acceptance-named-packet-scaffold"] !==
  `node ${renderPath}`
) {
  problems.push(`${packagePath} missing render:twii-bounded-data-acceptance-named-packet-scaffold`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-named-packet-scaffold"] !==
  "node scripts/check-twii-bounded-data-acceptance-named-packet-scaffold.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-named-packet-scaffold`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Named Packet Scaffold",
  "twii_bounded_data_acceptance_named_packet_scaffold_ready",
  "twii_bounded_named_packet_scaffold_rendered_for_no_write_chain",
  "render:twii-bounded-data-acceptance-named-packet-scaffold",
  "packet-driven no-write chain",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance named packet scaffold slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_NAMED_PACKET_SCAFFOLD.md",
  "twii_bounded_data_acceptance_named_packet_scaffold_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_NAMED_PACKET_SCAFFOLD.md` is `accepted` as TWII bounded data acceptance named packet scaffold",
  "twii_bounded_data_acceptance_named_packet_scaffold_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-named-packet-scaffold.mjs",
  "name: \"twii-bounded-data-acceptance-named-packet-scaffold\"",
  "\"twii-bounded-data-acceptance-named-packet-scaffold\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [renderPath, renderSource],
  [docPath, doc],
  ["render stdout", renderRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_data_acceptance_named_packet_scaffold_ready",
      renderStatus: renderResult.status,
      packetGateStatus: packetGate.status
    },
    null,
    2
  )
);

function validArtifact() {
  return {
    artifactId: "twii-named-packet-scaffold-check",
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
