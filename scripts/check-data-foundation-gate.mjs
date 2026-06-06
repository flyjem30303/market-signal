import { spawnSync } from "node:child_process";
import fs from "node:fs";

const helperPath = "src/lib/data-foundation-gate.ts";
const readinessPath = "src/lib/data-readiness-decision-summary.ts";
const progressPath = "src/lib/project-progress-score.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, readinessPath, progressPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);
const packageJson = JSON.parse(read(packagePath));
const missing = [];
const blocked = [];

for (const [file, phrases] of [
  [
    helperPath,
    [
      "DataFoundationGate",
      "getDataFoundationGate",
      "local_data_foundation_gate",
      "foundation_partially_accepted_remote_paused",
      "Object reachability accepted",
      "Runtime schema baseline accepted",
      "Freshness metadata accepted",
      "Row coverage still blocked",
      "Data quality threshold still blocked",
      "Source depth still blocked",
      "foundationPercent",
      "publicDataSource: \"mock\"",
      "scoreSource: \"mock\"",
      "does not run SQL",
      "publicDataSource=supabase",
      "scoreSource=real"
    ]
  ],
  [
    readinessPath,
    [
      "getDataFoundationGate",
      "dataFoundationGate: DataFoundationGate",
      "dataFoundationGate: getDataFoundationGate()"
    ]
  ],
  [
    progressPath,
    [
      "current: 95",
      "daily_prices runtime shape baseline",
      "DevOps health recovery readiness",
      "data foundation gate",
      "current: 83",
      "data/runtime foundation gates"
    ]
  ],
  [
    componentPath,
    [
      "project-progress-data-foundation",
      "dataReadiness.dataFoundationGate.foundationPercent",
      "dataReadiness.dataFoundationGate.items.map"
    ]
  ],
  [cssPath, [".project-progress-data-foundation", ".project-progress-data-foundation-grid"]]
]) {
  for (const phrase of phrases) {
    if (!read(file).includes(phrase)) {
      missing.push(`${file}: ${phrase}`);
    }
  }
}

for (const file of [helperPath, readinessPath, progressPath]) {
  for (const pattern of [
    /@supabase\/supabase-js/,
    /createClient/,
    /fetch\(/,
    /\.from\(/,
    /\.insert\(/,
    /\.update\(/,
    /\.delete\(/,
    /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
    /publicDataSource:\s*"supabase"/,
    /scoreSource:\s*"real"/,
    /scoreSourceRealEnabled:\s*true/,
    /sqlExecuted:\s*true/,
    /supabaseWritesEnabled:\s*true/,
    /marketDataFetched:\s*true/,
    /current:\s*100/
  ]) {
    if (pattern.test(read(file))) {
      blocked.push(`${file}: forbidden source pattern ${String(pattern)}`);
    }
  }
}

if (packageJson.scripts?.["check:data-foundation-gate"] !== "node scripts/check-data-foundation-gate.mjs") {
  missing.push(`${packagePath}: check:data-foundation-gate`);
}
if (!read(reviewGatePath).includes("scripts/check-data-foundation-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-foundation-gate.mjs`);
}

const snapshot = spawnSync(process.execPath, ["scripts/report-project-progress-snapshot.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});
if (snapshot.status !== 0) {
  blocked.push(`scripts/report-project-progress-snapshot.mjs: exited ${String(snapshot.status)} ${snapshot.stderr.trim()}`);
} else {
  const output = JSON.parse(snapshot.stdout);
  if (output.project?.adjustedScore < 70) {
    blocked.push(`project.adjustedScore expected at least 70, got ${String(output.project?.adjustedScore)}`);
  }
  if (output.project?.lanes?.find((lane) => lane.label === "Data freshness and quality evidence")?.current !== 95) {
    blocked.push("Data freshness and quality evidence lane expected 95");
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("snapshot safety must keep publicDataSource and scoreSource mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`snapshot safety ${flag} must be false`);
    }
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
