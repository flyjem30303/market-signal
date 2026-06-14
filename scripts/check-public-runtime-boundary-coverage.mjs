import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const findings = [];

const surfaces = [
  {
    name: "home",
    files: ["src/components/dashboard-shell.tsx", "src/components/home-runtime-status-panel.tsx"],
    required: ["PublicBetaDataReadinessStatus", "PublicBetaSourceCoverageBridge", "getRuntimeProductSummary", "目前維持示範資料"]
  },
  {
    name: "stock",
    files: ["src/components/dashboard-shell.tsx", "src/components/stock-runtime-at-a-glance.tsx"],
    required: ["StockRuntimeAtAGlance", "scoreSourceLabel", "snapshot", "風險"]
  },
  {
    name: "briefing",
    files: ["src/app/briefing/page.tsx"],
    required: ["DataFreshnessStrip", "PublicNextReadingFlow", "getDataFreshnessSnapshot"]
  },
  {
    name: "weekly",
    files: ["src/app/weekly/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="weekly"', "週報說明"]
  },
  {
    name: "methodology",
    files: ["src/app/methodology/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="methodology"', "方法說明"]
  },
  {
    name: "disclaimer",
    files: ["src/app/disclaimer/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="disclaimer"', "風險聲明"]
  }
];

const publicFiles = [
  "src/lib/public-runtime-boundary-copy.ts",
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/components/public-beta-data-readiness-status.tsx",
  "src/components/public-beta-source-coverage-bridge.tsx"
];

const sharedCopyRequirements = [
  "blockedState",
  "currentState",
  "headline",
  "nextStep",
  "stopLine",
  "summary",
  "正式資料升級尚未開放",
  "公開 Beta 目前使用示範資料",
  "不宣稱即時行情",
  "完整覆蓋",
  "模型輸出也不是預測或投資建議"
];

const freshnessStripRequirements = [
  "DataFreshnessStrip",
  "freshness.scoreSource",
  "freshness.isMock",
  "freshness.sourceName",
  "freshness-boundary",
  "methodology",
  "disclaimer"
];

const forbiddenPublicTokens = [
  'scoreSource: "real"',
  'scoreSource="real"',
  "createSupabaseMarketSignalRepository",
  "validate-supabase",
  "twse_stock_day_staging",
  "staging_twse_stock_day",
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
for (const token of ["風險聲明", "方法說明", "隱私與資料說明", "使用條款", "週報說明", "非投資建議"]) {
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
