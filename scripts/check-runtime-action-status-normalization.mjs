import fs from "node:fs";

const helperPath = "src/lib/runtime-action-status.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const briefingPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeActionStatusId"],
  [helperPath, "RuntimeActionStatusSummary"],
  [helperPath, "getRuntimeActionStatusSummary"],
  [helperPath, "runtime_action_status_normalization"],
  [helperPath, "\"mock_only\""],
  [helperPath, "\"readying\""],
  [helperPath, "\"blocked\""],
  [helperPath, "\"oral_decision_ready\""],
  [helperPath, "Mock-only runtime"],
  [helperPath, "Preparing runtime evidence"],
  [helperPath, "External-data promotion blocked"],
  [helperPath, "CEO oral decision ready"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real"],
  [helperPath, "Status normalization does not execute Supabase"],
  [helperPath, "run SQL"],
  [helperPath, "fetch market data"],
  [helperPath, "set scoreSource=real"],
  [homePath, "getRuntimeActionStatusSummary"],
  [homePath, "const actionStatus = getRuntimeActionStatusSummary()"],
  [homePath, "Runtime action status normalization"],
  [homePath, "runtime-action-status-strip"],
  [homePath, "actionStatus.statuses.map"],
  [stockPath, "getRuntimeActionStatusSummary"],
  [stockPath, "const actionStatus = getRuntimeActionStatusSummary()"],
  [stockPath, "Runtime action status normalization"],
  [stockPath, "runtime-action-status-strip"],
  [stockPath, "actionStatus.statuses.map"],
  [briefingPath, "getRuntimeActionStatusSummary"],
  [briefingPath, "const actionStatus = getRuntimeActionStatusSummary()"],
  [briefingPath, "Runtime action status normalization"],
  [briefingPath, "runtime-action-status-strip"],
  [briefingPath, "actionStatus.statuses.map"],
  [cssPath, ".runtime-action-status-strip"],
  [cssPath, ".runtime-action-status-strip article.active"],
  [cssPath, ".runtime-action-status-strip article.readying"],
  [cssPath, ".runtime-action-status-strip article.blocked"],
  [packagePath, "\"check:runtime-action-status-normalization\": \"node scripts/check-runtime-action-status-normalization.mjs\""],
  [reviewGatePath, "scripts/check-runtime-action-status-normalization.mjs"],
  [reviewGatePath, "runtime-action-status-normalization"]
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
  [homePath, "publicDataSource: \"supabase\""],
  [stockPath, "publicDataSource: \"supabase\""],
  [briefingPath, "publicDataSource: \"supabase\""],
  [homePath, "scoreSource: \"real\""],
  [stockPath, "scoreSource: \"real\""],
  [briefingPath, "scoreSource: \"real\""]
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
