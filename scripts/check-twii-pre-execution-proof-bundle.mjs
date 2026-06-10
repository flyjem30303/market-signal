import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-pre-execution-proof-bundle.mjs";
const docPath = "docs/TWII_PRE_EXECUTION_PROOF_BUNDLE.md";
const bundlePath = "data/source-gates/twii-pre-execution-proof-bundle.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const bundle = JSON.parse(read(bundlePath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const output = parseJson(run.stdout ?? "", "pre-execution proof bundle stdout");
if (run.status !== 0) problems.push("pre-execution proof bundle report must exit 0");
if (output.status !== "twii_pre_execution_proof_bundle_ready_no_execution") {
  problems.push("proof bundle status must be ready no execution");
}
if (output.outcome !== "proof_bundle_ready_future_authorization_still_blocked") {
  problems.push("proof bundle outcome must keep future authorization blocked");
}
if (output.bundleStatus !== "ready_for_pm_review_no_execution") problems.push("bundleStatus mismatch");
if (output.proofsReady !== true) problems.push("proofsReady must be true");
if (!Array.isArray(output.missingProofs) || output.missingProofs.length !== 0) problems.push("missingProofs must be empty");
if (output.recommendedNextAction !== "prepare_future_one_time_authorization_packet_after_pm_review") {
  problems.push("recommendedNextAction mismatch");
}
if (output.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.upstream?.selectorRecommendedNextAction !== "prepare_rollback_readback_postwrite_proof_bundle") {
  problems.push("selector route must point to proof bundle");
}
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");

assertBundle(bundle);
assertSafety(output);

if (pkg.scripts?.["report:twii-pre-execution-proof-bundle"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-pre-execution-proof-bundle`);
}
if (pkg.scripts?.["check:twii-pre-execution-proof-bundle"] !== "node scripts/check-twii-pre-execution-proof-bundle.mjs") {
  problems.push(`${packagePath} missing check:twii-pre-execution-proof-bundle`);
}

for (const phrase of [
  "TWII Pre-Execution Proof Bundle",
  "twii_pre_execution_proof_bundle_ready_no_execution",
  "proof_bundle_ready_future_authorization_still_blocked",
  "data/source-gates/twii-pre-execution-proof-bundle.json",
  "bundleStatus=ready_for_pm_review_no_execution",
  "proofsReady=true",
  "missingProofs=[]",
  "rollback-dry-run-proof",
  "aggregate-readback-proof",
  "post-write-review-proof",
  "recommendedNextAction=prepare_future_one_time_authorization_packet_after_pm_review",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII pre-execution proof bundle slice",
  "docs/TWII_PRE_EXECUTION_PROOF_BUNDLE.md",
  "data/source-gates/twii-pre-execution-proof-bundle.json",
  "twii_pre_execution_proof_bundle_ready_no_execution",
  "proof_bundle_ready_future_authorization_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_PRE_EXECUTION_PROOF_BUNDLE.md` is `accepted` as TWII pre-execution proof bundle",
  "twii_pre_execution_proof_bundle_ready_no_execution",
  "proof_bundle_ready_future_authorization_still_blocked",
  "prepare_future_one_time_authorization_packet_after_pm_review"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-pre-execution-proof-bundle.mjs",
  "name: \"twii-pre-execution-proof-bundle\"",
  "\"twii-pre-execution-proof-bundle\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [bundlePath, JSON.stringify(bundle)],
  ["pre-execution proof bundle stdout", run.stdout ?? ""]
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
      guardedStatus: output.status,
      acceptedOutcome: output.outcome,
      bundleStatus: output.bundleStatus,
      recommendedNextAction: output.recommendedNextAction
    },
    null,
    2
  )
);

function assertBundle(bundle) {
  if (bundle.bundleKind !== "twii_pre_execution_proof_bundle") problems.push("bundleKind mismatch");
  if (bundle.bundleStatus !== "ready_for_pm_review_no_execution") problems.push("bundleStatus mismatch");
  if (bundle.proofsReady !== true) problems.push("bundle proofsReady must be true");
  if (!Array.isArray(bundle.missingProofs) || bundle.missingProofs.length !== 0) problems.push("bundle missingProofs must be empty");
  for (const proofId of ["rollback-dry-run-proof", "aggregate-readback-proof", "post-write-review-proof"]) {
    if (!(bundle.proofs ?? []).some((proof) => proof.proofId === proofId && proof.readyForPmReview === true)) {
      problems.push(`bundle missing ready proof ${proofId}`);
    }
  }
  if (bundle.executionAllowedNow !== false) problems.push("bundle executionAllowedNow must be false");
  if (bundle.writeGateExecutableNow !== false) problems.push("bundle writeGateExecutableNow must be false");
  if (bundle.implementationAllowedNow !== false) problems.push("bundle implementationAllowedNow must be false");
}

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("proof bundle must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`proof bundle safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
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
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage scoring is approved/iu
  ];
}
