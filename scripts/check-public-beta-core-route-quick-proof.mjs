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
  "src/app/sitemap.ts"
];

const routeVisibleContracts = [
  { route: "/", tokens: ["公開 Beta", "30 秒", "3 分鐘", "市場總覽", "資料狀態", "非投資建議"] },
  { route: "/briefing", tokens: ["市場簡報", "30 秒", "3 分鐘", "警示清單", "資料邊界", "正式資料尚未啟用"] },
  { route: "/weekly", tokens: ["市場週報", "本週市場狀態", "示範資料", "不提供買賣建議"] },
  { route: "/membership", tokens: ["會員 MVP", "第二階段", "市場三層解讀", "自選追蹤", "自訂警示"] },
  { route: "/stocks/2330", tokens: ["2330", "指數燈號", "資料來源與覆蓋", "3 分鐘閱讀順序", "不是投資建議"] },
  { route: "/stocks/TWII", tokens: ["TWII", "指數燈號", "資料來源與覆蓋", "3 分鐘閱讀順序", "不是投資建議"] },
  { route: "/methodology", tokens: ["方法說明", "燈號方法", "資料狀態", "不是交易指令"] },
  { route: "/disclaimer", tokens: ["風險聲明", "市場資訊整理", "不構成個股買賣建議", "示範資料"] },
  { route: "/terms", tokens: ["使用條款", "市場觀察", "不能當作交易指令", "資料來源"] },
  { route: "/privacy", tokens: ["隱私", "會員功能", "自選追蹤", "自訂警示"] }
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
  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${file}: ${marker}`);
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
  for (const marker of findMojibakeMarkers(result.text ?? "")) {
    blocked.push(`${result.route}: ${marker}`);
  }
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

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (source.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return markers;
}
