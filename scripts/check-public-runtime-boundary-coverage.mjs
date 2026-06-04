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
      "home-runtime-details",
      "Mock signals are available for reading",
      "scoreSource=real remain blocked",
      "系統細節：審核狀態與尚未開放項目",
      "展開 runtime 細節、邊界與下一步依據",
      "公開畫面維持",
      "readonly 證據只代表連線與物件可達",
      "尚未開放",
      "Fail-closed",
      "失敗即封鎖規則",
      "runtime-fail-closed-card"
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
      "has a readable mock signal",
      "Supabase-backed public data",
      "scoreSource=real still require separate accepted gates",
      "runtime-fail-closed-card",
      "公開頁面仍停在 mock runtime",
      "尚未宣稱真實市場資料",
      "封鎖項目"
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
      "runtime-remote-guard-details",
      "Remote guard details: CEO-named one-attempt only",
      "runtime-evidence-details",
      "Evidence details / PM and technical work lanes",
      "runtimeDeliveryCadence.mandatoryCutpoints",
      "runtime-fail-closed-card"
    ]
  },
  {
    name: "weekly",
    files: [
      "src/app/weekly/page.tsx",
      "src/components/trust-runtime-boundary-notice.tsx",
      "src/lib/home-runtime-action-summary.ts"
    ],
    required: [
      "TrustRuntimeBoundaryNotice",
      'context="weekly"',
      "boundaryCopy.summary",
      "getHomeRuntimeActionSummary",
      "weekly-runtime-action-summary",
      "real-score transition",
      "actionSummary.currentProgressPercent",
      "actionSummary.safetyStopLine"
    ]
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
  "src/lib/home-runtime-action-summary.ts",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/runtime-readiness-panel.tsx",
  "src/components/source-depth-blocker-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx"
];

const sharedCopyRequirements = [
  "blockedState",
  "currentState",
  "headline",
  "nextStep",
  "stopLine",
  "summary",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const freshnessStripRequirements = [
  "DataFreshnessStrip",
  "getDataQualityDowngradeSummary",
  "getFreshnessInterpretationSummary",
  "getFreshnessMetadataBoundarySummary",
  "FreshnessEvidenceBoundary",
  "TrackedLink",
  "freshness-boundary",
  "metadataBoundary.stopLine"
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
  'sourceDepthState: "approved"'
];

const mojibakePattern = /\uFFFD/u;
const findings = [];

const sharedCopy = readRequired("src/lib/public-runtime-boundary-copy.ts");
for (const token of sharedCopyRequirements) {
  if (!sharedCopy.includes(token)) {
    findings.push({
      file: "src/lib/public-runtime-boundary-copy.ts",
      issue: `missing shared public runtime copy token: ${token}`
    });
  }
}

const freshnessStrip = readRequired("src/components/data-freshness-strip.tsx");
for (const token of freshnessStripRequirements) {
  if (!freshnessStrip.includes(token)) {
    findings.push({
      file: "src/components/data-freshness-strip.tsx",
      issue: `missing public freshness boundary token: ${token}`
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

for (const file of publicFiles) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const source = readRequired(file);

  if (mojibakePattern.test(source)) {
    findings.push({
      file,
      issue: "public runtime UI file contains replacement-character mojibake"
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
