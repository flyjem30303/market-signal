import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const briefingPath = "src/app/briefing/page.tsx";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];

const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const briefing = read(briefingPath);

if (
  pkg.scripts?.["check:briefing-product-first-information-hierarchy"] !==
  "node scripts/check-briefing-product-first-information-hierarchy.mjs"
) {
  problems.push(`${packagePath} missing check:briefing-product-first-information-hierarchy`);
}

for (const phrase of [
  "scripts/check-briefing-product-first-information-hierarchy.mjs",
  '"briefing-product-first-information-hierarchy"'
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
}

const orderedSourceMarkers = [
  "<BriefingPublicDecisionSummaryPanel",
  '<PublicBetaDecisionLoopBridge context="briefing"',
  '<PublicBetaUsableLoopPanel context="briefing"',
  '<PublicBetaRouteConsistencyPanel context="briefing"',
  '<PublicBetaSourceCoverageRuntimeLabelsPanel context="briefing"',
  "<BriefingExecutiveSummary",
  "<DataFreshnessStrip",
  "<PublicBetaDataReadinessStatus",
  '<PublicRuntimeStateStrip context="briefing"',
  '<PostReadonlyProductStatus context="briefing"',
  "<BriefingPublicBetaGateSummary"
];

assertOrder("briefing source product-first component order", briefing, orderedSourceMarkers);

const briefingResponse = await fetch(`${baseUrl}/briefing`);
const briefingHtml = await briefingResponse.text();
const visible = normalize(briefingHtml);

if (briefingResponse.status !== 200) problems.push(`/briefing returned ${briefingResponse.status}`);
if (visible.length > 16000) {
  problems.push(`briefing visible text too dense for product-first Beta surface: ${visible.length}`);
}

const orderedVisibleMarkers = [
  "Market Briefing",
  "\u0033\u0030 \u79d2\u770b\u61c2\u4eca\u65e5\u5e02\u5834\u6c23\u6c1b",
  "Public Beta Decision Loop",
  "\u53ef\u7528\u9589\u74b0",
  "\u516c\u958b\u908a\u754c",
  "\u8cc7\u6599\u4f86\u6e90\u8207\u8986\u84cb\u7bc4\u570d",
  "Daily Briefing",
  "\u8cc7\u6599\u65b0\u9bae\u5ea6 metadata",
  "Data Readiness"
];

assertOrder("briefing visible product-first order", visible, orderedVisibleMarkers);

for (const forbidden of [
  "cmd.exe",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "blocker"
]) {
  if (visible.includes(forbidden)) problems.push(`briefing visible text must not include ${forbidden}`);
}

if (!visible.includes("publicDataSource=mock")) problems.push("briefing visible text missing publicDataSource=mock");
if (!visible.includes("scoreSource=mock")) problems.push("briefing visible text missing scoreSource=mock");
if (!visible.includes("\u4e0d\u63d0\u4f9b\u8cb7\u8ce3\u5efa\u8b70")) {
  problems.push("briefing visible text missing non-investment-advice copy");
}

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      checkedRoutes: ["/briefing"],
      guardedStatus: "briefing_product_first_information_hierarchy_ready",
      status: "ok"
    },
    null,
    2
  )
);

function assertOrder(label, text, markers) {
  let cursor = -1;
  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index < 0) {
      problems.push(`${label} missing ${marker}`);
      continue;
    }
    if (index <= cursor) {
      problems.push(`${label} has ${marker} out of order`);
    }
    cursor = index;
  }
}

function normalize(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}
