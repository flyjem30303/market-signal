import fs from "node:fs";

const helperPath = "src/lib/data-readiness-decision-summary.ts";
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
  [helperPath, "DataReadinessDecisionSummary"],
  [helperPath, "getDataReadinessDecisionSummary"],
  [helperPath, "post_readonly_data_readiness_summary"],
  [helperPath, "local_ready_remote_paused"],
  [helperPath, "schema_shape_freshness_row_coverage_decision_gate"],
  [helperPath, "dataFoundationGate: DataFoundationGate"],
  [helperPath, "dataFoundationGate: getDataFoundationGate()"],
  [helperPath, "prepare_but_do_not_run"],
  [helperPath, "requiresSeparateCeoNamedAction: true"],
  [helperPath, "Object reachability"],
  [helperPath, "Schema shape"],
  [helperPath, "Freshness metadata"],
  [helperPath, "Row coverage"],
  [helperPath, "Quality and source depth"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "sqlExecuted: false"],
  [helperPath, "supabaseWritesEnabled: false"],
  [helperPath, "marketDataFetched: false"],
  [helperPath, "scoreSourceRealEnabled: false"],
  [helperPath, "secretsPrinted: false"],
  [helperPath, "Do not run SQL"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real"],
  [componentPath, "getDataReadinessDecisionSummary"],
  [componentPath, "dataReadiness.lanes.map"],
  [componentPath, "Data Readiness"],
  [componentPath, "Post-readonly data readiness summary"],
  [componentPath, "dataReadiness.boundedReadonlyAttempt"],
  [componentPath, "dataReadiness.dataFoundationGate.foundationPercent"],
  [componentPath, "dataReadiness.stopLine"],
  [cssPath, ".project-progress-data-readiness"],
  [cssPath, ".project-progress-data-readiness-lanes"],
  [cssPath, ".project-progress-data-readiness-attempt"],
  [packagePath, "\"check:data-readiness-decision-summary\": \"node scripts/check-data-readiness-decision-summary.mjs\""],
  [reviewGatePath, "scripts/check-data-readiness-decision-summary.mjs"],
  [reviewGatePath, "data-readiness-decision-summary"]
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
  [helperPath, "sqlExecuted: true"],
  [helperPath, "supabaseWritesEnabled: true"],
  [helperPath, "marketDataFetched: true"],
  [helperPath, "scoreSourceRealEnabled: true"],
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
