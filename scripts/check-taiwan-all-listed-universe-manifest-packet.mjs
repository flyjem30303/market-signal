import fs from "node:fs";

const problems = [];

const docPath = "docs/TAIWAN_ALL_LISTED_UNIVERSE_MANIFEST_PACKET.md";
const roadmapPath = "docs/COVERAGE_UNIVERSE_ROADMAP.md";
const statusPath = "PROJECT_STATUS.md";

const doc = read(docPath);
const roadmap = read(roadmapPath);
const status = read(statusPath);

const requiredDocPhrases = [
  "Taiwan All-Listed Universe Manifest Packet",
  "Status: `taiwan_all_listed_universe_manifest_packet_ready_level_2_preexecution`",
  "Level 2 is not the current MVP GOAL completion condition",
  "The current MVP GOAL remains Level 1 row coverage at `360/360`",
  "Level 2 is the next expansion stage",
  "stock master seed has been expanded to `1086` listed-stock records",
  "does not generate the actual all-listed universe list",
  "`stock_id`",
  "`symbol`",
  "`name`",
  "`market`",
  "`exchange`",
  "`security_type`",
  "`is_active`",
  "`listed_date`",
  "`delisted_date`",
  "`coverage_window`",
  "`session_count`",
  "`expected_rows`",
  "`source_rights_status`",
  "`batch_id`",
  "Level 2 denominator policy is `active TWSE listed common stocks x coverage_window`",
  "`1086 x 60 = 65160` expected rows",
  "Level 2 must not reuse the MVP `360` denominator",
  "Use deterministic sorted batches",
  "Do not mix securities with different source-rights states in the same executable batch",
  "Missing sessions must be counted, not silently filled",
  "Readback is required before any Level 2 row coverage claim",
  "Row coverage points remain blocked",
  "blocked_source_rights_unapproved",
  "historical daily OHLCV and turnover use",
  "storage and retention of source-derived values",
  "derived analysis and scoring use",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase` remains blocked",
  "`scoreSource=real` remains blocked"
];

const requiredBoundaryPhrases = [
  "does not execute SQL",
  "does not connect to Supabase",
  "does not write Supabase",
  "does not create staging rows",
  "does not modify `daily_prices`",
  "does not fetch raw market data",
  "does not ingest raw market data",
  "does not store raw market data",
  "does not commit raw market data",
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not generate the full `1086`-record universe list",
  "does not approve source rights",
  "does not approve redistribution",
  "does not award row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
];

const requiredGapPhrases = [
  "missing_from_manifest",
  "inactive_or_delisted",
  "source_rights_blocked",
  "calendar_mismatch",
  "partial_window",
  "field_contract_missing",
  "readback_mismatch",
  "quality_downgraded"
];

for (const phrase of [...requiredDocPhrases, ...requiredBoundaryPhrases, ...requiredGapPhrases]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `coverage_universe_roadmap_ready_mvp_now_all_listed_next`",
  "Taiwan all-listed coverage is the next major expansion stage",
  "stock master seed has been expanded to `1086` listed-stock records",
  "Create the Level 2 Taiwan all-listed universe manifest and denominator",
  "Continue the active GOAL with Level 1 until `360/360` is complete"
]) {
  if (!roadmap.includes(phrase)) problems.push(`${roadmapPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest coverage universe roadmap slice",
  "stock master seed evidence remains `1086` listed-stock records"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /SQL execution is approved/u,
  /Supabase connection is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /raw market data fetch is approved/u,
  /raw market data ingestion is approved/u,
  /source rights are approved/u,
  /redistribution approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
