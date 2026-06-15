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
const missing = [];
const blocked = [];

for (const route of requiredStatusPaths) {
  if (!localhostStatusHealthPaths.includes(route)) missing.push(`status route: ${route}`);
}

const contentByPath = new Map(localhostContentHealthChecks.map((check) => [check.path, check]));

for (const route of requiredContentPaths) {
  if (!contentByPath.has(route)) missing.push(`content route: ${route}`);
}

for (const token of ["Internal Server Error", "Application error", "Unhandled Runtime Error"]) {
  if (!localhostContentForbidden.includes(token)) missing.push(`forbidden token: ${token}`);
}

for (const token of [
  "scoreSource: real",
  "publicDataSource: supabase",
  "publicDataSource=mock",
  "scoreSource=mock",
  "mock-only",
  "Supabase readonly attempt"
]) {
  if (!localhostContentForbidden.includes(token)) missing.push(`public residue forbidden token: ${token}`);
}

for (const token of ["@supabase/supabase-js", "createClient"]) {
  if (JSON.stringify({ localhostContentHealthChecks, localhostStatusHealthPaths }).includes(token)) blocked.push(token);
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

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;
