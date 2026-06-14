import fs from "node:fs";

const componentPath = "src/components/public-beta-membership-mvp-roadmap.tsx";
const membershipPagePath = "src/app/membership/page.tsx";
const homePath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const siteNavPath = "src/components/site-nav.tsx";
const cssPath = "src/app/globals.css";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const component = read(componentPath);
const membershipPage = read(membershipPagePath);
const home = read(homePath);
const briefing = read(briefingPath);
const siteNav = read(siteNavPath);
const css = read(cssPath);
const brief = read(briefPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(componentPath, component, [
  "PublicBetaMembershipMvpRoadmap",
  "第二階段會員路線圖",
  "會員 MVP",
  "每日市場三層解讀",
  "自選追蹤",
  "自訂警示",
  "盤後複盤",
  "目前不提供會員登入、付費、自選追蹤儲存、個人化警示執行或會員專屬內容",
  'href="/membership"'
]);

requireIncludes(membershipPagePath, membershipPage, [
  "會員功能預覽",
  "第二階段會員路線圖",
  "會員 MVP",
  "30 秒",
  "3 分鐘",
  "市場三層解讀",
  "自選追蹤",
  "自訂警示",
  "盤後複盤",
  "目前不會建立帳號、不會收費、不會儲存自選追蹤清單、不會發送個人化警示",
  "不提供個別買賣建議"
]);

requireIncludes(homePath, home, ["PublicBetaMembershipMvpRoadmap", "<PublicBetaMembershipMvpRoadmap />", "自選追蹤與自訂警示"]);
requireIncludes(briefingPath, briefing, ["PublicBetaMembershipMvpRoadmap", "<PublicBetaMembershipMvpRoadmap />"]);
requireIncludes(siteNavPath, siteNav, ['href: "/membership"', 'label: "會員預覽"', 'aria-label="主要導覽"']);

requireIncludes(cssPath, css, [
  ".public-beta-membership-roadmap",
  ".public-beta-membership-roadmap__grid",
  ".public-beta-membership-roadmap__boundary",
  ".membership-preview-grid"
]);

requireIncludes(briefPath, brief, [
  "會員 MVP 優先內容包含",
  "每日會員專區《市場三層解讀》",
  "會員自選追蹤 + 自訂警示條件",
  "盤後複盤報告",
  "Phase 1 is current execution priority.",
  "Phase 2 should not delay Phase 1 launch readiness."
]);

const scriptName = "check:public-beta-membership-mvp-roadmap";
if (pkg.scripts?.[scriptName] !== "node scripts/check-public-beta-membership-mvp-roadmap.mjs") {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-public-beta-membership-mvp-roadmap.mjs",
  "public-beta-membership-mvp-roadmap"
]);

for (const [filePath, source] of [
  [componentPath, component],
  [membershipPagePath, membershipPage],
  [homePath, home],
  [briefingPath, briefing],
  [siteNavPath, siteNav],
  [cssPath, css]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }

  for (const pattern of forbiddenPatterns({ allowCssClassNames: filePath === cssPath })) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

for (const marker of findBadEncodingMarkers(brief)) {
  problems.push(`${briefPath} contains ${marker}`);
}

for (const pattern of forbiddenBriefPatterns()) {
  if (pattern.test(brief)) problems.push(`${briefPath} contains forbidden pattern ${String(pattern)}`);
}

const renderedMembership = await fetchRenderedText("/membership");
requireIncludes("rendered /membership", renderedMembership, [
  "會員功能預覽",
  "第二階段會員路線圖",
  "會員 MVP",
  "市場三層解讀",
  "自選追蹤",
  "自訂警示",
  "盤後複盤",
  "不會建立帳號",
  "不會收費",
  "不提供個別買賣建議"
]);

for (const pattern of forbiddenRenderedPatterns()) {
  if (pattern.test(renderedMembership)) problems.push(`rendered /membership contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_membership_mvp_roadmap_ready",
      publicLabel: "next-stage membership features",
      memberRoute: "/membership",
      phase2: "membership MVP path visible but deferred",
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
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (source.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return markers;
}

function forbiddenPatterns({ allowCssClassNames = false } = {}) {
  const patterns = [
    /publicDataSource\s*=\s*supabase/iu,
    /scoreSource\s*=\s*real/iu,
    /Supabase writes are approved/iu,
    /SQL execution is approved/iu,
    /real market data is live/iu,
    /investment advice is provided/iu
  ];

  if (!allowCssClassNames) patterns.push(/watchlist/u);

  return patterns;
}

function forbiddenBriefPatterns() {
  return [
    /publicDataSource\s*=\s*supabase\s+approved/iu,
    /scoreSource\s*=\s*real\s+approved/iu,
    /Supabase writes are approved/iu,
    /SQL execution is approved/iu,
    /real market data is live/iu,
    /investment advice is provided/iu
  ];
}

function forbiddenRenderedPatterns() {
  return [
    /cmd\.exe/iu,
    /npm run/iu,
    /publicDataSource/iu,
    /scoreSource/iu,
    /mock-only/iu,
    /Supabase/iu,
    /SQL/iu,
    /watchlist/u,
    /資料線/u
  ];
}
