import fs from "node:fs";

const docPath = "docs/A2_ROUTE_LOCAL_LEGAL_WEEKLY_METHODOLOGY_COPY_REGRESSION_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeFiles = [
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx"
];

const supportFiles = [
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/app/layout.tsx",
  "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md",
  "docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md"
];

const missing = [];
const blocked = [];

function read(path) {
  if (!fs.existsSync(path)) {
    missing.push(`${path}: file exists`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}

const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const files = Object.fromEntries([...routeFiles, ...supportFiles].map((path) => [path, read(path)]));
const joinedRouteCopy = routeFiles.map((path) => files[path]).join("\n");
const joinedSupportCopy = supportFiles.map((path) => files[path]).join("\n");

const requiredDocTokens = [
  "a2_route_local_legal_weekly_methodology_copy_regression_gate_ready",
  "bounded_local_only_route_copy_regression",
  "CEO decision: `promote_route_local_trust_copy_regression_before_visual_polish`.",
  "PM route: `route_local_legal_weekly_methodology_copy_regression_gate_then_bounded_copy_patches`.",
  "## Boundary",
  "## Regression Scope",
  "## Required Public Trust Topics",
  "## Accepted Evidence",
  "## A2 Next Assignment",
  "## PM Record",
  "`/weekly`",
  "`/methodology`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "Footer/legal shared chrome",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Data freshness as metadata/readiness",
  "Partial coverage and missing/delayed data limitations",
  "Model limitation and no guarantee of score quality",
  "Risk disclosure and non-investment-advice boundary",
  "Visual polish stays lower priority"
];

const requiredBoundaryTokens = [
  "Keep `publicDataSource=mock`.",
  "Keep `scoreSource=mock`.",
  "Do not set `publicDataSource=supabase`.",
  "Do not set `scoreSource=real`.",
  "Do not run SQL.",
  "Do not connect to Supabase.",
  "Do not write Supabase.",
  "Do not modify `daily_prices`.",
  "Do not fetch, ingest, store, or commit raw market data.",
  "Do not print secrets, row payloads, stock id payloads, or raw source payloads."
];

const requiredRouteTokens = [
  ["src/app/weekly/page.tsx", "TrustRuntimeBoundaryNotice"],
  ["src/app/weekly/page.tsx", "DataFreshnessStrip"],
  ["src/app/weekly/page.tsx", "WeeklyRowCoverageStatus"],
  ["src/app/methodology/page.tsx", "TrustRuntimeBoundaryNotice"],
  ["src/app/methodology/page.tsx", "DataFreshnessStrip"],
  ["src/app/disclaimer/page.tsx", "TrustRuntimeBoundaryNotice"],
  ["src/app/terms/page.tsx", "TrustRuntimeBoundaryNotice"],
  ["src/app/privacy/page.tsx", "TrustRuntimeBoundaryNotice"],
  ["src/app/layout.tsx", "/methodology"],
  ["src/app/layout.tsx", "/disclaimer"],
  ["src/app/layout.tsx", "/privacy"],
  ["src/app/layout.tsx", "/terms"],
  ["src/components/trust-runtime-boundary-notice.tsx", "publicDataSource=mock; scoreSource=mock"],
  ["src/components/trust-runtime-boundary-notice.tsx", "not investment advice"],
  ["src/components/trust-runtime-boundary-notice.tsx", "not live or complete market data"],
  ["src/components/trust-runtime-boundary-notice.tsx", "model limitation"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md", "Footer / legal pages `/disclaimer`, `/terms`, `/privacy`, `/methodology`"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md", "Weekly `/weekly`"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md", "`/weekly`"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md", "`/methodology`"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md", "`/disclaimer`"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md", "`/terms`"],
  ["docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md", "`/privacy`"]
];

const forbiddenClaims = [
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed",
  "validated forecast is approved",
  "provider redistribution is approved",
  "SQL execution is allowed",
  "Supabase writes are allowed",
  "raw market data was fetched",
  "secrets were printed",
  "row payloads were printed",
  "stock id payloads were printed"
];

for (const token of [...requiredDocTokens, ...requiredBoundaryTokens]) {
  if (!doc.includes(token)) missing.push(`${docPath}: ${token}`);
}

for (const [path, token] of requiredRouteTokens) {
  if (!files[path]?.includes(token)) missing.push(`${path}: ${token}`);
}

for (const token of forbiddenClaims) {
  if (doc.includes(token) || joinedRouteCopy.includes(token) || joinedSupportCopy.includes(token)) {
    blocked.push(`forbidden claim: ${token}`);
  }
}

if (packageJson.scripts?.["check:a2-route-local-legal-weekly-methodology-copy-regression-gate"] !== "node scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs") {
  missing.push(`${packagePath}: check:a2-route-local-legal-weekly-methodology-copy-regression-gate`);
}

if (!reviewGate.includes("scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs")) {
  missing.push(`${reviewGatePath}: checker registered`);
}

if (!reviewGate.includes('"a2-route-local-legal-weekly-methodology-copy-regression-gate"')) {
  missing.push(`${reviewGatePath}: core review gate name`);
}

const sectionOrder = [
  "## Boundary",
  "## Regression Scope",
  "## Required Public Trust Topics",
  "## Accepted Evidence",
  "## A2 Next Assignment",
  "## PM Record"
].map((section) => doc.indexOf(section));

if (sectionOrder.some((index) => index < 0) || !sectionOrder.every((index, i) => i === 0 || index > sectionOrder[i - 1])) {
  blocked.push(`${docPath}: required sections must stay in regression-gate order`);
}

const result = {
  blocked,
  missing,
  checked: {
    boundaryTokens: requiredBoundaryTokens.length,
    docTokens: requiredDocTokens.length,
    forbiddenClaims: forbiddenClaims.length,
    routeFiles: routeFiles.length,
    routeTokens: requiredRouteTokens.length,
    supportFiles: supportFiles.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
