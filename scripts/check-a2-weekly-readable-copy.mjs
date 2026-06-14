import fs from "node:fs";

const pagePath = "src/app/weekly/page.tsx";
const helperPath = "src/lib/weekly-market-action-summary.ts";
const trustPanelPath = "src/components/route-local-trust-copy-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-weekly-readable-copy.mjs";

const requiredByFile = {
  [pagePath]: [
    "市場週報",
    "本週市場狀態整理",
    "30 秒確認市場氣氛",
    "3 分鐘複核風險最高標的",
    "示範資料",
    "不提供買賣建議",
    "市場行動摘要",
    "週報快速閱讀",
    "資料更新時間",
    "RouteLocalTrustCopyPanel",
    "PublicNextReadingFlow"
  ],
  [helperPath]: [
    "週報是回看與觀察工具",
    "不是買賣指令",
    "示範資料",
    "本週樣本",
    "風險觀察"
  ],
  [trustPanelPath]: [
    "週報提醒",
    "週報協助回看",
    "週報用來整理一週市場狀態",
    "資料狀態與更新時間"
  ]
};

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

for (const [filePath, phrases] of Object.entries(requiredByFile)) {
  const source = read(filePath);

  for (const phrase of phrases) {
    if (!source.includes(phrase)) missing.push(`${filePath}: ${phrase}`);
  }

  for (const marker of findMojibakeMarkers(source)) {
    blocked.push(`${filePath}: mojibake marker ${marker}`);
  }

  for (const claim of forbiddenClaims) {
    if (source.includes(claim)) blocked.push(`${filePath}: forbidden claim ${claim}`);
  }
}

const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);
const checkerSource = read(checkerPath);

if (!packageJson.includes('"check:a2-weekly-readable-copy": "node scripts/check-a2-weekly-readable-copy.mjs"')) {
  missing.push(`${packagePath}: check:a2-weekly-readable-copy`);
}

if (!reviewGate.includes("scripts/check-a2-weekly-readable-copy.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-a2-weekly-readable-copy.mjs`);
}

if (!reviewGate.includes('"a2-weekly-readable-copy"')) {
  missing.push(`${reviewGatePath}: a2-weekly-readable-copy`);
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
        requiredFiles: Object.keys(requiredByFile).length,
        requiredPhrases: Object.values(requiredByFile).reduce((sum, phrases) => sum + phrases.length, 0)
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
