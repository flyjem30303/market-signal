import fs from "node:fs";

const packetPath = "src/lib/equity-report-only-dry-run-packet.ts";
const readinessPath = "src/lib/data-source-readiness-packet.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [packetPath, readinessPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [packetPath, "getEquityReportOnlyDryRunPacket"],
  [packetPath, "equity_report_only_dry_run_packet_prepared"],
  [packetPath, "sourceId: \"twse-stock-day\""],
  [packetPath, "targetSymbols: [\"2330\", \"2382\", \"2308\"]"],
  [packetPath, "startMonth: \"2023-03-01\""],
  [packetPath, "endMonth: \"2026-05-01\""],
  [packetPath, "expectedMonths: 39"],
  [packetPath, "minimumDelayMs: 800"],
  [packetPath, "run metadata"],
  [packetPath, "HTTP status summary"],
  [packetPath, "aggregate parsed row count"],
  [packetPath, "validation counters"],
  [packetPath, "daily row data"],
  [packetPath, "raw response body"],
  [packetPath, "CSV or JSON market data files"],
  [packetPath, "SQL inserts"],
  [packetPath, "Supabase mutations"],
  [packetPath, "row coverage credit"],
  [packetPath, "scope"],
  [packetPath, "source"],
  [packetPath, "report-contract"],
  [packetPath, "validation"],
  [packetPath, "review-decision"],
  [packetPath, "packet_ready"],
  [packetPath, "publicDataSource: \"mock\""],
  [packetPath, "scoreSource: \"mock\""],
  [packetPath, "does not run SQL"],
  [packetPath, "connect to Supabase"],
  [packetPath, "write Supabase"],
  [packetPath, "fetch or ingest market data"],
  [packetPath, "implement a reporter"],
  [packetPath, "execute a dry run"],
  [packetPath, "create staging rows"],
  [packetPath, "modify daily_prices"],
  [packetPath, "print secrets"],
  [packetPath, "print row payloads"],
  [packetPath, "commit raw market data"],
  [packetPath, "promote publicDataSource=supabase"],
  [packetPath, "award row coverage points"],
  [packetPath, "set scoreSource=real"],
  [readinessPath, "getEquityReportOnlyDryRunPacket"],
  [readinessPath, "equityReportOnlyDryRunPacket: EquityReportOnlyDryRunPacket"],
  [readinessPath, "equityReportOnlyDryRunPacket: getEquityReportOnlyDryRunPacket()"],
  [componentPath, "project-progress-equity-dry-run-packet"],
  [componentPath, "equityReportOnlyDryRunPacket.sections.map"],
  [componentPath, "equityReportOnlyDryRunPacket.allowedOutput.join"],
  [componentPath, "equityReportOnlyDryRunPacket.forbiddenOutput.join"],
  [componentPath, "equityReportOnlyDryRunPacket.stopLine"],
  [cssPath, ".project-progress-equity-dry-run-packet"],
  [packagePath, "\"check:equity-report-only-dry-run-packet\": \"node scripts/check-equity-report-only-dry-run-packet.mjs\""],
  [reviewGatePath, "scripts/check-equity-report-only-dry-run-packet.mjs"]
];

const forbidden = [
  [packetPath, "@supabase/supabase-js"],
  [packetPath, "createClient"],
  [packetPath, "fetch("],
  [packetPath, ".from("],
  [packetPath, ".insert("],
  [packetPath, ".update("],
  [packetPath, ".delete("],
  [packetPath, "process.env"],
  [packetPath, "publicDataSource: \"supabase\""],
  [packetPath, "scoreSource: \"real\""],
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
