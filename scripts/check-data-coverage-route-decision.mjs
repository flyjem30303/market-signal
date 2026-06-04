import fs from "node:fs";

const libPath = "src/lib/data-coverage-route-decision.ts";
const progressPath = "src/lib/project-progress-score.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, progressPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [libPath, "getBackfillIngestionDesignGate"],
  [libPath, "getDataCoverageBackfillPlan"],
  [libPath, "getDataSourceReadinessPacket"],
  [libPath, "getDataCoverageRouteDecision"],
  [libPath, "aggregate_count_incomplete"],
  [libPath, "backfillPlan: DataCoverageBackfillPlan"],
  [libPath, "backfillPlan: getDataCoverageBackfillPlan()"],
  [libPath, "designGate: BackfillIngestionDesignGate"],
  [libPath, "sourceReadinessPacket: DataSourceReadinessPacket"],
  [libPath, "sourceReadinessPacket: getDataSourceReadinessPacket()"],
  [libPath, "designGate: getBackfillIngestionDesignGate()"],
  [libPath, "expectedRows: 360"],
  [libPath, "observedRows: 5"],
  [libPath, "missingRows: 355"],
  [libPath, "prepare_backfill_ingestion_design_gate"],
  [libPath, "backfill-ingestion-design-gate"],
  [libPath, "mock-runtime-hardening"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "Do not run SQL"],
  [progressPath, "getDataCoverageRouteDecision"],
  [progressPath, "dataCoverageRouteDecision"],
  [componentPath, "Data coverage route"],
  [componentPath, "project-progress-design-gate"],
  [componentPath, "project-progress-backfill-plan"],
  [componentPath, "project-progress-source-readiness"],
  [componentPath, "progress.dataCoverageRouteDecision.recommendation"],
  [componentPath, "progress.dataCoverageRouteDecision.options.map"],
  [componentPath, "progress.dataCoverageRouteDecision.backfillPlan.lanes.map"],
  [componentPath, "const sourcePacket = progress.dataCoverageRouteDecision.sourceReadinessPacket"],
  [componentPath, "sourcePacket.lanes.map"],
  [componentPath, "progress.dataCoverageRouteDecision.designGate.requirements.map"],
  [componentPath, "progress.dataCoverageRouteDecision.stopLine"],
  [cssPath, ".project-progress-route-decision"],
  [cssPath, ".project-progress-design-gate"],
  [cssPath, ".project-progress-backfill-plan"],
  [cssPath, ".project-progress-source-readiness"],
  [packagePath, "\"check:data-coverage-route-decision\": \"node scripts/check-data-coverage-route-decision.mjs\""],
  [reviewGatePath, "scripts/check-data-coverage-route-decision.mjs"]
];

const forbidden = [
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, ".insert("],
  [libPath, ".update("],
  [libPath, ".delete("],
  [libPath, "process.env"],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [componentPath, "connect Supabase"],
  [componentPath, "run SQL"],
  [componentPath, "fetch("]
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
