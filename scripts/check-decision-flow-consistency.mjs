import { readFileSync } from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const component = readFileSync(componentPath, "utf8");
const packageJson = readFileSync(packagePath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

function readSlice(source, startToken, endToken, label) {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start + startToken.length);

  if (start < 0 || end < 0 || end <= start) {
    return { label, missingBoundary: true, text: "" };
  }

  return {
    label,
    missingBoundary: false,
    text: source.slice(start, end)
  };
}

function collectMissing(source, phrases, label) {
  return phrases.filter((phrase) => !source.includes(phrase)).map((phrase) => `${label}: ${phrase}`);
}

function collectForbidden(source, phrases, label) {
  return phrases.filter((phrase) => source.includes(phrase)).map((phrase) => `${label}: ${phrase}`);
}

const homeSlice = readSlice(
  component,
  '<section className="home-decision-strip"',
  '<section className="home-reading-route"',
  "home decision compass slice"
);
const stockSlice = readSlice(
  component,
  "function StockNextStepGuide",
  "function StockDecisionBoundary",
  "stock decision guide slice"
);

const homeRequired = [
  "Decision Compass",
  "先判斷市場節奏，再對照大盤，最後才進入 ETF 或個股拆解",
  "decision_compass_briefing",
  "decision_compass_market",
  "decision_compass_target",
  'href="/briefing"',
  "/stocks/${marketSnapshot.asset.symbol}",
  "先看市場晨報",
  "大盤基準",
  "標的拆解",
  "mock-only 閱讀模式"
];

const stockRequired = [
  "Decision Guide",
  "個股頁三步檢查",
  "1 · Runtime 邊界",
  "2 · 模組判讀",
  "3 · 資料與停止點",
  "publicDataSource=mock",
  "scoreSource=mock",
  "blocked gates",
  "stock_next_step_guide"
];

const forbiddenRuntimeClaims = [
  "scoreSource=real approved",
  "publicDataSource=supabase approved",
  "claimApproval=approved",
  "createClient(",
  "fetch("
];

const registrationRequired = [
  '"check:decision-flow-consistency": "node scripts/check-decision-flow-consistency.mjs"',
  "scripts/check-decision-flow-consistency.mjs"
];

const missing = [
  ...(homeSlice.missingBoundary ? [`${componentPath}: missing ${homeSlice.label}`] : []),
  ...(stockSlice.missingBoundary ? [`${componentPath}: missing ${stockSlice.label}`] : []),
  ...collectMissing(homeSlice.text, homeRequired, `${componentPath} ${homeSlice.label}`),
  ...collectMissing(stockSlice.text, stockRequired, `${componentPath} ${stockSlice.label}`),
  ...collectMissing(packageJson, [registrationRequired[0]], packagePath),
  ...collectMissing(reviewGate, [registrationRequired[1]], reviewGatePath)
];

const forbidden = [
  ...collectForbidden(homeSlice.text, forbiddenRuntimeClaims, `${componentPath} ${homeSlice.label}`),
  ...collectForbidden(stockSlice.text, forbiddenRuntimeClaims, `${componentPath} ${stockSlice.label}`)
];

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
