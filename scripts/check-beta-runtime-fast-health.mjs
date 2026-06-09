import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_RUNTIME_FAST_HEALTH_GATE.md";
const publicStatePath = "src/lib/public-claim-runtime-state.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const baseUrl = process.env.BETA_RUNTIME_FAST_HEALTH_BASE_URL ?? process.env.LOCALHOST_HEALTH_BASE_URL ?? "http://localhost:3000";
const timeoutMs = Number.parseInt(process.env.BETA_RUNTIME_FAST_HEALTH_TIMEOUT_MS ?? "8000", 10);
const routeRetryCount = Number.parseInt(process.env.BETA_RUNTIME_FAST_HEALTH_ROUTE_RETRIES ?? "5", 10);
const routeRetryDelayMs = Number.parseInt(process.env.BETA_RUNTIME_FAST_HEALTH_ROUTE_RETRY_DELAY_MS ?? "500", 10);
const routes = (process.env.BETA_RUNTIME_FAST_HEALTH_ROUTES ?? "/,/briefing,/weekly,/stocks/2330,/stocks/TWII,/methodology,/disclaimer,/terms,/privacy")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const doc = read(docPath);
const publicState = read(publicStatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const board = read(boardPath);

for (const phrase of [
  "Status: `beta_runtime_fast_health_gate_ready`",
  "CEO decision: `add_fast_runtime_health_gate_to_prevent_overvalidation_drag`",
  "beta_runtime_fast_health_gate",
  "fast_runtime_health_available_for_beta_mainline",
  "Use `check:beta-runtime-fast-health` for regular PM mainline progress.",
  "Use `check:localhost-full-health` only when one of these is true:",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "check:beta-runtime-fast-health",
  "check:localhost-full-health",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const route of routes) {
  if (!doc.includes(`- \`${route}\``)) problems.push(`${docPath} missing route: ${route}`);
}

for (const phrase of [
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "claimApprovalState: \"not_approved\""
]) {
  if (!publicState.includes(phrase)) problems.push(`${publicStatePath} missing runtime boundary: ${phrase}`);
}

for (const forbidden of [
  "publicDataSource: \"supabase\"",
  "publicDataSource: \"real\"",
  "scoreSource: \"real\"",
  "claimApprovalState: \"approved\""
]) {
  if (publicState.includes(forbidden)) problems.push(`${publicStatePath} contains forbidden runtime boundary: ${forbidden}`);
}

if (pkg.scripts?.["check:beta-runtime-fast-health"] !== "node scripts/check-beta-runtime-fast-health.mjs") {
  problems.push(`${packagePath} missing check:beta-runtime-fast-health script`);
}

for (const phrase of [
  "scripts/check-beta-runtime-fast-health.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-runtime-fast-health\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest beta runtime fast health gate slice"],
  [statusPath, status, "beta_runtime_fast_health_gate_ready"],
  [boardPath, board, "`docs/BETA_RUNTIME_FAST_HEALTH_GATE.md` is `accepted` as PM mainline fast runtime health gate"],
  [boardPath, board, "fast_runtime_health_available_for_beta_mainline"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "production deployment",
  "preview deployment",
  "deployment command execution",
  "hosting project creation",
  "hosting project mutation",
  "DNS change",
  "SSL configuration change",
  "platform env mutation",
  "secret output",
  "secret storage action",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const routeResults = [];
for (const route of routes) {
  routeResults.push(await checkRoute(route));
}
const failedRoutes = routeResults.filter((result) => result.statusCode !== 200);

if (failedRoutes.length > 0) {
  for (const result of failedRoutes) {
    problems.push(`route ${result.route} expected HTTP 200, got ${result.statusCode}${result.error ? ` (${result.error})` : ""}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", baseUrl, routes: routeResults, problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_runtime_fast_health_gate_ready",
      outcome: "fast_runtime_health_available_for_beta_mainline",
      baseUrl,
      checkedRoutes: routeResults.map((result) => ({
        route: result.route,
        statusCode: result.statusCode
      })),
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      }
    },
    null,
    2
  )
);

async function checkRoute(route) {
  let lastResult = null;
  for (let attempt = 0; attempt <= routeRetryCount; attempt += 1) {
    lastResult = await fetchRouteOnce(route, attempt + 1);
    if (lastResult.statusCode === 200) return lastResult;
    if (attempt < routeRetryCount) await delay(routeRetryDelayMs);
  }

  return lastResult;
}

async function fetchRouteOnce(route, attempt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(new URL(route, baseUrl), {
      cache: "no-store",
      signal: controller.signal
    });
    return {
      attempt,
      ok: response.ok,
      route,
      statusCode: response.status
    };
  } catch (error) {
    return {
      attempt,
      error: error instanceof Error ? error.message : String(error),
      ok: false,
      route,
      statusCode: 0
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function delay(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
