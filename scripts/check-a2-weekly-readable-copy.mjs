import fs from "node:fs";

const pagePath = "src/app/weekly/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-a2-weekly-readable-copy.mjs";

const required = [
  "Weekly Report",
  "本週市場觀察",
  "Weekly boundary",
  "data freshness metadata",
  "publicDataSource=mock",
  "scoreSource=mock",
  "not investment advice",
  "mock-only",
  "TrustRuntimeBoundaryNotice",
  "RouteLocalTrustCopyPanel",
  "DataFreshnessStrip",
  "WeeklyRowCoverageStatus",
  "buildWeeklyMarketActionSummary",
  "Market Action Summary",
  "本週仍以 mock runtime 做公開閱讀",
  "重要聲明"
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
