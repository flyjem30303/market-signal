import { readFileSync } from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, cssPath, packagePath, reviewGatePath].map((file) => [file, readFileSync(file, "utf8")])
);

const component = read(componentPath);
const homeStart = component.indexOf("function HomeProductOverview");
const homeEnd = component.indexOf("function getInvestorIndicatorStatusLabel", homeStart);
const home = homeStart >= 0 && homeEnd > homeStart ? component.slice(homeStart, homeEnd) : "";

const required = [
  [home, "coreIndicatorReadouts", "home core indicator data"],
  [home, "home-core-indicator-readout", "home core indicator section"],
  [home, "home-core-indicator-grid", "home core indicator grid"],
  [home, "Core Indicator Readout", "core indicator eyebrow"],
  [home, "\\u6838\\u5fc3\\u6307\\u6a19\\u5feb\\u8b80", "core indicator readout title"],
  [home, "\\u5e02\\u5834\\u6c23\\u6c1b", "market mood indicator"],
  [home, "\\u98a8\\u96aa\\u71b1\\u5ea6", "risk heat indicator"],
  [home, "\\u8cc7\\u6599\\u53ef\\u4fe1\\u5ea6", "data trust indicator"],
  [home, "\\u95dc\\u6ce8", "attention action language"],
  [home, "\\u52a0\\u5f37\\u89c0\\u5bdf", "observe action language"],
  [home, "\\u6e1b\\u5c11\\u98a8\\u96aa", "reduce risk action language"],
  [home, "mock-only", "mock-only boundary"],
  [read(cssPath), ".home-core-indicator-readout", "core indicator CSS"],
  [read(cssPath), ".home-core-indicator-grid", "core indicator grid CSS"],
  [read(packagePath), "\"check:home-core-indicator-readout\"", "package script"],
  [read(reviewGatePath), "scripts/check-home-core-indicator-readout.mjs", "review gate registration"]
];

const forbidden = [
  [home, "scoreSource=real", "real score claim"],
  [home, "publicDataSource=supabase", "public supabase claim"],
  [home, "claimApproval=approved", "approved real claim"],
  [home, "createClient(", "direct Supabase client"],
  [home, "fetch(", "remote fetch"],
  [home, "daily_prices", "daily_prices mutation surface"]
];

const missing = [
  ...(home ? [] : [`${componentPath}: HomeProductOverview slice`]),
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
