import fs from "node:fs";

const packetPath = "src/lib/etf-source-rights-review-packet.ts";
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
  [packetPath, "getEtfSourceRightsReviewPacket"],
  [packetPath, "etf_source_rights_review_packet_prepared"],
  [packetPath, "targetSymbols: [\"0050\", \"006208\"]"],
  [packetPath, "legal_and_redistribution_terms_unapproved"],
  [packetPath, "twse-mis-etf-surface"],
  [packetPath, "issuer-official-pages"],
  [packetPath, "licensed-vendor"],
  [packetPath, "blocked_for_ingestion"],
  [packetPath, "candidate_requires_review"],
  [packetPath, "Storage, display, redistribution, and derived-score use are explicitly permitted"],
  [packetPath, "ETF-specific fields include NAV"],
  [packetPath, "ETF row coverage credit remains blocked"],
  [packetPath, "Terms restrict automated download"],
  [packetPath, "publicDataSource: \"mock\""],
  [packetPath, "scoreSource: \"mock\""],
  [packetPath, "does not run SQL"],
  [packetPath, "connect to Supabase"],
  [packetPath, "write Supabase"],
  [packetPath, "fetch or ingest market data"],
  [packetPath, "run ETF MIS smoke"],
  [packetPath, "create staging rows"],
  [packetPath, "modify daily_prices"],
  [packetPath, "print secrets"],
  [packetPath, "print row payloads"],
  [packetPath, "promote publicDataSource=supabase"],
  [packetPath, "award row coverage points"],
  [packetPath, "set scoreSource=real"],
  [readinessPath, "getEtfSourceRightsReviewPacket"],
  [readinessPath, "etfSourceRightsReviewPacket: EtfSourceRightsReviewPacket"],
  [readinessPath, "etfSourceRightsReviewPacket: getEtfSourceRightsReviewPacket()"],
  [componentPath, "project-progress-etf-rights-review"],
  [componentPath, "etfSourceRightsReviewPacket.candidates.map"],
  [componentPath, "etfSourceRightsReviewPacket.nextSafeAction"],
  [componentPath, "etfSourceRightsReviewPacket.stopLine"],
  [cssPath, ".project-progress-etf-rights-review"],
  [packagePath, "\"check:etf-source-rights-review-packet\": \"node scripts/check-etf-source-rights-review-packet.mjs\""],
  [reviewGatePath, "scripts/check-etf-source-rights-review-packet.mjs"]
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
