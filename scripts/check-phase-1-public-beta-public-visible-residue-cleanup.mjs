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
  "/": ["市場總覽", "30 秒看懂今天的市場狀態", "資料狀態", "重要提醒"],
  "/briefing": ["市場快報", "30 秒看懂市場燈號", "下一步行動", "資料邊界"],
  "/weekly": ["市場週報", "市場燈號", "示範資料", "資料更新狀態"],
  "/methodology": ["方法說明", "燈號", "風險", "資料"],
  "/disclaimer": ["免責聲明", "不是投資建議", "不保證", "資料"],
  "/terms": ["使用條款", "市場資訊", "風險", "資料"],
  "/privacy": ["隱私政策", "Phase 1", "不啟用會員", "資料"],
  "/stocks/TWII": ["個股燈號", "綜合分數", "風險分數"],
  "/stocks/2330": ["個股燈號", "綜合分數", "風險分數"],
  "/stocks/0050": ["個股燈號", "綜合分數", "風險分數"],
  "/stocks/006208": ["個股燈號", "綜合分數", "風險分數"],
  "/stocks/2382": ["個股燈號", "綜合分數", "風險分數"],
  "/stocks/2308": ["個股燈號", "綜合分數", "風險分數"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "pre-launch",
  "PRE-LAUNCH",
  "hard blocker",
  "Hard Blocker",
  "HARD BLOCKER",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "packet",
  "operator",
  "commit ",
  "Git",
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
  "PM ",
  "CEO ",
  "A1 ",
  "A2 ",
  "A3 ",
  "A4 ",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO"
];

const routeResults = [];
const inaccessibleRouteResults = [];

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;

try {
  for (const route of publicRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      const html = await response.text();
      const visibleText = normalizeVisibleText(html);
      const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
      const mojibakeHits = findBadTextMarkers(visibleText);
      const missingRequiredSignals = (requiredPublicSignals[route] ?? []).filter(
        (phrase) => !visibleText.includes(phrase)
      );

      routeResults.push({
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
      });
    } catch (error) {
      routeResults.push({
        error: error instanceof Error ? error.message : String(error),
        pass: false,
        route
      });
    }
  }

  for (const route of inaccessiblePhase2Routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      inaccessibleRouteResults.push({
        pass: response.status === 404,
        route,
        status: response.status
      });
    } catch (error) {
      inaccessibleRouteResults.push({
        error: error instanceof Error ? error.message : String(error),
        pass: false,
        route
      });
    }
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
        managedServer: managedServer
          ? {
              command: managedServer.commandLabel,
              started: true
            }
          : {
              started: false
            },
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
  if (managedServer) {
    stopManagedServer(managedServer.child);
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
  const markers = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp === 0xfffd) markers.add("replacement-code-point");
    if (cp >= 0xe000 && cp <= 0xf8ff) markers.add("private-use-code-point");
    if (cp >= 0x80 && cp <= 0x9f) markers.add("c1-control-character");
  }
  if (/\?{3,}/u.test(text)) markers.add("question-mark-run");
  return [...markers];
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

  return {
    child,
    commandLabel: hasProductionBuild ? "next start" : "next dev"
  };
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
  if (next.Path && next.PATH) {
    delete next.PATH;
  }
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
