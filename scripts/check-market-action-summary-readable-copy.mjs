import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const sourcePaths = ["src/lib/home-market-action-summary.ts", "src/lib/briefing-market-action-summary.ts"];

const requiredRoutePhrases = {
  "/": ["市場廣度", "正式市場資料尚未啟用", "不提供個股買賣建議"],
  "/briefing": ["市場廣度", "風險觀察", "不提供個股買賣建議"]
};

const requiredSourcePhrases = ["\\u5e02\\u5834\\u5ee3\\u5ea6", "\\u4e0d\\u63d0\\u4f9b\\u500b\\u80a1\\u8cb7\\u8ce3\\u5efa\\u8b70"];

const forbiddenVisible = [
  "cmd.exe",
  "npm run",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:market-action-summary-readable-copy"] ===
      "node scripts/check-market-action-summary-readable-copy.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-market-action-summary-readable-copy.mjs") &&
      reviewGate.includes('"market-action-summary-readable-copy"')
  }
];

const sourceResults = sourcePaths.map((path) => {
  const source = fs.readFileSync(path, "utf8");
  const markerHits = findMojibakeMarkers(source);
  const missing = requiredSourcePhrases.filter((phrase) => !source.includes(phrase));
  return {
    markerHits,
    missing,
    pass: markerHits.length === 0 && missing.length === 0,
    path
  };
});

const routeResults = await Promise.all(
  Object.entries(requiredRoutePhrases).map(async ([path, required]) => {
    const response = await fetch(`${baseUrl}${path}`);
    const text = normalizeVisibleText(await response.text());
    const missing = required.filter((phrase) => !text.includes(phrase));
    const forbiddenHits = forbiddenVisible.filter((phrase) => text.includes(phrase));
    const markerHits = findMojibakeMarkers(text);
    return {
      forbiddenHits,
      markerHits,
      missing,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
      path,
      status: response.status
    };
  })
);

const status =
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass) &&
  registration.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

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
