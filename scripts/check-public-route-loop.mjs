import fs from "node:fs";

const files = {
  dashboard: "src/components/dashboard-shell.tsx",
  home: "src/app/page.tsx",
  stock: "src/app/stocks/[symbol]/page.tsx",
  briefing: "src/app/briefing/page.tsx",
  weekly: "src/app/weekly/page.tsx",
  methodology: "src/app/methodology/page.tsx",
  disclaimer: "src/app/disclaimer/page.tsx",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs"
};

const read = (file) => fs.readFileSync(file, "utf8");
const sources = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));

const required = [
  {
    name: "home-first-screen-to-decision-routes",
    source: sources.dashboard,
    tokens: [
      "Quick Start",
      "Decision Compass",
      "Market Action Summary",
      "href=\"/briefing\"",
      "href=\"/weekly\"",
      "href={`/stocks/${selected.symbol}`}",
      "href={`/stocks/${marketSnapshot.asset.symbol}`}",
      "home_cta_clicked",
      "mock-only runtime"
    ]
  },
  {
    name: "stock-page-follow-up-loop",
    source: sources.dashboard,
    tokens: [
      "function StockPageFollowUpLinks",
      "StockPageFollowUpLinks selected={selected}",
      "href=\"/briefing\"",
      "href=\"/weekly\"",
      "href=\"/\"",
      "href=\"/methodology\"",
      "href=\"/disclaimer\"",
      "stock_follow_up"
    ]
  },
  {
    name: "briefing-experience-flow-loop",
    source: sources.briefing,
    tokens: [
      "aria-label=\"Experience Flow\"",
      "href=\"/\"",
      "href=\"/weekly\"",
      "href=\"/methodology\"",
      "href=\"/disclaimer\"",
      "href=\"/stocks/2330\"",
      "href={`/stocks/${market.asset.symbol}`}",
      "PublicRuntimeStateStrip context=\"briefing\""
    ]
  },
  {
    name: "weekly-experience-flow-loop",
    source: sources.weekly,
    tokens: [
      "aria-label=\"Experience Flow\"",
      "href=\"/\"",
      "href=\"/briefing\"",
      "href=\"/stocks/TWII\"",
      "href=\"/methodology\"",
      "href=\"/disclaimer\"",
      "href={`/stocks/${market.asset.symbol}`}",
      "TrustRuntimeBoundaryNotice context=\"weekly\""
    ]
  },
  {
    name: "methodology-trust-loop",
    source: sources.methodology,
    tokens: [
      "TrustRuntimeBoundaryNotice context=\"methodology\"",
      "href=\"/\"",
      "href=\"/briefing\"",
      "href=\"/weekly\"",
      "href=\"/stocks/TWII\"",
      "href=\"/stocks/2330\"",
      "href=\"/disclaimer\"",
      "methodology_next_links"
    ]
  },
  {
    name: "disclaimer-trust-loop",
    source: sources.disclaimer,
    tokens: [
      "TrustRuntimeBoundaryNotice context=\"disclaimer\"",
      "href=\"/methodology\"",
      "href=\"/\"",
      "href=\"/terms\"",
      "href=\"/privacy\"",
      "disclaimer_next_links"
    ]
  },
  {
    name: "stock-route-runtime-shell",
    source: sources.stock,
    tokens: ["DashboardShell", "includeSeoContent"]
  },
  {
    name: "home-route-runtime-shell",
    source: sources.home,
    tokens: ["DashboardShell"]
  },
  {
    name: "package-script-registration",
    source: sources.packageJson,
    tokens: ["\"check:public-route-loop\": \"node scripts/check-public-route-loop.mjs\""]
  },
  {
    name: "review-gate-registration",
    source: sources.reviewGate,
    tokens: ["scripts/check-public-route-loop.mjs", "name: \"public-route-loop\""]
  }
];

const forbiddenPublicTokens = [
  "scoreSource=real approved",
  "publicDataSource=supabase approved",
  "claimApproval=approved",
  "Visible now: real",
  "Visible now: supabase",
  "createClient(",
  "fetch("
];

const publicSources = [
  ["dashboard", sources.dashboard],
  ["home", sources.home],
  ["stock", sources.stock],
  ["briefing", sources.briefing],
  ["weekly", sources.weekly],
  ["methodology", sources.methodology],
  ["disclaimer", sources.disclaimer]
];

const missing = [];
for (const check of required) {
  for (const token of check.tokens) {
    if (!check.source.includes(token)) {
      missing.push({ check: check.name, token });
    }
  }
}

const forbidden = [];
for (const [name, source] of publicSources) {
  for (const token of forbiddenPublicTokens) {
    if (source.includes(token)) {
      forbidden.push({ source: name, token });
    }
  }
}

const blocked = missing.length > 0 || forbidden.length > 0;
const result = {
  status: blocked ? "blocked" : "ok",
  checkedRoutes: ["/", "/briefing", "/weekly", "/stocks/[symbol]", "/methodology", "/disclaimer"],
  missing,
  forbidden
};

console.log(JSON.stringify(result, null, 2));
process.exit(blocked ? 1 : 0);
