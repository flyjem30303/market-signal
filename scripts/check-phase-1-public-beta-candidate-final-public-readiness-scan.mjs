import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const docPath = "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequired = {
  "/": ["30 秒", "3 分鐘", "市場", "核心指標", "資料", "非投資建議", "Phase 2"],
  "/briefing": ["30 秒", "3 分鐘", "市場", "使用提醒", "更新時間", "資料", "不提供買賣建議"],
  "/weekly": ["30 秒", "3 分鐘", "示範資料", "正式資料尚未啟用", "非投資建議"],
  "/stocks/2330": ["30 秒", "3 分鐘", "更新時間", "資料邊界", "不提供個股買賣建議"],
  "/stocks/TWII": ["30 秒", "3 分鐘", "更新時間", "資料邊界", "不提供個股買賣建議"],
  "/methodology": ["資料來源", "資料", "不提供", "買賣建議"],
  "/disclaimer": ["風險", "資料", "不提供", "投資建議"],
  "/terms": ["使用", "資訊參考", "投資建議"],
  "/privacy": ["隱私", "資料"]
};

const forbiddenVisible = [
  "cmd.exe",
  "npm run",
  "package.json",
  "C:\\",
  "D:\\",
  "operator",
  "packet",
  "preflight",
  "post-run",
  "PUBLIC_BETA_EXTERNAL",
  "BETA_",
  "raw payload",
  "database row",
  "SQL",
  "Supabase write",
  "staging rows",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "API key",
  "token"
];

const requiredDocPhrases = [
  "phase_1_public_beta_candidate_final_public_readiness_scan_ready",
  "PUBLIC_CANDIDATE_SCAN_PASS_WITH_MOCK_BOUNDARY",
  "Can a first-time visitor understand the market light",
  "Public Route Scope",
  "Required Public Understanding",
  "Public Residue Blockers",
  "PASS_AS_MOCK_ONLY_PUBLIC_BETA_CANDIDATE",
  "check:phase-1-public-beta-mock-launch-candidate-status-summary",
  "check:public-beta-mock-launch-proof-bundle",
  "check:public-visible-language-quality",
  "check:public-surface-user-facing-audit",
  "check:public-beta-alert-list-actionability",
  "check:public-beta-membership-mvp-roadmap",
  "phase_1_public_beta_human_visual_review_or_a3_no_secret_platform_checklist",
  "No SQL",
  "No Supabase write",
  "No `daily_prices` mutation",
  "No raw market data fetch, store, or commit",
  "No investment advice claim"
];

const requiredEvidencePaths = [
  "docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_CANDIDATE_STATUS_SUMMARY.md",
  "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingDocPhrases = requiredDocPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  '"check:phase-1-public-beta-candidate-final-public-readiness-scan": "node scripts/check-phase-1-public-beta-candidate-final-public-readiness-scan.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-beta-candidate-final-public-readiness-scan.mjs"
);
const focusedGateRegistered = reviewGate.includes('"phase-1-public-beta-candidate-final-public-readiness-scan"');
const routeResults = await Promise.all(Object.entries(routeRequired).map(checkRoute));
const docForbiddenHits = findForbiddenHits(doc);
const status =
  missingDocPhrases.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  docForbiddenHits.length === 0 &&
  routeResults.every((result) => result.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_candidate_final_public_readiness_scan_ready",
      missingDocPhrases,
      missingEvidenceFiles,
      missingEvidenceReferences,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      docForbiddenHits,
      routeResults,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute([path, required]) {
  const response = await fetch(`${baseUrl}${path}`);
  const visibleText = normalizeVisibleText(await response.text());
  const missing = required.filter((phrase) => !visibleText.includes(phrase));
  const forbiddenHits = forbiddenVisible.filter((phrase) => visibleText.includes(phrase));
  const markerHits = findMojibakeMarkers(visibleText);

  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path,
    status: response.status
  };
}

function readText(path) {
  if (!fs.existsSync(path)) return "";
  return fs.readFileSync(path, "utf8");
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}

function findForbiddenHits(text) {
  const hits = [];
  if (/publicDataSource\s*=\s*["']supabase["']/u.test(text)) hits.push("publicDataSource assignment");
  if (/scoreSource\s*=\s*["']real["']/u.test(text)) hits.push("scoreSource assignment");
  if (/GO\s+WITH\s+REAL\s+DATA/iu.test(text)) hits.push("go-with-real-data-claim");
  if (/SQL execution is approved/iu.test(text)) hits.push("sql-approved");
  if (/Supabase writes are approved/iu.test(text)) hits.push("supabase-write-approved");
  if (/raw market data fetch is approved/iu.test(text)) hits.push("raw-fetch-approved");
  if (/investment advice is provided/iu.test(text)) hits.push("investment-advice-claim");
  return hits;
}
