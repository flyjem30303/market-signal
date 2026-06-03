import fs from "node:fs";

const helperPath = "src/lib/blocker-closure-map.ts";
const componentPath = "src/components/project-progress-panel.tsx";
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
  [helperPath, "BlockerClosureMap"],
  [helperPath, "getBlockerReviewDecisionOutcomeLedger"],
  [helperPath, "blockerReviewDecisionOutcomeLedger: BlockerReviewDecisionOutcomeLedger"],
  [helperPath, "blockerReviewDecisionOutcomeLedger: getBlockerReviewDecisionOutcomeLedger()"],
  [helperPath, "getBlockerClosureMap"],
  [helperPath, "blocker_closure_map"],
  [helperPath, "source-rights-and-disclosure"],
  [helperPath, "model-credibility"],
  [helperPath, "data-quality-evidence"],
  [helperPath, "Legal source-rights locally first"],
  [helperPath, "npm run report:source-rights-disclosure-local-review"],
  [helperPath, "npm run report:model-credibility-local-review"],
  [helperPath, "npm run report:data-quality-field-validity-qa-review"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real"],
  [helperPath, "does not run SQL"],
  [helperPath, "approve source rights"],
  [componentPath, "getBlockerClosureMap"],
  [componentPath, "const blockerClosure = getBlockerClosureMap()"],
  [componentPath, "Blocker closure map"],
  [componentPath, "project-progress-blocker-closure"],
  [componentPath, "blockerClosure.sequence.map"],
  [componentPath, "project-progress-blocker-outcome-ledger"],
  [componentPath, "blockerClosure.blockerReviewDecisionOutcomeLedger.outcomes.map"],
  [componentPath, "item.nextCommand"],
  [componentPath, "item.nextDecision"],
  [componentPath, "item.blockedPromotion"],
  [cssPath, ".project-progress-blocker-closure"],
  [cssPath, ".project-progress-blocker-closure-grid"],
  [cssPath, ".project-progress-blocker-closure-grid article.first"],
  [cssPath, ".project-progress-blocker-closure-grid article.parallel"],
  [cssPath, ".project-progress-blocker-closure-grid article.held"],
  [packagePath, "\"check:blocker-closure-map\": \"node scripts/check-blocker-closure-map.mjs\""],
  [reviewGatePath, "scripts/check-blocker-closure-map.mjs"],
  [reviewGatePath, "blocker-closure-map"]
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
  [helperPath, "sourceRightsApproved: true"],
  [helperPath, "canRaiseDataQualityScore: true"],
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, ".insert("],
  [componentPath, ".update("],
  [componentPath, ".delete("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource=real approved"]
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
