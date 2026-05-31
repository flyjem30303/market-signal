import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const stripPages = [
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx"
];

const dashboardPages = ["src/app/stocks/[symbol]/page.tsx"];

const componentFiles = [
  "src/components/data-freshness-strip.tsx",
  "src/components/dashboard-shell.tsx"
];

const forbiddenRuntimeTokens = [
  "createServerSupabaseClient",
  "createSupabaseClient",
  "@supabase/supabase-js",
  "DATA_FRESHNESS_SUPABASE_READS",
  "DATA_FRESHNESS_SOURCE",
  "SUPABASE_SERVICE_ROLE_KEY",
  'scoreSource: "real"',
  "scoreSource=\"real\"",
  "scoreSource=real",
  "getSupabaseDataFreshnessSnapshot",
  "createFreshnessRepository",
  "createDataRunsFreshnessRepository"
];

const checks = [];

for (const file of stripPages) {
  checks.push(...checkStripPage(file));
}

for (const file of dashboardPages) {
  checks.push(...checkDashboardPage(file));
}

for (const file of componentFiles) {
  checks.push(...checkComponentBoundary(file));
}

const failed = checks.filter((check) => !check.pass);

console.log(
  JSON.stringify(
    {
      checks,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exitCode = 1;
}

function checkStripPage(file) {
  const source = read(file);
  const freshnessCall = "const freshness = await getDataFreshnessSnapshot();";
  const stripCall = "<DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />";

  return [
    required(file, source, 'import { DataFreshnessStrip } from "@/components/data-freshness-strip";'),
    required(file, source, 'import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";'),
    required(file, source, "getMarketSignalSourceStatus"),
    required(file, source, freshnessCall),
    required(file, source, "const marketSignalSourceStatus = getMarketSignalSourceStatus();"),
    required(file, source, stripCall),
    order(file, source, freshnessCall, stripCall, "freshness snapshot is resolved before strip render"),
    ...forbidden(file, source, forbiddenRuntimeTokens)
  ];
}

function checkDashboardPage(file) {
  const source = read(file);
  const freshnessCall = "const freshness = await getDataFreshnessSnapshot();";
  const shellCall = "<DashboardShell";

  return [
    required(file, source, 'import { DashboardShell } from "@/components/dashboard-shell";'),
    required(file, source, 'import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";'),
    required(file, source, "getMarketSignalSourceStatus"),
    required(file, source, freshnessCall),
    required(file, source, "const marketSignalSourceStatus = getMarketSignalSourceStatus();"),
    required(file, source, "freshnessSnapshot={freshness}"),
    required(file, source, "marketSignalSourceStatus={marketSignalSourceStatus}"),
    order(file, source, freshnessCall, shellCall, "freshness snapshot is resolved before dashboard render"),
    ...forbidden(file, source, forbiddenRuntimeTokens)
  ];
}

function checkComponentBoundary(file) {
  const source = read(file);
  const requiredTokens =
    file.endsWith("data-freshness-strip.tsx")
      ? ["freshness.sourceName", "freshness.description", "freshness.scoreSource", "marketSignalSourceStatus"]
      : ["freshnessSnapshot", "buildMockDataFreshnessSnapshot", "DataFreshnessStrip", "marketSignalSourceStatus"];

  return [
    ...requiredTokens.map((token) => required(file, source, token)),
    ...forbidden(file, source, [
      "DATA_FRESHNESS_SUPABASE_READS",
      "SUPABASE_SERVICE_ROLE_KEY",
      'scoreSource: "real"',
      "scoreSource=\"real\"",
      "scoreSource=real",
      "getSupabaseDataFreshnessSnapshot"
    ])
  ];
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function required(file, source, token) {
  return {
    file,
    pass: source.includes(token),
    rule: `required token: ${token}`
  };
}

function forbidden(file, source, tokens) {
  return tokens.map((token) => ({
    file,
    pass: !source.includes(token),
    rule: `forbidden token absent: ${token}`
  }));
}

function order(file, source, before, after, label) {
  const beforeIndex = source.indexOf(before);
  const afterIndex = source.indexOf(after);

  return {
    file,
    pass: beforeIndex >= 0 && afterIndex >= 0 && beforeIndex < afterIndex,
    rule: label
  };
}
