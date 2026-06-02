import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const surfaces = [
  {
    name: "home",
    files: ["src/components/dashboard-shell.tsx", "src/components/home-runtime-status-panel.tsx"],
    required: [
      "HomeRuntimeStatusPanel",
      "getPublicRuntimeBoundaryCopy",
      "boundaryCopy.currentState",
      "getRuntimeDeliveryCadence",
      "runtime-delivery-card",
      "mock-only runtime 比較台指、個股與 ETF",
      "目前仍未啟用 Supabase runtime 或正式分數來源"
    ]
  },
  {
    name: "stock",
    files: ["src/components/dashboard-shell.tsx", "src/components/stock-runtime-at-a-glance.tsx"],
    required: [
      "StockRuntimeAtAGlance",
      "getPublicRuntimeBoundaryCopy",
      "boundaryCopy.blockedState",
      "getRuntimeDeliveryCadence",
      "runtime-cutpoint-card",
      "mock-only runtime 燈號、模組分數與資料缺口",
      "Supabase runtime 與正式分數來源尚未啟用"
    ]
  },
  {
    name: "briefing",
    files: ["src/app/briefing/page.tsx", "src/components/runtime-readiness-panel.tsx"],
    required: [
      "RuntimeReadinessPanel",
      "runtimeHardeningExit.publicBoundaryLabel",
      "runtime-public-boundary-summary",
      "getRuntimeDeliveryCadence",
      "runtime-delivery-cadence",
      "runtimeDeliveryCadence.mandatoryCutpoints"
    ]
  },
  {
    name: "weekly",
    files: ["src/app/weekly/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="weekly"', "boundaryCopy.summary"]
  },
  {
    name: "methodology",
    files: ["src/app/methodology/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="methodology"', "getPublicRuntimeBoundaryCopy"]
  },
  {
    name: "disclaimer",
    files: ["src/app/disclaimer/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="disclaimer"', "boundaryCopy.currentState"]
  }
];

const publicFiles = [
  "src/lib/public-runtime-boundary-copy.ts",
  "src/lib/runtime-delivery-cadence.ts",
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/runtime-readiness-panel.tsx",
  "src/components/source-depth-blocker-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx"
];

const publicCopyRequirements = [
  {
    file: "src/components/data-freshness-strip.tsx",
    tokens: [
      "資料新鮮度 metadata 只說明顯示狀態",
      "市場訊號來源：目前",
      "新鮮度基準",
      "資料品質閘門",
      "Metadata 邊界"
    ]
  }
];

const forbiddenPublicTokens = [
  'scoreSource: "real"',
  'scoreSource="real"',
  "createServerSupabaseClient",
  "createSupabaseMarketSignalRepository",
  "validate-supabase",
  "twse_stock_day_staging",
  "staging_twse_stock_day",
  "daily_prices",
  "sourceDepthState: \"approved\""
];

const mojibakePattern = /[\uFFFD\uF000-\uF8FF]/u;

const findings = [];

const sharedCopy = readRequired("src/lib/public-runtime-boundary-copy.ts");
for (const token of [
  "Mock-only runtime boundary",
  "Stock page mock-only runtime boundary",
  "Trust page mock-only runtime boundary",
  "Public pages show mock runtime interpretation only.",
  "Not live: Supabase-backed public data, SQL-backed scoring, market-data ingestion, and scoreSource=real.",
  "Stop line: keep publicDataSource=mock and scoreSource=mock."
]) {
  if (!sharedCopy.includes(token)) {
    findings.push({
      file: "src/lib/public-runtime-boundary-copy.ts",
      issue: `missing shared public runtime copy token: ${token}`
    });
  }
}

for (const surface of surfaces) {
  const combined = surface.files.map(readRequired).join("\n");

  for (const token of surface.required) {
    if (!combined.includes(token)) {
      findings.push({
        issue: `missing runtime boundary coverage token: ${token}`,
        surface: surface.name
      });
    }
  }
}

for (const requirement of publicCopyRequirements) {
  const source = readRequired(requirement.file);

  for (const token of requirement.tokens) {
    if (!source.includes(token)) {
      findings.push({
        file: requirement.file,
        issue: `missing public runtime readability token: ${token}`
      });
    }
  }
}

const cadenceCopy = readRequired("src/lib/runtime-delivery-cadence.ts");
for (const token of [
  "recent_slices_too_fragmented",
  "larger_mock_runtime_product_slice",
  "runtime product 70 / blocker closure 20 / governance 10",
  "before any Supabase connection attempt",
  "before any SQL execution",
  "before any market-data fetch or ingestion",
  "before any publicDataSource promotion",
  "before any scoreSource=real transition",
  "after any remote attempt post-run review"
]) {
  if (!cadenceCopy.includes(token)) {
    findings.push({
      file: "src/lib/runtime-delivery-cadence.ts",
      issue: `missing runtime delivery cadence token: ${token}`
    });
  }
}

for (const file of publicFiles) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const source = readRequired(file);

  if (mojibakePattern.test(source)) {
    findings.push({
      file,
      issue: "public runtime UI file contains replacement/private-use mojibake characters"
    });
  }

  for (const token of forbiddenPublicTokens) {
    if (source.includes(token)) {
      findings.push({
        file,
        issue: `forbidden public runtime boundary token: ${token}`
      });
    }
  }
}

console.log(
  JSON.stringify(
    {
      checkedPublicFiles: publicFiles,
      checkedSurfaces: surfaces.map((surface) => surface.name),
      findings,
      status: findings.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (findings.length > 0) {
  process.exitCode = 1;
}

function readRequired(file) {
  const fullPath = path.join(root, file);

  if (!fs.existsSync(fullPath)) {
    findings.push({ file, issue: "required public runtime boundary file is missing" });
    return "";
  }

  return fs.readFileSync(fullPath, "utf8");
}
