import fs from "node:fs";

const libPath = "src/lib/schema-shape-acceptance-contract.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, panelPath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [libPath, "SchemaShapeAcceptanceContract"],
  [libPath, "getSchemaShapeAcceptanceContract"],
  [libPath, "schema_shape_acceptance_contract"],
  [libPath, "schema_shape_sanitized_run_2026_05_31"],
  [libPath, "accepted_for_runtime_shape"],
  [libPath, "needs_reconciliation"],
  [libPath, "remote_only_pending_contract"],
  [libPath, "daily_prices"],
  [libPath, "stock_id"],
  [libPath, "trade_date"],
  [libPath, "open"],
  [libPath, "high"],
  [libPath, "low"],
  [libPath, "close"],
  [libPath, "volume"],
  [libPath, "turnover"],
  [libPath, "twse_stock_day_staging"],
  [libPath, "staging_twse_stock_day_runs"],
  [libPath, "staging_twse_stock_day_prices"],
  [libPath, "market_assets"],
  [libPath, "model_runs"],
  [libPath, "data_freshness"],
  [libPath, "Map data_freshness to data_runs"],
  [libPath, "Reconcile twse_stock_day_staging naming"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "Schema shape acceptance does not approve row completeness"],
  [libPath, "SQL execution"],
  [libPath, "Supabase writes"],
  [libPath, "daily_prices writes"],
  [libPath, "scoreSource=real"],
  [panelPath, "getSchemaShapeAcceptanceContract"],
  [panelPath, "schemaShapeContract"],
  [panelPath, "runtime-schema-shape-contract"],
  [panelPath, "Schema shape acceptance contract"],
  [panelPath, "schemaShapeContract.objects.map"],
  [cssPath, ".runtime-schema-shape-contract"],
  [cssPath, ".runtime-schema-shape-contract article.ready"],
  [cssPath, ".runtime-schema-shape-contract article.hold"],
  [packagePath, "\"check:schema-shape-acceptance-contract\": \"node scripts/check-schema-shape-acceptance-contract.mjs\""],
  [reviewGatePath, "scripts/check-schema-shape-acceptance-contract.mjs"]
];

const forbidden = [
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, ".insert("],
  [libPath, ".update("],
  [libPath, ".delete("],
  [libPath, "process.env"],
  [libPath, "node:fs"],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [libPath, "SQL execution approved"],
  [libPath, "Supabase writes approved"],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
