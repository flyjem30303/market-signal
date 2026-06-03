import fs from "node:fs";

const helperPath = "src/lib/data-evidence-ladder.ts";
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
  [helperPath, "DataEvidenceLadderSummary"],
  [helperPath, "DataEvidenceLadderStage"],
  [helperPath, "getDataEvidenceLadderSummary"],
  [helperPath, "data_evidence_ladder"],
  [helperPath, "\"schema-shape\""],
  [helperPath, "\"freshness-metadata\""],
  [helperPath, "\"row-coverage\""],
  [helperPath, "\"data-quality\""],
  [helperPath, "\"source-depth\""],
  [helperPath, "\"real-score-candidacy\""],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real"],
  [helperPath, "award row coverage points"],
  [helperPath, "does not run SQL"],
  [componentPath, "getDataEvidenceLadderSummary"],
  [componentPath, "const evidenceLadder = getDataEvidenceLadderSummary()"],
  [componentPath, "Data evidence ladder"],
  [componentPath, "project-progress-evidence-ladder"],
  [componentPath, "evidenceLadder.stages.map"],
  [componentPath, "stage.acceptedEvidence"],
  [componentPath, "stage.exitCriteria"],
  [componentPath, "stage.blockedPromotion"],
  [componentPath, "stage.nextAction"],
  [cssPath, ".project-progress-evidence-ladder"],
  [cssPath, ".project-progress-evidence-ladder-stages"],
  [cssPath, ".project-progress-evidence-ladder-stages article.accepted"],
  [cssPath, ".project-progress-evidence-ladder-stages article.readying"],
  [cssPath, ".project-progress-evidence-ladder-stages article.blocked"],
  [packagePath, "\"check:data-evidence-ladder\": \"node scripts/check-data-evidence-ladder.mjs\""],
  [reviewGatePath, "scripts/check-data-evidence-ladder.mjs"],
  [reviewGatePath, "data-evidence-ladder"]
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
