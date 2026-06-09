import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const wrapperPath = "scripts/run-twii-bounded-data-acceptance-attempt.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_DRY_RUN_WRAPPER.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const syntheticArtifactPath = path.join(tmpDir, "twii-bounded-acceptance-synthetic-candidate-artifact.safe.json");
const outputPath = path.join(tmpDir, "twii-bounded-acceptance-wrapper-check-output.json");

const wrapperSource = read(wrapperPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(
  syntheticArtifactPath,
  `${JSON.stringify(
    {
      fixtureKind: "synthetic_empty_candidate_artifact_metadata_only",
      rawMarketData: false,
      candidateRows: []
    },
    null,
    2
  )}\n`
);

const result = spawnSync(
  process.execPath,
  [
    wrapperPath,
    "--attempt-id",
    "twii-bounded-wrapper-check",
    "--candidate-artifact-path",
    syntheticArtifactPath,
    "--mode",
    "no-write-preview",
    "--out",
    outputPath
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  }
);

if (result.status !== 0) problems.push("dry-run wrapper must exit 0 for synthetic safe artifact");
const summary = parseJson(result.stdout ?? "");
const writtenSummary = parseJson(fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "{}");

for (const [label, output] of [
  ["stdout summary", summary],
  ["written summary", writtenSummary]
]) {
  if (output.status !== "twii_bounded_data_acceptance_attempt_dry_run_ready_no_write") {
    problems.push(`${label} must report dry_run_ready_no_write`);
  }
  if (output.mode !== "no-write-preview") problems.push(`${label} must keep mode no-write-preview`);
  if (output.candidateArtifact?.rawContentRead !== false) problems.push(`${label} must not read raw content`);
  if (output.candidateArtifact?.rawContentParsed !== false) problems.push(`${label} must not parse raw content`);
  if (output.dryRunResult?.candidateRowsAcceptedNow !== false) problems.push(`${label} must not accept rows`);
  if (output.dryRunResult?.dailyPricesMutated !== false) problems.push(`${label} must not mutate daily_prices`);
  if (output.dryRunResult?.rowCoverageScoringAllowed !== false) {
    problems.push(`${label} must not allow row coverage scoring`);
  }
  assertSafety(output, label);
}

if (
  pkg.scripts?.["run:twii-bounded-data-acceptance-attempt"] !==
  `node ${wrapperPath}`
) {
  problems.push(`${packagePath} missing run:twii-bounded-data-acceptance-attempt`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-attempt-dry-run-wrapper"] !==
  "node scripts/check-twii-bounded-data-acceptance-attempt-dry-run-wrapper.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-attempt-dry-run-wrapper`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Attempt Dry-Run Wrapper",
  "twii_bounded_data_acceptance_attempt_dry_run_wrapper_ready_no_write",
  "cmd.exe /c npm run run:twii-bounded-data-acceptance-attempt",
  "--mode no-write-preview",
  "candidateArtifact.rawContentRead=false",
  "candidateRowsAcceptedNow=false",
  "dailyPricesMutated=false",
  "supabaseConnectionAttempted=false",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance dry-run wrapper slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_DRY_RUN_WRAPPER.md",
  "twii_bounded_data_acceptance_attempt_dry_run_wrapper_ready_no_write"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_DRY_RUN_WRAPPER.md` is `accepted` as TWII bounded data acceptance attempt dry-run wrapper",
  "twii_bounded_data_acceptance_attempt_dry_run_wrapper_ready_no_write"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-attempt-dry-run-wrapper.mjs",
  "name: \"twii-bounded-data-acceptance-attempt-dry-run-wrapper\"",
  "\"twii-bounded-data-acceptance-attempt-dry-run-wrapper\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [wrapperPath, wrapperSource],
  [docPath, doc],
  ["wrapper stdout", result.stdout ?? ""],
  [outputPath, fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : ""]
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
      guardedStatus: "twii_bounded_data_acceptance_attempt_dry_run_wrapper_ready_no_write",
      wrapperOutputPath: outputPath
    },
    null,
    2
  )
);

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
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("wrapper output is not valid JSON");
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
    /scoreSource":\s*"real"/u,
    /candidateRowsAcceptedNow":\s*true/u,
    /dailyPricesMutated":\s*true/u,
    /sqlExecuted":\s*true/u,
    /supabaseConnectionAttempted":\s*true/u
  ];
}
