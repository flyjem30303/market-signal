import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const componentPath = "src/components/public-beta-decision-journey-panel.tsx";
const libPath = "src/lib/public-beta-decision-journey.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const u = (value) => JSON.parse(`"${value}"`);

const publicRequired = [
  "Decision Journey",
  u("\\u5f9e 30 \\u79d2\\u6c1b\\u570d\\u5230 3 \\u5206\\u9418\\u884c\\u52d5\\u5224\\u65b7"),
  u("30 \\u79d2\\u5e02\\u5834\\u6c1b\\u570d"),
  u("3 \\u5206\\u9418\\u884c\\u52d5\\u5224\\u65b7"),
  u("\\u6210\\u56e0\\u8207\\u6307\\u6a19\\u512a\\u5148\\u9806\\u5e8f"),
  u("\\u516c\\u958b Beta \\u95b1\\u8b80\\u9589\\u74b0"),
  u("\\u4e0d\\u5ba3\\u7a31\\u5373\\u6642\\u771f\\u5be6\\u8cc7\\u6599"),
  u("\\u4e0d\\u63d0\\u4f9b\\u8cb7\\u8ce3\\u5efa\\u8b70"),
  "publicDataSource=mock",
  "scoreSource=mock"
];

const forbiddenPublicPhrases = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "cmd.exe /c npm run",
  "readonly-attempt",
  "post-run",
  "preflight",
  "packet",
  "operator",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw market data fetch is approved",
  "publicDataSource=supabase approved",
  "scoreSource=real approved"
];

const files = new Map(
  [componentPath, libPath, dashboardPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const sourceChecks = [
  {
    path: libPath,
    required: [
      "PublicBetaDecisionJourneyContext",
      "getPublicBetaDecisionJourney",
      "home",
      "briefing",
      "stock",
      "\\u516c\\u958b Beta \\u95b1\\u8b80\\u9589\\u74b0",
      "\\u4e0d\\u5ba3\\u7a31\\u5373\\u6642\\u771f\\u5be6\\u8cc7\\u6599",
      "\\u4e0d\\u63d0\\u4f9b\\u8cb7\\u8ce3\\u5efa\\u8b70"
    ]
  },
  {
    path: componentPath,
    required: [
      "PublicBetaDecisionJourneyPanel",
      "public-beta-decision-journey",
      "Decision Journey",
      "TrackedLink",
      "publicDataSource=",
      "scoreSource="
    ]
  },
  {
    allowLegacyProcessTerms: true,
    path: dashboardPath,
    required: [
      "PublicBetaDecisionJourneyPanel",
      'context="home"',
      'context="stock"'
    ]
  },
  {
    path: briefingPath,
    required: ["PublicBetaDecisionJourneyPanel", 'context="briefing"']
  },
  {
    allowLegacyProcessTerms: true,
    path: cssPath,
    required: [
      ".public-beta-decision-journey",
      ".public-beta-decision-journey__steps",
      ".public-beta-decision-journey__boundary"
    ]
  }
];

const sourceResults = sourceChecks.map((check) => {
  const source = files.get(check.path) ?? "";
  const forbiddenHits = check.allowLegacyProcessTerms ? [] : forbiddenPublicPhrases.filter((phrase) => source.includes(phrase));
  const markerHits = findMojibakeMarkers(source);
  const missing = check.required.filter((phrase) => !source.includes(phrase));
  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path: check.path
  };
});

const routeResults = await Promise.all(["/", "/briefing", "/stocks/2330"].map(checkRoute));

const registration = [
  {
    file: packagePath,
    pass:
      JSON.parse(files.get(packagePath) ?? "{}").scripts?.["check:public-beta-decision-journey-panel"] ===
      "node scripts/check-public-beta-decision-journey-panel.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      (files.get(reviewGatePath) ?? "").includes("scripts/check-public-beta-decision-journey-panel.mjs") &&
      (files.get(reviewGatePath) ?? "").includes('"public-beta-decision-journey-panel"')
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
  const missing = publicRequired.filter((phrase) => !text.includes(phrase));
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
