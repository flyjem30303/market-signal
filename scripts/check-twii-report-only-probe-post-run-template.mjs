import fs from "node:fs";

const templatePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_POST_RUN_REVIEW_TEMPLATE_2026-06-01.md";
const commandMapPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_COMMAND_MAP_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const template = fs.readFileSync(templatePath, "utf8");
const commandMap = fs.readFileSync(commandMapPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_post_run_review_template_recorded`",
  "scripts/run-twii-report-only-probe-once.mjs",
  "status: pending_run",
  "failureClass: pending_run",
  "remoteAttempted: pending_run",
  "connectionAttempted: pending_run",
  "targetSymbol: TWII",
  "selectedCandidate: official-exchange-index",
  "parsedRowCount: pending_run",
  "publicDataSource: mock",
  "scoreSource: mock",
  "rowPayloadsPrinted: false",
  "stockIdPayloadsPrinted: false",
  "secretsPrinted: false",
  "sqlExecuted: false",
  "writesAttempted: false",
  "marketDataFilesWritten: false",
  "rowCoverageCreditAwarded: false",
  "scoreSourceRealEnabled: false",
  "Did the runner execute exactly once?",
  "Did it return sanitized JSON only?",
  "parser-design preparation, source-rights rejection, or fallback-source selection",
  "This template does not run SQL",
  "This template does not connect to Supabase",
  "This template does not write Supabase",
  "This template does not create staging rows",
  "This template does not modify `daily_prices`",
  "This template does not fetch or ingest raw market data",
  "This template does not probe an external endpoint",
  "This template does not set `scoreSource=real`",
  "POST_RUN_REVIEW_TEMPLATE_READY_BEFORE_TWII_REPORT_ONLY_PROBE_EXECUTION"
]) {
  if (!template.includes(phrase)) {
    missing.push(`${templatePath}: ${phrase}`);
  }
}

if (!commandMap.includes("CHECK-003 npm run check:twii-report-only-probe-post-run-template")) {
  missing.push(`${commandMapPath}: post-run template check`);
}

for (const pattern of [
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i,
  /status:\s*ready_for_review/i,
  /REQUEST_EXECUTE/i
]) {
  if (pattern.test(template)) {
    blocked.push(`${templatePath}: forbidden template pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:twii-report-only-probe-post-run-template"] !==
  "node scripts/check-twii-report-only-probe-post-run-template.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-post-run-template`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-post-run-template.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-post-run-template.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
