import { readFileSync } from "node:fs";

const files = {
  component: "src/components/runtime-transition-rail.tsx",
  css: "src/app/globals.css",
  home: "src/components/home-runtime-status-panel.tsx",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  stock: "src/components/stock-runtime-at-a-glance.tsx"
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

const component = read(files.component);
const home = read(files.home);
const stock = read(files.stock);
const css = read(files.css);
const packageJson = read(files.packageJson);
const reviewGate = read(files.reviewGate);

for (const [token, label] of [
  ["RuntimeTransitionRail", "component export"],
  ["getRuntimeProductSummary", "product summary helper"],
  ["getPostReadonlyRuntimeState", "post-readonly helper"],
  ['aria-label="Runtime transition rail"', "aria label"],
  ['className="runtime-transition-rail"', "rail class"],
  ["Live now", "live now stage"],
  ["Mock runtime", "mock runtime stage"],
  ["Evidence ready", "evidence stage"],
  ["readonly objects", "readonly evidence wording"],
  ["Not live yet", "not live stage"],
  ["Real score blocked", "real score blocked wording"],
  ["postReadonly.stopLine", "stop line wiring"]
]) {
  requireIncludes(component, token, label);
}

requireIncludes(home, 'import { RuntimeTransitionRail }', "home import");
requireIncludes(home, "<RuntimeTransitionRail symbol={selectedSymbol} />", "home rail placement");
requireIncludes(stock, 'import { RuntimeTransitionRail }', "stock import");
requireIncludes(stock, "<RuntimeTransitionRail symbol={snapshot.asset.symbol} />", "stock rail placement");
requireIncludes(css, ".runtime-transition-rail", "rail CSS");
requireIncludes(css, ".runtime-transition-rail article.active", "active rail CSS");
requireIncludes(css, ".runtime-transition-rail article.readying", "readying rail CSS");
requireIncludes(css, ".runtime-transition-rail article.blocked", "blocked rail CSS");
requireIncludes(packageJson, '"check:runtime-transition-rail"', "package script");
requireIncludes(reviewGate, "check-runtime-transition-rail.mjs", "review gate wiring");

for (const [source, label] of [
  [component, "component"],
  [home, "home"],
  [stock, "stock"]
]) {
  forbidIncludes(source, "@supabase/supabase-js", `${label} Supabase client`);
  forbidIncludes(source, "createClient", `${label} direct client`);
  forbidIncludes(source, "fetch(", `${label} remote fetch`);
  forbidIncludes(source, "scoreSource: \"real\"", `${label} real score source object`);
  forbidIncludes(source, "publicDataSource: \"supabase\"", `${label} public supabase source object`);
}

console.log("runtime transition rail ok");
