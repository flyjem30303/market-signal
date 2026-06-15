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

const stockContentTokens = ["標的燈號", "標的快速判讀", "資料邊界", "非投資建議"];

export const localhostContentHealthChecks = [
  {
    path: "/",
    required: ["指數狀態儀表站", "30 秒看懂台股市場狀態", "公開 Beta 使用狀態", "資料邊界清楚揭露"]
  },
  ...["/stocks/2330", "/stocks/TWII", "/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"].map(
    (path) => ({
      path,
      required: stockContentTokens
    })
  ),
  {
    path: "/briefing",
    required: ["市場簡報", "30 秒看懂市場狀態", "公開 Beta 使用狀態", "資料邊界", "非投資建議"]
  },
  {
    path: "/weekly",
    required: ["每週市場", "市場", "資料"]
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
