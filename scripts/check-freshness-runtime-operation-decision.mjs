import fs from "node:fs";

const helperPath = "src/lib/freshness-runtime-operation-decision.ts";
const componentPath = "src/components/freshness-evidence-boundary.tsx";
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
  [helperPath, "FreshnessRuntimeOperationDecisionSummary"],
  [helperPath, "attemptCandidate"],
  [helperPath, "routeSummary"],
  [helperPath, "getFreshnessRuntimeOperationDecisionSummary"],
  [helperPath, "getFreshnessEvidenceBoundarySummary"],
  [helperPath, "getFreshnessInterpretationSummary"],
  [helperPath, "getSupabaseReadonlyEvidenceSummary"],
  [helperPath, "Runtime 操作決策"],
  [helperPath, "示範揭露"],
  [helperPath, "唯讀嘗試"],
  [helperPath, "正式分數模式"],
  [helperPath, "candidate_only"],
  [helperPath, "bounded readonly-attempt 決策候選"],
  [helperPath, "唯讀嘗試候選可在本地討論"],
  [helperPath, "separate_ceo_named_action_required"],
  [helperPath, "required_before_promotion"],
  [helperPath, "去識別化執行後覆核"],
  [helperPath, "不升級正式分數"],
  [helperPath, "PM 路線選擇摘要"],
  [helperPath, "mock_runtime_hardening"],
  [helperPath, "bounded_readonly_attempt_candidate"],
  [helperPath, "路線選擇只是指引"],
  [helperPath, "任何 runtime 操作決策都不得觸發 SQL"],
  [componentPath, "getFreshnessRuntimeOperationDecisionSummary"],
  [componentPath, "freshness-operation-decision"],
  [componentPath, "新鮮度操作決策"],
  [componentPath, "freshness-operation-stop-line"],
  [componentPath, "freshness-readonly-candidate-card"],
  [componentPath, "新鮮度唯讀候選檢查"],
  [componentPath, "operationDecision.attemptCandidate.items"],
  [componentPath, "freshness-readonly-candidate-stop-line"],
  [componentPath, "freshness-route-summary"],
  [componentPath, "新鮮度路線選擇摘要"],
  [componentPath, "operationDecision.routeSummary.options"],
  [componentPath, "freshness-route-stop-line"],
  [cssPath, ".freshness-operation-decision"],
  [cssPath, ".freshness-operation-decision article.allowed"],
  [cssPath, ".freshness-operation-decision article.candidate"],
  [cssPath, ".freshness-operation-decision article.blocked"],
  [cssPath, ".freshness-operation-stop-line"],
  [cssPath, ".freshness-readonly-candidate-card"],
  [cssPath, ".freshness-readonly-candidate-card article.ready"],
  [cssPath, ".freshness-readonly-candidate-card article.hold"],
  [cssPath, ".freshness-readonly-candidate-card article.blocked"],
  [cssPath, ".freshness-readonly-candidate-stop-line"],
  [cssPath, ".freshness-route-summary"],
  [cssPath, ".freshness-route-summary article.active"],
  [cssPath, ".freshness-route-summary article.optional"],
  [cssPath, ".freshness-route-summary article.blocked"],
  [cssPath, ".freshness-route-stop-line"],
  [packagePath, "\"check:freshness-runtime-operation-decision\": \"node scripts/check-freshness-runtime-operation-decision.mjs\""],
  [reviewGatePath, "scripts/check-freshness-runtime-operation-decision.mjs"]
];

const forbidden = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  "scoreSource: \"real\"",
  "scoreSource=\"real\"",
  "publicDataSource: \"supabase\"",
  "run SQL",
  "write Supabase"
];

const missing = required
  .filter(([file, token]) => !files.get(file)?.includes(token))
  .map(([file, token]) => ({ file, token }));

const forbiddenHits = [helperPath, componentPath]
  .flatMap((file) => forbidden.map((token) => ({ file, token, hit: files.get(file)?.includes(token) })))
  .filter((item) => item.hit)
  .map(({ file, token }) => ({ file, token }));

if (missing.length > 0 || forbiddenHits.length > 0) {
  console.error(
    JSON.stringify(
      {
        forbidden: forbiddenHits,
        missing,
        status: "failed"
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log("freshness runtime operation decision ok");
