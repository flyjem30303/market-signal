import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-legal-methodology-readable-copy.mjs";

const pages = [
  {
    path: "src/app/disclaimer/page.tsx",
    required: [
      "風險揭露與免責聲明",
      "Investment and data limits",
      "not investment advice",
      "data freshness metadata",
      "publicDataSource=mock",
      "scoreSource=mock",
      "不是買進、賣出或持有建議"
    ]
  },
  {
    path: "src/app/terms/page.tsx",
    required: [
      "使用條款",
      "Terms of use",
      "mock-only",
      "data freshness metadata",
      "publicDataSource=mock",
      "scoreSource=mock",
      "不得視為買賣指示"
    ]
  },
  {
    path: "src/app/privacy/page.tsx",
    required: [
      "隱私權與資料邊界",
      "公開 Beta 會盡量把使用者資料收集降到最低",
      "示範資料與示範分數",
      "尚未切換為正式市場資料服務",
      "localStorage",
      "不公開原始市場資料內容",
      "不收集交易帳密",
      "個人持股明細"
    ]
  },
  {
    path: "src/app/methodology/page.tsx",
    required: [
      "方法論",
      "Methodology",
      "mock scores",
      "promotion gate",
      "publicDataSource",
      "scoreSource",
      "不是買進、賣出或持有建議"
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

  const markers = findMojibakeMarkers(source);
  for (const marker of markers) {
    blocked.push(`${page.path}: mojibake marker ${marker}`);
  }

  for (const claim of forbiddenClaims) {
    if (source.includes(claim)) blocked.push(`${page.path}: forbidden claim ${claim}`);
  }

  if (page.path === "src/app/privacy/page.tsx") {
    for (const phrase of ["publicDataSource=mock", "scoreSource=mock", "raw market payloads", "row payloads", "stock id payloads", "secrets"]) {
      if (source.includes(phrase)) blocked.push(`${page.path}: public privacy copy should avoid machine/audit phrase ${phrase}`);
    }
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
  if (/\?{2,}/u.test(text)) markers.push("question-mark-run");
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
