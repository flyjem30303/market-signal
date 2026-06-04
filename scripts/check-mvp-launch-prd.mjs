import fs from "node:fs";

const docPath = "docs/MVP_LAUNCH_PRD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const statusPath = "PROJECT_STATUS.md";

const doc = fs.readFileSync(docPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const roleWorkstreams = fs.readFileSync(rolePath, "utf8");
const projectStatus = fs.readFileSync(statusPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "MVP Launch PRD And Product Baseline",
  "Do not pause the project for a full restart",
  "Taiwan-first market signal website that can later scale globally",
  "Target Users For MVP",
  "MVP User Problems",
  "MVP Launch Definition",
  "Requirement Baseline",
  "UX And F Design Timing",
  "Codex design or browser skills are best used in the final polish and launch QA",
  "Planning Gap Decision",
  "Annotation And Final Design Review",
  "Current Efficiency Rules",
  "Solidify the build/dev-server recovery preflight",
  "exactly one bounded Supabase readonly",
  "publicDataSource=mock",
  "scoreSource=mock",
  "real market evidence",
  "No SQL execution",
  "No Supabase writes"
]) {
  if (!doc.includes(phrase)) missing.push(`${docPath}: ${phrase}`);
}

for (const phrase of [
  "docs/MVP_LAUNCH_PRD.md",
  "F / Product Design should use docs/MVP_LAUNCH_PRD.md",
  "Use the MVP Launch PRD as the product baseline"
]) {
  if (!roleWorkstreams.includes(phrase) && !projectStatus.includes(phrase)) {
    missing.push(`project references: ${phrase}`);
  }
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
  /scoreSource=real is approved/i
]) {
  if (pattern.test(doc)) blocked.push(`${docPath}: forbidden phrase/pattern ${String(pattern)}`);
}

if (packageJson.scripts?.["check:mvp-launch-prd"] !== "node scripts/check-mvp-launch-prd.mjs") {
  missing.push(`${packagePath}: check:mvp-launch-prd`);
}

if (!reviewGate.includes("scripts/check-mvp-launch-prd.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-mvp-launch-prd.mjs`);
}

if (!fullHealth.includes("scripts/check-mvp-launch-prd.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-mvp-launch-prd.mjs`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
