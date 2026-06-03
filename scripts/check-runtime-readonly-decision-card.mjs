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
  [helperPath, "displayDecisionState"],
  [helperPath, "displayHeadline"],
  [helperPath, "displayLocalChecks"],
  [helperPath, "displayBlockedRemoteActions"],
  [helperPath, "displayRequiredCeoWording"],
  [helperPath, "displayPostRunReviewRequirement"],
  [helperPath, "可口頭審核，尚未執行"],
  [helperPath, "唯讀嘗試已在本機準備好，但仍需要 CEO 明確點名"],
  [helperPath, "自動連線 Supabase"],
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
  [componentPath, "readonlyDecisionCard.displayDecisionState"],
  [componentPath, "readonlyDecisionCard.displayHeadline"],
  [componentPath, "readonlyDecisionCard.displayLocalChecks"],
  [componentPath, "readonlyDecisionCard.displayBlockedRemoteActions"],
  [componentPath, "readonlyDecisionCard.displayRequiredCeoWording"],
  [componentPath, "readonlyDecisionCard.displayPostRunReviewRequirement"],
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

const uiInternalWordingForbidden = [
  [componentPath, ">{readonlyDecisionCard.decisionState}</strong>"],
  [componentPath, ">{readonlyDecisionCard.headline}</p>"],
  [componentPath, "readonlyDecisionCard.allowedLocalChecks.map"],
  [componentPath, "readonlyDecisionCard.blockedRemoteActions.slice"],
  [componentPath, ">{readonlyDecisionCard.requiredCeoWording}</p>"],
  [componentPath, ">{readonlyDecisionCard.postRunReviewRequirement}</p>"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = [
  ...forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`),
  ...uiInternalWordingForbidden
    .filter(([file, phrase]) => read(file).includes(phrase))
    .map(([file, phrase]) => `${file}: UI still renders internal readonly wording ${phrase}`)
];

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
