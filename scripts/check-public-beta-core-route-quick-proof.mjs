import fs from "node:fs";
import http from "node:http";

const baseUrl = process.env.PUBLIC_BETA_QUICK_PROOF_BASE_URL ?? "http://localhost:3000";
const timeoutMs = Number.parseInt(process.env.PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS ?? "20000", 10);

const routes = [
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

const routeContracts = [
  {
    file: "src/app/briefing/page.tsx",
    tokens: ["PublicRuntimeStateStrip", "DataFreshnessStrip"]
  },
  {
    file: "src/app/weekly/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel", "WeeklyRowCoverageStatus"]
  },
  {
    file: "src/app/disclaimer/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel", "示範資料", "非投資建議"]
  },
  {
    file: "src/app/terms/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel", "正式市場資料尚未啟用"]
  },
  {
    file: "src/app/privacy/page.tsx",
    tokens: ["TrustRuntimeBoundaryNotice", "RouteLocalTrustCopyPanel", "不公開原始市場資料內容"]
  },
  {
    file: "src/components/trust-runtime-boundary-notice.tsx",
    tokens: ["publicDataSource=mock; scoreSource=mock", "not investment advice", "not live or complete market data"]
  },
  {
    file: "src/components/public-beta-launch-readiness-panel.tsx",
    tokens: ["PublicBetaLaunchReadinessPanel", "publicDataSource", "scoreSource"]
  }
];

const scanRoots = ["src/app", "src/components", "src/lib"];
const missing = [];
const blocked = [];

for (const contract of routeContracts) {
  const source = read(contract.file);
  for (const token of contract.tokens) {
    if (!source.includes(token)) missing.push(`${contract.file}: ${token}`);
  }
}

for (const file of collectFiles(scanRoots)) {
  const source = read(file);
  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${file}: ${marker}`);
  }
}

for (const [file, source] of [
  ["src/lib/runtime-product-summary.ts", read("src/lib/runtime-product-summary.ts")],
  ["src/lib/public-beta-launch-readiness.ts", read("src/lib/public-beta-launch-readiness.ts")]
]) {
  if (source.includes('scoreSource: "real"')) blocked.push(`${file}: scoreSource real`);
  if (source.includes('publicDataSource: "supabase"')) blocked.push(`${file}: publicDataSource supabase`);
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

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    missing.push(`${filePath}: file exists`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function collectFiles(roots) {
  const files = [];

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    walk(root);
  }

  return files;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filePath = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(filePath);
      } else if (/\.(ts|tsx)$/u.test(entry.name)) {
        files.push(filePath);
      }
    }
  }
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  if (/[嚗]{2,}/u.test(text)) markers.push("common-mojibake-run");
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}

function checkRoute(route) {
  const url = new URL(route, baseUrl);

  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
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
