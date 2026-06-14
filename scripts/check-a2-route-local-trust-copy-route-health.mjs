import fs from "node:fs";
import { spawn } from "node:child_process";

const node = process.execPath;
const docPath = "docs/A2_ROUTE_LOCAL_TRUST_COPY_ROUTE_HEALTH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const defaultBaseUrl = process.env.A2_ROUTE_LOCAL_TRUST_COPY_BASE_URL ?? "http://localhost:3000";
const fallbackBaseUrl = process.env.A2_ROUTE_LOCAL_TRUST_COPY_FALLBACK_BASE_URL ?? "http://localhost:3101";

const routes = [
  { path: "/weekly", required: ["市場週報", "30 秒", "3 分鐘", "正式資料尚未啟用", "不提供買賣建議"] },
  { path: "/methodology", required: ["方法說明", "燈號方法", "資料品質", "資料狀態", "不提供買賣建議"] },
  { path: "/disclaimer", required: ["風險聲明", "公開 Beta", "不是投資建議", "市場風險自負", "正式市場資料尚未啟用"] },
  { path: "/terms", required: ["使用條款", "市場資訊整理", "風險辨識", "資料來源", "自行承擔風險"] },
  { path: "/privacy", required: ["隱私權與資料說明", "公開 Beta", "資料來源", "交易帳戶", "會員功能資料邊界"] }
];

const forbidden = [
  "Internal Server Error",
  "Application error",
  "Unhandled Runtime Error",
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate",
  "publicDataSource: supabase",
  "scoreSource: real",
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed"
];

const missing = [];
const blocked = [];
let managedServer = null;

function read(path) {
  if (!fs.existsSync(path)) {
    missing.push(`${path}: file exists`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}

const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const token of [
  "a2_route_local_trust_copy_route_health_ready",
  "bounded_local_route_health",
  "CEO decision: `verify_route_local_trust_copy_health_before_returning_to_data_coverage`.",
  "PM route: `route_health_for_weekly_methodology_legal_pages_then_data_coverage_source_rights_unblock`.",
  "## Route Scope",
  "## Required Runtime / Trust Evidence",
  "## Boundary",
  "## Acceptance",
  "## PM Result",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "data_coverage_source_rights_unblock_after_route_health_green"
]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

if (packageJson.scripts?.["check:a2-route-local-trust-copy-route-health"] !== "node scripts/check-a2-route-local-trust-copy-route-health.mjs") {
  missing.push(`${packagePath}: check:a2-route-local-trust-copy-route-health`);
}

if (!reviewGate.includes("scripts/check-a2-route-local-trust-copy-route-health.mjs")) {
  missing.push(`${reviewGatePath}: checker registered`);
}

if (!reviewGate.includes('"a2-route-local-trust-copy-route-health"')) {
  missing.push(`${reviewGatePath}: core review gate name`);
}

let baseUrl = defaultBaseUrl;
const initialRoot = await canFetchRoot(defaultBaseUrl);

if (!initialRoot) {
  managedServer = await startTemporaryServer(fallbackBaseUrl);
  baseUrl = fallbackBaseUrl;
}

const routeResults = [];

try {
  for (const route of routes) {
    routeResults.push(await checkRoute(baseUrl, route));
  }
} finally {
  if (managedServer) {
    managedServer.kill();
  }
}

for (const result of routeResults) {
  for (const item of result.missing) missing.push(`${result.path}: ${item}`);
  for (const item of result.blocked) blocked.push(`${result.path}: ${item}`);
  if (result.statusCode !== 200) blocked.push(`${result.path}: HTTP ${result.statusCode}`);
}

const output = {
  baseUrl,
  blocked,
  checked: {
    forbidden: forbidden.length,
    managedServer: Boolean(managedServer),
    routes: routes.length
  },
  missing,
  results: routeResults,
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(output, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

async function checkRoute(baseUrl, route) {
  try {
    const response = await fetch(new URL(route.path, baseUrl), { cache: "no-store" });
    const text = await response.text();
    return {
      blocked: forbidden.filter((token) => text.includes(token)),
      missing: route.required.filter((token) => !text.includes(token)),
      path: route.path,
      statusCode: response.status
    };
  } catch (error) {
    return {
      blocked: [error instanceof Error ? error.message : String(error)],
      missing: route.required,
      path: route.path,
      statusCode: 0
    };
  }
}

async function canFetchRoot(baseUrl) {
  try {
    const response = await fetch(new URL("/", baseUrl), { cache: "no-store" });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function startTemporaryServer(baseUrl) {
  const port = new URL(baseUrl).port || "3101";
  const hasProductionBuild = fs.existsSync(".next/BUILD_ID");
  const args = hasProductionBuild
    ? ["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", port]
    : ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", port];
  const child = spawn(node, args, {
    cwd: process.cwd(),
    env: normalizeEnv(process.env),
    stdio: "ignore",
    windowsHide: true
  });

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canFetchRoot(baseUrl)) return child;
    await delay(1000);
  }

  child.kill();
  throw new Error(`temporary route health server did not become ready at ${baseUrl}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEnv(env) {
  const next = { ...env };
  if (next.Path && next.PATH) {
    delete next.PATH;
  }

  return next;
}
