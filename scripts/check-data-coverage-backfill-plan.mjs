import fs from "node:fs";

const planPath = "src/lib/data-coverage-backfill-plan.ts";
const routePath = "src/lib/data-coverage-route-decision.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [planPath, routePath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [planPath, "getDataCoverageBackfillPlan"],
  [planPath, "report_only_source_lane_plan"],
  [planPath, "expectedRows: 360"],
  [planPath, "observedRows: 5"],
  [planPath, "missingRows: 355"],
  [planPath, "publicDataSource: \"mock\""],
  [planPath, "scoreSource: \"mock\""],
  [planPath, "tw-index"],
  [planPath, "TWII"],
  [planPath, "tw-etf"],
  [planPath, "0050"],
  [planPath, "006208"],
  [planPath, "tw-equity"],
  [planPath, "2330"],
  [planPath, "2382"],
  [planPath, "2308"],
  [planPath, "source_required"],
  [planPath, "design_reference_available"],
  [planPath, "does not run SQL"],
  [planPath, "write Supabase"],
  [planPath, "fetch or ingest market data"],
  [planPath, "create staging rows"],
  [planPath, "modify daily_prices"],
  [planPath, "print row payloads"],
  [planPath, "promote publicDataSource=supabase"],
  [planPath, "award row coverage points"],
  [planPath, "set scoreSource=real"],
  [routePath, "getDataCoverageBackfillPlan"],
  [routePath, "backfillPlan: DataCoverageBackfillPlan"],
  [routePath, "backfillPlan: getDataCoverageBackfillPlan()"],
  [componentPath, "project-progress-backfill-plan"],
  [componentPath, "project-progress-source-readiness"],
  [componentPath, "progress.dataCoverageRouteDecision.backfillPlan.lanes.map"],
  [componentPath, "const sourcePacket = progress.dataCoverageRouteDecision.sourceReadinessPacket"],
  [componentPath, "sourcePacket.lanes.map"],
  [componentPath, "progress.dataCoverageRouteDecision.backfillPlan.stopLine"],
  [cssPath, ".project-progress-backfill-plan"],
  [cssPath, ".project-progress-source-readiness"],
  [packagePath, "\"check:data-coverage-backfill-plan\": \"node scripts/check-data-coverage-backfill-plan.mjs\""],
  [reviewGatePath, "scripts/check-data-coverage-backfill-plan.mjs"]
];

const forbidden = [
  [planPath, "@supabase/supabase-js"],
  [planPath, "createClient"],
  [planPath, "fetch("],
  [planPath, ".from("],
  [planPath, ".insert("],
  [planPath, ".update("],
  [planPath, ".delete("],
  [planPath, "process.env"],
  [planPath, "publicDataSource: \"supabase\""],
  [planPath, "scoreSource: \"real\""],
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
