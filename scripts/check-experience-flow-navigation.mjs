import { readFileSync } from "node:fs";

const files = {
  briefing: "src/app/briefing/page.tsx",
  dashboard: "src/components/dashboard-shell.tsx",
  css: "src/app/globals.css",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  weekly: "src/app/weekly/page.tsx"
};

function read(path) {
  return readFileSync(path, "utf8");
}

function requireIncludes(source, token, label) {
  if (!source.includes(token)) {
    throw new Error(`Missing ${label}: ${token}`);
  }
}

function forbidIncludes(source, token, label) {
  if (source.includes(token)) {
    throw new Error(`Forbidden ${label}: ${token}`);
  }
}

const briefing = read(files.briefing);
const weekly = read(files.weekly);
const dashboard = read(files.dashboard);
const css = read(files.css);
const packageJson = read(files.packageJson);
const reviewGate = read(files.reviewGate);

for (const [source, page] of [
  [briefing, "briefing"],
  [weekly, "weekly"]
]) {
  requireIncludes(source, 'aria-label="Experience Flow"', `${page} flow nav label`);
  requireIncludes(source, 'className="experience-flow-nav"', `${page} flow nav class`);
  requireIncludes(source, 'payload={{ area: "experience_flow"', `${page} tracking payload`);
  requireIncludes(source, 'href="/"', `${page} home link`);
  requireIncludes(source, "看台指狀態", `${page} market-status link`);
}

requireIncludes(briefing, 'href="/weekly"', "briefing to weekly link");
requireIncludes(weekly, 'href="/briefing"', "weekly to briefing link");
requireIncludes(dashboard, "home_cta_clicked", "home CTA tracking");
requireIncludes(dashboard, 'href="/briefing"', "home/stock briefing route");
requireIncludes(dashboard, 'href="/weekly"', "home/stock weekly route");
requireIncludes(dashboard, "stock_follow_up", "stock follow-up payload");
requireIncludes(dashboard, "回首頁看覆蓋地圖", "stock page home return link");
requireIncludes(css, ".experience-flow-nav", "experience flow CSS");
requireIncludes(packageJson, '"check:experience-flow-navigation"', "package script");
requireIncludes(reviewGate, "check-experience-flow-navigation.mjs", "review gate wiring");

for (const [source, page] of [
  [briefing, "briefing"],
  [weekly, "weekly"],
  [dashboard, "dashboard"]
]) {
  forbidIncludes(source, "scoreSource=real", `${page} real score source claim`);
  forbidIncludes(source, "publicDataSource=supabase", `${page} public supabase claim`);
  forbidIncludes(source, "createClient(", `${page} direct Supabase client`);
  forbidIncludes(source, "fetch(", `${page} direct remote fetch`);
}

console.log("experience flow navigation ok");
