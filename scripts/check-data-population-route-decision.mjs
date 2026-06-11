import fs from "node:fs";

const docPath = "docs/BATCH1_DATA_COVERAGE_ROUTE_DECISION_2026-06-12.md";
const postRunPath = "docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md";
const routeLibPath = "src/lib/data-coverage-route-decision.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";

const files = new Map(
  [docPath, postRunPath, routeLibPath, packagePath, reviewGatePath, fullHealthPath, statusPath].map((file) => [
    file,
    fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
  ])
);

const required = [
  [docPath, "Batch 1 Data Coverage Route Decision"],
  [docPath, "batch1_data_coverage_route_selected_twii_first_design_only"],
  [docPath, "docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md"],
  [docPath, "CEO selects a `TWII`-first Batch 1 coverage repair route"],
  [docPath, "design-only approval"],
  [docPath, "aggregate_count_incomplete"],
  [docPath, "Expected rows: `360`"],
  [docPath, "Observed rows: `182`"],
  [docPath, "Missing rows: `178`"],
  [docPath, "prepare_twii_coverage_repair_gate"],
  [docPath, "`TWII` is `0/60`"],
  [docPath, "`0050` is `1/60`"],
  [docPath, "`006208` is `1/60`"],
  [docPath, "source rights and attribution acceptance"],
  [docPath, "target-table boundary"],
  [docPath, "report-only dry-run packet"],
  [docPath, "rollback, cleanup, retention"],
  [docPath, "post-run review"],
  [docPath, "PM / Engineering mainline"],
  [docPath, "A1 Data / Supabase / Market Evidence"],
  [docPath, "A2 Public Copy / UX Safety"],
  [docPath, "Do not run SQL"],
  [docPath, "Do not write Supabase"],
  [docPath, "Do not create staging rows"],
  [docPath, "Do not modify `daily_prices`"],
  [docPath, "Do not fetch, ingest, store, or commit raw market data"],
  [docPath, "Do not retry the readonly attempt"],
  [docPath, "Do not promote `publicDataSource=supabase`"],
  [docPath, "Do not set `scoreSource=real`"],
  [docPath, "Do not award row coverage points"],
  [docPath, "Create the `TWII` coverage repair gate"],
  [postRunPath, "observedTotalRows\": 182"],
  [postRunPath, "missingRows\": 178"],
  [postRunPath, "aggregate_count_incomplete"],
  [routeLibPath, "prepare_twii_coverage_repair_gate"],
  [routeLibPath, "observedRows: 182"],
  [routeLibPath, "missingRows: 178"],
  [packagePath, "\"check:data-population-route-decision\": \"node scripts/check-data-population-route-decision.mjs\""],
  [reviewGatePath, "scripts/check-data-population-route-decision.mjs"],
  [fullHealthPath, "scripts/check-data-population-route-decision.mjs"],
  [statusPath, "Latest Batch 1 data coverage route decision slice"],
  [statusPath, "docs/BATCH1_DATA_COVERAGE_ROUTE_DECISION_2026-06-12.md"],
  [statusPath, "batch1_data_coverage_route_selected_twii_first_design_only"],
  [statusPath, "prepare_twii_coverage_repair_gate"]
];

const forbidden = [
  [docPath, "SQL execution is approved"],
  [docPath, "Supabase writes are approved"],
  [docPath, "market ingestion is approved"],
  [docPath, "publicDataSource=supabase is approved"],
  [docPath, "scoreSource=real is approved"],
  [docPath, "ROW_COVERAGE_POINTS_AWARDED"],
  [docPath, "RUN_REMOTE_NOW"],
  [docPath, "EXECUTION_COMPLETED"],
  [docPath, "sb_secret_"],
  [docPath, "sb_publishable_"],
  [docPath, "SUPABASE_SERVICE_ROLE_KEY="],
  [docPath, "raw payload:"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
