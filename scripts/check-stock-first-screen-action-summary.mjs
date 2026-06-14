const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const routes = ["/stocks/2330", "/stocks/TWII", "/stocks/0050"];

const requiredVisiblePhrases = [
  "狀態儀表",
  "標的快速判讀",
  "30 秒看懂標的狀態",
  "觀察順序整理",
  "把單一標的放回市場脈絡",
  "股票頁決策羅盤",
  "市場脈絡",
  "資料邊界",
  "示範資料與示範分數",
  "不提供個股買賣建議"
];

const forbiddenVisiblePhrases = [
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
  "Runtime Brief",
  "Decision Guide",
  "blocked gates"
];

const results = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  const visible = normalizeVisibleText(await response.text());
  const missing = requiredVisiblePhrases.filter((phrase) => !visible.includes(phrase));
  const forbidden = forbiddenVisiblePhrases.filter((phrase) => visible.includes(phrase));
  const mojibake = findMojibakeMarkers(visible);

  results.push({
    forbidden,
    missing,
    mojibake,
    route,
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
      checkedRoutes: routes,
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
