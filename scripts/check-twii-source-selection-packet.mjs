import fs from "node:fs";

const packetPath = "src/lib/twii-source-selection-packet.ts";
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
  [packetPath, "getTwiiSourceSelectionPacket"],
  [packetPath, "twii_source_selection_packet_prepared"],
  [packetPath, "targetSymbol: \"TWII\""],
  [packetPath, "priority: \"highest_row_coverage_gap\""],
  [packetPath, "observedRows: 0"],
  [packetPath, "official-exchange-index"],
  [packetPath, "licensed-market-data-vendor"],
  [packetPath, "internal-approved-feed"],
  [packetPath, "candidate_unverified"],
  [packetPath, "Source authority and license terms are documented"],
  [packetPath, "No row coverage credit is awarded"],
  [packetPath, "License does not allow storage or derived use"],
  [packetPath, "publicDataSource: \"mock\""],
  [packetPath, "scoreSource: \"mock\""],
  [packetPath, "does not run SQL"],
  [packetPath, "connect to Supabase"],
  [packetPath, "write Supabase"],
  [packetPath, "fetch or ingest market data"],
  [packetPath, "create staging rows"],
  [packetPath, "modify daily_prices"],
  [packetPath, "print secrets"],
  [packetPath, "print row payloads"],
  [packetPath, "promote publicDataSource=supabase"],
  [packetPath, "award row coverage points"],
  [packetPath, "set scoreSource=real"],
  [readinessPath, "getTwiiSourceSelectionPacket"],
  [readinessPath, "twiiSourceSelectionPacket: TwiiSourceSelectionPacket"],
  [readinessPath, "twiiSourceSelectionPacket: getTwiiSourceSelectionPacket()"],
  [componentPath, "project-progress-twii-source-selection"],
  [componentPath, "twiiSourceSelectionPacket.candidates.map"],
  [componentPath, "twiiSourceSelectionPacket.nextSafeAction"],
  [componentPath, "twiiSourceSelectionPacket.stopLine"],
  [cssPath, ".project-progress-twii-source-selection"],
  [packagePath, "\"check:twii-source-selection-packet\": \"node scripts/check-twii-source-selection-packet.mjs\""],
  [reviewGatePath, "scripts/check-twii-source-selection-packet.mjs"]
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
