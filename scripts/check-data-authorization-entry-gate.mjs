import fs from "node:fs";

const docPath = "docs/DATA_AUTHORIZATION_ENTRY_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";

const problems = [];
const blocked = [];

const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);

for (const phrase of [
  "Data Authorization Entry Gate",
  "entry_ready_local_only",
  "not execution approval",
  "docs/MOCK_MVP_CHAIRMAN_REVIEW.md",
  "docs/MOCK_MVP_F_UI_CLOSEOUT.md",
  "one bounded readonly attempt",
  "exact command",
  "readonly only",
  "sanitized aggregate output only",
  "immediate post-run review",
  "no promotion by itself",
  "SQL execution",
  "Supabase writes",
  "raw market data",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "source rights accepted",
  "row coverage aggregate",
  "data-quality score threshold",
  "model credibility",
  "Legal public claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath}: missing ${phrase}`);
}

for (const phrase of [
  "Latest data authorization entry gate slice",
  "docs/DATA_AUTHORIZATION_ENTRY_GATE.md",
  "entry_ready_local_only",
  "authorization decision packet",
  "one-attempt readonly rules",
  "post-run review requirements"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath}: missing ${phrase}`);
}

if (packageJson.scripts?.["check:data-authorization-entry-gate"] !== "node scripts/check-data-authorization-entry-gate.mjs") {
  problems.push(`${packagePath}: missing check:data-authorization-entry-gate script`);
}

if (!reviewGate.includes("scripts/check-data-authorization-entry-gate.mjs")) {
  problems.push(`${reviewGatePath}: missing checker registration`);
}

if (!reviewGate.includes('"data-authorization-entry-gate"')) {
  problems.push(`${reviewGatePath}: missing core review gate name`);
}

if (!fullHealth.includes("scripts/check-data-authorization-entry-gate.mjs")) {
  problems.push(`${fullHealthPath}: missing checker registration`);
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
  /SQL execution: allowed/i,
  /Supabase writes: allowed/i,
  /raw payload:/i
]) {
  if (pattern.test(doc)) blocked.push(`${docPath}: forbidden pattern ${String(pattern)}`);
}

console.log(JSON.stringify({ blocked, problems, status: blocked.length === 0 && problems.length === 0 ? "ok" : "blocked" }, null, 2));

if (blocked.length > 0 || problems.length > 0) {
  process.exitCode = 1;
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "{}";
  }

  return fs.readFileSync(path, "utf8");
}
