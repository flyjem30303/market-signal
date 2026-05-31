import fs from "node:fs";

const evidencePath = "src/lib/supabase-readonly-evidence.ts";
const runtimePath = "src/components/runtime-readiness-panel.tsx";
const progressPath = "src/lib/project-progress-score.ts";
const sourceDepthPath = "src/lib/source-depth-blockers.ts";

const files = new Map(
  [evidencePath, runtimePath, progressPath, sourceDepthPath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [evidencePath, "getSupabaseReadonlyEvidenceSummary"],
  [evidencePath, "object_reachability_accepted"],
  [evidencePath, "daily_prices"],
  [evidencePath, "twse_stock_day_staging"],
  [evidencePath, "market_assets"],
  [evidencePath, "model_runs"],
  [evidencePath, "data_freshness"],
  [evidencePath, "not data completeness, data quality, source-depth, or real-score approval"],
  [evidencePath, "filesWritten: false"],
  [evidencePath, "mutations: false"],
  [evidencePath, "sqlExecuted: false"],
  [evidencePath, "scoreSourceRealChanged: false"],
  [runtimePath, "getSupabaseReadonlyEvidenceSummary"],
  [runtimePath, "Readonly evidence"],
  [runtimePath, "Objects reachable:"],
  [progressPath, "Supabase object reachability 已完成"],
  [progressPath, "schema shape 與資料品質判讀"],
  [sourceDepthPath, "Supabase object reachability 已被接受為窄前提"]
];

const forbidden = [
  [evidencePath, "@supabase/supabase-js"],
  [evidencePath, "createClient"],
  [evidencePath, "fetch("],
  [evidencePath, ".from("],
  [evidencePath, ".insert("],
  [evidencePath, ".update("],
  [evidencePath, ".delete("],
  [evidencePath, "scoreSource=real approved"],
  [runtimePath, "scoreSource=real approved"],
  [progressPath, "scoreSource=real approved"]
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
