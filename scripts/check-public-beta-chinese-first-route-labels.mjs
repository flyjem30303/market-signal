const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const publicRoutes = ["/", "/briefing", "/weekly", "/membership", "/stocks/2330", "/stocks/TWII"];

const requiredVisiblePhrases = {
  "/": ["資料信任", "標的瀏覽", "下一步閱讀"],
  "/briefing": ["市場行動摘要", "3 分鐘判斷順序"],
  "/weekly": ["市場週報", "週報行動摘要"],
  "/membership": ["會員功能預覽", "會員 MVP", "尚未開放"],
  "/stocks/2330": ["標的瀏覽", "30 秒解讀", "資料邊界"],
  "/stocks/TWII": ["標的瀏覽", "30 秒解讀", "資料邊界"]
};

const forbiddenVisibleLabels = [
  "Data Trust",
  "Explore",
  "Market Action Summary",
  "Member MVP",
  "Membership Preview",
  "Next",
  "Not Open Yet",
  "Weekly Report"
];

const results = [];

for (const route of publicRoutes) {
  results.push(await checkRoute(route));
}

const blocked = results.filter((result) => !result.pass);
const status = blocked.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      checkedRoutes: publicRoutes.length,
      forbiddenVisibleLabels,
      guardedStatus: "public_beta_chinese_first_route_labels_ready",
      results,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const visibleText = normalizeVisibleText(await response.text());
    const missing = (requiredVisiblePhrases[route] ?? []).filter((phrase) => !visibleText.includes(phrase));
    const forbiddenHits = forbiddenVisibleLabels.filter((label) => visibleText.includes(label));

    return {
      forbiddenHits,
      missing,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0,
      route,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    };
  }
}

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
