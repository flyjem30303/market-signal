import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const node = process.execPath;
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";

const requiredByPath = {
  "/": ["30 秒看懂市場狀態", "示範資料", "不是投資建議"],
  "/stocks/2330": ["2330", "標的燈號 / 一眼判讀", "標的基本資料", "市場事件 / 新聞脈絡"],
  "/stocks/TWII": ["TWII", "標的燈號 / 一眼判讀", "標的基本資料", "市場事件 / 新聞脈絡"],
  "/stocks/0050": ["0050", "標的燈號 / 一眼判讀", "標的基本資料", "市場事件 / 新聞脈絡"],
  "/stocks/006208": ["006208", "標的燈號 / 一眼判讀", "標的基本資料", "市場事件 / 新聞脈絡"],
  "/stocks/2382": ["2382", "標的燈號 / 一眼判讀", "標的基本資料", "市場事件 / 新聞脈絡"],
  "/stocks/2308": ["2308", "標的燈號 / 一眼判讀", "標的基本資料", "市場事件 / 新聞脈絡"],
  "/briefing": ["市場快報", "3 分鐘把市場燈號拆成原因", "資料與風險邊界"],
  "/weekly": ["市場週報", "公開 Beta", "示範資料"]
};

const blockedFragments = [
  "Internal Server Error",
  "Unhandled Runtime Error",
  "cmd.exe",
  "PUBLIC_BETA_",
  "BETA_",
  "daily_prices",
  "raw market data",
  "candidateArtifactPath",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "publicDataSource",
  "scoreSource"
];

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;
const results = [];

try {
  for (const [path, required] of Object.entries(requiredByPath)) {
    results.push(await checkPath(path, required));
  }

  const status = results.every((result) => result.ok) ? "ok" : "blocked";
  console.log(
    JSON.stringify(
      {
        baseUrl,
        managedServer: managedServer ? { command: managedServer.commandLabel, started: true } : { started: false },
        results,
        status
      },
      null,
      2
    )
  );

  if (status !== "ok") process.exitCode = 1;
} finally {
  if (managedServer) stopManagedServer(managedServer.child);
}

async function checkPath(path, required) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
      const text = normalizeVisibleText(await response.text());
      const missing = required.filter((phrase) => !text.includes(phrase));
      const blocked = blockedFragments.filter((fragment) => text.includes(fragment));
      const mojibake = findBadTextMarkers(text);
      const ok = response.status === 200 && missing.length === 0 && blocked.length === 0 && mojibake.length === 0;
      if (ok || attempt === 4) {
        return { blocked, missing, mojibake, ok, attempt, path, statusCode: response.status };
      }
    } catch (error) {
      if (attempt === 4) {
        return {
          error: error instanceof Error ? error.message : String(error),
          ok: false,
          attempt,
          path,
          statusCode: 0
        };
      }
    }
    await delay(1000);
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
