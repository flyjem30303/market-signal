import fs from "node:fs";

const gatePath = "src/lib/backfill-ingestion-design-gate.ts";
const routePath = "src/lib/data-coverage-route-decision.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [gatePath, routePath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [gatePath, "getBackfillIngestionDesignGate"],
  [gatePath, "design_gate_required_not_authorized_for_execution"],
  [gatePath, "blockedReason: \"aggregate_count_incomplete\""],
  [gatePath, "missingRows: 355"],
  [gatePath, "targetRelation: \"daily_prices\""],
  [gatePath, "publicDataSource: \"mock\""],
  [gatePath, "scoreSource: \"mock\""],
  [gatePath, "source-rights"],
  [gatePath, "target-table-boundary"],
  [gatePath, "dry-run-report"],
  [gatePath, "rollback-retention"],
  [gatePath, "post-run-review"],
  [gatePath, "does not run SQL"],
  [gatePath, "write Supabase"],
  [gatePath, "fetch or ingest market data"],
  [gatePath, "promote publicDataSource=supabase"],
  [gatePath, "award row coverage points"],
  [gatePath, "set scoreSource=real"],
  [routePath, "getBackfillIngestionDesignGate"],
  [routePath, "designGate: BackfillIngestionDesignGate"],
  [routePath, "designGate: getBackfillIngestionDesignGate()"],
  [componentPath, "project-progress-design-gate"],
  [componentPath, "progress.dataCoverageRouteDecision.designGate.requirements.map"],
  [componentPath, "progress.dataCoverageRouteDecision.designGate.stopLine"],
  [cssPath, ".project-progress-design-gate"],
  [packagePath, "\"check:backfill-ingestion-design-gate\": \"node scripts/check-backfill-ingestion-design-gate.mjs\""],
  [reviewGatePath, "scripts/check-backfill-ingestion-design-gate.mjs"]
];

const forbidden = [
  [gatePath, "@supabase/supabase-js"],
  [gatePath, "createClient"],
  [gatePath, "fetch("],
  [gatePath, ".from("],
  [gatePath, ".insert("],
  [gatePath, ".update("],
  [gatePath, ".delete("],
  [gatePath, "process.env"],
  [gatePath, "publicDataSource: \"supabase\""],
  [gatePath, "scoreSource: \"real\""],
  [routePath, "publicDataSource: \"supabase\""],
  [routePath, "scoreSource: \"real\""],
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
