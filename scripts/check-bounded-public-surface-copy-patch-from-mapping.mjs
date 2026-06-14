import fs from "node:fs";

const problems = [];

const docPath = "docs/BOUNDED_PUBLIC_SURFACE_COPY_PATCH_FROM_MAPPING.md";
const mappingPath = "docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md";
const publicCopyPath = "src/lib/public-runtime-boundary-copy.ts";
const trustNoticePath = "src/components/trust-runtime-boundary-notice.tsx";
const visibleLanguageCheckerPath = "scripts/check-public-visible-language-quality.mjs";
const boundaryCoverageCheckerPath = "scripts/check-public-runtime-boundary-coverage.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const mapping = read(mappingPath);
const publicCopy = read(publicCopyPath);
const trustNotice = read(trustNoticePath);
const visibleLanguageChecker = read(visibleLanguageCheckerPath);
const boundaryCoverageChecker = read(boundaryCoverageCheckerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `bounded_public_surface_copy_patch_from_mapping_applied_mock_boundary_preserved`",
  "CEO decision: `apply_public_surface_copy_patch_from_runtime_policy_mapping_without_real_promotion`",
  "PM route: `bounded_public_surface_copy_patch_from_mapping`",
  "docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/components/trust-runtime-boundary-notice.tsx",
  "Data freshness metadata is display context only",
  "does not constitute investment advice",
  "The next route is `route_local_public_copy_alignment_or_blocked_universe_candidate_path`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `runtime_policy_public_surface_mapping_ready_mock_boundary_preserved`",
  "bounded_public_surface_copy_patch_from_mapping",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!mapping.includes(phrase)) problems.push(`${mappingPath} missing mapping phrase: ${phrase}`);
}

for (const phrase of [
  "正式資料升級尚未開放",
  "公開 Beta 目前使用示範資料",
  "不宣稱即時行情",
  "完整覆蓋",
  "保證報酬",
  "個別買賣建議",
  "模型輸出也不是預測或投資建議"
]) {
  if (!publicCopy.includes(phrase)) problems.push(`${publicCopyPath} missing current public boundary phrase: ${phrase}`);
}

for (const phrase of [
  "風險聲明",
  "方法說明",
  "隱私與資料說明",
  "使用條款",
  "週報說明",
  "boundaryCopy.summary",
  "PublicRuntimeStateStrip"
]) {
  if (!trustNotice.includes(phrase)) problems.push(`${trustNoticePath} missing current trust phrase: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [visibleLanguageCheckerPath, visibleLanguageChecker, "forbiddenVisibleFragments"],
  [visibleLanguageCheckerPath, visibleLanguageChecker, "findBadTextMarkers"],
  [boundaryCoverageCheckerPath, boundaryCoverageChecker, "getRuntimeProductSummary"],
  [boundaryCoverageCheckerPath, boundaryCoverageChecker, "正式資料升級尚未開放"],
  [boundaryCoverageCheckerPath, boundaryCoverageChecker, "非投資建議"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing checker phrase: ${phrase}`);
}

for (const [pathName, text] of [
  [publicCopyPath, publicCopy],
  [trustNoticePath, trustNotice],
  [boundaryCoverageCheckerPath, boundaryCoverageChecker]
]) {
  const mojibakeMarkers = findMojibakeMarkers(text);
  if (mojibakeMarkers.length > 0) {
    problems.push(`${pathName} contains mojibake markers: ${mojibakeMarkers.join(", ")}`);
  }
}

for (const phrase of [
  "Latest bounded public surface copy patch from mapping slice",
  "docs/BOUNDED_PUBLIC_SURFACE_COPY_PATCH_FROM_MAPPING.md",
  "bounded_public_surface_copy_patch_from_mapping_applied_mock_boundary_preserved",
  "apply_public_surface_copy_patch_from_runtime_policy_mapping_without_real_promotion",
  "route_local_public_copy_alignment_or_blocked_universe_candidate_path"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:bounded-public-surface-copy-patch-from-mapping"] !==
  "node scripts/check-bounded-public-surface-copy-patch-from-mapping.mjs"
) {
  problems.push(`${packagePath} missing check:bounded-public-surface-copy-patch-from-mapping`);
}

for (const phrase of [
  "scripts/check-bounded-public-surface-copy-patch-from-mapping.mjs",
  "expectStatus: \"ok\"",
  "name: \"bounded-public-surface-copy-patch-from-mapping\"",
  "\"bounded-public-surface-copy-patch-from-mapping\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenApprovalPatterns = [
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /public real-data claim: `accepted`/u,
  /real score claim: `accepted`/u,
  /full MVP row coverage readiness: `accepted`/u,
  /public launch completion claim accepted/u,
  /investment advice claim accepted/u
];

for (const pattern of forbiddenApprovalPatterns) {
  if (pattern.test(doc) || pattern.test(publicCopy) || pattern.test(trustNotice)) {
    problems.push(`forbidden approval pattern found: ${pattern}`);
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
      guardedStatus: "bounded_public_surface_copy_patch_from_mapping_applied_mock_boundary_preserved",
      runtime: "publicDataSource=mock",
      score: "scoreSource=mock",
      nextRoute: "route_local_public_copy_alignment_or_blocked_universe_candidate_path"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
