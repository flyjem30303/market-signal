import fs from "node:fs";

const gatePath = "docs/reviews/MODEL_CREDIBILITY_ACCEPTANCE_GATE_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const gate = fs.readFileSync(gatePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");

const required = [
  [gatePath, "Model Credibility Acceptance Gate"],
  [gatePath, "Date: 2026-06-02"],
  [gatePath, "model credibility acceptance gate recorded"],
  [gatePath, "ACCEPT_MODEL_CREDIBILITY_AS_LOCAL_REVIEW_PACKET_ONLY"],
  [gatePath, "local Investment review material only"],
  [gatePath, "does not approve real scoring"],
  [gatePath, "buy/sell/hold advice"],
  [gatePath, "public ranking claims"],
  [gatePath, "model confidence claims"],
  [gatePath, "formula version promotion"],
  [gatePath, "`scoreSource=real`"],
  [gatePath, "scripts/report-model-credibility-checklist.mjs"],
  [gatePath, "scripts/report-model-credibility-local-review.mjs"],
  [gatePath, "scripts/check-data-quality-score-contract.mjs"],
  [gatePath, "INVESTMENT-MODEL-001"],
  [gatePath, "INVESTMENT-MODEL-002"],
  [gatePath, "INVESTMENT-BACKTEST-001"],
  [gatePath, "QA-MODEL-001"],
  [gatePath, "BOUNDARY-MODEL-001"],
  [gatePath, "Real scoring remains blocked"],
  [gatePath, "Public ranking claim remains blocked"],
  [gatePath, "Model confidence claim remains blocked"],
  [gatePath, "Public data source remains mock"],
  [gatePath, "`scoreSource=real` remains blocked"],
  [gatePath, "CP3 readiness remains `not_ready`"],
  [gatePath, "not as approval for real scoring"],
  [gatePath, "Model credibility checklist checker passes"],
  [gatePath, "Model credibility local review checker passes"],
  [gatePath, "Review gates pass"],
  [gatePath, "TypeScript check passes"]
];

const forbidden = [
  [gatePath, "CP3_READY_NOW"],
  [gatePath, "PROMOTE_CP3_READINESS_NOW"],
  [gatePath, "MODEL_APPROVED_FOR_REAL_SCORING"],
  [gatePath, "REAL_SCORING_APPROVED"],
  [gatePath, "scoreSource=real approved"],
  [gatePath, "ALLOW_SQL_EXECUTION"],
  [gatePath, "ALLOW_SUPABASE_WRITES"],
  [gatePath, "ALLOW_MARKET_INGESTION"],
  [gatePath, "PUBLIC_CLAIMS_APPROVED"],
  [gatePath, "MODEL_CREDIBILITY_POINTS_AWARDED"],
  [gatePath, "publicDataSource=supabase"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (packageJson.scripts?.["check:model-credibility-acceptance-gate"] !== "node scripts/check-model-credibility-acceptance-gate.mjs") {
  missing.push(`${packagePath}: check:model-credibility-acceptance-gate`);
}

if (!reviewGate.includes("scripts/check-model-credibility-acceptance-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-model-credibility-acceptance-gate.mjs`);
}

if (!fullHealth.includes("scripts/check-model-credibility-acceptance-gate.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-model-credibility-acceptance-gate.mjs`);
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
