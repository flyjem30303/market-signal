import { readFileSync } from "node:fs";

const files = {
  briefing: "src/app/briefing/page.tsx",
  component: "src/components/public-runtime-state-strip.tsx",
  css: "src/app/globals.css",
  helper: "src/lib/public-claim-runtime-state.ts",
  home: "src/components/home-runtime-status-panel.tsx",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  stock: "src/components/stock-runtime-at-a-glance.tsx",
  trust: "src/components/trust-runtime-boundary-notice.tsx"
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

const helper = read(files.helper);
const component = read(files.component);
const home = read(files.home);
const stock = read(files.stock);
const trust = read(files.trust);
const briefing = read(files.briefing);
const css = read(files.css);
const packageJson = read(files.packageJson);
const reviewGate = read(files.reviewGate);

for (const [token, label] of [
  ["PublicClaimRuntimeState", "state type"],
  ["getPublicClaimRuntimeState", "state helper"],
  ['publicDataSource: "mock"', "mock public source"],
  ['scoreSource: "mock"', "mock score source"],
  ['claimApprovalState: "not_approved"', "not approved claim state"],
  ["Runtime quick read: mock only", "headline"],
  ["Visible now", "visible-now label"],
  ["Not live yet", "not-live-yet label"],
  ["Next gate", "next-gate label"],
  ["publicDataSource=mock", "public source display"],
  ["scoreSource=mock", "score source display"],
  ["claimApproval=not_approved", "claim approval display"],
  ["Users can read mock signals", "readable user summary"],
  ["CEO must separately name a bounded readonly gate", "next gate boundary"],
  ["Do not promote public source", "stop line"]
]) {
  requireIncludes(helper, token, label);
}

for (const [token, label] of [
  ["PublicRuntimeStateStrip", "component export"],
  ["getPublicClaimRuntimeState", "helper import"],
  ['aria-label={`${context} public runtime state`}', "aria label"],
  ['className="public-runtime-state-strip"', "strip class"],
  ["public-runtime-stop-line", "stop line class"]
]) {
  requireIncludes(component, token, label);
}

requireIncludes(home, "<PublicRuntimeStateStrip context=\"home\" />", "home placement");
requireIncludes(stock, "<PublicRuntimeStateStrip context=\"stock\" />", "stock placement");
requireIncludes(briefing, "<PublicRuntimeStateStrip context=\"briefing\" />", "briefing placement");
requireIncludes(trust, "PublicRuntimeStateStrip", "trust import");
requireIncludes(trust, 'context={context === "weekly" ? "weekly" : "trust"}', "weekly/trust context routing");
requireIncludes(css, ".public-runtime-state-strip", "strip CSS");
requireIncludes(css, ".public-runtime-state-strip article.blocked", "blocked CSS");
requireIncludes(packageJson, '"check:public-runtime-state-strip"', "package script");
requireIncludes(reviewGate, "check-public-runtime-state-strip.mjs", "review gate wiring");

for (const [source, label] of [
  [helper, "helper"],
  [component, "component"],
  [home, "home"],
  [stock, "stock"],
  [briefing, "briefing"],
  [trust, "trust"]
]) {
  forbidIncludes(source, "@supabase/supabase-js", `${label} Supabase client`);
  forbidIncludes(source, "createClient", `${label} direct client`);
  forbidIncludes(source, "fetch(", `${label} remote fetch`);
  forbidIncludes(source, 'scoreSource: "real"', `${label} real score source object`);
  forbidIncludes(source, 'publicDataSource: "supabase"', `${label} public supabase source object`);
  forbidIncludes(source, "claimApproval=approved", `${label} approved public claim`);
}

console.log("public runtime state strip ok");
