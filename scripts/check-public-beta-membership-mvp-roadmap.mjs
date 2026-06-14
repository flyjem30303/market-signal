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
  "下一階段會員功能",
  "會員 MVP 是第二階段，第一階段先把免費指數燈號做穩",
  "每日市場三層解讀",
  "自選追蹤與自訂警示",
  "盤後複盤報告",
  "目前不提供會員登入、付費、自選追蹤儲存、個人化警示執行或會員專屬內容",
  "查看會員功能預覽",
  'href="/membership"'
]);

requireIncludes(membershipPagePath, membershipPage, [
  "會員功能預覽",
  "30 秒先看市場氣氛",
  "3 分鐘再看成因",
  "每日市場三層解讀",
  "自選追蹤與自訂警示條件",
  "盤後複盤報告",
  "這頁是會員路線圖，不是會員入口",
  "目前不開放會員登入或付費",
  "目前不會建立帳號、不會收費、不會儲存自選追蹤清單、不會發送個人化警示",
  "不會串接券商或處理下單",
  "仍維持非投資建議邊界"
]);

requireIncludes(homePath, home, ["PublicBetaMembershipMvpRoadmap", "<PublicBetaMembershipMvpRoadmap />"]);
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

  for (const pattern of forbiddenPatterns()) {
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
  "30 秒先看市場氣氛",
  "3 分鐘再看成因",
  "每日市場三層解讀",
  "自選追蹤與自訂警示",
  "盤後複盤報告",
  "這頁是會員路線圖，不是會員入口",
  "目前不開放會員登入或付費",
  "不會串接券商或處理下單",
  "風險聲明"
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
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  if (/\u5699/u.test(source)) markers.push("mojibake-fragment");
  return markers;
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /createClient\(/u,
    /daily_prices/u
  ];
}

function forbiddenBriefPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /createClient\(/u,
    /daily_prices mutation is approved/iu
  ];
}

function forbiddenRenderedPatterns() {
  return [
    /cmd\.exe/iu,
    /npm run/iu,
    /publicDataSource/iu,
    /scoreSource/iu,
    /Supabase/iu,
    /SQL/iu,
    /daily_prices/iu,
    /raw payload/iu,
    /raw market data/iu,
    /member-only/iu,
    /Membership MVP/iu,
    /Phase 1/iu,
    /Phase 2/iu,
    /[?]{4,}/u,
    /[\uE000-\uF8FF\uFFFD]/u
  ];
}
