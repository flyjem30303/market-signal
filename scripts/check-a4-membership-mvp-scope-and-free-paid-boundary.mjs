import fs from "node:fs";

const scopePath = "docs/A4_MEMBERSHIP_MVP_SCOPE_AND_FREE_PAID_BOUNDARY.md";
const handoffPath = "docs/A4_MEMBERSHIP_MVP_PLANNING_HANDOFF.md";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const membershipPagePath = "src/app/membership/page.tsx";
const roadmapComponentPath = "src/components/public-beta-membership-mvp-roadmap.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const scope = read(scopePath);
const handoff = read(handoffPath);
const brief = read(briefPath);
const membershipPage = read(membershipPagePath);
const roadmapComponent = read(roadmapComponentPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(scopePath, scope, [
  "a4_membership_mvp_scope_and_free_paid_boundary_ready",
  "Phase 2 membership MVP planning-only",
  "Phase 1 public/free site remains the mainline",
  "每日市場三層解讀",
  "自選追蹤（watchlist）",
  "自訂警示條件",
  "盤後複盤報告",
  "Free/Member Boundary",
  "conversion metrics",
  "no login implementation during Phase 1",
  "no payment implementation during Phase 1",
  "no persisted watchlist during Phase 1",
  "no personalized alert execution during Phase 1",
  "no member-only content gating during Phase 1",
  "publicDataSource=mock",
  "scoreSource=mock",
  "phase_1_public_readability_then_a4_membership_scope_review"
]);

requireIncludes(handoffPath, handoff, [
  "a4_membership_mvp_planning_lane_parallel_planning_only",
  "Prepare `membership_mvp_scope_and_free_paid_boundary`",
  "must not implement login, payment, persisted watchlist, personalized alert execution, or member-only content gating"
]);

requireIncludes(briefPath, brief, [
  "Phase 1",
  "Phase 2",
  "會員 MVP",
  "會員自選追蹤（watchlist）+ 自訂警示條件",
  "Phase 2 should not delay Phase 1 launch readiness"
]);

requireIncludes(membershipPagePath, membershipPage, [
  "會員功能預覽",
  "這頁是會員路線圖，不是會員入口",
  "目前不會建立帳號、不會收費、不會儲存自選追蹤清單、不會發送個人化警示",
  "不提供個別買賣建議"
]);

requireIncludes(roadmapComponentPath, roadmapComponent, [
  "會員功能規劃",
  "目前不提供會員登入、付費、自選追蹤儲存、個人化警示執行或會員專屬內容",
  "href=\"/membership\""
]);

const scriptName = "check:a4-membership-mvp-scope-and-free-paid-boundary";
if (pkg.scripts?.[scriptName] !== "node scripts/check-a4-membership-mvp-scope-and-free-paid-boundary.mjs") {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-a4-membership-mvp-scope-and-free-paid-boundary.mjs",
  "a4-membership-mvp-scope-and-free-paid-boundary"
]);

for (const [filePath, source] of [
  [scopePath, scope],
  [handoffPath, handoff],
  [briefPath, brief],
  [membershipPagePath, membershipPage],
  [roadmapComponentPath, roadmapComponent]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }

  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "a4_membership_mvp_scope_and_free_paid_boundary_ready",
      phase1: "public/free mainline",
      phase2: "membership MVP planning-only",
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

function forbiddenPatterns() {
  return [
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /investment advice is provided/iu,
    /guaranteed return/iu,
    /buy now/iu,
    /sell now/iu,
    /service[_-]?role/iu,
    /SUPABASE_SERVICE_ROLE_KEY/u
  ];
}
