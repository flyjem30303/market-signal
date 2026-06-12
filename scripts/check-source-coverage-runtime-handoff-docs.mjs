import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const a1Path = "docs/A1_TWSE_OPENAPI_TERMS_FIELD_COVERAGE_MATRIX_NO_FETCH.md";
const a2Path = "docs/A2_SOURCE_COVERAGE_RUNTIME_LABELS_PUBLIC_COPY_REVIEW.md";
const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const a1 = readText(a1Path);
const a2 = readText(a2Path);

if (pkg.scripts?.["check:source-coverage-runtime-handoff-docs"] !== "node scripts/check-source-coverage-runtime-handoff-docs.mjs") {
  problems.push(`${packagePath} missing check:source-coverage-runtime-handoff-docs`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-source-coverage-runtime-handoff-docs.mjs",
  "source-coverage-runtime-handoff-docs"
]);

requireIncludes("A1 handoff", a1, [
  "Status: `a1_twse_openapi_terms_field_coverage_matrix_ready_local_only`",
  "TWSE OpenAPI Candidate Sources",
  "Terms Location Pending Fields",
  "Attribution / Cadence / Display / Redistribution Posture",
  "Coverage Layers",
  "Field-Contract Gaps",
  "PM-Receivable Mock Runtime Labels",
  "Do not fetch TWSE OpenAPI market rows",
  "Do not run SQL",
  "Do not connect to Supabase",
  "Do not modify `daily_prices`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]);

requireIncludes("A2 handoff", a2, [
  "Status: `a2_source_coverage_runtime_labels_public_copy_review_accepted_after_pm_copy_repair`",
  "30-Second Investor Readability",
  "PM copy repair applied",
  "`資料來源與覆蓋狀態`",
  "`展示可用`",
  "`檢查中`",
  "`暫停公開`",
  "mock-only",
  "not investment advice",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]);

for (const [label, source] of [
  ["A1 handoff", a1],
  ["A2 handoff", a2]
]) {
  requireExcludes(label, source, [
    "publicDataSource=supabase",
    "scoreSource=real",
    "SQL execution approved",
    "Supabase write approved",
    "raw market data approved",
    "buy now is approved",
    "sell now is approved",
    "guaranteed return is approved"
  ]);
}

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      a1Path,
      a2Path,
      status: "ok",
      summary: "A1/A2 source coverage runtime handoff docs are present, local-only, mock-boundary preserving, and PM-usable."
    },
    null,
    2
  )
);

function readText(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function requireIncludes(label, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) problems.push(`${label} missing ${needle}`);
  }
}

function requireExcludes(label, text, needles) {
  for (const needle of needles) {
    if (text.includes(needle)) problems.push(`${label} must not include ${needle}`);
  }
}
