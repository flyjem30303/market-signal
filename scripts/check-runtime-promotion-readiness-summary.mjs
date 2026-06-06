import fs from "node:fs";
import { spawnSync } from "node:child_process";

const helperPath = "src/lib/runtime-promotion-readiness-summary.ts";
const componentPath = "src/components/post-readonly-product-status.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimePromotionReadinessSummary"],
  [helperPath, "getRuntimePromotionReadinessSummary"],
  [helperPath, "getPostReadonlyNextGateQueue"],
  [helperPath, "Define source rights, target tables, dry-run output, rollback, retention, and no-write preflight before any ingestion."],
  [helperPath, "keep_mock_runtime_and_prepare_coverage_route"],
  [helperPath, "not_ready_for_real_data_promotion"],
  [helperPath, "aggregate_count_incomplete"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "ready_for_local_use"],
  [helperPath, "blocked_by_evidence"],
  [helperPath, "needs_review"],
  [helperPath, "does not run SQL"],
  [helperPath, "write Supabase"],
  [helperPath, "fetch market data"],
  [helperPath, "set scoreSource=real"],
  [componentPath, "getRuntimePromotionReadinessSummary"],
  [componentPath, "post-readonly-promotion-summary"],
  [componentPath, "Runtime promotion readiness summary"],
  [componentPath, "Promotion readiness"],
  [componentPath, "No-go actions"],
  [componentPath, "promotion.steps.map"],
  [componentPath, "promotion.readinessCounts.ready"],
  [componentPath, "promotion.mockBoundary.publicDataSource"],
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

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

const tsc = spawnSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (tsc.status !== 0) {
  blocked.push(`typescript failed: ${(tsc.stderr || tsc.stdout).trim()}`);
}

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
