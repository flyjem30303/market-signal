import fs from "node:fs";

const gatePath = "docs/reviews/DATA_QUALITY_FIELD_VALIDITY_ACCEPTANCE_GATE_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const gate = fs.readFileSync(gatePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");

const required = [
  [gatePath, "Data Quality Field Validity Acceptance Gate"],
  [gatePath, "Date: 2026-06-02"],
  [gatePath, "data quality field validity acceptance gate recorded"],
  [gatePath, "ACCEPT_FIELD_VALIDITY_AS_LOCAL_QA_REVIEWED_SPEC_ONLY"],
  [gatePath, "local QA-reviewed specification only"],
  [gatePath, "does not approve data-quality score points"],
  [gatePath, "Supabase writes"],
  [gatePath, "SQL execution"],
  [gatePath, "market-data ingestion"],
  [gatePath, "`scoreSource=real`"],
  [gatePath, "scripts/report-data-quality-field-validity.mjs"],
  [gatePath, "scripts/report-data-quality-field-validity-qa-review.mjs"],
  [gatePath, "scripts/check-data-quality-score-contract.mjs"],
  [gatePath, "QA-FIELD-001"],
  [gatePath, "QA-FIELD-002"],
  [gatePath, "QA-DOWNGRADE-001"],
  [gatePath, "QA-BOUNDARY-001"],
  [gatePath, "Data-quality score increase remains blocked"],
  [gatePath, "Public data source remains mock"],
  [gatePath, "`scoreSource=real` remains blocked"],
  [gatePath, "CP3 readiness remains `not_ready`"],
  [gatePath, "does not move the product to real data or real scoring"],
  [gatePath, "Field validity checker passes"],
  [gatePath, "Review gates pass"],
  [gatePath, "TypeScript check passes"]
];

const forbidden = [
  [gatePath, "CP3_READY_NOW"],
  [gatePath, "PROMOTE_CP3_READINESS_NOW"],
  [gatePath, "scoreSource=real approved"],
  [gatePath, "ALLOW_SQL_EXECUTION"],
  [gatePath, "ALLOW_SUPABASE_WRITES"],
  [gatePath, "ALLOW_MARKET_INGESTION"],
  [gatePath, "PUBLIC_CLAIMS_APPROVED"],
  [gatePath, "DATA_QUALITY_POINTS_AWARDED"],
  [gatePath, "ROW_COVERAGE_POINTS_AWARDED"],
  [gatePath, "publicDataSource=supabase"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (
  packageJson.scripts?.["check:data-quality-field-validity-acceptance-gate"] !==
  "node scripts/check-data-quality-field-validity-acceptance-gate.mjs"
) {
  missing.push(`${packagePath}: check:data-quality-field-validity-acceptance-gate`);
}

if (!reviewGate.includes("scripts/check-data-quality-field-validity-acceptance-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-data-quality-field-validity-acceptance-gate.mjs`);
}

if (!fullHealth.includes("scripts/check-data-quality-field-validity-acceptance-gate.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-data-quality-field-validity-acceptance-gate.mjs`);
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
