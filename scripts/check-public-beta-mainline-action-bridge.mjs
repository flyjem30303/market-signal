import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const surfaces = [
  {
    label: "home",
    path: "src/components/dashboard-shell.tsx",
    required: [
      "buildHomeMarketActionSummary",
      "home-market-action-summary",
      "home_market_action_primary",
      "home_market_action_secondary",
      "30 \u79d2\u770b\u61c2\u5e02\u5834\u6c1b\u570d",
      "3 \u5206\u9418\u6c7a\u5b9a\u95dc\u6ce8",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    label: "stock",
    path: "src/components/dashboard-shell.tsx",
    required: [
      "buildInvestorActionSummary",
      "StockInvestorActionSummary",
      "stock-investor-action-summary",
      "summary.observationFocus",
      "summary.primaryRisk",
      "summary.stopCondition",
      "3 \u5206\u9418\u78ba\u8a8d\u6210\u56e0",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    label: "stock-route",
    path: "src/app/stocks/[symbol]/page.tsx",
    required: [
      "DashboardShell",
      "includeSeoContent",
      "marketSignalSourceStatus",
      "Mock health score",
      "Mock pullback risk score",
      "not real market data",
      "investment advice"
    ]
  },
  {
    label: "briefing",
    path: "src/app/briefing/page.tsx",
    required: [
      "BriefingPublicDecisionSummaryPanel",
      "PublicBetaDecisionLoopBridge",
      "PublicBetaUsableLoopPanel",
      "buildBriefingMarketActionSummary",
      "briefing-market-action-summary",
      "briefing_market_action_primary",
      "briefing_market_action_secondary",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  }
];

const helperContracts = [
  {
    label: "home-helper",
    path: "src/lib/home-market-action-summary.ts",
    required: [
      "buildHomeMarketActionSummary",
      "HomeMarketActionSummary",
      "primaryAction",
      "secondaryAction",
      "\\u5e02\\u5834\\u6c23\\u6c1b",
      "\\u98a8\\u96aa\\u89c0\\u5bdf",
      "\\u4e0d\\u63d0\\u4f9b\\u8cb7\\u8ce3\\u5efa\\u8b70",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    label: "briefing-helper",
    path: "src/lib/briefing-market-action-summary.ts",
    required: [
      "buildBriefingMarketActionSummary",
      "BriefingMarketActionSummary",
      "primary",
      "secondary",
      "\\u5e02\\u5834\\u7e3d\\u89bd",
      "\\u98a8\\u96aa\\u89c0\\u5bdf",
      "\\u4e0d\\u63d0\\u4f9b\\u8cb7\\u8ce3\\u5efa\\u8b70",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    label: "stock-helper",
    path: "src/lib/investor-action-summary.ts",
    required: [
      "buildInvestorActionSummary",
      "InvestorActionSummary",
      "observationFocus",
      "primaryRisk",
      "stopCondition",
      "\u4e0d\u69cb\u6210\u6295\u8cc7\u5efa\u8b70",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  }
];

const forbiddenRuntimeTokens = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(\"",
  ".from('",
  "process.env",
  "scoreSource=real",
  "publicDataSource=supabase",
  "scoreSource: \"real\"",
  "publicDataSource: \"supabase\""
];

const forbiddenPublicClaimTokens = [
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed",
  "Supabase writes are approved",
  "SQL execution is approved"
];

const missing = [];
const blocked = [];

for (const surface of surfaces) {
  const source = read(surface.path);
  for (const phrase of surface.required) {
    if (!source.includes(phrase)) missing.push(`${surface.label}:${surface.path}: ${phrase}`);
  }

  for (const phrase of forbiddenPublicClaimTokens) {
    if (source.includes(phrase)) blocked.push(`${surface.label}:${surface.path}: ${phrase}`);
  }
}

for (const contract of helperContracts) {
  const source = read(contract.path);
  for (const phrase of contract.required) {
    if (!source.includes(phrase)) missing.push(`${contract.label}:${contract.path}: ${phrase}`);
  }

  for (const phrase of forbiddenRuntimeTokens) {
    if (source.includes(phrase)) blocked.push(`${contract.label}:${contract.path}: ${phrase}`);
  }
}

const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

if (
  packageJson.scripts?.["check:public-beta-mainline-action-bridge"] !==
  "node scripts/check-public-beta-mainline-action-bridge.mjs"
) {
  missing.push(`${packagePath}: check:public-beta-mainline-action-bridge`);
}

for (const phrase of [
  "scripts/check-public-beta-mainline-action-bridge.mjs",
  "public-beta-mainline-action-bridge"
]) {
  if (!reviewGate.includes(phrase)) missing.push(`${reviewGatePath}: ${phrase}`);
}

const result = {
  blocked,
  checked: {
    helperContracts: helperContracts.map((item) => item.label),
    surfaces: surfaces.map((item) => item.label)
  },
  missing,
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    missing.push(`${filePath}: file exists`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
