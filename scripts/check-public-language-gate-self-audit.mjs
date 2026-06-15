import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const auditedCheckers = [
  "scripts/check-public-visible-language-quality.mjs",
  "scripts/check-action-summary-language-quality.mjs",
  "scripts/check-home-first-screen-action-summary.mjs",
  "scripts/check-stock-first-screen-readability.mjs",
  "scripts/check-stock-first-screen-action-summary.mjs"
];

const sources = Object.fromEntries(auditedCheckers.map((file) => [file, fs.readFileSync(file, "utf8")]));
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

requireTokens("scripts/check-public-visible-language-quality.mjs", [
  "publicRoutes",
  "internalBoundaryRoutes",
  "publicSourceFiles",
  "forbiddenVisibleFragments",
  "forbiddenMembershipReadyFragments",
  "findBadTextMarkers",
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "/membership"
]);

requireTokens("scripts/check-action-summary-language-quality.mjs", [
  "src/lib/home-market-action-summary.ts",
  "src/lib/investor-action-summary.ts",
  "src/lib/briefing-market-action-summary.ts",
  "src/lib/weekly-market-action-summary.ts",
  "scoreSource=real",
  "publicDataSource=supabase",
  "replacement/private-use character"
]);

requireTokens("scripts/check-home-first-screen-action-summary.mjs", [
  "HomeProductOverview",
  "actionSummary.headline",
  "actionSummary.stopLine",
  "scoreSourceLabel",
  "scoreSource=real",
  "publicDataSource=supabase",
  "findMojibakeMarkers"
]);

requireAny("stock first-screen language gates", [
  ["scripts/check-stock-first-screen-readability.mjs", "required"],
  ["scripts/check-stock-first-screen-readability.mjs", "forbidden"],
  ["scripts/check-stock-first-screen-readability.mjs", "findMojibakeMarkers"],
  ["scripts/check-stock-first-screen-action-summary.mjs", "requiredVisiblePhrases"],
  ["scripts/check-stock-first-screen-action-summary.mjs", "forbiddenVisiblePhrases"],
  ["scripts/check-stock-first-screen-action-summary.mjs", "findMojibakeMarkers"]
]);

if (!packageJson.includes('"check:public-language-gate-self-audit"')) {
  missing.push(`${packagePath}: check:public-language-gate-self-audit`);
}
if (!reviewGate.includes("scripts/check-public-language-gate-self-audit.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-public-language-gate-self-audit.mjs`);
}

for (const file of ["scripts/check-public-visible-language-quality.mjs", "scripts/check-public-language-gate-self-audit.mjs"]) {
  const content = fs.readFileSync(file, "utf8");
  if (/[\uE000-\uF8FF\uFFFD\u0080-\u009F]/u.test(content)) {
    blocked.push(`${file}: checker source contains replacement/private-use/control codepoint`);
  }
}

console.log(
  JSON.stringify(
    {
      auditedCheckers,
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function requireTokens(file, tokens) {
  for (const token of tokens) {
    if (!sources[file]?.includes(token)) {
      missing.push(`${file}: ${token}`);
    }
  }
}

function requireAny(label, checks) {
  for (const [file, token] of checks) {
    if (!sources[file]?.includes(token)) {
      missing.push(`${label}: ${file}: ${token}`);
    }
  }
}
