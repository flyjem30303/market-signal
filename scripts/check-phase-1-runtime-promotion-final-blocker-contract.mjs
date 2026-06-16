import fs from "node:fs";

const helperPath = "src/lib/phase-1-runtime-promotion-final-blocker-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "Phase1RuntimePromotionFinalBlockerContract"],
  [helperPath, "getPhase1RuntimePromotionFinalBlockerContract"],
  [helperPath, "mode: \"phase_1_runtime_promotion_final_blocker_contract\""],
  [helperPath, "status: \"ready_for_bounded_runtime_promotion_preflight_no_go\""],
  [helperPath, "phase1Universe: \"twii_plus_listed_stock_daily_close\""],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "canPromotePublicDataSourceToSupabase: false"],
  [helperPath, "canSetScoreSourceReal: false"],
  [helperPath, "bounded_execution_packet"],
  [helperPath, "aggregate_readback"],
  [helperPath, "rollback_or_quarantine"],
  [helperPath, "operator_decision"],
  [helperPath, "public_runtime_factory_switch"],
  [helperPath, "ETF coverage is deferred to Phase 1.1"],
  [helperPath, "Do not run SQL"],
  [packagePath, "\"check:phase-1-runtime-promotion-final-blocker-contract\": \"node scripts/check-phase-1-runtime-promotion-final-blocker-contract.mjs\""],
  [reviewGatePath, "scripts/check-phase-1-runtime-promotion-final-blocker-contract.mjs"],
  [reviewGatePath, "\"phase-1-runtime-promotion-final-blocker-contract\""]
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
  [helperPath, "canPromotePublicDataSourceToSupabase: true"],
  [helperPath, "executionAllowedNow: true"],
  [helperPath, "writeGateExecutableNow: true"]
];

const missing = required
  .filter(([file, phrase]) => !read(file).includes(phrase))
  .map(([file, phrase]) => ({ file, phrase }));
const blocked = forbidden
  .filter(([file, phrase]) => read(file).includes(phrase))
  .map(([file, phrase]) => ({ file, phrase }));

const blockerCount = (read(helperPath).match(/id: "(bounded_execution_packet|aggregate_readback|rollback_or_quarantine|operator_decision|public_runtime_factory_switch)"/g) ?? []).length;
if (blockerCount !== 5) {
  blocked.push({ file: helperPath, phrase: `expected 5 final runtime blockers, found ${blockerCount}` });
}

const status = missing.length === 0 && blocked.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      mode: "phase_1_runtime_promotion_final_blocker_contract_check",
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
