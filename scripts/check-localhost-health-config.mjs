import {
  localhostContentForbidden,
  localhostContentHealthChecks,
  localhostStatusHealthPaths
} from "./localhost-health-config.mjs";

const requiredStockPaths = [
  "/stocks/TWII",
  "/stocks/0050",
  "/stocks/006208",
  "/stocks/2330",
  "/stocks/2382",
  "/stocks/2308"
];
const requiredStatusPaths = ["/", ...requiredStockPaths, "/briefing", "/weekly", "/robots.txt"];
const requiredContentPaths = ["/", ...requiredStockPaths, "/briefing", "/weekly"];
const sharedRuntimeBoundaryTokens = [
  "local_ready_remote_paused",
  "mock-only",
  "publicDataSource=mock",
  "scoreSource=mock"
];
const requiredContentTokensByPath = new Map([
  [
    "/",
    [
      "Runtime Status",
      "Market Action Summary",
      "mock-only runtime",
      "Data / Legal / Investment checklists are local-ready",
      ...sharedRuntimeBoundaryTokens
    ]
  ],
  [
    "/briefing",
    [
      "Market Action Summary",
      "Supabase readonly attempt",
      "Blocker Readiness",
      "Three blocker checklists are ready for local review",
      ...sharedRuntimeBoundaryTokens
    ]
  ],
  [
    "/weekly",
    [
      "Market Action Summary",
      "Supabase readonly attempt",
      ...sharedRuntimeBoundaryTokens
    ]
  ]
]);
const stockContentTokens = [
  "Runtime At A Glance",
  "Investor Action Summary",
  "Indicator Roadmap",
  "Data / Legal / Investment checklists are local-ready",
  ...sharedRuntimeBoundaryTokens
];
const missing = [];
const blocked = [];

for (const route of requiredStatusPaths) {
  if (!localhostStatusHealthPaths.includes(route)) {
    missing.push(`status route: ${route}`);
  }
}

const contentByPath = new Map(localhostContentHealthChecks.map((check) => [check.path, check]));

for (const route of requiredContentPaths) {
  if (!contentByPath.has(route)) {
    missing.push(`content route: ${route}`);
  }
}

for (const route of requiredStockPaths) {
  requireTokens(route, stockContentTokens);
}

for (const [route, tokens] of requiredContentTokensByPath) {
  requireTokens(route, tokens);
}

for (const token of ["Internal Server Error", "Application error", "Unhandled Runtime Error"]) {
  if (!localhostContentForbidden.includes(token)) {
    missing.push(`forbidden token: ${token}`);
  }
}

for (const token of ["scoreSource: real", "publicDataSource: supabase"]) {
  if (!localhostContentForbidden.includes(token)) {
    missing.push(`real-source forbidden token: ${token}`);
  }
}

for (const token of ["scoreSource: \"real\"", "publicDataSource: \"supabase\"", "@supabase/supabase-js", "createClient"]) {
  if (JSON.stringify({ localhostContentHealthChecks, localhostStatusHealthPaths }).includes(token)) {
    blocked.push(token);
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      contentPathCount: localhostContentHealthChecks.length,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked",
      statusPathCount: localhostStatusHealthPaths.length
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function requireTokens(route, tokens) {
  const check = contentByPath.get(route);
  if (!check) return;

  for (const token of tokens) {
    if (!check.required.includes(token)) {
      missing.push(`${route}: ${token}`);
    }
  }
}
