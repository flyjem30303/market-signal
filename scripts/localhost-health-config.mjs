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

export const localhostContentHealthChecks = [
  {
    path: "/",
    required: [
      "Runtime Status",
      "local_ready_remote_paused",
      "mock-only runtime",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/stocks/2330",
    required: [
      "Runtime At A Glance",
      "local_ready_remote_paused",
      "scoreSource=real",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/stocks/TWII",
    required: [
      "Runtime At A Glance",
      "local_ready_remote_paused",
      "scoreSource=real",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/stocks/0050",
    required: [
      "Runtime At A Glance",
      "local_ready_remote_paused",
      "scoreSource=real",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/stocks/006208",
    required: [
      "Runtime At A Glance",
      "local_ready_remote_paused",
      "scoreSource=real",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/stocks/2382",
    required: [
      "Runtime At A Glance",
      "local_ready_remote_paused",
      "scoreSource=real",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/stocks/2308",
    required: [
      "Runtime At A Glance",
      "local_ready_remote_paused",
      "scoreSource=real",
      "Blocker readiness",
      "Data / Legal / Investment checklists are local-ready"
    ]
  },
  {
    path: "/briefing",
    required: [
      "Row Coverage Readiness",
      "local_ready_remote_paused",
      "Supabase readonly attempt",
      "Blocker Readiness",
      "Three blocker checklists are ready for local review"
    ]
  },
  {
    path: "/weekly",
    required: ["Row Coverage Gate", "local_ready_remote_paused", "Supabase readonly attempt"]
  }
];

export const localhostContentForbidden = [
  "Internal Server Error",
  "Application error",
  "Unhandled Runtime Error",
  "scoreSource: real",
  "publicDataSource: supabase"
];
