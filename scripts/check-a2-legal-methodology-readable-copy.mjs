import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-legal-methodology-readable-copy.mjs";
const trustPanelPath = "src/components/route-local-trust-copy-panel.tsx";

const pages = [
  {
    path: "src/app/disclaimer/page.tsx",
    required: [
      "風險聲明",
      "公開 Beta",
      "示範資料",
      "示範分數",
      "正式市場資料尚未啟用",
      "不是投資建議",
      "不提供買賣建議",
      "市場風險自負",
      "不要當成交易指令",
      "會員功能"
    ]
  },
  {
    path: "src/app/terms/page.tsx",
    required: [
      "使用條款",
      "公開 Beta",
      "市場資訊整理",
      "風險辨識",
      "不是投資建議",
      "請自行評估風險",
      "資料來源",
      "更新時間",
      "自行承擔風險"
    ]
  },
  {
    path: "src/app/privacy/page.tsx",
    required: [
      "隱私權與資料說明",
      "公開 Beta",
      "資料來源",
      "不要在任何表單",
      "交易帳戶",
      "會員功能資料邊界",
      "watchlist",
      "警示條件",
      "刪除流程"
    ]
  },
  {
    path: "src/app/methodology/page.tsx",
    required: [
      "方法說明",
      "燈號方法",
      "30 秒",
      "3 分鐘",
      "核心指標",
      "資料品質",
      "資料狀態",
      "資料來源",
      "覆蓋率",
      "更新時間",
      "正式市場資料尚未啟用",
      "不是交易指令",
      "不提供買賣建議",
      "個股買賣建議"
    ]
  },
  {
    path: trustPanelPath,
    required: [
      "本網站不提供買賣建議",
      "先看市場氣氛，再看風險來源",
      "公開頁不需要輸入機密資訊",
      "公開 Beta 內容可能調整",
      "週報用來整理觀察順序"
    ]
  }
];

const forbiddenPublicResidue = [
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data",
  "raw market payloads",
  "raw payload",
  "row payloads",
  "stock id payloads",
  "secrets",
  "Runtime Status",
  "promotion gate",
  "Phase 1",
  "Phase 2",
  "Membership MVP"
];

const forbiddenClaims = [
  "publicDataSource=supabase is approved",
  "scoreSource=real is approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed",
  "validated forecast is approved",
  "SQL execution is allowed",
  "Supabase writes are allowed",
  "raw market data was fetched",
  "secrets were printed",
  "row payloads were printed",
  "stock id payloads were printed"
];

const missing = [];
const blocked = [];

for (const page of pages) {
  const source = read(page.path);
  for (const phrase of page.required) {
    if (!source.includes(phrase)) missing.push(`${page.path}: ${phrase}`);
  }

  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${page.path}: mojibake marker ${marker}`);
  }

  for (const claim of forbiddenClaims) {
    if (source.includes(claim)) blocked.push(`${page.path}: forbidden claim ${claim}`);
  }

  for (const residue of forbiddenPublicResidue) {
    if (source.includes(residue)) blocked.push(`${page.path}: public residue ${residue}`);
  }
}

const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);
const checkerSource = read(checkerPath);

if (!packageJson.includes('"check:a2-legal-methodology-readable-copy": "node scripts/check-a2-legal-methodology-readable-copy.mjs"')) {
  missing.push(`${packagePath}: check:a2-legal-methodology-readable-copy`);
}

if (!reviewGate.includes("scripts/check-a2-legal-methodology-readable-copy.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-a2-legal-methodology-readable-copy.mjs`);
}

if (!reviewGate.includes('"a2-legal-methodology-readable-copy"')) {
  missing.push(`${reviewGatePath}: a2-legal-methodology-readable-copy`);
}

if (!checkerSource.includes("findMojibakeMarkers") || !checkerSource.includes("private-use-code-point")) {
  missing.push(`${checkerPath}: self-contract mojibake guard`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      checked: {
        forbiddenClaims: forbiddenClaims.length,
        forbiddenPublicResidue: forbiddenPublicResidue.length,
        pages: pages.length,
        requiredPhrases: pages.reduce((sum, page) => sum + page.required.length, 0)
      },
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    missing.push(`${filePath}: file exists`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  if (/(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓||){2,}/u.test(text)) {
    markers.push("common-mojibake-run");
  }
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
