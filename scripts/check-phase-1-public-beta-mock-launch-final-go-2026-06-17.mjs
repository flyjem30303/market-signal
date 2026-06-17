import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-public-beta-mock-launch-final-go-2026-06-17.json";
const docPath = "docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_FINAL_GO_2026_06_17.md";
const projectStatusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const doc = read(docPath);
const projectStatus = read(projectStatusPath);
const packageJson = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);

validateArtifact();
validateDoc();
validateProjectStatus();
validateRegistration();
validateDependencyCheck("scripts/check-phase-1-public-beta-public-visible-residue-cleanup.mjs");
validateDependencyCheck("scripts/check-phase-1-current-scope-write-closure-final-go-judgement-2026-06-17.mjs");
validateDependencyCheck("scripts/check-phase-1-runtime-promotion-explicit-go-no-go-decision.mjs");
validateBoundaries();

const ok = problems.length === 0;
console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_public_beta_mock_launch_final_go_ready"
    : "phase_1_public_beta_mock_launch_final_go_blocked",
  decision: artifact.decision ?? null,
  publicBetaMockLaunchFinalGo: ok,
  runtimePromotionFinalGo: artifact.runtimePromotionFinalGo ?? null,
  publicDataSource: artifact.publicDataSource ?? null,
  scoreSource: artifact.scoreSource ?? null,
  nextRoute: artifact.nextRoute ?? null,
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_public_beta_mock_launch_final_go", "artifact.packetMode");
  expect(artifact.status, "phase_1_public_beta_mock_launch_final_go_ready", "artifact.status");
  expect(
    artifact.decision,
    "FINAL_GO_PUBLIC_BETA_MOCK_LAUNCH_READY_KEEP_REAL_RUNTIME_NO_GO",
    "artifact.decision"
  );
  expect(artifact.phase, "phase_1_public_beta", "artifact.phase");
  expect(artifact.launchScope, "public_beta_mock_data_index_signal_dashboard", "artifact.launchScope");
  expect(artifact.briefAligned, true, "artifact.briefAligned");
  expect(artifact.publicSurfaceReady, true, "artifact.publicSurfaceReady");
  expect(artifact.publicVisibleResidueClean, true, "artifact.publicVisibleResidueClean");
  expect(artifact.currentScopeWriteClosureFinalGo, true, "artifact.currentScopeWriteClosureFinalGo");
  expect(artifact.runtimePromotionFinalGo, false, "artifact.runtimePromotionFinalGo");
  expect(artifact.runtimePromotionAllowedNow, false, "artifact.runtimePromotionAllowedNow");
  expect(artifact.realRuntimePromotionBlocked, true, "artifact.realRuntimePromotionBlocked");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.currentScope, "twii_plus_listed_stock_daily_close", "artifact.currentScope");
  expect(artifact.phase11DeferredScope, "etf_full_coverage", "artifact.phase11DeferredScope");
  expectArrayIncludes(artifact.acceptedEvidence, [
    "check:phase-1-public-beta-public-visible-residue-cleanup",
    "check:phase-1-public-beta-public-status-surface-alignment",
    "check:localhost-content-health",
    "check:phase-1-current-scope-write-closure-final-go-judgement-2026-06-17",
    "check:phase-1-runtime-promotion-explicit-go-no-go-decision",
    "check:review-gates",
    "npm run build"
  ], "artifact.acceptedEvidence");
  expectArray(artifact.problems, [], "artifact.problems");
  expect(
    artifact.nextRoute,
    "ship_public_beta_mock_launch_or_continue_real_runtime_promotion_review",
    "artifact.nextRoute"
  );
}

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_public_beta_mock_launch_final_go_ready`",
    "Decision: `FINAL_GO_PUBLIC_BETA_MOCK_LAUNCH_READY_KEEP_REAL_RUNTIME_NO_GO`",
    "Phase 1 can reach public Beta final-go",
    "This is not a real-runtime promotion",
    "`ship_public_beta_mock_launch_or_continue_real_runtime_promotion_review`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Public Beta Mock Launch Final-Go",
    "phase_1_public_beta_mock_launch_final_go_ready",
    "FINAL_GO_PUBLIC_BETA_MOCK_LAUNCH_READY_KEEP_REAL_RUNTIME_NO_GO",
    "ship_public_beta_mock_launch_or_continue_real_runtime_promotion_review"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateRegistration() {
  const scriptName = "check:phase-1-public-beta-mock-launch-final-go-2026-06-17";
  const gateName = "phase-1-public-beta-mock-launch-final-go-2026-06-17";
  if (!packageJson.scripts?.[scriptName]) problems.push(`${packagePath} missing script ${scriptName}`);
  if (!reviewGate.includes(`name: "${gateName}"`)) problems.push(`${reviewGatePath} missing check registration ${gateName}`);
  if (!reviewGate.includes(`"${gateName}"`)) problems.push(`${reviewGatePath} missing live-core gate name ${gateName}`);
}

function validateDependencyCheck(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 30000,
    windowsHide: true
  });
  if (result.status !== 0) {
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
    problems.push(`${scriptPath} failed with exit ${result.status}: ${output.slice(0, 500)}`);
    return;
  }
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (!output.includes('"status": "ok"')) problems.push(`${scriptPath} did not report status ok`);
}

function validateBoundaries() {
  for (const [label, text] of [[artifactPath, artifactText], [docPath, doc], [projectStatusPath, projectStatus]]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`${label} mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
}

function expectArrayIncludes(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  for (const item of expected) {
    if (!actual.includes(item)) problems.push(`${label} missing ${item}`);
  }
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"rawPayload"\s*:/iu,
    /"rowPayload"\s*:/iu,
    /"stockIds"\s*:/iu,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
