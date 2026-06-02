import fs from "node:fs";

const helperPath = "src/lib/runtime-readonly-decision-card.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
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
  [helperPath, "RuntimeReadonlyDecisionCard"],
  [helperPath, "getRuntimeReadonlyDecisionCard"],
  [helperPath, "allowedLocalChecks"],
  [helperPath, "blockedRemoteActions"],
  [helperPath, "requiredCeoWording"],
  [helperPath, "postRunReviewRequirement"],
  [helperPath, "automatedRemoteRun: false"],
  [helperPath, "decisionState: ready ? \"ready_for_ceo_oral_review\" : \"hold\""],
  [helperPath, "does not run Supabase"],
  [helperPath, "does not run SQL"],
  [helperPath, "does not promote scoreSource=real"],
  [componentPath, "getRuntimeReadonlyDecisionCard"],
  [componentPath, "readonlyDecisionCard.decisionState"],
  [componentPath, "readonlyDecisionCard.allowedLocalChecks"],
  [componentPath, "readonlyDecisionCard.blockedRemoteActions"],
  [componentPath, "readonlyDecisionCard.requiredCeoWording"],
  [componentPath, "readonlyDecisionCard.postRunReviewRequirement"],
  [componentPath, "runtime-readonly-decision-card"],
  [cssPath, ".runtime-readonly-decision-card"],
  [packagePath, "\"check:runtime-readonly-decision-card\": \"node scripts/check-runtime-readonly-decision-card.mjs\""],
  [reviewGatePath, "scripts/check-runtime-readonly-decision-card.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [componentPath, "project-progress-score"]
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
