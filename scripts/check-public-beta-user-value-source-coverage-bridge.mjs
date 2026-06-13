import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const componentPath = "src/components/public-beta-source-coverage-bridge.tsx";
const sourceChecks = [
  {
    path: "src/components/dashboard-shell.tsx",
    required: ["PublicBetaSourceCoverageBridge", 'context={isStockPage ? "stock" : "home"}']
  },
  {
    path: "src/app/briefing/page.tsx",
    required: ["PublicBetaSourceCoverageBridge", 'context="briefing"']
  },
  {
    path: componentPath,
    required: [
      "PublicBetaSourceCoverageBridge",
      "資料來源與覆蓋率",
      "升級條件",
      "正式市場資料尚未啟用",
      "不提供買賣建議",
      "查看方法說明",
      "查看風險聲明",
      "回到市場晨報",
      'href="/methodology"',
      'href="/disclaimer"',
      'href="/briefing"',
      "source_coverage_bridge_action_path"
    ]
  }
];

const routeChecks = [
  {
    path: "/",
    required: [
      "資料來源與覆蓋率",
      "資料範圍",
      "覆蓋範圍",
      "升級條件",
      "查看方法說明",
      "查看風險聲明",
      "回到市場晨報",
      "正式市場資料尚未啟用",
      "不提供買賣建議"
    ]
  },
  {
    path: "/briefing",
    required: [
      "資料來源與覆蓋率",
      "資料範圍",
      "覆蓋範圍",
      "升級條件",
      "查看方法說明",
      "查看風險聲明",
      "回到市場晨報",
      "正式市場資料尚未啟用",
      "不提供買賣建議"
    ]
  },
  {
    path: "/stocks/2330",
    required: [
      "資料來源與覆蓋率",
      "資料範圍",
      "覆蓋範圍",
      "升級條件",
      "查看方法說明",
      "查看風險聲明",
      "回到市場晨報",
      "正式市場資料尚未啟用",
      "不提供買賣建議"
    ]
  },
  {
    path: "/stocks/TWII",
    required: [
      "資料來源與覆蓋率",
      "資料範圍",
      "覆蓋範圍",
      "升級條件",
      "查看方法說明",
      "查看風險聲明",
      "回到市場晨報",
      "正式市場資料尚未啟用",
      "不提供買賣建議"
    ]
  },
  {
    path: "/stocks/0050",
    required: [
      "資料來源與覆蓋率",
      "資料範圍",
      "覆蓋範圍",
      "升級條件",
      "查看方法說明",
      "查看風險聲明",
      "回到市場晨報",
      "正式市場資料尚未啟用",
      "不提供買賣建議"
    ]
  }
];

const forbiddenVisibleTerms = [
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate"
];

const forbiddenSourcePatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-user-value-source-coverage-bridge"] ===
      "node scripts/check-public-beta-user-value-source-coverage-bridge.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-user-value-source-coverage-bridge.mjs") &&
      reviewGate.includes('"public-beta-user-value-source-coverage-bridge"')
  }
];

const sourceResults = sourceChecks.map(({ path, required }) => {
  const source = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
  const missing = required.filter((phrase) => !source.includes(phrase));
  const forbiddenHits = forbiddenSourcePatterns.filter((pattern) => pattern.test(source)).map(String);
  const markerHits = findHardMojibakeMarkers(source);
  return { forbiddenHits, markerHits, missing, pass: source.length > 0 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0, path };
});

const routeResults = await Promise.all(routeChecks.map(checkRoute));
const status =
  registration.every((item) => item.pass) &&
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

async function checkRoute({ path, required }) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = normalizeVisibleText(await response.text());
  const missing = required.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenVisibleTerms.filter((phrase) => text.includes(phrase));
  const markerHits = findHardMojibakeMarkers(text);

  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path,
    status: response.status
  };
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
