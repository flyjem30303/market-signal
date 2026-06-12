import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const homeLibPath = "src/lib/home-market-action-summary.ts";
const briefingLibPath = "src/lib/briefing-market-action-summary.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const u = (value) => JSON.parse(`"${value}"`);

const requiredPublicPhrases = [
  "Market Action Summary",
  u("\\u5e02\\u5834\\u5ee3\\u5ea6"),
  u("\\u4e0d\\u63d0\\u4f9b\\u8cb7\\u8ce3\\u5efa\\u8b70"),
  "publicDataSource=mock",
  "scoreSource=mock"
];

const routeSpecificRequired = {
  "/": [u("\\u8cc7\\u6599\\u72c0\\u614b\\u9700\\u8981\\u5148\\u78ba\\u8a8d")],
  "/briefing": [u("\\u98a8\\u96aa\\u89c0\\u5bdf")]
};

const requiredSourcePhrases = [
  "\\u5e02\\u5834\\u5ee3\\u5ea6",
  "\\u4e0d\\u63d0\\u4f9b\\u8cb7\\u8ce3\\u5efa\\u8b70",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const forbiddenPublicPhrases = [
  "cmd.exe",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource=supabase approved",
  "scoreSource=real approved"
];

const files = new Map(
  [homeLibPath, briefingLibPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const sourceResults = [homeLibPath, briefingLibPath].map((path) => {
  const source = files.get(path) ?? "";
  const markerHits = findMojibakeMarkers(source);
  const missing = requiredSourcePhrases.filter((phrase) => !source.includes(phrase));
  return {
    markerHits,
    missing,
    pass: markerHits.length === 0 && missing.length === 0,
    path
  };
});

const routeResults = await Promise.all(["/", "/briefing"].map(checkRoute));

const packageJson = JSON.parse(files.get(packagePath) ?? "{}");
const reviewGate = files.get(reviewGatePath) ?? "";
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

const status =
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass) &&
  registration.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const required = [...requiredPublicPhrases, ...(routeSpecificRequired[path] ?? [])];
  const missing = required.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenPublicPhrases.filter((phrase) => text.includes(phrase));
  const markerHits = findMojibakeMarkers(text);

  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path,
    status: response.status
  };
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
