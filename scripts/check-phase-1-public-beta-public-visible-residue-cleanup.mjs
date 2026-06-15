const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const publicRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy",
  "/stocks/TWII",
  "/stocks/2330",
  "/stocks/0050",
  "/stocks/006208",
  "/stocks/2382",
  "/stocks/2308"
];

const requiredPublicSignals = {
  "/": ["目前市場", "市場總覽", "資料狀態", "風險聲明"],
  "/briefing": ["市場快報", "30 秒看懂市場燈號", "下一步行動", "資料邊界"],
  "/weekly": ["週報", "一週市場狀態", "資料狀態", "示範資料"],
  "/methodology": ["方法說明", "燈號", "風險", "非投資建議"],
  "/disclaimer": ["風險聲明", "不提供投資建議", "自行判斷", "資料"],
  "/terms": ["使用條款", "資訊整理", "投資決策", "資料"],
  "/privacy": ["隱私政策", "Phase 1", "不啟用會員", "資料"],
  "/stocks/TWII": ["標的燈號", "綜合分數", "風險分數"],
  "/stocks/2330": ["標的燈號", "綜合分數", "風險分數"],
  "/stocks/0050": ["標的燈號", "綜合分數", "風險分數"],
  "/stocks/006208": ["標的燈號", "綜合分數", "風險分數"],
  "/stocks/2382": ["標的燈號", "綜合分數", "風險分數"],
  "/stocks/2308": ["標的燈號", "綜合分數", "風險分數"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "pre-launch",
  "PRE-LAUNCH",
  "hard blocker",
  "Hard Blocker",
  "HARD BLOCKER",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "packet",
  "operator",
  "commit ",
  "Git",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate",
  "real-data promotion",
  "PM ",
  "CEO ",
  "A1 ",
  "A2 ",
  "A3 ",
  "A4 ",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO"
];

const routeResults = [];

for (const route of publicRoutes) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const visibleText = normalizeVisibleText(html);
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findBadTextMarkers(visibleText);
    const missingRequiredSignals = (requiredPublicSignals[route] ?? []).filter(
      (phrase) => !visibleText.includes(phrase)
    );

    routeResults.push({
      forbiddenHits,
      missingRequiredSignals,
      mojibakeHits,
      pass:
        response.status === 200 &&
        forbiddenHits.length === 0 &&
        mojibakeHits.length === 0 &&
        missingRequiredSignals.length === 0,
      route,
      status: response.status
    });
  } catch (error) {
    routeResults.push({
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    });
  }
}

const status = routeResults.every((result) => result.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_public_visible_residue_cleanup_ready_for_users",
      checkedRoutes: publicRoutes.length,
      routeResults,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

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

function findBadTextMarkers(text) {
  const markers = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp === 0xfffd) markers.add("replacement-code-point");
    if (cp >= 0xe000 && cp <= 0xf8ff) markers.add("private-use-code-point");
    if (cp >= 0x80 && cp <= 0x9f) markers.add("c1-control-character");
  }
  if (/\?{3,}/u.test(text)) markers.add("question-mark-run");
  if (/(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓||){2,}/u.test(text)) {
    markers.add("common-mojibake-run");
  }
  return [...markers];
}
