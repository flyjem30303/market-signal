import fs from "node:fs";

const docPath = "docs/A2_TWII_OPERATOR_DECISION_PUBLIC_COPY_GUARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A2 TWII Operator Decision Public Copy Guard",
  "`a2_twii_operator_decision_public_copy_guard_ready`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "copy-only",
  "TWII 來源證據已整理，仍等待明確操作決策",
  "目前只顯示 mock 狀態，尚未啟用真實資料",
  "資料來源與欄位契約正在進入決策準備",
  "若未來授權，也會先經過單次 bounded readonly 檢查與 post-run review",
  "公開頁不提供買賣建議，也不保證即時性或完整覆蓋",
  "目前分數來源仍是 mock",
  "目前公開資料來源仍是 mock",
  "TWII 更新節奏以每日收盤後資料為候選方向，尚未切換到正式資料源",
  "operator decision packet 是決策準備，不是執行結果",
  "operator readonly decision packet ready no-execution",
  "waiting for explicit operator decision",
  "A1 prerequisites ready no-execution",
  "A2 copy guard ready",
  "real promotion blocked",
  "TWII 真實資料已啟用",
  "已取得官方授權",
  "已完成 Supabase 讀取",
  "已寫入 daily_prices",
  "已完成 row coverage",
  "已可即時追蹤 TWII",
  "官方認證資料",
  "保證資料完整",
  "已切換 publicDataSource=supabase",
  "已切換 scoreSource=real",
  "系統建議買進",
  "系統建議賣出",
  "保證報酬",
  "已執行 bounded readonly attempt",
  "`operator_decision_copy_guard_ready_wait_for_explicit_operator_decision`",
  "SQL execution",
  "Supabase connection",
  "Supabase reads",
  "Supabase writes",
  "staging rows",
  "`daily_prices` mutation",
  "endpoint probe",
  "OpenAPI call",
  "CSV download",
  "market-data fetch",
  "market-data ingest",
  "market-data storage",
  "market-data commit",
  "runner execution",
  "parser execution",
  "candidate market-row artifact generation",
  "raw payload output",
  "row payload output",
  "stock-id row-list output",
  "secret output",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time market-data claims",
  "official endorsement claims",
  "investment advice claims"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/iu,
  /\bcreateClient\(/iu,
  /@supabase\/supabase-js/iu,
  /\.from\(/iu,
  /\.select\(/iu,
  /\.insert\(/iu,
  /\.upsert\(/iu,
  /\binsert\s+into\b/iu,
  /\bselect\s+\*\s+from\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /publicDataSource\s*=\s*"supabase"/iu,
  /scoreSource\s*=\s*"real"/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /market-data fetch is approved/iu,
  /investment advice is provided/iu,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern: ${pattern}`);
}

let parsedPackage = {};
try {
  parsedPackage = JSON.parse(packageJson);
} catch {
  problems.push(`${packagePath} invalid JSON`);
}

if (
  parsedPackage?.scripts?.["check:a2-twii-operator-decision-public-copy-guard"] !==
  "node scripts/check-a2-twii-operator-decision-public-copy-guard.mjs"
) {
  problems.push(`${packagePath} missing check:a2-twii-operator-decision-public-copy-guard`);
}

if (!reviewGate.includes("check-a2-twii-operator-decision-public-copy-guard.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a2-twii-operator-decision-public-copy-guard")) {
  problems.push(`${reviewGatePath} missing checker gate name`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        status: "ok",
        mode: "a2_twii_operator_decision_public_copy_guard",
        publicDataSource: "mock",
        scoreSource: "mock",
        nextPmRoute: "operator_decision_copy_guard_ready_wait_for_explicit_operator_decision"
      },
      null,
      2
    )
  );
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
