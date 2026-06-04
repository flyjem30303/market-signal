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
  "Runtime At A Glance",
  "Investor Action Summary",
  "Indicator Roadmap",
  "local_ready_remote_paused",
  "scoreSource=real",
  "封鎖項目",
  "Data / Legal / Investment checklists are local-ready"
];

export const localhostContentHealthChecks = [
  {
    path: "/",
    required: [
      "Runtime Status",
      "Market Action Summary",
      "local_ready_remote_paused",
      "mock-only runtime",
      "封鎖項目準備度",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  ...["/stocks/2330", "/stocks/TWII", "/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"].map(
    (path) => ({
      path,
      required: stockContentTokens
    })
  ),
  {
    path: "/briefing",
    required: [
      "資料列覆蓋準備",
      "Market Action Summary",
      "local_ready_remote_paused",
      "Supabase readonly attempt",
      "Blocker Readiness",
      "Three blocker checklists are ready for local review"
    ]
  },
  {
    path: "/weekly",
    required: ["Market Action Summary", "資料列覆蓋關卡", "local_ready_remote_paused", "Supabase readonly attempt"]
  }
];

export const localhostContentForbidden = [
  "Internal Server Error",
  "Application error",
  "Unhandled Runtime Error",
  "scoreSource: real",
  "publicDataSource: supabase"
];
