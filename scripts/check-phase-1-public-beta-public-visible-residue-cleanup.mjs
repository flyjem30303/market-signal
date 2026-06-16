import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";

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
  "/": ["市場總覽 / 快速判讀", "30 秒看懂今天的市場狀態", "資料狀態", "重要提醒"],
  "/briefing": ["市場快報", "30 秒看懂市場燈號", "下一步行動", "資料邊界"],
  "/weekly": ["市場週報", "市場燈號", "示範資料", "資料更新狀態"],
  "/methodology": ["方法說明", "燈號", "風險分數", "資料狀態"],
  "/disclaimer": ["免責聲明", "不是投資建議", "資料限制", "示範資料"],
  "/terms": ["使用條款", "市場資訊整理", "風險", "示範資料"],
  "/privacy": ["隱私政策", "Phase 1", "不啟用會員", "資料"],
  "/stocks/TWII": ["個股燈號 / 一眼判讀", "綜合分數", "風險分數"],
  "/stocks/2330": ["個股燈號 / 一眼判讀", "綜合分數", "風險分數"],
  "/stocks/0050": ["個股燈號 / 一眼判讀", "綜合分數", "風險分數"],
  "/stocks/006208": ["個股燈號 / 一眼判讀", "綜合分數", "風險分數"],
  "/stocks/2382": ["個股燈號 / 一眼判讀", "綜合分數", "風險分數"],
  "/stocks/2308": ["個股燈號 / 一眼判讀", "綜合分數", "風險分數"]
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
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH"
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
      pass: response.status === 404,
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
  for (const fragment of ["撣", "憸券", "鞈", "蝷箇", "嚗", "銝", "甇"]) {
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
    const response = await fetch(new URL("/", baseUrl), { cache: "no-store" });
    return response.status === 200;
  } catch {
    return false;
  }
}

function normalizeEnv(env) {
  const next = { ...env };
  if (next.Path && next.PATH) delete next.PATH;
  return next;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stopManagedServer(child) {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    return;
  }
  child.kill();
}
