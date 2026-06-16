import fs from "node:fs";

const helperPath = "src/lib/phase-1-source-depth-acceptance-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "Phase1SourceDepthAcceptanceContract"],
  [helperPath, "getPhase1SourceDepthAcceptanceContract"],
  [helperPath, "mode: \"phase_1_source_depth_acceptance_contract\""],
  [helperPath, "status: \"blocked_by_etf_source_rights\""],
  [helperPath, "twii_index_history"],
  [helperPath, "tw_cross_market_index_history"],
  [helperPath, "tw_listed_stock_daily_close"],
  [helperPath, "https://data.gov.tw/en/datasets/11755"],
  [helperPath, "https://data.gov.tw/en/datasets/11669"],
  [helperPath, "https://data.gov.tw/dataset/11548"],
  [helperPath, "https://openapi.twse.com.tw/v1/swagger.json"],
  [helperPath, "Open Government Data License, version 1.0"],
  [helperPath, "charge: \"free\""],
  [helperPath, "cadence: \"daily\""],
  [helperPath, "attributionRequired: true"],
  [helperPath, "accepted_for_delayed_public_display_and_derived_metrics"],
  [helperPath, "phase_1_etf_source_rights"],
  [helperPath, "0050"],
  [helperPath, "006208"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "canPromotePublicDataSourceToSupabase: false"],
  [helperPath, "canSetScoreSourceReal: false"],
  [packagePath, "\"check:phase-1-source-depth-acceptance-contract\": \"node scripts/check-phase-1-source-depth-acceptance-contract.mjs\""],
  [reviewGatePath, "scripts/check-phase-1-source-depth-acceptance-contract.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, ".upsert("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "canSetScoreSourceReal: true"],
  [helperPath, "canPromotePublicDataSourceToSupabase: true"]
];

const missing = required
  .filter(([file, phrase]) => !read(file).includes(phrase))
  .map(([file, phrase]) => ({ file, phrase }));
const blocked = forbidden
  .filter(([file, phrase]) => read(file).includes(phrase))
  .map(([file, phrase]) => ({ file, phrase }));

const acceptedRouteCount = (read(helperPath).match(/id: "tw(?:ii_index_history|_cross_market_index_history|_listed_stock_daily_close)"/g) ?? []).length;
if (acceptedRouteCount !== 3) {
  blocked.push({ file: helperPath, phrase: `expected 3 accepted source routes, found ${acceptedRouteCount}` });
}

const status = missing.length === 0 && blocked.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      mode: "phase_1_source_depth_acceptance_contract_check",
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
