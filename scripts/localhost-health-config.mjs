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

const sharedRuntimeBoundaryTokens = [
  "local_ready_remote_paused",
  "mock-only",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const stockContentTokens = [
  "Runtime At A Glance",
  "Investor Action Summary",
  "Indicator Roadmap",
  "Data / Legal / Investment checklists are local-ready",
  ...sharedRuntimeBoundaryTokens
];

export const localhostContentHealthChecks = [
  {
    path: "/",
    required: [
      "Runtime Status",
      "Market Action Summary",
      "mock-only runtime",
      "Data / Legal / Investment checklists are local-ready",
      ...sharedRuntimeBoundaryTokens
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
      "Market Action Summary",
      "Supabase readonly attempt",
      "Blocker Readiness",
      "Three blocker checklists are ready for local review",
      ...sharedRuntimeBoundaryTokens
    ]
  },
  {
    path: "/weekly",
    required: [
      "Market Action Summary",
      "Supabase readonly attempt",
      ...sharedRuntimeBoundaryTokens
    ]
  }
];

export const localhostContentForbidden = [
  "Internal Server Error",
  "Application error",
  "Unhandled Runtime Error",
  "scoreSource: real",
  "publicDataSource: supabase"
];
