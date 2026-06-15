import fs from "node:fs";

const componentPath = "src/components/public-beta-membership-mvp-roadmap.tsx";
const membershipPagePath = "src/app/membership/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const component = read(componentPath);
const membershipPage = read(membershipPagePath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(componentPath, component, [
  "PublicBetaMembershipMvpRoadmap",
  "會員功能預告",
  "下一階段：從看到燈號，升級成理解燈號",
  "深度解讀",
  "個人化追蹤",
  "複盤與學習",
  "目前不提供會員登入、付費、自選追蹤儲存、個人化警示執行或會員專屬內容。"
]);

requireIncludes(membershipPagePath, membershipPage, [
  "notFound()",
  "index: false",
  "follow: false",
  'title: "Not Found"'
]);

forbidIncludes(componentPath, component, [
  'href="/membership"',
  "membership_preview_link_clicked",
  "會員功能已開放",
  "立即註冊",
  "立即登入",
  "立即付費"
]);

for (const [filePath, source] of [
  [componentPath, component],
  [membershipPagePath, membershipPage]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }
  for (const pattern of forbiddenSourcePatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:public-beta-membership-mvp-roadmap"] !==
  "node scripts/check-public-beta-membership-mvp-roadmap.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-membership-mvp-roadmap`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-public-beta-membership-mvp-roadmap.mjs",
  "public-beta-membership-mvp-roadmap"
]);

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_membership_mvp_roadmap_deferred_no_public_dead_link",
      membershipRoute: "/membership",
      membershipRouteExpectedStatus: 404,
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

function forbidIncludes(label, source, phrases) {
  for (const phrase of phrases) {
    if (source.includes(phrase)) problems.push(`${label} must not include phrase: ${phrase}`);
  }
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}

function forbiddenSourcePatterns() {
  return [
    /publicDataSource\s*=\s*supabase/iu,
    /scoreSource\s*=\s*real/iu,
    /Supabase writes are approved/iu,
    /SQL execution is approved/iu,
    /real market data is live/iu,
    /investment advice is provided/iu
  ];
}
