import fs from "node:fs";
import http from "node:http";
import https from "node:https";

const baseUrl = process.env.PUBLIC_BETA_QUICK_PROOF_BASE_URL ?? "http://localhost:3000";
const timeoutMs = Number.parseInt(process.env.PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS ?? "20000", 10);

const routes = [
  "/",
  "/briefing",
  "/weekly",
  "/membership",
  "/stocks/2330",
  "/stocks/TWII",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy"
];

const sourceFiles = [
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/membership/page.tsx",
  "src/components/public-beta-membership-mvp-roadmap.tsx",
  "src/components/public-beta-public-status-surface.tsx",
  "src/components/public-beta-source-coverage-bridge.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/sitemap.xml/route.ts"
];

const routeVisibleContracts = [
  { route: "/", tokens: ["指數狀態儀表站", "30 秒", "3 分鐘", "資料更新時間", "不提供個股買賣建議"] },
  { route: "/briefing", tokens: ["每日市場晨報", "30 秒", "3 分鐘", "資料狀態", "示範資料"] },
  { route: "/weekly", tokens: ["市場週報", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"] },
  { route: "/membership", tokens: ["會員功能預覽", "會員 MVP", "watchlist", "盤後複盤", "不是會員入口"] },
  { route: "/stocks/2330", tokens: ["2330", "狀態儀表", "標的快速判讀", "資料邊界", "不能當成個股買賣指令"] },
  { route: "/stocks/TWII", tokens: ["TWII", "狀態儀表", "標的快速判讀", "資料邊界", "不能當成個股買賣指令"] },
  { route: "/methodology", tokens: ["方法說明", "資料來源", "示範資料", "不提供買賣建議"] },
  { route: "/disclaimer", tokens: ["風險聲明", "資料來源", "投資決策", "不提供買賣建議"] },
  { route: "/terms", tokens: ["使用條款", "資料來源", "不是投資建議"] },
  { route: "/privacy", tokens: ["隱私權與資料說明", "資料", "會員"] }
];

const missing = [];
const blocked = [];
const forbiddenPublicSourceFragments = [
  "cmd.exe",
  "PUBLIC_BETA_",
  "BETA_",
  "daily_prices",
  "raw market data",
  "candidateArtifactPath",
  "OFFICIAL-",
  "workflow proof",
  "hard blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY"
];

for (const file of sourceFiles) {
  const source = read(file);
  for (const fragment of forbiddenPublicSourceFragments) {
    if (source.includes(fragment)) blocked.push(`${file}: public source residue ${fragment}`);
  }
}

for (const [file, source] of [
  ["src/lib/runtime-product-summary.ts", read("src/lib/runtime-product-summary.ts")],
  ["src/lib/public-beta-launch-readiness.ts", read("src/lib/public-beta-launch-readiness.ts")],
  ["src/components/dashboard-shell.tsx", read("src/components/dashboard-shell.tsx")],
  ["src/app/membership/page.tsx", read("src/app/membership/page.tsx")]
]) {
  if (source.includes('scoreSource: "real"')) blocked.push(`${file}: scoreSource real`);
  if (source.includes('publicDataSource: "supabase"')) blocked.push(`${file}: publicDataSource supabase`);
  if (/createClient\(/u.test(source)) blocked.push(`${file}: Supabase client use`);
}

const routeResults = [];
for (const route of routes) {
  routeResults.push(await checkRoute(route));
}

for (const result of routeResults) {
  if (result.statusCode !== 200) blocked.push(`${result.route}: HTTP ${result.statusCode}`);
}

for (const contract of routeVisibleContracts) {
  const result = routeResults.find((item) => item.route === contract.route);
  const text = result?.text ?? "";
  for (const token of contract.tokens) {
    if (!text.includes(token)) missing.push(`${contract.route}: ${token}`);
  }
}

const result = {
  blocked,
  checked: {
    baseUrl,
    files: sourceFiles.length,
    routes: routeResults.map(({ route, statusCode }) => ({ route, statusCode }))
  },
  missing,
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    missing.push(`${filePath}: file exists`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function checkRoute(route) {
  const url = new URL(route, baseUrl);
  const client = url.protocol === "https:" ? https : http;

  return new Promise((resolve) => {
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      resolve({ error: `unsupported protocol ${url.protocol}`, route, statusCode: 0 });
      return;
    }

    const request = client.get(url, (response) => {
      let html = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        html += chunk;
      });
      response.on("end", () => {
        resolve({ route, statusCode: response.statusCode ?? 0, text: normalizeVisibleText(html) });
      });
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error("timeout"));
    });

    request.on("error", (error) => {
      resolve({ error: error.message, route, statusCode: 0 });
    });
  });
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
