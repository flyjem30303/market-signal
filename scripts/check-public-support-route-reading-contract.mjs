import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const componentPath = "src/components/public-route-reading-contract.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routes = [
  { path: "/methodology", source: "src/app/methodology/page.tsx", context: "methodology" },
  { path: "/disclaimer", source: "src/app/disclaimer/page.tsx", context: "disclaimer" },
  { path: "/terms", source: "src/app/terms/page.tsx", context: "terms" },
  { path: "/privacy", source: "src/app/privacy/page.tsx", context: "privacy" }
];

const requiredStepLabels = ["市場狀態", "原因", "更新時間", "風險提醒", "資料邊界", "下一步觀察"];
const requiredRendered = [
  "閱讀流程",
  ...requiredStepLabels,
  "示範資料"
];
const forbiddenRendered = [
  "Phase 1",
  "Phase 2",
  "Membership MVP",
  "cmd.exe",
  "npm run",
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "SQL",
  "operator",
  "packet",
  "hard blocker"
];

const problems = [];
const component = read(componentPath);
const css = read(cssPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(componentPath, component, [
  "PublicRouteReadingContract",
  "公開頁閱讀流程",
  "市場狀態",
  "原因",
  "更新時間",
  "風險提醒",
  "資料邊界",
  "下一步觀察",
  "六個閱讀檢查點",
  "關注、加強觀察或等待更多資料"
]);

requireIncludes(cssPath, css, [
  ".public-route-reading-contract",
  ".public-route-reading-contract__intro",
  ".public-route-reading-contract__steps"
]);

for (const route of routes) {
  const source = read(route.source);
  requireIncludes(route.source, source, [
    "PublicRouteReadingContract",
    `<PublicRouteReadingContract context="${route.context}" />`
  ]);
}

const scriptName = "check:public-support-route-reading-contract";
if (packageJson.scripts?.[scriptName] !== "node scripts/check-public-support-route-reading-contract.mjs") {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-public-support-route-reading-contract.mjs",
  "public-support-route-reading-contract"
]);

for (const route of routes) {
  const text = await fetchRenderedText(route.path);
  requireIncludes(`rendered ${route.path}`, text, requiredRendered);
  for (const phrase of forbiddenRendered) {
    if (text.includes(phrase)) problems.push(`rendered ${route.path} exposes forbidden phrase: ${phrase}`);
  }
}

for (const [filePath, source] of [
  [componentPath, component],
  [cssPath, css],
  [reviewGatePath, reviewGate]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_support_route_reading_contract_ready",
      checkedRoutes: routes.map((route) => route.path),
      requiredStepLabels,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function requireIncludes(label, source, phrases) {
  for (const phrase of phrases) {
    if (!source.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
  }
}

async function fetchRenderedText(route) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) problems.push(`${route} returned HTTP ${response.status}`);
  const html = await response.text();
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/[?]{4,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
