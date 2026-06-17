import fs from "node:fs";
import { spawn } from "node:child_process";

const node = process.execPath;
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";

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

const inaccessibleRoutes = [
  "/membership",
  "/watchlist",
  "/internal",
  "/internal/cp3-dry-run",
  "/internal/etf-source-readiness",
  "/internal/raw-market-preview",
  "/api/internal/raw-market?symbol=2330"
];

const publicSourceFiles = [
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/components/public-data-source-boundary-notice.tsx",
  "src/components/public-next-reading-flow.tsx",
  "src/components/public-route-reading-contract.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/lib/assets.ts",
  "src/lib/market-data.ts",
  "src/lib/signal-model.ts"
];

const requiredByRoute = {
  "/": ["公開 Beta / 指數狀態儀表站", "30 秒看懂台股市場氛圍", "資料邊界", "風險聲明"],
  "/briefing": ["市場快報", "3 分鐘把市場燈號拆成原因", "資料與風險邊界", "市場摘要"],
  "/weekly": ["市場週報", "回看本週市場狀態與風險變化", "示範資料"],
  "/methodology": ["方法說明", "燈號幫你建立觀察順序", "核心模組"],
  "/disclaimer": ["風險聲明", "不是投資建議", "不保證任何投資結果"],
  "/terms": ["使用條款", "資訊用途與限制", "使用者需自行判斷風險"],
  "/privacy": ["隱私權政策", "不建立會員資料", "未來會員"],
  "/stocks/TWII": ["TWII", "標的燈號", "綜合分數", "風險分數"],
  "/stocks/2330": ["2330", "標的燈號", "綜合分數", "風險分數"],
  "/stocks/0050": ["0050", "標的燈號", "綜合分數", "風險分數"],
  "/stocks/006208": ["006208", "標的燈號", "綜合分數", "風險分數"],
  "/stocks/2382": ["2382", "標的燈號", "綜合分數", "風險分數"],
  "/stocks/2308": ["2308", "標的燈號", "綜合分數", "風險分數"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "hard blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "preflight",
  "post-run",
  "operator",
  "PUBLIC_BETA",
  "BETA_",
  "publicDataSource",
  "scoreSource",
  "daily_prices",
  "staging rows",
  "raw payload",
  "candidateArtifactPath",
  "source_row_hash",
  "Phase 1",
  "Phase 2",
  "promotion gate",
  "mock-only",
  "mock data"
];

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;
const publicResults = [];
const inaccessibleResults = [];

try {
  for (const route of publicRoutes) {
    publicResults.push(await checkPublicRoute(route));
  }

  for (const route of inaccessibleRoutes) {
    inaccessibleResults.push(await checkInaccessibleRoute(route));
  }

  const sourceResults = checkPublicSourceFiles();
  const registrationResults = checkRegistration();
  const blocked = [
    ...publicResults.filter((result) => !result.pass),
    ...inaccessibleResults.filter((result) => !result.pass),
    ...sourceResults.filter((result) => !result.pass),
    ...registrationResults.filter((result) => !result.pass)
  ];
  const status = blocked.length === 0 ? "ok" : "blocked";

  console.log(
    JSON.stringify(
      {
        baseUrl,
        blocked,
        managedServer: managedServer ? { command: managedServer.commandLabel, started: true } : { started: false },
        checkedInaccessibleRoutes: inaccessibleRoutes.length,
        checkedPublicRoutes: publicRoutes.length,
        checkedPublicSourceFiles: publicSourceFiles.length,
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

async function checkPublicRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const visibleText = normalizeVisibleText(html);
    const missing = (requiredByRoute[route] ?? []).filter((phrase) => !visibleText.includes(phrase));
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findBadTextMarkers(visibleText);

    return {
      forbiddenHits,
      missing,
      mojibakeHits,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && mojibakeHits.length === 0,
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
    const visibleText = normalizeVisibleText(await response.text());
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findBadTextMarkers(visibleText);

    return {
      forbiddenHits,
      mojibakeHits,
      pass: [401, 404].includes(response.status) && forbiddenHits.length === 0 && mojibakeHits.length === 0,
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

function checkPublicSourceFiles() {
  return publicSourceFiles.map((file) => {
    const source = fs.readFileSync(file, "utf8");
    const mojibakeHits = findBadTextMarkers(source);
    return {
      file,
      mojibakeHits,
      pass: mojibakeHits.length === 0
    };
  });
}

function checkRegistration() {
  const packageJson = fs.readFileSync(packagePath, "utf8");
  const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
  const checker = fs.readFileSync(checkerPath, "utf8");

  return [
    {
      check: "package script registered",
      pass: packageJson.includes('"check:public-visible-language-quality"')
    },
    {
      check: "review gate registered",
      pass: reviewGate.includes("scripts/check-public-visible-language-quality.mjs")
    },
    {
      check: "checker guards public routes",
      pass: checker.includes('"/briefing"') && checker.includes('"/stocks/2330"')
    }
  ];
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
