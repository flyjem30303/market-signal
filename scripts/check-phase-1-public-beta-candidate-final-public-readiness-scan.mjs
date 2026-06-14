import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const docPath = "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md";
const summaryPath = "docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_CANDIDATE_STATUS_SUMMARY.md";
const rollupPath = "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequired = {
  "/": ["公開 Beta", "30 秒", "3 分鐘", "市場總覽", "資料狀態", "示範資料", "非投資建議"],
  "/briefing": ["市場簡報", "30 秒", "3 分鐘", "警示清單", "資料邊界", "示範資料", "正式資料尚未啟用"],
  "/weekly": ["市場週報", "30 秒", "3 分鐘", "本週市場狀態", "示範資料", "不提供買賣建議"],
  "/stocks/2330": ["2330", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "示範資料", "不是投資建議"],
  "/stocks/TWII": ["TWII", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "示範資料", "不是投資建議"],
  "/methodology": ["方法說明", "燈號方法", "30 秒", "3 分鐘", "資料狀態", "不是交易指令"],
  "/disclaimer": ["風險聲明", "市場資訊整理", "不構成個股買賣建議", "示範資料", "交易指令"],
  "/terms": ["使用條款", "市場觀察", "不能當作交易指令", "資料來源", "會員功能"],
  "/privacy": ["隱私", "會員功能", "自選追蹤", "自訂警示", "不需要輸入個人資料"]
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

const requiredSummaryPhrases = [
  "phase_1_public_beta_mock_launch_candidate_status_summary_ready",
  "指數燈號網站 BRIEF",
  "GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE",
  "Phase 1 can move as a public free index-lighting site candidate while the runtime stays mock-only",
  "What Can Go Public Now",
  "What Remains Deferred",
  "A3 Resume Conditions",
  "A4 membership MVP planning",
  "phase_1_public_beta_candidate_final_public_readiness_scan"
];

const requiredEvidencePaths = [summaryPath, rollupPath];

const doc = readText(docPath);
const summary = readText(summaryPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingDocPhrases = requiredDocPhrases.filter((phrase) => !doc.includes(phrase));
const missingSummaryPhrases = requiredSummaryPhrases.filter((phrase) => !summary.includes(phrase));
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
const summaryForbiddenHits = findForbiddenHits(summary);
const docMarkerHits = findMojibakeMarkers(doc);
const summaryMarkerHits = findMojibakeMarkers(summary);
const status =
  missingDocPhrases.length === 0 &&
  missingSummaryPhrases.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  docForbiddenHits.length === 0 &&
  summaryForbiddenHits.length === 0 &&
  docMarkerHits.length === 0 &&
  summaryMarkerHits.length === 0 &&
  routeResults.every((result) => result.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_candidate_final_public_readiness_scan_ready",
      missingDocPhrases,
      missingSummaryPhrases,
      missingEvidenceFiles,
      missingEvidenceReferences,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      docForbiddenHits,
      summaryForbiddenHits,
      docMarkerHits,
      summaryMarkerHits,
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
  try {
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
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      forbiddenHits: [],
      markerHits: [],
      missing: required,
      pass: false,
      path,
      status: "fetch_failed"
    };
  }
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
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (source.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
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
