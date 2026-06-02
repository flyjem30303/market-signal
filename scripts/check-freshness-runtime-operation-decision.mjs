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
  [helperPath, "Runtime operation decision"],
  [helperPath, "Mock disclosure"],
  [helperPath, "Readonly attempt"],
  [helperPath, "Real score mode"],
  [helperPath, "candidate_only"],
  [helperPath, "bounded readonly-attempt decision candidate"],
  [helperPath, "Readonly attempt candidate is locally discussable"],
  [helperPath, "separate_ceo_named_action_required"],
  [helperPath, "required_before_promotion"],
  [helperPath, "A sanitized post-run review must be recorded"],
  [helperPath, "does not promote scoreSource=real"],
  [helperPath, "PM route choice summary"],
  [helperPath, "mock_runtime_hardening"],
  [helperPath, "bounded_readonly_attempt_candidate"],
  [helperPath, "Route selection is guidance only"],
  [helperPath, "No runtime operation decision may trigger SQL"],
  [componentPath, "getFreshnessRuntimeOperationDecisionSummary"],
  [componentPath, "freshness-operation-decision"],
  [componentPath, "Freshness runtime operation decision"],
  [componentPath, "freshness-operation-stop-line"],
  [componentPath, "freshness-readonly-candidate-card"],
  [componentPath, "Freshness readonly attempt candidate preflight"],
  [componentPath, "operationDecision.attemptCandidate.items"],
  [componentPath, "freshness-readonly-candidate-stop-line"],
  [componentPath, "freshness-route-summary"],
  [componentPath, "Freshness runtime route choice summary"],
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
