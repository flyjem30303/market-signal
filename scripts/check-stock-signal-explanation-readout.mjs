import { readFileSync } from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const publicCheckerPath = "scripts/check-public-visible-language-quality.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, cssPath, publicCheckerPath, packagePath, reviewGatePath].map((file) => [
    file,
    readFileSync(file, "utf8")
  ])
);

const component = read(componentPath);
const renderStart = component.indexOf("includeSeoContent && (");
const renderEnd = component.indexOf('<nav className="tabs"', renderStart);
const stockRender = renderStart >= 0 && renderEnd > renderStart ? component.slice(renderStart, renderEnd) : "";
const panelStart = component.indexOf("function StockSignalWhyPanel");
const panelEnd = component.indexOf("function StockEvidenceSnapshot", panelStart);
const panel = panelStart >= 0 && panelEnd > panelStart ? component.slice(panelStart, panelEnd) : "";

const required = [
  [stockRender, "StockSignalWhyPanel", "stock render signal why panel"],
  [panel, "stock-signal-why-panel", "signal why section"],
  [panel, "\\u70ba\\u4ec0\\u9ebc\\u662f\\u9019\\u500b\\u71c8\\u865f", "why this signal title"],
  [panel, "\\u7d50\\u69cb\\u652f\\u6490", "structure support"],
  [panel, "\\u98a8\\u96aa\\u62c9\\u529b", "risk pull"],
  [panel, "\\u8cc7\\u6599\\u908a\\u754c", "data boundary"],
  [panel, "\\u95dc\\u6ce8", "attention action"],
  [panel, "\\u52a0\\u5f37\\u89c0\\u5bdf", "observe action"],
  [panel, "\\u6e1b\\u5c11\\u98a8\\u96aa", "reduce risk action"],
  [panel, "mock-only", "mock-only boundary"],
  [read(cssPath), ".stock-signal-why-panel", "signal why CSS"],
  [read(cssPath), ".stock-signal-why-grid", "signal why grid CSS"],
  [read(publicCheckerPath), "為什麼是這個燈號", "public language checker requires title"],
  [read(publicCheckerPath), "結構支撐", "public language checker requires structure"],
  [read(publicCheckerPath), "風險拉力", "public language checker requires risk"],
  [read(publicCheckerPath), "資料邊界", "public language checker requires data boundary"],
  [read(packagePath), "\"check:stock-signal-explanation-readout\"", "package script"],
  [read(reviewGatePath), "scripts/check-stock-signal-explanation-readout.mjs", "review gate registration"]
];

const forbidden = [
  [panel, "scoreSource=real", "real score claim"],
  [panel, "publicDataSource=supabase", "public supabase claim"],
  [panel, "claimApproval=approved", "approved real claim"],
  [panel, "createClient(", "direct Supabase client"],
  [panel, "fetch(", "remote fetch"],
  [panel, "daily_prices", "daily_prices surface"],
  [panel, "buy", "buy wording"],
  [panel, "sell", "sell wording"]
];

const missing = [
  ...(stockRender ? [] : [`${componentPath}: stock render slice`]),
  ...(panel ? [] : [`${componentPath}: StockSignalWhyPanel slice`]),
  ...required.filter(([source, token]) => !source.includes(token)).map(([, token, label]) => `${label}: ${token}`)
];
const blocked = forbidden.filter(([source, token]) => source.includes(token)).map(([, token, label]) => `${label}: ${token}`);

console.log(JSON.stringify({
  blocked,
  missing,
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
}, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
