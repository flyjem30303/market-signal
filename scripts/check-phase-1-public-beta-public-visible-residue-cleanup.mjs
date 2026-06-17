import fs from "node:fs";
import { spawn } from "node:child_process";

const node = process.execPath;
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";

const publicRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy",
  "/stocks/TWII",
  "/stocks/2330",
  "/stocks/0050",
  "/stocks/006208",
  "/stocks/2382",
  "/stocks/2308"
];

const inaccessiblePhase2Routes = [
  "/membership",
  "/watchlist",
  "/internal",
  "/internal/cp3-dry-run",
  "/internal/raw-market-preview",
  "/internal/etf-source-readiness",
  "/api/internal/raw-market"
];

const requiredPublicSignals = {
  "/": ["30 秒看懂台股市場氛圍", "資料邊界", "風險聲明"],
  "/briefing": ["市場快報", "市場摘要", "資料與風險邊界"],
  "/weekly": ["市場週報", "週報摘要", "示範資料"],
  "/methodology": ["方法說明", "核心模組", "燈號"],
  "/disclaimer": ["風險聲明", "不是投資建議", "投資決策"],
  "/terms": ["使用條款", "資訊用途", "資料限制"],
  "/privacy": ["隱私權政策", "不建立會員資料", "未來會員"],
  "/stocks/TWII": ["TWII", "標的燈號", "資料邊界"],
  "/stocks/2330": ["2330", "標的燈號", "資料邊界"],
  "/stocks/0050": ["0050", "標的燈號", "資料邊界"],
  "/stocks/006208": ["006208", "標的燈號", "資料邊界"],
  "/stocks/2382": ["2382", "標的燈號", "資料邊界"],
  "/stocks/2308": ["2308", "標的燈號", "資料邊界"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "pre-launch",
  "PRE-LAUNCH",
  "hard blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "packet",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "mock data",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate",
  "real-data promotion",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "Phase 1",
  "Phase 2"
];

const routeResults = [];
const inaccessibleRouteResults = [];
const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;

try {
  for (const route of publicRoutes) {
    routeResults.push(await checkPublicRoute(route));
  }

  for (const route of inaccessiblePhase2Routes) {
    inaccessibleRouteResults.push(await checkInaccessibleRoute(route));
  }

  const status =
    routeResults.every((result) => result.pass) && inaccessibleRouteResults.every((result) => result.pass)
      ? "ok"
      : "blocked";

  console.log(
    JSON.stringify(
      {
        status,
        guardedStatus: "phase_1_public_beta_public_visible_residue_cleanup_ready_for_users",
        managedServer: managedServer ? { command: managedServer.commandLabel, started: true } : { started: false },
        checkedRoutes: publicRoutes.length,
        checkedInaccessiblePhase2Routes: inaccessiblePhase2Routes.length,
        routeResults,
        inaccessibleRouteResults,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      null,
      2
    )
  );

  if (status !== "ok") process.exitCode = 1;
} finally {
  if (managedServer) stopManagedServer(managedServer.child);
}

async function checkPublicRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const visibleText = normalizeVisibleText(html);
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findBadTextMarkers(visibleText);
    const missingRequiredSignals = (requiredPublicSignals[route] ?? []).filter(
      (phrase) => !visibleText.includes(phrase)
    );

    return {
      forbiddenHits,
      missingRequiredSignals,
      mojibakeHits,
      pass:
        response.status === 200 &&
        forbiddenHits.length === 0 &&
        mojibakeHits.length === 0 &&
        missingRequiredSignals.length === 0,
      route,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    };
  }
}

async function checkInaccessibleRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    return {
      pass: [401, 404].includes(response.status),
      route,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    };
  }
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findBadTextMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(text)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  for (const fragment of ["蝷", "撣", "鞈", "憸", "閫", "璅", "嚗", "銝", "蝘", "甇", "霅", "靽", "蝬", "", "", "", "", ""]) {
    if (text.includes(fragment)) markers.push(`legacy-mojibake-fragment:${fragment}`);
  }
  return markers;
}

async function startTemporaryServer() {
  const hasProductionBuild = fs.existsSync(".next/BUILD_ID");
  const args = hasProductionBuild
    ? ["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", "3000"]
    : ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", "3000"];
  const child = spawn(node, args, {
    cwd: process.cwd(),
    env: normalizeEnv(process.env),
    stdio: "ignore",
    windowsHide: true
  });

  const ready = await waitForRoot();
  if (!ready) {
    child.kill();
    throw new Error("temporary localhost server did not become ready");
  }

  return { child, commandLabel: hasProductionBuild ? "next start" : "next dev" };
}

async function waitForRoot() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canFetchRoot()) return true;
    await delay(1000);
  }
  return false;
}

async function canFetchRoot() {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

function stopManagedServer(child) {
  child.kill();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEnv(env) {
  const nextEnv = { ...env };
  nextEnv.NEXT_TELEMETRY_DISABLED = "1";
  return nextEnv;
}
