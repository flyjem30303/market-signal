import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const findings = [];

const surfaces = [
  {
    name: "home",
    files: ["src/components/dashboard-shell.tsx", "src/components/home-runtime-status-panel.tsx"],
    required: [
      "HomeRuntimeStatusPanel",
      "getPublicRuntimeBoundaryCopy",
      "boundaryCopy.currentState",
      "boundaryCopy.stopLine",
      "getRuntimeDeliveryCadence",
      "runtime-delivery-card",
      "home-runtime-details",
      "Freshness metadata",
      "Supabase readonly",
      "Fail-closed",
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
      "boundaryCopy.summary",
      "boundaryCopy.currentState",
      "getRuntimeDeliveryCadence",
      "runtime-cutpoint-card",
      "Freshness metadata",
      "scoreSource=real",
      "runtime-fail-closed-card"
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
  "scoreSource=mock",
  "mock-only",
  "資料新鮮度",
  "不構成投資建議",
  "partial coverage",
  "missing/delayed data",
  "model outputs are not forecasts"
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
  'sourceDepthState: "approved"',
  "publicDataSource=supabase approved",
  "scoreSource=real approved"
];

const sharedCopy = readRequired("src/lib/public-runtime-boundary-copy.ts");
for (const token of sharedCopyRequirements) {
  if (!sharedCopy.includes(token)) {
    findings.push({
      file: "src/lib/public-runtime-boundary-copy.ts",
      issue: `missing shared public runtime copy token: ${token}`
    });
  }
}

const trustNotice = readRequired("src/components/trust-runtime-boundary-notice.tsx");
for (const token of ["投資與資料限制", "資料新鮮度", "不構成投資建議", "publicDataSource=mock; scoreSource=mock"]) {
  if (!trustNotice.includes(token)) {
    findings.push({
      file: "src/components/trust-runtime-boundary-notice.tsx",
      issue: `missing trust notice launch-copy token: ${token}`
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

  for (const marker of findMojibakeMarkers(source)) {
    findings.push({
      file,
      issue: `public runtime UI file contains ${marker}`
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-character mojibake");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use mojibake");
  return markers;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}
