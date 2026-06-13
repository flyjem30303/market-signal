import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_PRE_OPERATOR_KEEP_OPEN_STATUS_DASHBOARD_ALIGNMENT.md";
const surfaceCheckerPath = "scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs";
const residueCheckerPath = "scripts/check-phase-1-public-beta-public-visible-residue-cleanup.mjs";
const rollupPath = "docs/A3_PHASE_1_PUBLIC_BETA_KEEP_OPEN_REPAIR_OR_NO_GO_RESULT_ROLLUP.md";
const splitPath = "docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const surfaceChecker = read(surfaceCheckerPath);
const residueChecker = read(residueCheckerPath);
const rollup = read(rollupPath);
const split = read(splitPath);
const pmBrief = read(pmBriefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready",
  "Internal State To Public Message Map",
  "Public Surface Requirements",
  "PM/A3 Internal Dashboard Requirements",
  "Workstream Assignment",
  "Required Checks",
  "Stop Lines",
  "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "NOT_RUN",
  "目前公開使用狀態",
  "市場氣氛快讀",
  "資料狀態需複核",
  "會員功能下一階段",
  "不提供買賣建議"
]);

for (const publicPhrase of [
  "目前可用：可用 30 秒快讀市場氣氛",
  "暫時保守：部分資訊正在校正",
  "暫不開放：公開頁需完成修復後才會恢復完整顯示",
  "尚未執行上線確認：目前仍維持公開 Beta 前的示範狀態"
]) {
  if (!doc.includes(publicPhrase)) problems.push(`${docPath} missing public mapping phrase: ${publicPhrase}`);
}

for (const command of [
  "cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup",
  "cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

for (const source of [
  [surfaceCheckerPath, surfaceChecker],
  [residueCheckerPath, residueChecker]
]) {
  const [filePath, text] = source;
  for (const forbidden of ["KEEP_OPEN_WITH_DEFERRALS", "REPAIR_THEN_RECHECK", "ROLLBACK_OR_NO_GO"]) {
    if (!text.includes(forbidden)) problems.push(`${filePath} should block public ${forbidden}`);
  }
}

requireIncludes(surfaceCheckerPath, surfaceChecker, [
  "目前公開使用狀態",
  "市場氣氛快讀",
  "資料狀態需複核",
  "會員功能下一階段",
  "findMojibakeMarkers"
]);

requireIncludes(rollupPath, rollup, [
  "phase_1_public_beta_pre_operator_or_keep_open_status_dashboard_alignment",
  "final state is keep-open",
  "public status/dashboard remains aligned"
]);

requireIncludes(splitPath, split, [
  "Phase 1 is the public free index-lighting site",
  "Phase 2 implementation must not block Phase 1 public Beta readiness"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "phase_1_public_beta_pre_operator_or_keep_open_status_dashboard_alignment",
  "A4 Membership MVP Planning"
]);

const scriptName = "check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment";
if (
  pkg.scripts?.[scriptName] !==
  "node scripts/check-phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment.mjs"
) {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment.mjs",
  "phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment"
]);

for (const [filePath, source] of [
  [docPath, doc],
  [surfaceCheckerPath, surfaceChecker]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function requireIncludes(label, source, phrases) {
  for (const phrase of phrases) {
    if (!source.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
  }
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /production deployment is approved/u,
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /real-time official market data is provided/u,
    /official endorsement is provided/u,
    /guaranteed return is provided/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}
