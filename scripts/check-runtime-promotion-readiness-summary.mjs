import fs from "node:fs";
import { spawnSync } from "node:child_process";

const helperPath = "src/lib/runtime-promotion-readiness-summary.ts";
const queuePath = "src/lib/post-readonly-next-gate-queue.ts";
const componentPath = "src/components/post-readonly-product-status.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, queuePath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimePromotionReadinessSummary"],
  [helperPath, "getRuntimePromotionReadinessSummary"],
  [helperPath, "getPostReadonlyNextGateQueue"],
  [helperPath, "promotion_gate_pending"],
  [helperPath, "prepare_runtime_promotion_gate_preflight"],
  [helperPath, "coverage_complete_promotion_pending"],
  [helperPath, "missingRows: 0"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "ready_for_local_use"],
  [helperPath, "blocked_by_evidence"],
  [helperPath, "needs_review"],
  [helperPath, "資料覆蓋完成，正式資料升級仍需最後審核"],
  [helperPath, "不得執行資料庫結構或內容變更"],
  [helperPath, "不得寫入正式資料庫"],
  [helperPath, "未審核的市場原始資料"],
  [helperPath, "不得把示範分數宣稱為正式投資模型"],
  [queuePath, "row_coverage"],
  [queuePath, "missingRows=0"],
  [queuePath, "500/500"],
  [queuePath, "status: \"local_ready\""],
  [queuePath, "runtime_promotion_preflight_preparation"],
  [queuePath, "資料覆蓋完成，進入正式資料升級前檢查"],
  [componentPath, "getRuntimePromotionReadinessSummary"],
  [componentPath, "post-readonly-promotion-summary"],
  [componentPath, "Runtime promotion readiness summary"],
  [componentPath, "Promotion readiness"],
  [componentPath, "No-go actions"],
  [componentPath, "尚未允許正式資料模式"],
  [componentPath, "promotion.steps.map"],
  [componentPath, "promotion.readinessCounts.ready"],
  [componentPath, "promotion.noGoActions.join"],
  [cssPath, ".post-readonly-promotion-summary"],
  [packagePath, "\"check:runtime-promotion-readiness-summary\": \"node scripts/check-runtime-promotion-readiness-summary.mjs\""],
  [reviewGatePath, "scripts/check-runtime-promotion-readiness-summary.mjs"]
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
  [helperPath, "data-coverage-route-decision"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "scoreSource=real approved"],
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, ".insert("],
  [componentPath, ".update("],
  [componentPath, ".delete("],
  [componentPath, ".upsert("],
  [componentPath, "process.env"],
  [componentPath, "node:fs"],
  [componentPath, "publicDataSource: \"supabase\""],
  [componentPath, "scoreSource: \"real\""],
  [componentPath, "scoreSource=real approved"]
];

const mojibakePatterns = [/鞈/u, /銝/u, /嚗/u, /蝣/u, /撌/u, /甇/u, /摰/u, /靘/u, /雿/u, /蝺/u, /�/u];
const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [helperPath, queuePath, componentPath]) {
  for (const pattern of mojibakePatterns) {
    if (pattern.test(read(file))) blocked.push(`${file}: mojibake pattern ${pattern}`);
  }
}

const tsc = spawnSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (tsc.status !== 0) {
  blocked.push(`typescript failed: ${(tsc.stderr || tsc.stdout).trim()}`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
