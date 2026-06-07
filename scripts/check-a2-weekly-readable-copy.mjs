import fs from "node:fs";

const pagePath = "src/app/weekly/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-weekly-readable-copy.mjs";

const required = [
  "Weekly Report",
  "\u516c\u958b Beta \u9031\u5831",
  "\u793a\u7bc4\u8cc7\u6599",
  "\u793a\u7bc4\u5206\u6578",
  "\u6b63\u5f0f\u5e02\u5834\u8cc7\u6599\u5c1a\u672a\u555f\u7528",
  "\u975e\u6295\u8cc7\u5efa\u8b70",
  "TrustRuntimeBoundaryNotice",
  "RouteLocalTrustCopyPanel",
  "DataFreshnessStrip",
  "WeeklyRowCoverageStatus",
  "buildWeeklyMarketActionSummary",
  "Market Action Summary",
  "\u672c\u9031\u4ee5\u793a\u7bc4\u8cc7\u6599\u5448\u73fe\u516c\u958b\u95b1\u8b80\u6d41\u7a0b",
  "\u4e0b\u9031\u89c0\u5bdf\u91cd\u9ede",
  "\u91cd\u8981\u8072\u660e"
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

const page = read(pagePath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);
const checkerSource = read(checkerPath);

for (const phrase of required) {
  if (!page.includes(phrase)) missing.push(`${pagePath}: ${phrase}`);
}

for (const claim of forbiddenClaims) {
  if (page.includes(claim)) blocked.push(`${pagePath}: forbidden claim ${claim}`);
}

for (const marker of findMojibakeMarkers(page)) {
  blocked.push(`${pagePath}: mojibake marker ${marker}`);
}

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
        requiredPhrases: required.length
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
  if (/[嚗]{2,}/u.test(text)) markers.push("common-mojibake-run");
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
