import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const sourcePaths = ["src/components/dashboard-shell.tsx", "src/app/briefing/page.tsx"];

const routeChecks = [
  {
    path: "/",
    required: ["3 分鐘判斷順序", "市場氣氛", "成因", "資料狀態", "下一步觀察", "正式市場資料尚未啟用"]
  },
  {
    path: "/briefing",
    required: ["3 分鐘判斷順序", "市場氣氛", "成因", "資料狀態", "下一步觀察", "正式市場資料尚未啟用"]
  },
  {
    path: "/stocks/2330",
    required: ["3 分鐘判斷順序", "市場氣氛", "成因", "影響級別", "下一步觀察", "不應直接視為個股買賣建議"]
  },
  {
    path: "/stocks/TWII",
    required: ["3 分鐘判斷順序", "市場氣氛", "成因", "影響級別", "下一步觀察", "不應直接視為個股買賣建議"]
  },
  {
    path: "/stocks/0050",
    required: ["3 分鐘判斷順序", "市場氣氛", "成因", "影響級別", "下一步觀察", "不應直接視為個股買賣建議"]
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

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-value-loop-refinement"] ===
      "node scripts/check-public-beta-value-loop-refinement.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-value-loop-refinement.mjs") &&
      reviewGate.includes('"public-beta-value-loop-refinement"')
  }
];

const sourceResults = sourcePaths.map((path) => {
  const source = fs.readFileSync(path, "utf8");
  const missing = ["3 分鐘判斷順序", "市場氣氛", "成因", "下一步觀察"].filter((phrase) => !source.includes(phrase));
  const markerHits = findHardMojibakeMarkers(source);
  return { markerHits, missing, pass: missing.length === 0 && markerHits.length === 0, path };
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
