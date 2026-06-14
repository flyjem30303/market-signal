const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const surfaces = [
  {
    name: "home",
    route: "/",
    required: ["指數狀態儀表站", "30 秒", "3 分鐘", "市場燈號", "主要風險", "下一步"]
  },
  {
    name: "stock",
    route: "/stocks/2330",
    required: ["標的快速判讀", "觀察順序整理", "股票頁決策羅盤", "市場脈絡", "資料邊界"]
  },
  {
    name: "briefing",
    route: "/briefing",
    required: ["30 秒看懂今日市場氣氛", "3 分鐘行動判斷", "今日市場提醒", "下一步"]
  },
  {
    name: "weekly",
    route: "/weekly",
    required: ["本週市場狀態整理", "30 秒", "3 分鐘", "示範資料", "非投資建議"]
  }
];

const forbiddenVisibleTerms = [
  "cmd.exe",
  "npm run",
  "PUBLIC_BETA",
  "BETA_",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "mock-only"
];

const results = [];

for (const surface of surfaces) {
  const response = await fetch(`${baseUrl}${surface.route}`);
  const visible = normalizeVisibleText(await response.text());
  const missing = surface.required.filter((phrase) => !visible.includes(phrase));
  const forbidden = forbiddenVisibleTerms.filter((phrase) => visible.includes(phrase));
  const mojibake = findMojibakeMarkers(visible);

  results.push({
    forbidden,
    missing,
    mojibake,
    name: surface.name,
    route: surface.route,
    status: response.status
  });
}

const blocked = results.filter(
  (result) => result.status !== 200 || result.missing.length > 0 || result.forbidden.length > 0 || result.mojibake.length > 0
);

console.log(
  JSON.stringify(
    {
      baseUrl,
      blocked,
      checkedSurfaces: surfaces.map((surface) => surface.name),
      status: blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (blocked.length > 0) process.exitCode = 1;

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[ÃÂ�]/u.test(text)) markers.push("utf8-decoding-artifact");
  if (/ï¿½/u.test(text)) markers.push("replacement-sequence");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
