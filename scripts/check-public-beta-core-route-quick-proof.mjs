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

const inaccessibleRoutes = ["/membership", "/watchlist"];

const sourceFiles = [
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
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
  { route: "/", tokens: ["市場總覽 / 快速判讀", "30 秒", "示範資料", "免責聲明"] },
  { route: "/briefing", tokens: ["市場快報", "30 秒看懂市場燈號", "下一步行動", "資料邊界"] },
  { route: "/weekly", tokens: ["市場週報", "本週市場狀態回顧", "示範資料", "不是投資建議"] },
  { route: "/stocks/2330", tokens: ["2330", "個股燈號 / 一眼判讀", "示範資料", "免責聲明"] },
  { route: "/stocks/TWII", tokens: ["TWII", "個股燈號 / 一眼判讀", "示範資料", "免責聲明"] },
  { route: "/methodology", tokens: ["方法說明", "燈號", "風險分數", "不是投資建議"] },
  { route: "/disclaimer", tokens: ["風險聲明", "不是投資建議", "示範資料"] },
  { route: "/terms", tokens: ["使用條款", "市場資訊整理", "示範資料"] },
  { route: "/privacy", tokens: ["隱私權", "公開免費版", "會員"] }
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

const inaccessibleRouteResults = [];
for (const route of inaccessibleRoutes) {
  inaccessibleRouteResults.push(await checkRoute(route));
}

for (const result of publicRouteResults) {
  if (result.statusCode !== 200) blocked.push(`${result.route}: HTTP ${result.statusCode}`);
  for (const marker of findMojibakeMarkers(result.text ?? "")) {
    blocked.push(`${result.route}: ${marker}`);
  }
}

for (const result of inaccessibleRouteResults) {
  if (![401, 404].includes(result.statusCode)) blocked.push(`${result.route}: expected inaccessible route, got HTTP ${result.statusCode}`);
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
    inaccessibleRoutes: inaccessibleRouteResults.map(({ route, statusCode }) => ({ route, statusCode })),
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
  for (const fragment of ["撣", "憸券", "鞈", "蝷箇", "嚗", "銝", "甇"]) {
    if (source.includes(fragment)) markers.push(`legacy-mojibake-fragment:${fragment}`);
  }
  return markers;
}
