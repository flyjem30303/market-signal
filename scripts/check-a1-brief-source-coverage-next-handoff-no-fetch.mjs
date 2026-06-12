import fs from "node:fs";

const docPath = "docs/A1_BRIEF_SOURCE_COVERAGE_NEXT_HANDOFF_NO_FETCH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes("A1 handoff", doc, [
  "A1 BRIEF Source Coverage Next Handoff No-Fetch",
  "Status: `a1_brief_source_coverage_next_handoff_no_fetch_ready`",
  "brief_source_coverage_next_handoff_without_market_row_fetch",
  "TWSE OpenAPI",
  "TWII",
  "0050",
  "006208",
  "2330",
  "2382",
  "2308",
  "index_baseline",
  "core_etf_context",
  "listed_equity_batch1",
  "listed_equity_full",
  "otc_future_expansion",
  "prepare_public_beta_source_coverage_gap_matrix_no_fetch",
  "資料來源與覆蓋範圍仍在準備中",
  "目前是 mock 示範，不是即時真實資料",
  "完整上市股票覆蓋尚未開放",
  "不提供買賣建議",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "accept_a1_brief_source_coverage_next_handoff_no_fetch"
]);

requireExcludes("A1 handoff", doc, forbiddenPatterns());
requireNoMojibake("A1 handoff", doc);

if (
  pkg.scripts?.["check:a1-brief-source-coverage-next-handoff-no-fetch"] !==
  "node scripts/check-a1-brief-source-coverage-next-handoff-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-brief-source-coverage-next-handoff-no-fetch`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-a1-brief-source-coverage-next-handoff-no-fetch.mjs",
  "a1-brief-source-coverage-next-handoff-no-fetch"
]);

if (problems.length) {
  console.error(JSON.stringify({ docPath, problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      docPath,
      nextA1Task: "prepare_public_beta_source_coverage_gap_matrix_no_fetch",
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "ok"
    },
    null,
    2
  )
);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function requireIncludes(label, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) problems.push(`${label} missing ${needle}`);
  }
}

function requireExcludes(label, text, patterns) {
  for (const pattern of patterns) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${String(pattern)}`);
  }
}

function forbiddenPatterns() {
  return [
    /\bfetch\(/iu,
    /\bfrom\(/iu,
    /\binsert\s+into\b/iu,
    /\bupdate\s+daily_prices\b/iu,
    /publicDataSource\s*=\s*supabase\s+approved/iu,
    /scoreSource\s*=\s*real\s+approved/iu,
    /rawMarketDataFetch\s*=\s*true/iu,
    /supabaseWrite\s*=\s*true/iu,
    /dailyPricesMutation\s*=\s*true/iu,
    /raw payload sample/iu,
    /market row sample/iu,
    /stock-id row list sample/iu,
    /output stock-id row list as data/iu,
    /buy now/iu,
    /sell now/iu
  ];
}

function requireNoMojibake(label, text) {
  for (const marker of findMojibakeMarkers(text)) problems.push(`${label} exposes ${marker}`);
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
