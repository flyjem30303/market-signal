import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-legal-methodology-readable-copy.mjs";
const trustPanelPath = "src/components/route-local-trust-copy-panel.tsx";

const pages = [
  {
    path: "src/app/disclaimer/page.tsx",
    required: [
      "免責聲明",
      "Disclaimer",
      "公開 Beta",
      "示範資料",
      "示範分數",
      "正式市場資料尚未啟用",
      "非投資建議",
      "請自行查證並評估風險",
      "Beta 期間變更"
    ]
  },
  {
    path: "src/app/terms/page.tsx",
    required: [
      "使用條款",
      "公開 Beta",
      "示範資料",
      "示範分數",
      "正式市場資料尚未啟用",
      "非投資建議",
      "請自行評估風險",
      "Beta 期間可能變動"
    ]
  },
  {
    path: "src/app/privacy/page.tsx",
    required: [
      "隱私與資料說明",
      "公開 Beta",
      "mock-only",
      "不需要輸入 API key",
      "不顯示 secrets",
      "raw market payloads",
      "row payloads",
      "stock id payloads",
      "不要求使用者輸入交易帳密"
    ]
  },
  {
    path: "src/app/methodology/page.tsx",
    required: [
      "方法說明",
      "Methodology",
      "示範資料",
      "示範評分",
      "正式市場資料",
      "投資建議",
      "指標組成",
      "資料品質等級",
      "不把分數當指令"
    ]
  },
  {
    path: trustPanelPath,
    required: [
      "目前提供的是市場觀察輔助",
      "方法說明只描述評分邏輯",
      "公開頁不要求輸入密鑰",
      "請把公開 Beta 視為資訊產品原型",
      "週報用來整理觀察重點"
    ]
  }
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
