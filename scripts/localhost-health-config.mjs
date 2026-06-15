export const localhostStatusHealthPaths = [
  "/",
  "/stocks/2330",
  "/stocks/TWII",
  "/stocks/0050",
  "/stocks/006208",
  "/stocks/2382",
  "/stocks/2308",
  "/briefing",
  "/weekly",
  "/robots.txt"
];

const stockContentTokens = ["標的燈號", "標的摘要", "綜合分數", "風險分數", "資料狀態"];

export const localhostContentHealthChecks = [
  {
    path: "/",
    required: ["指數狀態儀表站", "30 秒看懂市場氛圍", "市場總覽", "風險提醒"]
  },
  ...["/stocks/2330", "/stocks/TWII", "/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"].map(
    (path) => ({
      path,
      required: stockContentTokens
    })
  ),
  {
    path: "/briefing",
    required: ["市場快報", "30 秒看市場狀態", "下一步觀察", "資料邊界"]
  },
  {
    path: "/weekly",
    required: ["市場週報", "市場燈號", "示範資料", "資料更新狀態"]
  }
];

export const localhostContentForbidden = [
  "Internal Server Error",
  "Application error",
  "Unhandled Runtime Error",
  "scoreSource: real",
  "publicDataSource: supabase",
  "publicDataSource=mock",
  "scoreSource=mock",
  "mock-only",
  "Supabase readonly attempt"
];
