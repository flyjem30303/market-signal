import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-public-route-user-facing-residue-gate.json";
const reportPath = "scripts/report-phase-1-public-route-user-facing-residue-gate.mjs";
const docPath = "docs/PHASE_1_PUBLIC_ROUTE_USER_FACING_RESIDUE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const publicRouteFiles = [
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/public-beta-data-readiness-status.tsx",
  "src/components/public-beta-source-coverage-bridge.tsx",
  "src/components/public-beta-usable-loop-panel.tsx",
  "src/components/public-data-source-boundary-notice.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx"
];

const internalOnlyComponents = [
  "PublicBetaLaunchReadinessPanel",
  "BriefingPublicBetaGateSummary",
  "BlockerReadinessPanel",
  "SourceDepthBlockerPanel"
];

const forbiddenVisibleResiduePatterns = [
  /PUBLIC BETA READINESS/iu,
  /PRE-LAUNCH EXECUTABLE/iu,
  /OPERATIONAL GOAL/iu,
  /CURRENT HARD BLOCKERS/iu,
  /REMAINING HARD BLOCKERS/iu,
  /EXTERNAL REPLY DRY-RUN INTAKE/iu,
  /REQUEST BLOCKS/iu,
  /BETA_HOSTING_PROJECT_NAME/u,
  /BETA_TEMPORARY_URL/u,
  /PUBLIC_BETA_EXTERNAL_REPLY_PATH/u,
  /cmd\.exe\s*\/c\s*npm/iu,
  /npm run\s+(check|report|run):/iu,
  /\bphase_1_[a-z0-9_]+/iu,
  /\bcommit\s+[0-9a-f]{6,40}\b/iu,
  /\bhard blocker(s)?\b/iu,
  /\bblocker groups?\b/iu,
  /\bworkflow proof\b/iu,
  /\bdry-run intake\b/iu,
  /\bpacket proof\b/iu,
  /\bPM worktree\b/iu,
  /\bA1 evidence\b/iu,
  /\bA1 TWII\b/iu,
  /\bA2\b/u,
  /\bA3\b/u,
  /\bA4\b/u
];

const requiredPublicRouteTokens = [
  "30",
  "3",
  "資料",
  "風險",
  "非投資建議",
  "更新"
];

const problems = [];
const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const status = readText(statusPath);
const sourceResults = scanPublicRouteSources();

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
if (reportRun.status !== 0) problems.push("report script must exit 0");
const reportText = reportRun.stdout ?? "";
const report = parseJson(reportText, "report stdout");

validateArtifact();
validateSources();
validateReport();
validateDoc();
validateRegistration();
validateStatus();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_public_route_user_facing_residue_gate_ready"
        : "phase_1_public_route_user_facing_residue_gate_blocked",
      checkedRouteFiles: publicRouteFiles.length,
      forbiddenResidueHits: sourceResults.flatMap((result) => result.forbiddenHits).length,
      internalOnlyComponentLeaks: sourceResults.flatMap((result) => result.internalOnlyComponentHits).length,
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateArtifact() {
  expect(artifact.status, "phase_1_public_route_user_facing_residue_gate_ready", "artifact status");
  expect(artifact.gateMode, "public_route_user_facing_residue_gate", "gateMode");
  expect(artifact.gateDecision, "public_routes_must_not_show_internal_project_process_copy", "gateDecision");
  expectArray(artifact.targetRoutes, ["/", "/briefing", "/stocks/[symbol]"], "targetRoutes");
  expectArray(artifact.routeSurfaceFiles, publicRouteFiles, "routeSurfaceFiles");
  expectArray(artifact.internalOnlyComponents, internalOnlyComponents, "internalOnlyComponents");
  expect(artifact.publicVisibleResidueAllowed, false, "publicVisibleResidueAllowed");
  expect(artifact.developerWorkflowCopyAllowed, false, "developerWorkflowCopyAllowed");
  expect(artifact.userFacingCopyRequired, true, "userFacingCopyRequired");
  expect(artifact.nextRoute, "repair_any_public_route_residue_before_phase_1_release_candidate", "nextRoute");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateSources() {
  for (const result of sourceResults) {
    if (!result.exists) {
      problems.push(`${result.file} missing`);
      continue;
    }
    if (result.forbiddenHits.length > 0) {
      problems.push(`${result.file} contains public residue: ${result.forbiddenHits.join(", ")}`);
    }
    if (result.internalOnlyComponentHits.length > 0) {
      problems.push(`${result.file} imports/renders internal component: ${result.internalOnlyComponentHits.join(", ")}`);
    }
  }
}

function validateReport() {
  expect(report.status, "phase_1_public_route_user_facing_residue_gate_ready", "report status");
  expect(report.gateDecision, artifact.gateDecision, "report gateDecision");
  expect(report.checkedRouteFiles, publicRouteFiles.length, "report checkedRouteFiles");
  expect(report.publicVisibleResidueAllowed, false, "report publicVisibleResidueAllowed");
  if (!reportText.includes("public_routes_must_not_show_internal_project_process_copy")) {
    problems.push("report missing public route gate decision");
  }
  if (!reportText.includes("repair_any_public_route_residue_before_phase_1_release_candidate")) {
    problems.push("report missing next route");
  }
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 Public Route User-Facing Residue Gate",
    "phase_1_public_route_user_facing_residue_gate_ready",
    "public_routes_must_not_show_internal_project_process_copy",
    "/",
    "/briefing",
    "/stocks/[symbol]",
    "PublicBetaLaunchReadinessPanel",
    "BETA_HOSTING_PROJECT_NAME",
    "cmd.exe /c npm",
    "No SQL",
    "No Supabase write",
    "publicDataSource=mock",
    "scoreSource=mock",
    "repair_any_public_route_residue_before_phase_1_release_candidate"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-public-route-user-facing-residue-gate"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-public-route-user-facing-residue-gate");
  }
  if (
    packageJson.scripts?.["check:phase-1-public-route-user-facing-residue-gate"] !==
    "node scripts/check-phase-1-public-route-user-facing-residue-gate.mjs"
  ) {
    problems.push("package.json missing check:phase-1-public-route-user-facing-residue-gate");
  }
  if (!reviewGate.includes("scripts/check-phase-1-public-route-user-facing-residue-gate.mjs")) {
    problems.push("review gate missing public route residue checker");
  }
  if (!reviewGate.includes('"phase-1-public-route-user-facing-residue-gate"')) {
    problems.push("focused review gate missing public route residue checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 public route user-facing residue gate slice",
    "docs/PHASE_1_PUBLIC_ROUTE_USER_FACING_RESIDUE_GATE.md",
    "phase_1_public_route_user_facing_residue_gate_ready",
    "public_routes_must_not_show_internal_project_process_copy",
    "repair_any_public_route_residue_before_phase_1_release_candidate"
  ];
  for (const token of requiredTokens) if (!status.includes(token)) problems.push(`${statusPath} missing ${token}`);
}

function validateBoundaries() {
  const texts = [
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["report stdout", reportText]
  ];
  const forbiddenPatterns = [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /publicVisibleResidueAllowed"\s*:\s*true/u,
    /developerWorkflowCopyAllowed"\s*:\s*true/u
  ];
  for (const [label, text] of texts) {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function scanPublicRouteSources() {
  return publicRouteFiles.map((file) => {
    const text = readText(file);
    const normalized = text.normalize("NFC");
    const forbiddenHits = forbiddenVisibleResiduePatterns
      .filter((pattern) => pattern.test(normalized))
      .map((pattern) => pattern.source);
    const internalOnlyComponentHits = internalOnlyComponents.filter((name) => {
      if (file.endsWith(`${kebabLike(name)}.tsx`)) return false;
      return new RegExp(`\\b${escapeRegExp(name)}\\b`, "u").test(normalized);
    });
    const publicTokenHits = requiredPublicRouteTokens.filter((token) => normalized.includes(token));

    return {
      exists: text.length > 0,
      file,
      forbiddenHits,
      internalOnlyComponentHits,
      publicTokenHits
    };
  });
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
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

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
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

function kebabLike(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
