import fs from "node:fs";

const gatePath = "src/lib/equity-packet-role-review-gate.ts";
const readinessPath = "src/lib/data-source-readiness-packet.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [gatePath, readinessPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [gatePath, "getEquityPacketRoleReviewGate"],
  [gatePath, "equity_packet_role_review_gate_prepared"],
  [gatePath, "equity_report_only_dry_run_packet_prepared"],
  [gatePath, "may_request_report_only_runner_implementation_approval"],
  [gatePath, "accepted_for_packet_review"],
  [gatePath, "accepted_with_execution_blocker"],
  [gatePath, "PM"],
  [gatePath, "Engineering"],
  [gatePath, "Legal"],
  [gatePath, "Data"],
  [gatePath, "Investment"],
  [gatePath, "CEO"],
  [gatePath, "CEO has not approved reporter implementation"],
  [gatePath, "Legal has not approved automated source access"],
  [gatePath, "No fetcher, parser, or reporter is authorized"],
  [gatePath, "No Supabase read or write is authorized"],
  [gatePath, "No raw market data may be stored or committed"],
  [gatePath, "No row coverage credit or real score may be awarded"],
  [gatePath, "publicDataSource: \"mock\""],
  [gatePath, "scoreSource: \"mock\""],
  [gatePath, "does not run SQL"],
  [gatePath, "connect to Supabase"],
  [gatePath, "write Supabase"],
  [gatePath, "fetch or ingest market data"],
  [gatePath, "implement a reporter"],
  [gatePath, "execute a dry run"],
  [gatePath, "create staging rows"],
  [gatePath, "modify daily_prices"],
  [gatePath, "print secrets"],
  [gatePath, "print row payloads"],
  [gatePath, "commit raw market data"],
  [gatePath, "promote publicDataSource=supabase"],
  [gatePath, "award row coverage points"],
  [gatePath, "set scoreSource=real"],
  [readinessPath, "getEquityPacketRoleReviewGate"],
  [readinessPath, "equityPacketRoleReviewGate: EquityPacketRoleReviewGate"],
  [readinessPath, "equityPacketRoleReviewGate: getEquityPacketRoleReviewGate()"],
  [componentPath, "project-progress-equity-role-review"],
  [componentPath, "equityPacketRoleReviewGate.reviews.map"],
  [componentPath, "equityPacketRoleReviewGate.executionBlockers.join"],
  [componentPath, "equityPacketRoleReviewGate.stopLine"],
  [cssPath, ".project-progress-equity-role-review"],
  [packagePath, "\"check:equity-packet-role-review-gate\": \"node scripts/check-equity-packet-role-review-gate.mjs\""],
  [reviewGatePath, "scripts/check-equity-packet-role-review-gate.mjs"]
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
