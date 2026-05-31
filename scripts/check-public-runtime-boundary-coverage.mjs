import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const surfaces = [
  {
    name: "home",
    files: ["src/components/dashboard-shell.tsx", "src/components/home-runtime-status-panel.tsx"],
    required: ["HomeRuntimeStatusPanel", "mock-only runtime", "scoreSource"]
  },
  {
    name: "stock",
    files: ["src/components/dashboard-shell.tsx", "src/components/stock-runtime-at-a-glance.tsx"],
    required: ["StockRuntimeAtAGlance", "scoreSource=real 仍未完成", "readiness"]
  },
  {
    name: "briefing",
    files: ["src/app/briefing/page.tsx"],
    required: ["RuntimeReadinessPanel", "SourceDepthBlockerPanel"]
  },
  {
    name: "weekly",
    files: ["src/app/weekly/page.tsx", "src/components/trust-runtime-boundary-notice.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="weekly"', "mock-only"]
  },
  {
    name: "methodology",
    files: ["src/app/methodology/page.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="methodology"', "scoreSource"]
  },
  {
    name: "disclaimer",
    files: ["src/app/disclaimer/page.tsx"],
    required: ["TrustRuntimeBoundaryNotice", 'context="disclaimer"', "投資建議"]
  }
];

const publicFiles = [
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

const forbiddenPublicTokens = [
  'scoreSource: "real"',
  'scoreSource="real"',
  "scoreSource=real 已完成",
  "createServerSupabaseClient",
  "createSupabaseMarketSignalRepository",
  "validate-supabase",
  "twse_stock_day_staging",
  "staging_twse_stock_day",
  "daily_prices",
  "seed SQL 已建立",
  "sourceDepthState: \"approved\""
];

const findings = [];

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
