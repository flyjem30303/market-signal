import fs from "node:fs";

const packetPath = "src/lib/equity-dry-run-packet-readiness.ts";
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
  [packetPath, "getEquityDryRunPacketReadiness"],
  [packetPath, "equity_dry_run_packet_ready_for_report_only_design"],
  [packetPath, "sourceId: \"twse-stock-day\""],
  [packetPath, "targetSymbols: [\"2330\", \"2382\", \"2308\"]"],
  [packetPath, "docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md"],
  [packetPath, "docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md"],
  [packetPath, "scope-lock"],
  [packetPath, "source-contract"],
  [packetPath, "report-only-output"],
  [packetPath, "validation-thresholds"],
  [packetPath, "post-run-review"],
  [packetPath, "ready_for_packet"],
  [packetPath, "requires_confirmation"],
  [packetPath, "aggregate run metadata"],
  [packetPath, "No row coverage credit"],
  [packetPath, "publicDataSource: \"mock\""],
  [packetPath, "scoreSource: \"mock\""],
  [packetPath, "does not run SQL"],
  [packetPath, "connect to Supabase"],
  [packetPath, "write Supabase"],
  [packetPath, "fetch or ingest market data"],
  [packetPath, "implement a reporter"],
  [packetPath, "create staging rows"],
  [packetPath, "modify daily_prices"],
  [packetPath, "print secrets"],
  [packetPath, "print row payloads"],
  [packetPath, "commit raw market data"],
  [packetPath, "promote publicDataSource=supabase"],
  [packetPath, "award row coverage points"],
  [packetPath, "set scoreSource=real"],
  [readinessPath, "getEquityDryRunPacketReadiness"],
  [readinessPath, "equityDryRunPacketReadiness: EquityDryRunPacketReadiness"],
  [readinessPath, "equityDryRunPacketReadiness: getEquityDryRunPacketReadiness()"],
  [componentPath, "project-progress-equity-dry-run"],
  [componentPath, "equityDryRunPacketReadiness.requirements.map"],
  [componentPath, "equityDryRunPacketReadiness.nextSafeAction"],
  [componentPath, "equityDryRunPacketReadiness.stopLine"],
  [cssPath, ".project-progress-equity-dry-run"],
  [packagePath, "\"check:equity-dry-run-packet-readiness\": \"node scripts/check-equity-dry-run-packet-readiness.mjs\""],
  [reviewGatePath, "scripts/check-equity-dry-run-packet-readiness.mjs"]
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
