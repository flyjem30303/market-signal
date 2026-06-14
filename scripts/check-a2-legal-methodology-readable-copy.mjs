import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-legal-methodology-readable-copy.mjs";
const trustPanelPath = "src/components/route-local-trust-copy-panel.tsx";
const readingContractPath = "src/components/public-route-reading-contract.tsx";

const pages = [
  {
    path: "src/app/disclaimer/page.tsx",
    required: [
      "風險聲明",
      "資訊整理、風險辨識與觀察輔助工具",
      "不構成個股買賣建議",
      "不保證獲利",
      "正式資料尚未啟用",
      "不提供買賣建議",
      "資料狀態需要複核"
    ]
  },
  {
    path: "src/app/terms/page.tsx",
    required: [
      "使用條款",
      "市場資訊整理",
      "不能當作交易指令",
      "需自行複核",
      "自行判斷市場風險",
      "自選追蹤",
      "自訂警示"
    ]
  },
  {
    path: "src/app/privacy/page.tsx",
    required: [
      "隱私政策",
      "目前公開頁以市場資訊展示為主",
      "會員功能尚未正式開放",
      "自選追蹤",
      "自訂警示",
      "最小必要資料",
      "資料用途"
    ]
  },
  {
    path: "src/app/methodology/page.tsx",
    required: [
      "方法說明",
      "燈號方法",
      "30 秒",
      "3 分鐘",
      "資料品質",
      "正式資料尚未啟用",
      "不是交易指令",
      "指標模組",
      "資料需要可驗證",
      "風險提醒不能恐嚇"
    ]
  },
  {
    path: trustPanelPath,
    required: [
      "本站不提供買賣建議",
      "先看總燈號",
      "公開頁不需要個人資料即可閱讀",
      "條款頁會說明本站定位",
      "週報用來整理一週市場狀態"
    ]
  },
  {
    path: readingContractPath,
    required: [
      "先理解用途",
      "燈號是摘要",
      "資訊輔助",
      "不是買賣建議",
      "四步閱讀流程"
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
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
