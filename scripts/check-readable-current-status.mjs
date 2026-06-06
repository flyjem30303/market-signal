import fs from "node:fs";

const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const handoffPath = "docs/RUNTIME_AUTONOMY_HANDOFF.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";

const problems = [];

const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const topSection = status.split(/\n## (?!Readable Current Status)/u)[0] ?? "";

const requiredTopPhrases = [
  "Readable Current Status - 2026-06-04",
  "PM progress score: 96%",
  "Latest investment-credibility slice",
  "Latest investment evidence upgrade",
  "Investment credibility moved from 46% to 58%",
  "Latest formula downgrade readiness slice",
  "Investment credibility moved from 58% to 68%",
  "Latest investment public claim readiness slice",
  "Investment credibility moved from 68% to 80%",
  "MVP review target as local-only evidence",
  "CEO / PM / Runtime Engineering",
  "larger local-only runtime product slices",
  "A1 and A2 as support lanes",
  "PM as integration owner",
  "public runtime remains mock-only",
  "publicDataSource=mock",
  "scoreSource=mock",
  "briefing / weekly row coverage panels plus the shared row coverage readiness panel",
  "bounded readonly and mock-source stop lines",
  "mainline readonly / row coverage integration gate",
  "bounded readiness, packet bridge, preexecution packet, and attempt decision",
  "site chrome readability now checks global nav, logo, footer trust copy, and mock-source boundaries",
  "public visible language checker now detects private-use mojibake by code point instead of embedding corrupted literals",
  "shared freshness / public runtime boundary helpers now use readable labels",
  "資料新鮮度",
  "分數來源",
  "新鮮度基準",
  "資料品質閘門",
  "data-goal readiness",
  "accepted bounded Supabase readonly post-run review",
  "data-goal readiness at 96%",
  "aggregate row coverage remains incomplete",
  "Latest data freshness / quality readiness slice",
  "Data freshness and quality evidence moved from 64% to 76%",
  "data-quality score lift",
  "Latest data promotion prerequisites readiness slice",
  "Data freshness and quality evidence moved from 76% to 80%",
  "promotion prerequisites gate",
  "post-run review fields",
  "Latest data coverage quality route readiness slice",
  "Data freshness and quality evidence moved from 80% to 84%",
  "overall project progress moved from 83% to 84%",
  "no-write coverage route",
  "Latest source-specific acceptance packets readiness slice",
  "Data freshness and quality evidence moved from 84% to 88%",
  "overall project progress moved from 84% to 85%",
  "source-specific acceptance packet",
  "TWII report-only probe preparation acceptance",
  "Latest data coverage MVP deferral decision slice",
  "Data freshness and quality evidence moved from 88% to 92%",
  "MVP data coverage deferral decision evidence",
  "post-MVP data coverage promotion remains separate",
  "Latest data coverage promotion execution readiness slice",
  "Data freshness and quality evidence moved from 92% to 95%",
  "post-MVP data coverage promotion execution readiness evidence",
  "future data coverage promotion still requires a separately named execution gate",
  "Latest source-rights specific classification slice",
  "Source-rights disclosure moved from 78% to 88%",
  "Latest source-rights public copy acceptance slice",
  "Source-rights disclosure moved from 88% to 92%",
  "public copy acceptance evidence",
  "Latest source-rights MVP deferral decision slice",
  "Source-rights disclosure moved from 92% to 96%",
  "MVP deferral decision evidence",
  "post-MVP source promotion remains separate",
  "Latest source-rights MVP final closure readiness slice",
  "Source-rights disclosure moved from 96% to 100%",
  "mock MVP final closure readiness evidence",
  "source-rights MVP final closure gate",
  "Latest runtime/schema promotion readiness slice",
  "Runtime state guard moved from 90% to 95%",
  "Supabase schema / repository readiness moved from 90% to 95%",
  "overall project progress moved from 86% to 87%",
  "runtime/schema promotion readiness gate",
  "Latest mock signal reading flow readiness slice",
  "Mock signal reading flow moved from 86% to 95%",
  "overall project progress moved from 87% to 88%",
  "mock-only, non-advisory, and readable for MVP review",
  "Latest mock MVP product surface readiness slice",
  "Mock MVP product surface moved from 88% to 95%",
  "overall project progress moved from 88% to 89%",
  "cross-route product-surface review gate",
  "Latest DevOps health recovery readiness slice",
  "DevOps / health / recovery moved from 88% to 95%",
  "overall project progress moved from 89% to 90%",
  "build-recovery-health-review-gate readiness map",
  "Latest CEO execution focus closure slice",
  "CEO execution focus moved from 83% to 90%",
  "overall project progress moved from 90% to 91%",
  "larger coherent local-only slices",
  "authorized Supabase/SQL/real-data promotion",
  "Latest final MVP 100 completion audit readiness slice",
  "focused audit readiness moved from 91% to 96%",
  "Not yet 100%",
  "ten focused evidence rows",
  "one milestone verification pass",
  "final local-only MVP 100 completion audit",
  "ten evidence rows",
  "bounded_readonly_attempt_reviewed_aggregate_incomplete",
  "Latest CEO decision posture",
  "exactly one attempt as a separate action",
  "sanitized aggregate output and immediate post-run review",
  "full review gate returns `ok`",
  "expected blocked/not-ready items with `pass: true`",
  "production build",
  "TypeScript",
  "localhost full health",
  "site chrome readability",
  "public visible language quality",
  "public runtime boundary coverage",
  "public runtime state strip",
  "trust runtime boundary notice",
  "freshness UI runtime disclosure",
  "A2 public-copy readability candidates",
  "runtime readiness language quality",
  "runtime gate decision brief",
  "mainline readonly row coverage integration",
  "project progress snapshot",
  "project progress score",
  "CEO progress brief",
  "runtime autonomy handoff checks are passing",
  "do not start Supabase",
  "SQL",
  "market-data fetch/ingestion",
  "public source promotion",
  "scoreSource=real",
  "do not stage or commit while the chairman is away"
];

for (const phrase of requiredTopPhrases) {
  if (!topSection.includes(phrase)) problems.push(`PROJECT_STATUS readable section missing: ${phrase}`);
}

for (const file of [handoffPath, rolePath]) {
  if (!topSection.includes(file)) problems.push(`PROJECT_STATUS readable section must link ${file}`);
}

if (pkg.scripts?.["check:readable-current-status"] !== "node scripts/check-readable-current-status.mjs") {
  problems.push("package.json missing check:readable-current-status script");
}

if (!reviewGate.includes("scripts/check-readable-current-status.mjs")) {
  problems.push("review gate missing readable current status checker");
}

const forbiddenInTopSection = [
  /publicDataSource=supabase/i,
  /scoreSource=real approved/i,
  /CEO Decision:\s*APPROVE/i,
  /SUPABASE_SERVICE_ROLE_KEY=.+/i,
  /sb_secret_/i,
  /sb_publishable_/i,
  /raw payload/i
];

for (const pattern of forbiddenInTopSection) {
  if (pattern.test(topSection)) problems.push(`PROJECT_STATUS readable section contains forbidden token: ${pattern}`);
}

if (/[\uE000-\uF8FF\uFFFD]/u.test(topSection)) {
  problems.push("PROJECT_STATUS readable section contains mojibake/private-use characters");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
