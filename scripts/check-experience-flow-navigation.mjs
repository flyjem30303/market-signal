import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const weeklyPath = "src/app/weekly/page.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const componentPath = "src/components/public-next-reading-flow.tsx";
const cssPath = "src/app/globals.css";

const publicRouteRequirements = [
  {
    path: "/",
    required: ["下一步閱讀", "市場晨報", "週報", "方法說明", "風險聲明"]
  },
  {
    path: "/briefing",
    required: ["閱讀順序", "市場總覽", "指數狀態", "週報", "方法說明", "風險聲明"]
  },
  {
    path: "/weekly",
    required: ["閱讀順序", "市場總覽", "今日簡報", "指數狀態", "方法說明", "風險揭露"]
  },
  {
    path: "/stocks/2330",
    required: ["下一步閱讀", "市場晨報", "週報", "方法說明", "風險聲明"]
  }
];

const forbiddenVisibleTerms = [
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
  "Runtime Status",
  "promotion gate",
  "CEO ",
  "PM ",
  "A1 ",
  "A2 "
];

const setupProblems = [];
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const weekly = read(weeklyPath);
const briefing = read(briefingPath);
const dashboard = read(dashboardPath);
const component = read(componentPath);
const css = read(cssPath);

if (packageJson.scripts?.["check:experience-flow-navigation"] !== "node scripts/check-experience-flow-navigation.mjs") {
  setupProblems.push(`${packagePath} missing check:experience-flow-navigation`);
}

if (!reviewGate.includes("scripts/check-experience-flow-navigation.mjs") || !reviewGate.includes('"experience-flow-navigation"')) {
  setupProblems.push(`${reviewGatePath} missing experience-flow-navigation registration`);
}

for (const [source, filePath, phrases] of [
  [weekly, weeklyPath, ['PublicNextReadingFlow context="weekly"', "stockSymbol={market.asset.symbol}"]],
  [briefing, briefingPath, ['PublicNextReadingFlow context="briefing"', "stockSymbol={market.asset.symbol}"]],
  [dashboard, dashboardPath, ['PublicNextReadingFlow context={isStockPage ? "stock" : "home"}', "stockSymbol={selected.symbol}"]],
  [
    component,
    componentPath,
    [
      'ariaLabel: "晨報閱讀順序"',
      'ariaLabel: "週報閱讀順序"',
      "下一步閱讀",
      "市場晨報",
      "今日簡報",
      "指數狀態",
      "方法說明",
      "風險聲明",
      "風險揭露",
      'payload={{ area: "experience_flow", context, target: link.target }}'
    ]
  ],
  [css, cssPath, [".experience-flow-nav", ".next-reading-panel"]]
]) {
  for (const phrase of phrases) {
    if (!source.includes(phrase)) setupProblems.push(`${filePath} missing ${phrase}`);
  }
}

const routeResults = await Promise.all(publicRouteRequirements.map(checkRoute));
const status = setupProblems.length === 0 && routeResults.every((result) => result.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      routeResults,
      setupProblems,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute({ path, required }) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = normalizeVisibleText(await response.text());
  const missing = required.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenVisibleTerms.filter((phrase) => text.includes(phrase));
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

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    setupProblems.push(`${filePath} missing`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}
