import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-tw-equity-post-repair-schema-exposure-probe-result.mjs";
const reviewPath = "docs/reviews/TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_POST_RUN_REVIEW_2026-06-06.md";
const outcomePath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const review = read(reviewPath);
const outcome = read(outcomePath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const [pathName, text, phrases] of [
  [
    reviewPath,
    review,
    [
      "Repair Outcome Gate",
      "Repair outcome required: `accepted`",
      "Repair outcome observed: `accepted`",
      "Repair outcome recorded by: `CEO`",
      "tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete",
      "staging_twse_stock_day_runs_not_exposed_in_openapi_schema",
      "staging_twse_stock_day_prices_not_exposed_in_openapi_schema"
    ]
  ],
  [
    outcomePath,
    outcome,
    [
      "\"outcome\": \"accepted\"",
      "Data API public schema confirmed and NOTIFY pgrst reload schema executed with no data write"
    ]
  ],
  [
    reportPath,
    reportSource,
    [
      "tw_equity_post_repair_schema_exposure_probe_result",
      "tw_equity_post_repair_schema_exposure_probe_result_exposure_still_incomplete_third_write_blocked",
      "inspect_data_api_table_exposure_permissions_or_table_api_visibility_before_any_third_write_decision",
      "thirdStagingWriteAttemptAllowed: false",
      "publicDataSource: \"mock\"",
      "scoreSource: \"mock\""
    ]
  ],
  [
    statusPath,
    status,
    [
      "Latest TW equity post-repair schema exposure probe result slice",
      "scripts/report-tw-equity-post-repair-schema-exposure-probe-result.mjs",
      "scripts/check-tw-equity-post-repair-schema-exposure-probe-result.mjs",
      "tw_equity_post_repair_schema_exposure_probe_result_exposure_still_incomplete_third_write_blocked",
      "third bounded staging write remains blocked",
      "table-level Data API visibility and permission diagnostic decision"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
  }
}

if (
  pkg.scripts?.["report:tw-equity-post-repair-schema-exposure-probe-result"] !==
  "node scripts/report-tw-equity-post-repair-schema-exposure-probe-result.mjs"
) {
  problems.push("package.json missing report:tw-equity-post-repair-schema-exposure-probe-result");
}
if (
  pkg.scripts?.["check:tw-equity-post-repair-schema-exposure-probe-result"] !==
  "node scripts/check-tw-equity-post-repair-schema-exposure-probe-result.mjs"
) {
  problems.push("package.json missing check:tw-equity-post-repair-schema-exposure-probe-result");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-post-repair-schema-exposure-probe-result.mjs")) {
    problems.push(`${pathName} missing TW equity post-repair schema exposure probe result checker`);
  }
  if (!text.includes("tw-equity-post-repair-schema-exposure-probe-result")) {
    problems.push(`${pathName} missing tw-equity-post-repair-schema-exposure-probe-result name`);
  }
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(reportRun.stdout)) problems.push(`${reportPath} emitted forbidden output pattern: ${String(pattern)}`);
  }

  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_post_repair_schema_exposure_probe_result_exposure_still_incomplete_third_write_blocked") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.decision?.thirdStagingWriteAttemptAllowed !== false) {
      problems.push(`${reportPath} must block third write`);
    }
    for (const key of [
      "connectionAttemptedByThisReport",
      "sqlExecuted",
      "migrationExecuted",
      "supabaseWriteAttempted",
      "stagingRowsCreated",
      "dailyPricesMutated",
      "marketDataFetched",
      "marketDataIngested",
      "rawOpenApiPrinted",
      "rawPayloadsPrinted",
      "rowPayloadsPrinted",
      "secretsPrinted",
      "publicPromotionAllowed",
      "rowCoveragePointsAllowed",
      "scoreSourceRealAllowed"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${reportPath} safety.${key} must be false`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score source`);
    }
  } catch {
    problems.push(`${reportPath} did not emit JSON`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}

