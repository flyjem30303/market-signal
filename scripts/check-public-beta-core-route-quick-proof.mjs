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

const routeContracts = [
  {
    file: "src/components/dashboard-shell.tsx",
    tokens: ["指數燈號", "30 秒", "3 分鐘", "資料品質", "不提供買賣建議"]
  },
  {
    file: "src/app/briefing/page.tsx",
    tokens: ["市場晨報", "3 分鐘判斷順序", "資料來源", "會員功能預覽", "不提供買賣建議"]
  },
  {
    file: "src/app/weekly/page.tsx",
    tokens: ["市場週報", "30 秒", "3 分鐘", "正式資料尚未啟用", "不提供買賣建議"]
  },
  {
    file: "src/app/membership/page.tsx",
    tokens: ["會員功能預覽", "這頁是會員路線圖，不是會員入口", "每日市場三層解讀", "Watchlist 與自訂警示", "盤後複盤報告"]
  },
  {
    file: "src/components/public-beta-membership-mvp-roadmap.tsx",
    tokens: ["下一階段會員功能", "會員內容會在公開 Beta 穩定後開放", "查看會員功能預覽", 'href="/membership"']
  },
  {
    file: "src/components/public-beta-public-status-surface.tsx",
    tokens: ["目前公開使用狀態", "surface.headline", "surface.stopLine"]
  },
  {
    file: "src/components/public-beta-source-coverage-bridge.tsx",
    tokens: ["資料來源與覆蓋狀態", "資料品質", "升級條件", "查看風險聲明"]
  },
  {
    file: "src/app/methodology/page.tsx",
    tokens: ["方法說明", "資料品質", "正式市場資料尚未啟用", "不提供買賣建議"]
  },
  {
    file: "src/app/disclaimer/page.tsx",
    tokens: ["風險聲明", "資料來源", "覆蓋率", "不提供買賣建議"]
  },
  {
    file: "src/app/terms/page.tsx",
    tokens: ["使用條款", "不是投資建議", "資料來源", "自行承擔風險"]
  },
  {
    file: "src/app/privacy/page.tsx",
    tokens: ["隱私權與資料說明", "資料來源", "不要在任何表單", "會員功能資料邊界"]
  },
  {
    file: "src/app/sitemap.xml/route.ts",
    tokens: ['"/membership"']
  }
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

for (const contract of routeContracts) {
  const source = read(contract.file);
  for (const token of contract.tokens) {
    if (!source.includes(token)) missing.push(`${contract.file}: ${token}`);
  }

  for (const fragment of forbiddenPublicSourceFragments) {
    if (source.includes(fragment)) blocked.push(`${contract.file}: public source residue ${fragment}`);
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

const result = {
  blocked,
  checked: {
    baseUrl,
    files: routeContracts.length,
    routes: routeResults
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
      response.resume();
      response.on("end", () => {
        resolve({ route, statusCode: response.statusCode ?? 0 });
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
