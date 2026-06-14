import fs from "node:fs";

const specPath = "docs/A4_MEMBERSHIP_MVP_EXECUTABLE_SPEC.md";
const scopePath = "docs/A4_MEMBERSHIP_MVP_SCOPE_AND_FREE_PAID_BOUNDARY.md";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const membershipPagePath = "src/app/membership/page.tsx";
const roadmapComponentPath = "src/components/public-beta-membership-mvp-roadmap.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const spec = read(specPath);
const scope = read(scopePath);
const brief = read(briefPath);
const membershipPage = read(membershipPagePath);
const roadmapComponent = read(roadmapComponentPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(specPath, spec, [
  "a4_membership_mvp_executable_spec_ready",
  "Phase 1 remains the mainline",
  "Phase 2 membership is a product path, not a Phase 1 blocker",
  "Member daily market three-layer interpretation",
  "Watchlist MVP",
  "Custom Alert Condition MVP",
  "Post-Market Review Report",
  "Trigger when a selected symbol or indicator changes light state",
  "member_three_layer_read_started",
  "member_watchlist_item_added",
  "member_alert_condition_created",
  "member_post_market_review_opened",
  "Phase 1 remains the current mainline",
  "phase_1_public_runtime_then_phase_2_membership_mvp_implementation_gate"
]);

requireIncludes(scopePath, scope, [
  "a4_membership_mvp_scope_and_free_paid_boundary_ready",
  "The first implementation should stay narrow",
  "PM must not treat it as approval to implement account, payment, personalized storage, or member-only gating"
]);

requireIncludes(briefPath, brief, [
  "Phase 1 is current execution priority",
  "Phase 2 should not delay Phase 1 launch readiness",
  "會員 MVP 優先內容包含"
]);

requireIncludes(membershipPagePath, membershipPage, [
  "會員功能預覽",
  "這頁是會員路線圖，不是會員入口",
  "目前不會建立帳號、不會收費、不會儲存自選追蹤清單、不會發送個人化警示",
  "不提供個別買賣建議"
]);

requireIncludes(roadmapComponentPath, roadmapComponent, [
  "每日市場三層解讀",
  "自選追蹤清單與自訂警示",
  "盤後複盤報告",
  "不提供買賣建議"
]);

const scriptName = "check:a4-membership-mvp-executable-spec";
if (pkg.scripts?.[scriptName] !== "node scripts/check-a4-membership-mvp-executable-spec.mjs") {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-a4-membership-mvp-executable-spec.mjs",
  "a4-membership-mvp-executable-spec"
]);

for (const [filePath, source] of [
  [specPath, spec],
  [scopePath, scope],
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
      guardedStatus: "a4_membership_mvp_executable_spec_ready",
      phase1: "public/free mainline",
      phase2: "membership MVP specification only",
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
