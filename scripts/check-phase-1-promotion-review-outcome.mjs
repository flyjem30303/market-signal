import fs from "node:fs";

const helperPath = "src/lib/phase-1-promotion-review-outcome.ts";
const queuePath = "src/lib/post-readonly-next-gate-queue.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, queuePath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "Phase1PromotionReviewOutcomeSummary"],
  [helperPath, "getPhase1PromotionReviewOutcomeSummary"],
  [helperPath, "mode: \"phase_1_promotion_review_outcome\""],
  [helperPath, "status: \"partially_accepted\""],
  [helperPath, "outcome: dataQualityAccepted ? \"accepted\" : \"rejected_for_promotion\""],
  [helperPath, "outcome: \"rejected_for_promotion\""],
  [helperPath, "id: \"data_quality\""],
  [helperPath, "id: \"source_depth\""],
  [helperPath, "canPromotePublicDataSourceToSupabase: false"],
  [helperPath, "canSetScoreSourceReal: false"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "local data-quality threshold"],
  [helperPath, "pass the local data-quality threshold"],
  [helperPath, "Source disclosure is usable for mock/public reading"],
  [helperPath, "keep scoreSource=mock"],
  [helperPath, "keep publicDataSource=mock"],
  [queuePath, "getPhase1PromotionReviewOutcomeSummary"],
  [queuePath, "field validity promotion accepted"],
  [queuePath, "source-depth artifact promotion rejected"],
  [queuePath, "status: \"blocked_waiting_evidence\""],
  [queuePath, "資料覆蓋與資料品質已可作為本地 Phase 1 promotion evidence"],
  [packagePath, "\"check:phase-1-promotion-review-outcome\": \"node scripts/check-phase-1-promotion-review-outcome.mjs\""],
  [reviewGatePath, "scripts/check-phase-1-promotion-review-outcome.mjs"]
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
  [queuePath, "publicDataSource: \"supabase\""],
  [queuePath, "scoreSource: \"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => ({
  file,
  phrase
}));
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => ({
  file,
  phrase
}));

const staticRejectedOutcomeCount = (read(helperPath).match(/outcome: "rejected_for_promotion",/g) ?? []).length;
const dynamicAcceptedOutcomeCount = (read(helperPath).match(/outcome: dataQualityAccepted \? "accepted" : "rejected_for_promotion"/g) ?? []).length;
if (staticRejectedOutcomeCount !== 1) {
  blocked.push({ file: helperPath, phrase: `expected 1 static rejected outcome, found ${staticRejectedOutcomeCount}` });
}
if (dynamicAcceptedOutcomeCount !== 1) {
  blocked.push({ file: helperPath, phrase: `expected 1 dynamic accepted data-quality outcome, found ${dynamicAcceptedOutcomeCount}` });
}

const status = missing.length === 0 && blocked.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      mode: "phase_1_promotion_review_outcome_check",
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
