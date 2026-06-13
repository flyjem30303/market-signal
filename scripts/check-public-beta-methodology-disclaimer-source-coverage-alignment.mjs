const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const routeChecks = [
  {
    path: "/methodology",
    required: [
      "方法說明",
      "資料來源",
      "覆蓋率",
      "更新時間",
      "正式資料尚未啟用",
      "不提供買賣建議",
      "不提供個股買賣建議"
    ]
  },
  {
    path: "/disclaimer",
    required: [
      "風險聲明",
      "資料來源",
      "更新時間",
      "覆蓋率",
      "正式市場資料尚未啟用",
      "不提供買賣建議",
      "不是投資建議"
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

const routeResults = await Promise.all(routeChecks.map(checkRoute));
const status = routeResults.every((item) => item.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "public_beta_methodology_disclaimer_source_coverage_alignment_ready",
      routeResults,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

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
