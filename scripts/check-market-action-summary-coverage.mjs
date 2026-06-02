import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const surfaces = [
  {
    helperPath: "src/lib/home-market-action-summary.ts",
    integrationPath: "src/components/dashboard-shell.tsx",
    integrationTokens: [
      "buildHomeMarketActionSummary",
      "home-market-action-summary",
      "home_market_action_primary",
      "home_market_action_secondary"
    ],
    name: "home",
    requiredHelperTokens: [
      "buildHomeMarketActionSummary",
      "HomeMarketActionSummary",
      "primaryAction",
      "secondaryAction",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    helperPath: "src/lib/investor-action-summary.ts",
    integrationPath: "src/components/dashboard-shell.tsx",
    integrationTokens: [
      "buildInvestorActionSummary",
      "StockInvestorActionSummary",
      "stock-investor-action-summary",
      "summary.observationFocus",
      "summary.primaryRisk",
      "summary.stopCondition"
    ],
    name: "stock",
    requiredHelperTokens: [
      "buildInvestorActionSummary",
      "InvestorActionSummary",
      "observationFocus",
      "primaryRisk",
      "stopCondition",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    helperPath: "src/lib/briefing-market-action-summary.ts",
    integrationPath: "src/app/briefing/page.tsx",
    integrationTokens: [
      "buildBriefingMarketActionSummary",
      "briefing-market-action-summary",
      "briefing_market_action_primary",
      "briefing_market_action_secondary"
    ],
    name: "briefing",
    requiredHelperTokens: [
      "buildBriefingMarketActionSummary",
      "BriefingMarketActionSummary",
      "primary",
      "secondary",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    helperPath: "src/lib/weekly-market-action-summary.ts",
    integrationPath: "src/app/weekly/page.tsx",
    integrationTokens: [
      "buildWeeklyMarketActionSummary",
      "weekly-market-action-summary",
      "weekly_market_action_primary",
      "weekly_market_action_secondary"
    ],
    name: "weekly",
    requiredHelperTokens: [
      "buildWeeklyMarketActionSummary",
      "WeeklyMarketActionSummary",
      "primary",
      "secondary",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  }
];

const forbiddenHelperTokens = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(\"",
  ".from('",
  "process.env",
  "node:fs",
  "scoreSource: \"real\"",
  "publicDataSource: \"supabase\""
];

const forbiddenIntegrationTokens = ["scoreSource=\"real\"", "publicDataSource=\"supabase\""];

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const surface of surfaces) {
  const helper = fs.readFileSync(surface.helperPath, "utf8");
  const integration = fs.readFileSync(surface.integrationPath, "utf8");

  for (const token of surface.requiredHelperTokens) {
    if (!helper.includes(token)) missing.push(`${surface.name}:${surface.helperPath}: ${token}`);
  }

  for (const token of surface.integrationTokens) {
    if (!integration.includes(token)) missing.push(`${surface.name}:${surface.integrationPath}: ${token}`);
  }

  for (const token of forbiddenHelperTokens) {
    if (helper.includes(token)) blocked.push(`${surface.name}:${surface.helperPath}: ${token}`);
  }

  for (const token of forbiddenIntegrationTokens) {
    if (integration.includes(token)) blocked.push(`${surface.name}:${surface.integrationPath}: ${token}`);
  }
}

if (!packageJson.includes('"check:market-action-summary-coverage"')) {
  missing.push(`${packagePath}: check:market-action-summary-coverage`);
}

if (!reviewGate.includes("check-market-action-summary-coverage.mjs")) {
  missing.push(`${reviewGatePath}: check-market-action-summary-coverage.mjs`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      checkedSurfaces: surfaces.map((surface) => surface.name),
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
