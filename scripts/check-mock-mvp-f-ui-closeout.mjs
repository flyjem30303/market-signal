import fs from "node:fs";

const docPath = "docs/MOCK_MVP_F_UI_CLOSEOUT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";

const doc = fs.readFileSync(docPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const status = fs.readFileSync(statusPath, "utf8");

const missing = [];
const blocked = [];

for (const phrase of [
  "Mock MVP F/UI Minimal Closeout",
  "Chairman outcome: accepted.",
  "avoid a broad redesign now",
  "first-screen comprehension",
  "`/`",
  "`/stocks/2330`",
  "`/briefing`",
  "`/disclaimer`",
  "No Internal Server Error",
  "Home first screen",
  "Stock first screen",
  "Briefing first screen",
  "Disclaimer first screen",
  "Keep the current visual structure",
  "Defer broad visual polish",
  "SQL execution",
  "Supabase writes",
  "raw market-data fetch",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "Supabase readonly / data coverage / real-source promotion authorization"
]) {
  if (!doc.includes(phrase)) missing.push(`${docPath}: ${phrase}`);
}

for (const phrase of [
  "docs/MOCK_MVP_F_UI_CLOSEOUT.md",
  "mock MVP F/UI minimal closeout",
  "Chairman accepted the mock MVP baseline"
]) {
  if (!status.includes(phrase)) missing.push(`${statusPath}: ${phrase}`);
}

for (const pattern of [
  /@supabase\/supabase-js/,
  /createClient/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /publicDataSource=supabase is approved/i,
  /scoreSource=real is approved/i,
  /real-data production launch is approved/i,
  /SQL execution: allowed/i,
  /Supabase writes: allowed/i
]) {
  if (pattern.test(doc)) blocked.push(`${docPath}: forbidden phrase/pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["check:mock-mvp-f-ui-closeout"] !== "node scripts/check-mock-mvp-f-ui-closeout.mjs") {
  missing.push(`${packagePath}: check:mock-mvp-f-ui-closeout`);
}

if (!reviewGate.includes("scripts/check-mock-mvp-f-ui-closeout.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-mock-mvp-f-ui-closeout.mjs`);
}

if (!fullHealth.includes("scripts/check-mock-mvp-f-ui-closeout.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-mock-mvp-f-ui-closeout.mjs`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
