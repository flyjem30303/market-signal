import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_GO_NO_GO_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const postWriteGatePath = "scripts/check-phase-1-post-write-coverage-scoring-gate.mjs";
const runtimePromotionPath = "scripts/check-runtime-promotion-readiness-summary.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const postWriteGate = runJson(postWriteGatePath);
const runtimePromotionGate = runJson(runtimePromotionPath);

for (const phrase of [
  "phase_1_data_online_go_no_go_status_coverage_complete_promotion_pending",
  "DATA_COVERAGE_COMPLETE_BUT_RUNTIME_PROMOTION_NO_GO",
  "NO_GO_FOR_RUNTIME_REAL_PROMOTION",
  "Candidate row payload validation accepted `500` rows",
  "inserted `437` missing rows",
  "Final candidate-key readback confirmed `500/500`",
  "Missing rows after write are `0`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "check:phase-1-post-write-coverage-scoring-gate",
  "check:runtime-promotion-readiness-summary",
  "phase_1_runtime_promotion_gate_preflight_mock_to_supabase_review",
  "Data coverage is no longer the blocker",
  "publicDataSource=supabase",
  "scoreSource=real"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-data-online-go-no-go-status"] !==
  "node scripts/check-phase-1-data-online-go-no-go-status.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-data-online-go-no-go-status`);
}

if (!reviewGate.includes("scripts/check-phase-1-data-online-go-no-go-status.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}

if (!reviewGate.includes('"phase-1-data-online-go-no-go-status"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

expect(postWriteGate.status, "ok", "postWriteGate.status");
expect(postWriteGate.guardedStatus, "phase_1_post_write_coverage_scoring_gate_ready_for_runtime_promotion_review", "postWriteGate.guardedStatus");
expect(postWriteGate.acceptedCoverageRows, 500, "postWriteGate.acceptedCoverageRows");
expect(postWriteGate.insertedRows, 437, "postWriteGate.insertedRows");
expect(postWriteGate.skippedExistingRows, 63, "postWriteGate.skippedExistingRows");
expect(postWriteGate.finalCandidateKeyRows, 500, "postWriteGate.finalCandidateKeyRows");
expect(postWriteGate.missingRowsAfterWrite, 0, "postWriteGate.missingRowsAfterWrite");
expect(postWriteGate.rowCoverageScoringAccepted, true, "postWriteGate.rowCoverageScoringAccepted");
expect(postWriteGate.runtimePromotionAllowedNow, false, "postWriteGate.runtimePromotionAllowedNow");
expect(postWriteGate.publicDataSource, "mock", "postWriteGate.publicDataSource");
expect(postWriteGate.scoreSource, "mock", "postWriteGate.scoreSource");

expect(runtimePromotionGate.status, "ok", "runtimePromotionGate.status");

for (const pattern of [
  /\bsb_secret_/iu,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
  /https:\/\/[a-z0-9.-]+supabase/iu,
  /"stock_id"\s*:/u,
  /"rawPayload"\s*:/u,
  /"rowBody"\s*:/u,
  /publicDataSource"\s*:\s*"supabase"/u,
  /scoreSource"\s*:\s*"real"/u,
  /guaranteed return/iu,
  /buy now/iu
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
}

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus:
        status === "ok"
          ? "phase_1_data_online_go_no_go_status_coverage_complete_promotion_pending"
          : "phase_1_data_online_go_no_go_status_blocked",
      accepted: status === "ok",
      decision: "DATA_COVERAGE_COMPLETE_BUT_RUNTIME_PROMOTION_NO_GO",
      coverage: {
      acceptedCoverageRows: 500,
      insertedRows: 437,
      skippedExistingRows: 63,
      finalCandidateKeyRows: 500,
        missingRowsAfterWrite: 0
      },
      runtimePromotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_gate_preflight_mock_to_supabase_review",
      problems
    },
    null,
    2
  )
);

if (status !== "ok") process.exit(1);

function readText(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return "{}";
  }

  return fs.readFileSync(path, "utf8");
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 2
  });

  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);

  try {
    return JSON.parse(run.stdout);
  } catch {
    problems.push(`${scriptPath} did not emit JSON`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
