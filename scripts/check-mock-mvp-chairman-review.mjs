import fs from "node:fs";

const docPath = "docs/MOCK_MVP_CHAIRMAN_REVIEW.md";
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
  "Mock MVP Chairman Review Packet",
  "The mock MVP is ready for chairman review",
  "It is not a real-data production launch",
  "`/`",
  "`/stocks/2330`",
  "`/stocks/TWII`",
  "`/briefing`",
  "`/weekly`",
  "`/methodology`",
  "`/disclaimer`",
  "No Internal Server Error",
  "What The Chairman Should Approve Now",
  "What The Chairman Should Not Approve Yet",
  "F / UI Minimal Closeout",
  "Do not start a broad redesign",
  "Supabase readonly / data coverage / real-source promotion authorization",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "SQL execution: blocked",
  "Supabase writes: blocked",
  "real scoring: blocked",
  "Accept the mock MVP baseline",
  "Reject the baseline with concrete page-level fixes"
]) {
  if (!doc.includes(phrase)) missing.push(`${docPath}: ${phrase}`);
}

for (const phrase of [
  "docs/MOCK_MVP_CHAIRMAN_REVIEW.md",
  "mock MVP chairman review"
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

if (packageJson.scripts?.["check:mock-mvp-chairman-review"] !== "node scripts/check-mock-mvp-chairman-review.mjs") {
  missing.push(`${packagePath}: check:mock-mvp-chairman-review`);
}

if (!reviewGate.includes("scripts/check-mock-mvp-chairman-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-mock-mvp-chairman-review.mjs`);
}

if (!fullHealth.includes("scripts/check-mock-mvp-chairman-review.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-mock-mvp-chairman-review.mjs`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
