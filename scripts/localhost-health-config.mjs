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

const stockContentTokens = [
  "標的燈號",
  "資料邊界",
  "示範資料",
  "非投資建議"
];

export const localhostContentHealthChecks = [
  {
    path: "/",
    required: ["指數狀態儀表站", "30 秒看懂台股市場狀態", "公開 Beta 使用狀態", "非投資建議"]
  },
  ...["/stocks/2330", "/stocks/TWII", "/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"].map(
    (path) => ({
      path,
      required: stockContentTokens
    })
  ),
  {
    path: "/briefing",
    required: ["市場簡報", "30 秒看懂市場狀態", "閱讀方式", "非投資建議"]
  },
  {
    path: "/weekly",
    required: ["市場週報", "每週行動摘要", "下週觀察", "非投資建議"]
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
