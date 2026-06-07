import fs from "node:fs";

const docPath = "docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const goalPath = "docs/GOAL_PARALLEL_WORKSTREAM_ADJUSTMENT.md";
const configPath = "scripts/localhost-health-config.mjs";
const publicRouteLoopPath = "scripts/check-public-route-loop.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const goal = read(goalPath);
const config = read(configPath);
const publicRouteLoop = read(publicRouteLoopPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `runtime_local_route_health_refresh_ready_mock_boundary_preserved`",
  "refresh_runtime_local_route_health_before_executable_packet_or_data_gate",
  "runtime_local_route_health_refresh_before_executable_packet_or_data_gate",
  "local_route_health_refresh_ready_for_next_preflight_proof",
  "Public runtime boundary remains `publicDataSource=mock`",
  "Score boundary remains `scoreSource=mock`",
  "Current Level 1 MVP row coverage remains `182/360`",
  "TW equity first closed loop remains accepted at `180/180`",
  "TWII remains `0/60`",
  "ETF remains `2/120`, with `118` missing rows",
  "cmd.exe /c npm run check:localhost-health-config",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "cmd.exe /c npm run check:runtime-summary-alignment-from-first-closed-loop",
  "cmd.exe /c npm run check:runtime-data-promotion-handoff-checklist",
  "cmd.exe /c npm run check:runtime-local-route-health-refresh-before-executable-packet",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "cmd.exe /c npm run check:review-gates",
  "data_gate_readiness_after_local_route_health_refresh",
  "executable_packet_candidate_after_platform_values",
  "runtime_repair_before_next_gate",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) {
    problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

const requiredRoutes = [
  "/",
  "/stocks/2330",
  "/stocks/TWII",
  "/stocks/0050",
  "/stocks/006208",
  "/stocks/2382",
  "/stocks/2308",
  "/briefing",
  "/weekly",
  "/robots.txt"
];

for (const route of requiredRoutes) {
  if (!doc.includes(`| \`${route}\``)) {
    problems.push(`${docPath} missing route table entry: ${route}`);
  }
  if (!config.includes(`"${route}"`)) {
    problems.push(`${configPath} missing route target: ${route}`);
  }
}

const requiredRuntimeTokens = [
  "local_ready_remote_paused",
  "mock-only",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Internal Server Error",
  "Application error",
  "Unhandled Runtime Error",
  "publicDataSource: supabase",
  "scoreSource: real"
];

for (const token of requiredRuntimeTokens) {
  if (!doc.includes(token)) problems.push(`${docPath} missing runtime token: ${token}`);
  if (!config.includes(token)) problems.push(`${configPath} missing runtime token: ${token}`);
}

const requiredCrossFilePhrases = [
  [statusPath, status, "Latest runtime local route health refresh slice"],
  [statusPath, status, "runtime_local_route_health_refresh_ready_mock_boundary_preserved"],
  [statusPath, status, "runtime_local_route_health_refresh_before_executable_packet_or_data_gate"],
  [boardPath, board, "`docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md` is `accepted` as PM mainline local route health refresh"],
  [goalPath, goal, "Current PM next route: `runtime_local_route_health_refresh_before_executable_packet_or_data_gate`"],
  [packagePath, packageJson, "\"check:runtime-local-route-health-refresh-before-executable-packet\""],
  [reviewGatePath, reviewGate, "scripts/check-runtime-local-route-health-refresh-before-executable-packet.mjs"],
  [reviewGatePath, reviewGate, "runtime-local-route-health-refresh-before-executable-packet"],
  [publicRouteLoopPath, publicRouteLoop, "checkedRoutes"]
];

for (const [path, source, phrase] of requiredCrossFilePhrases) {
  if (!source.includes(phrase)) {
    problems.push(`${path} missing phrase: ${phrase}`);
  }
}

const forbiddenPatterns = [
  /Supabase writes are approved/u,
  /SQL execution is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /deployment executed/u,
  /launch complete/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) {
    problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
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
      docPath,
      guardedStatus: "runtime_local_route_health_refresh_ready_mock_boundary_preserved"
    },
    null,
    2
  )
);

function read(path) {
  return fs.readFileSync(path, "utf8");
}
