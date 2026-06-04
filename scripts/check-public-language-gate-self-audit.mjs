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

const missing = [];
const blocked = [];

const publicVisibleSource = fs.readFileSync("scripts/check-public-visible-language-quality.mjs", "utf8");
const actionSummarySource = fs.readFileSync("scripts/check-action-summary-language-quality.mjs", "utf8");
const homeFirstScreenSource = fs.readFileSync("scripts/check-home-first-screen-action-summary.mjs", "utf8");
const stockFirstScreenSource = fs.readFileSync("scripts/check-stock-first-screen-readability.mjs", "utf8");
const stockActionSource = fs.readFileSync("scripts/check-stock-first-screen-action-summary.mjs", "utf8");

for (const token of ["免責聲明", "使用條款", "隱私政策", "publicDataSource=mock", "scoreSource=mock"]) {
  if (!publicVisibleSource.includes(token)) {
    missing.push(`scripts/check-public-visible-language-quality.mjs: ${token}`);
  }
}

for (const token of ["scoreSource=real approved", "publicDataSource=supabase approved"]) {
  if (!publicVisibleSource.includes(token)) {
    missing.push(`scripts/check-public-visible-language-quality.mjs forbidden sample: ${token}`);
  }
}

for (const token of ["src/lib/home-market-action-summary.ts", "src/lib/investor-action-summary.ts", "src/lib/briefing-market-action-summary.ts", "src/lib/weekly-market-action-summary.ts", "publicDataSource=mock", "scoreSource=mock"]) {
  if (!actionSummarySource.includes(token)) {
    missing.push(`scripts/check-action-summary-language-quality.mjs: ${token}`);
  }
}

for (const token of ["Quick Start", "Market Action Summary", "Decision Compass", "actionSummary.stopLine"]) {
  if (!homeFirstScreenSource.includes(token)) {
    missing.push(`scripts/check-home-first-screen-action-summary.mjs: ${token}`);
  }
}

for (const token of ["Market Signal Dashboard", "publicDataSource=mock", "scoreSource=mock"]) {
  if (!stockFirstScreenSource.includes(token) && !stockActionSource.includes(token)) {
    missing.push(`stock first-screen language gates: ${token}`);
  }
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
if (!packageJson.includes('"check:public-language-gate-self-audit"')) {
  missing.push(`${packagePath}: check:public-language-gate-self-audit`);
}
if (!reviewGate.includes("scripts/check-public-language-gate-self-audit.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-public-language-gate-self-audit.mjs`);
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
