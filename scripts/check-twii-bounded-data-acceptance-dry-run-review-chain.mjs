import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const chainPath = "scripts/run-twii-bounded-data-acceptance-dry-run-review-chain.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_DRY_RUN_REVIEW_CHAIN.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const syntheticArtifactPath = path.join(tmpDir, "twii-bounded-chain-synthetic-artifact.safe.json");
const chainOutDir = path.join(tmpDir, "twii-bounded-chain-check");

const chainSource = read(chainPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(
  syntheticArtifactPath,
  `${JSON.stringify({ fixtureKind: "synthetic_chain_metadata_only", candidateRows: [] }, null, 2)}\n`
);

const result = spawnSync(
  process.execPath,
  [
    chainPath,
    "--attempt-id",
    "twii-bounded-chain-check",
    "--candidate-artifact-path",
    syntheticArtifactPath,
    "--mode",
    "no-write-preview",
    "--out-dir",
    chainOutDir
  ],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);

const chain = parseJson(result.stdout ?? "", "chain stdout");
if (result.status !== 0) problems.push("chain runner must exit 0 for synthetic safe artifact");
if (chain.status !== "twii_bounded_data_acceptance_dry_run_review_chain_completed_no_write") {
  problems.push("chain runner must complete no-write chain");
}
if (chain.outcome !== "accepted_no_write_chain") problems.push("chain outcome must be accepted_no_write_chain");
if (chain.executedSteps?.dryRunWrapper !== true) problems.push("chain must execute dry-run wrapper");
if (chain.executedSteps?.postRunReviewGate !== true) problems.push("chain must execute post-run review gate");
if (chain.reviewedStatuses?.postRunReviewStatus !== "twii_bounded_data_acceptance_post_run_review_accepted_no_write") {
  problems.push("chain must include accepted post-run review status");
}
assertSafety(chain, "chain");

if (
  pkg.scripts?.["run:twii-bounded-data-acceptance-dry-run-review-chain"] !==
  `node ${chainPath}`
) {
  problems.push(`${packagePath} missing run:twii-bounded-data-acceptance-dry-run-review-chain`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-dry-run-review-chain"] !==
  "node scripts/check-twii-bounded-data-acceptance-dry-run-review-chain.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-dry-run-review-chain`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Dry-Run Review Chain",
  "twii_bounded_data_acceptance_dry_run_review_chain_ready",
  "twii_bounded_data_acceptance_dry_run_review_chain_completed_no_write",
  "run:twii-bounded-data-acceptance-dry-run-review-chain",
  "accepted_no_write_chain",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance dry-run review chain slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_DRY_RUN_REVIEW_CHAIN.md",
  "twii_bounded_data_acceptance_dry_run_review_chain_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_DRY_RUN_REVIEW_CHAIN.md` is `accepted` as TWII bounded data acceptance dry-run review chain",
  "twii_bounded_data_acceptance_dry_run_review_chain_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-dry-run-review-chain.mjs",
  "name: \"twii-bounded-data-acceptance-dry-run-review-chain\"",
  "\"twii-bounded-data-acceptance-dry-run-review-chain\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [chainPath, chainSource],
  [docPath, doc],
  ["chain stdout", result.stdout ?? ""]
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
      guardedStatus: "twii_bounded_data_acceptance_dry_run_review_chain_ready",
      chainStatus: chain.status
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
