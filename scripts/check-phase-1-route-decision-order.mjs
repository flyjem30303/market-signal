import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeContracts = [
  {
    path: "/",
    sequence: ["首頁快速判讀", "資料來源與覆蓋率", "公開 Beta 可用閉環"]
  },
  {
    path: "/briefing",
    sequence: ["每日市場晨報", "今日警示清單", "資料來源與覆蓋率", "公開 Beta 可用閉環"]
  },
  {
    path: "/stocks/2330",
    sequence: ["標的決策摘要", "資料來源與覆蓋率", "公開 Beta 可用閉環"]
  },
  {
    path: "/stocks/TWII",
    sequence: ["標的決策摘要", "資料來源與覆蓋率", "公開 Beta 可用閉環"]
  },
  {
    path: "/stocks/0050",
    sequence: ["標的決策摘要", "資料來源與覆蓋率", "公開 Beta 可用閉環"]
  }
];

const publicForbidden = [
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
  "raw payload"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const briefing = fs.readFileSync(briefingPath, "utf8");

const sourceResults = [
  {
    check: "stock-decision-before-data-boundary",
    pass: dashboard.indexOf("<StockRuntimeAtAGlance") > -1 && dashboard.indexOf("<StockRuntimeAtAGlance") < dashboard.indexOf("<DataFreshnessStrip")
  },
  {
    check: "home-decision-before-data-boundary",
    pass:
      dashboard.indexOf("<HomeFirstScreenDecisionSummary") > -1 &&
      dashboard.indexOf("<HomeFirstScreenDecisionSummary") < dashboard.indexOf("<DataFreshnessStrip")
  },
  {
    check: "briefing-decision-before-data-boundary",
    pass:
      briefing.indexOf("briefing-public-summary") > -1 &&
      briefing.indexOf("briefing-public-summary") < briefing.indexOf("<DataFreshnessStrip")
  }
];

const registration = [
  {
    file: packagePath,
    pass: packageJson.scripts?.["check:phase-1-route-decision-order"] === "node scripts/check-phase-1-route-decision-order.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-phase-1-route-decision-order.mjs") &&
      reviewGate.includes('"phase-1-route-decision-order"')
  }
];

const routeResults = await Promise.all(routeContracts.map(checkRoute));
const status =
  sourceResults.every((item) => item.pass) &&
  registration.every((item) => item.pass) &&
  routeResults.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));
if (status !== "ok") process.exitCode = 1;

async function checkRoute(contract) {
  const response = await fetch(`${baseUrl}${contract.path}`);
  const text = normalizeVisibleText(await response.text());
  const sequence = buildSequenceResult(text, contract.sequence);
  const forbiddenHits = publicForbidden.filter((phrase) => text.includes(phrase));
  const markerHits = findMojibakeMarkers(text);

  return {
    forbiddenHits,
    markerHits,
    pass: response.status === 200 && sequence.pass && forbiddenHits.length === 0 && markerHits.length === 0,
    path: contract.path,
    sequence,
    status: response.status
  };
}

function buildSequenceResult(text, sequence) {
  let previous = -1;
  const positions = sequence.map((phrase) => {
    const index = text.indexOf(phrase);
    const inOrder = index > previous;
    if (inOrder) previous = index;
    return { inOrder, index, phrase };
  });

  return {
    pass: positions.every((item) => item.index >= 0 && item.inOrder),
    positions
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
