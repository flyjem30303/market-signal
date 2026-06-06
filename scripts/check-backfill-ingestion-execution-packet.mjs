import fs from "node:fs";

const docPath = "docs/BACKFILL_INGESTION_EXECUTION_PACKET.md";
const routePath = "docs/DATA_POPULATION_ROUTE_DECISION_2026-06-06.md";
const gatePath = "src/lib/backfill-ingestion-design-gate.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";

const files = new Map(
  [docPath, routePath, gatePath, packagePath, reviewGatePath, fullHealthPath, statusPath].map((file) => [
    file,
    fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
  ])
);

const required = [
  [docPath, "Backfill / Ingestion Design Gate Execution Packet"],
  [docPath, "backfill_ingestion_packet_ready_design_only_not_executable"],
  [docPath, "docs/DATA_POPULATION_ROUTE_DECISION_2026-06-06.md"],
  [docPath, "design_only_not_authorized_for_execution"],
  [docPath, "separately named CEO/chairman approval"],
  [docPath, "command drift"],
  [docPath, "Source-Specific Lanes"],
  [docPath, "`TWII`"],
  [docPath, "`0050`, `006208`"],
  [docPath, "`2330`, `2382`, `2308`"],
  [docPath, "Default future posture: staging first"],
  [docPath, "Direct `daily_prices` mutation is blocked"],
  [docPath, "Report-Only Dry-Run Contract"],
  [docPath, "The report-only dry-run must not fetch market data unless"],
  [docPath, "Rollback And Retention Contract"],
  [docPath, "Rollback owner must be named"],
  [docPath, "Rollback must be scoped by run id or staging batch id"],
  [docPath, "Rollback must not touch production `daily_prices`"],
  [docPath, "Required Post-Run Review Template"],
  [docPath, "authorization id"],
  [docPath, "rows proposed"],
  [docPath, "rows written"],
  [docPath, "rows rejected"],
  [docPath, "public data source remains mock until promotion gate"],
  [docPath, "score source remains mock until score-source gate"],
  [docPath, "no promotion by itself"],
  [docPath, "scripts/check-data-population-route-decision.mjs"],
  [docPath, "scripts/check-backfill-ingestion-design-gate.mjs"],
  [docPath, "Do not run SQL"],
  [docPath, "Do not write Supabase"],
  [docPath, "Do not create staging rows"],
  [docPath, "Do not modify `daily_prices`"],
  [docPath, "Do not fetch, ingest, store, or commit raw market data"],
  [docPath, "Do not promote `publicDataSource=supabase`"],
  [docPath, "Do not set `scoreSource=real`"],
  [docPath, "Do not award row coverage points"],
  [docPath, "TW equity (`2330`, `2382`, `2308`)"],
  [routePath, "prepare_backfill_ingestion_design_gate"],
  [routePath, "data_population_route_selected_design_only"],
  [gatePath, "design_gate_required_not_authorized_for_execution"],
  [gatePath, "targetRelation: \"daily_prices\""],
  [packagePath, "\"check:backfill-ingestion-execution-packet\": \"node scripts/check-backfill-ingestion-execution-packet.mjs\""],
  [reviewGatePath, "scripts/check-backfill-ingestion-execution-packet.mjs"],
  [fullHealthPath, "scripts/check-backfill-ingestion-execution-packet.mjs"],
  [statusPath, "Latest backfill / ingestion execution packet slice"],
  [statusPath, "docs/BACKFILL_INGESTION_EXECUTION_PACKET.md"],
  [statusPath, "backfill_ingestion_packet_ready_design_only_not_executable"],
  [statusPath, "first lane-specific report-only dry-run packet for TW equity"]
];

const forbidden = [
  [docPath, "@supabase/supabase-js"],
  [docPath, "createClient"],
  [docPath, ".from("],
  [docPath, ".insert("],
  [docPath, ".update("],
  [docPath, ".delete("],
  [docPath, ".upsert("],
  [docPath, "process.env"],
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
