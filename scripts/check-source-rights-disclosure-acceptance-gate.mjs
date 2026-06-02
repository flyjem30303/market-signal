import fs from "node:fs";

const gatePath = "docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const gate = fs.readFileSync(gatePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");

const required = [
  [gatePath, "Source Rights Disclosure Acceptance Gate"],
  [gatePath, "Date: 2026-06-02"],
  [gatePath, "source rights disclosure acceptance gate recorded"],
  [gatePath, "ACCEPT_SOURCE_RIGHTS_DISCLOSURE_AS_LOCAL_REVIEW_PACKET_ONLY"],
  [gatePath, "local review material only"],
  [gatePath, "does not verify external provider terms"],
  [gatePath, "does not approve source licenses"],
  [gatePath, "does not approve redistribution"],
  [gatePath, "Supabase writes"],
  [gatePath, "SQL execution"],
  [gatePath, "market-data ingestion"],
  [gatePath, "`scoreSource=real`"],
  [gatePath, "scripts/report-source-rights-disclosure-checklist.mjs"],
  [gatePath, "scripts/report-source-rights-disclosure-local-review.mjs"],
  [gatePath, "LEGAL-SOURCE-001"],
  [gatePath, "LEGAL-SOURCE-002"],
  [gatePath, "PRODUCT-DISCLOSURE-001"],
  [gatePath, "INVESTMENT-CLAIM-001"],
  [gatePath, "BOUNDARY-SOURCE-001"],
  [gatePath, "External source-rights approval remains blocked"],
  [gatePath, "Provider-specific terms review remains blocked"],
  [gatePath, "Public data source remains mock"],
  [gatePath, "`scoreSource=real` remains blocked"],
  [gatePath, "CP3 readiness remains `not_ready`"],
  [gatePath, "locally accepted review packet, not as legal clearance"],
  [gatePath, "Source-rights disclosure checklist checker passes"],
  [gatePath, "Source-rights disclosure local review checker passes"],
  [gatePath, "Review gates pass"],
  [gatePath, "TypeScript check passes"]
];

const forbidden = [
  [gatePath, "CP3_READY_NOW"],
  [gatePath, "PROMOTE_CP3_READINESS_NOW"],
  [gatePath, "SOURCE_RIGHTS_APPROVED"],
  [gatePath, "LEGAL_CLEARANCE_GRANTED"],
  [gatePath, "scoreSource=real approved"],
  [gatePath, "ALLOW_SQL_EXECUTION"],
  [gatePath, "ALLOW_SUPABASE_WRITES"],
  [gatePath, "ALLOW_MARKET_INGESTION"],
  [gatePath, "PUBLIC_CLAIMS_APPROVED"],
  [gatePath, "RAW_DATA_REDISTRIBUTION_APPROVED"],
  [gatePath, "publicDataSource=supabase"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (
  packageJson.scripts?.["check:source-rights-disclosure-acceptance-gate"] !==
  "node scripts/check-source-rights-disclosure-acceptance-gate.mjs"
) {
  missing.push(`${packagePath}: check:source-rights-disclosure-acceptance-gate`);
}

if (!reviewGate.includes("scripts/check-source-rights-disclosure-acceptance-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-source-rights-disclosure-acceptance-gate.mjs`);
}

if (!fullHealth.includes("scripts/check-source-rights-disclosure-acceptance-gate.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-source-rights-disclosure-acceptance-gate.mjs`);
}

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
  if (file === gatePath) return gate;
  if (file === reviewGatePath) return reviewGate;
  if (file === fullHealthPath) return fullHealth;
  return fs.readFileSync(file, "utf8");
}
