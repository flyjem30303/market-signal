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
    file: "src/app/briefing/page.tsx",
    tokens: ["DataFreshnessStrip", "PublicBetaDataReadinessStatus", "PublicBetaSourceCoverageBridge"]
  },
  {
    file: "src/components/dashboard-shell.tsx",
    tokens: ["指數狀態儀表站", "正式市場資料尚未啟用", "不提供個股買賣建議"]
  },
  {
    file: "src/app/membership/page.tsx",
    tokens: ["會員功能預覽", "每日市場三層解讀", "Watchlist 與自訂警示", "盤後複盤報告"]
  },
  {
    file: "src/components/public-beta-membership-mvp-roadmap.tsx",
    tokens: ["下一階段會員功能", "查看會員功能預覽", 'href="/membership"']
  },
  {
    file: "src/components/trust-runtime-boundary-notice.tsx",
    tokens: ["非投資建議", "正式資料狀態", "示範資料"]
  },
  {
    file: "src/app/weekly/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel", "WeeklyRowCoverageStatus"]
  },
  {
    file: "src/app/disclaimer/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel"]
  },
  {
    file: "src/app/terms/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel"]
  },
  {
    file: "src/app/privacy/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel"]
  },
  {
    file: "src/app/sitemap.xml/route.ts",
    tokens: ['"/membership"']
  }
];

const missing = [];
const blocked = [];

for (const contract of routeContracts) {
  const source = read(contract.file);
  for (const token of contract.tokens) {
    if (!source.includes(token)) missing.push(`${contract.file}: ${token}`);
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
