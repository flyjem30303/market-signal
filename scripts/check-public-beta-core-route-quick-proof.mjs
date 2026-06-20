import fs from "node:fs";
import http from "node:http";
import https from "node:https";

const baseUrl = process.env.PUBLIC_BETA_QUICK_PROOF_BASE_URL ?? "http://localhost:3000";
const timeoutMs = Number.parseInt(process.env.PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS ?? "20000", 10);

const publicRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/stocks/2330",
  "/stocks/TWII",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy"
];

const phaseTwoRoutes = ["/membership", "/watchlist"];

const sourceFiles = [
  "src/components/dashboard-shell.tsx",
  "src/components/market-watchlist-panel.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/sitemap.ts"
];

const routeVisibleContracts = [
  { route: "/", tokens: ["台股市場燈號", "今日重點", "搜尋股票"] },
  { route: "/briefing", tokens: ["市場快報", "主要支撐", "主要拖累"] },
  { route: "/weekly", tokens: ["市場週報", "本週市場摘要", "本週主要支撐"] },
  { route: "/stocks/2330", tokens: ["2330", "市場診斷", "搜尋股票"] },
  { route: "/stocks/TWII", tokens: ["TWII", "市場診斷", "搜尋股票"] },
  { route: "/methodology", tokens: ["方法說明", "燈號", "風險分數"] },
  { route: "/disclaimer", tokens: ["風險聲明", "不提供個股買賣建議", "可能延遲或缺漏"] },
  { route: "/terms", tokens: ["使用條款", "市場觀察", "不構成投資建議"] },
  { route: "/privacy", tokens: ["隱私權政策", "目前沒有帳號系統", "儲存在你的瀏覽器"] }
];

const missing = [];
const blocked = [];
const forbiddenPublicSourceFragments = [
  "cmd.exe",
  "PUBLIC_BETA_",
  "BETA_",
  "raw market data",
  "candidateArtifactPath",
  "OFFICIAL-",
  "workflow proof",
  "hard blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  'scoreSource: "real"',
  'publicDataSource: "supabase"'
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
  ["src/components/dashboard-shell.tsx", read("src/components/dashboard-shell.tsx")]
]) {
  if (source.includes('scoreSource: "real"')) blocked.push(`${file}: scoreSource real`);
  if (source.includes('publicDataSource: "supabase"')) blocked.push(`${file}: publicDataSource supabase`);
  if (/createClient\(/u.test(source)) blocked.push(`${file}: Supabase client use`);
}

const publicRouteResults = [];
for (const route of publicRoutes) {
  publicRouteResults.push(await checkRoute(route));
}

const phaseTwoRouteResults = [];
for (const route of phaseTwoRoutes) {
  phaseTwoRouteResults.push(await checkRoute(route));
}

for (const result of publicRouteResults) {
  if (result.statusCode !== 200) blocked.push(`${result.route}: HTTP ${result.statusCode}`);
  for (const marker of findMojibakeMarkers(result.text ?? "")) {
    blocked.push(`${result.route}: ${marker}`);
  }
}

for (const result of phaseTwoRouteResults) {
  if (![401, 404].includes(result.statusCode)) {
    blocked.push(`${result.route}: Phase 2 route should stay unavailable, got HTTP ${result.statusCode}`);
  }
  for (const marker of findMojibakeMarkers(result.text ?? "")) {
    blocked.push(`${result.route}: ${marker}`);
  }
}

for (const contract of routeVisibleContracts) {
  const result = publicRouteResults.find((item) => item.route === contract.route);
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
    phaseTwoRoutes: phaseTwoRouteResults.map(({ route, statusCode }) => ({ route, statusCode })),
    routes: publicRouteResults.map(({ route, statusCode }) => ({ route, statusCode }))
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
  if (/[\uE000-\uF8FF\uFFFD]/u.test(source)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
