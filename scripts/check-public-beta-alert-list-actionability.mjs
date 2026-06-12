import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const u = (value) => JSON.parse(`"${value}"`);

const sharedRequired = [
  u("\\u8b66\\u793a\\u6e05\\u55ae"),
  u("\\u6210\\u56e0"),
  u("\\u66f4\\u65b0\\u6642\\u9593"),
  u("\\u5f71\\u97ff\\u7d1a\\u5225"),
  u("\\u4e0b\\u4e00\\u6b65"),
  "publicDataSource=mock",
  "scoreSource=mock"
];

const routeRequired = {
  "/": [
    u("\\u6bcf\\u5247\\u8b66\\u793a\\u90fd\\u5305\\u542b\\u72c0\\u614b"),
    u("\\u8cc7\\u6599\\u53ef\\u9760\\u5ea6"),
    u("\\u98a8\\u96aa\\u8b66\\u793a"),
    u("\\u5e02\\u5834\\u6c1b\\u570d")
  ],
  "/briefing": [
    u("\\u6bcf\\u500b\\u8b66\\u793a\\u90fd\\u4fdd\\u7559\\u72c0\\u614b"),
    u("\\u5e02\\u5834\\u6c23\\u6c1b\\u8b66\\u793a"),
    u("\\u98a8\\u96aa\\u4f86\\u6e90"),
    u("\\u5e02\\u5834\\u7d50\\u69cb\\u8b66\\u793a")
  ]
};

const forbidden = [
  "cmd.exe",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource=supabase approved",
  "scoreSource=real approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw market data fetch is approved"
];

const files = new Map(
  [dashboardPath, briefingPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const sourceResults = [
  {
    path: dashboardPath,
    required: [
      "publicDashboardAlerts",
      "home-public-beta-alert-list",
      u("\\u6210\\u56e0"),
      u("\\u66f4\\u65b0\\u6642\\u9593"),
      u("\\u5f71\\u97ff\\u7d1a\\u5225"),
      u("\\u4e0b\\u4e00\\u6b65\\u5efa\\u8b70")
    ]
  },
  {
    path: briefingPath,
    required: [
      "buildBriefingAlerts",
      "briefing-alert-decision-list",
      u("\\u6210\\u56e0"),
      u("\\u66f4\\u65b0\\u6642\\u9593"),
      u("\\u5f71\\u97ff\\u7d1a\\u5225"),
      u("\\u4e0b\\u4e00\\u6b65")
    ]
  }
].map((check) => {
  const source = files.get(check.path) ?? "";
  const markerHits = findMojibakeMarkers(source);
  const missing = check.required.filter((phrase) => !source.includes(phrase));
  return {
    markerHits,
    missing,
    pass: markerHits.length === 0 && missing.length === 0,
    path: check.path
  };
});

const routeResults = await Promise.all(["/", "/briefing"].map(checkRoute));

const packageJson = JSON.parse(files.get(packagePath) ?? "{}");
const reviewGate = files.get(reviewGatePath) ?? "";
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-alert-list-actionability"] ===
      "node scripts/check-public-beta-alert-list-actionability.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-alert-list-actionability.mjs") &&
      reviewGate.includes('"public-beta-alert-list-actionability"')
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
  const required = [...sharedRequired, ...(routeRequired[path] ?? [])];
  const missing = required.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbidden.filter((phrase) => text.includes(phrase));
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
