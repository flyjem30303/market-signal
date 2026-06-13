import { readFileSync } from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const component = read(componentPath);
const css = read(cssPath);
const pkg = read(packagePath);
const reviewGate = read(reviewGatePath);

const problems = [];

requireIncludes(componentPath, component, [
  "function HomeCoreIndicatorReadout",
  "coreIndicatorReadouts",
  "home-core-indicator-readout",
  "home-core-indicator-grid",
  "Core Indicator Readout",
  "核心指標快讀",
  "市場氣氛",
  "風險熱度",
  "資料可信度",
  "可先關注",
  "加強觀察",
  "降低風險",
  "先複核",
  "示範資料",
  "正式資料尚未啟用",
  "formatTaipeiTime(snapshot.lastUpdatedAt)"
]);

requireIncludes(cssPath, css, [".home-core-indicator-readout", ".home-core-indicator-grid"]);
requireIncludes(packagePath, pkg, ["\"check:home-core-indicator-readout\""]);
requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-home-core-indicator-readout.mjs",
  "home-core-indicator-readout"
]);

for (const [label, source] of [
  [componentPath, component],
  [cssPath, css],
  [componentPath, component]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${label} contains ${marker}`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(component)) problems.push(`${componentPath} contains forbidden pattern ${String(pattern)}`);
}

const rendered = await fetchRenderedText("/");
requireIncludes("rendered /", rendered, [
  "核心指標快讀",
  "市場氣氛",
  "風險熱度",
  "資料可信度",
  "可先關注",
  "加強觀察",
  "降低風險",
  "先複核",
  "示範資料",
  "正式資料尚未啟用"
]);

for (const pattern of forbiddenRenderedPatterns()) {
  if (pattern.test(rendered)) problems.push(`rendered / contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedSurface: "home-core-indicator-readout",
      indicators: ["市場氣氛", "風險熱度", "資料可信度"],
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  return readFileSync(filePath, "utf8");
}

function requireIncludes(label, source, phrases) {
  for (const phrase of phrases) {
    if (!source.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
  }
}

async function fetchRenderedText(route) {
  const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
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
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-character");
  if (/[?]{4,}/u.test(source)) markers.push("question-mark-run");
  if (/\u5699/u.test(source)) markers.push("mojibake-fragment");
  return markers;
}

function forbiddenPatterns() {
  return [
    /scoreSource\s*=\s*"real"/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /createClient\(/u,
    /daily_prices/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
  ];
}

function forbiddenRenderedPatterns() {
  return [
    /mock-only/iu,
    /publicDataSource/iu,
    /scoreSource/iu,
    /Supabase/iu,
    /SQL/iu,
    /daily_prices/iu,
    /cmd\.exe/iu,
    /npm run/iu,
    /[?]{4,}/u,
    /[\uE000-\uF8FF\uFFFD]/u
  ];
}
