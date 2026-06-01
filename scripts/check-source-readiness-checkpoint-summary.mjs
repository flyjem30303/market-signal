import fs from "node:fs";

const summaryPath = "src/lib/source-readiness-checkpoint-summary.ts";
const readinessPath = "src/lib/data-source-readiness-packet.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [summaryPath, readinessPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [summaryPath, "getSourceReadinessCheckpointSummary"],
  [summaryPath, "source_readiness_checkpoint_summarized"],
  [summaryPath, "primaryNextMove: \"equity_report_only_packet\""],
  [summaryPath, "human_review_required"],
  [summaryPath, "rights_review_required"],
  [summaryPath, "report_only_packet_ready"],
  [summaryPath, "TWII has the highest coverage gap"],
  [summaryPath, "technical reachability is not permission"],
  [summaryPath, "can move next as a report-only packet"],
  [summaryPath, "SQL execution"],
  [summaryPath, "Supabase reads or writes"],
  [summaryPath, "market-data fetch or ingestion"],
  [summaryPath, "staging rows or daily_prices mutation"],
  [summaryPath, "raw market-data commits"],
  [summaryPath, "row coverage credit"],
  [summaryPath, "publicDataSource=supabase"],
  [summaryPath, "scoreSource=real"],
  [summaryPath, "publicDataSource: \"mock\""],
  [summaryPath, "scoreSource: \"mock\""],
  [summaryPath, "does not run SQL"],
  [summaryPath, "connect to Supabase"],
  [summaryPath, "write Supabase"],
  [summaryPath, "fetch or ingest market data"],
  [summaryPath, "create staging rows"],
  [summaryPath, "modify daily_prices"],
  [summaryPath, "print secrets"],
  [summaryPath, "print row payloads"],
  [summaryPath, "commit raw market data"],
  [summaryPath, "award row coverage points"],
  [readinessPath, "getSourceReadinessCheckpointSummary"],
  [readinessPath, "sourceReadinessCheckpointSummary: SourceReadinessCheckpointSummary"],
  [readinessPath, "sourceReadinessCheckpointSummary: getSourceReadinessCheckpointSummary()"],
  [componentPath, "project-progress-source-checkpoint"],
  [componentPath, "sourceReadinessCheckpointSummary.lanes.map"],
  [componentPath, "sourceReadinessCheckpointSummary.blockedFromExecution.join"],
  [componentPath, "sourceReadinessCheckpointSummary.stopLine"],
  [cssPath, ".project-progress-source-checkpoint"],
  [packagePath, "\"check:source-readiness-checkpoint-summary\": \"node scripts/check-source-readiness-checkpoint-summary.mjs\""],
  [reviewGatePath, "scripts/check-source-readiness-checkpoint-summary.mjs"]
];

const forbidden = [
  [summaryPath, "@supabase/supabase-js"],
  [summaryPath, "createClient"],
  [summaryPath, "fetch("],
  [summaryPath, ".from("],
  [summaryPath, ".insert("],
  [summaryPath, ".update("],
  [summaryPath, ".delete("],
  [summaryPath, "process.env"],
  [summaryPath, "publicDataSource: \"supabase\""],
  [summaryPath, "scoreSource: \"real\""],
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
