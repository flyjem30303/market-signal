import { spawnSync } from "node:child_process";
import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const reportPath = "scripts/report-public-beta-data-realification-next-action.mjs";
const problems = [];

const run = spawnSync(process.execPath, [reportPath], {
  encoding: "utf8",
  maxBuffer: 1024 * 1024
});

if (run.status !== 0) problems.push(`${reportPath} exited ${run.status}`);

let output;
try {
  output = JSON.parse(run.stdout);
} catch {
  problems.push(`${reportPath} did not emit JSON`);
  output = {};
}

const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const report = read(reportPath);

if (
  pkg.scripts?.["report:public-beta-data-realification-next-action"] !==
  "node scripts/report-public-beta-data-realification-next-action.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-data-realification-next-action`);
}

if (
  pkg.scripts?.["check:public-beta-data-realification-next-action"] !==
  "node scripts/check-public-beta-data-realification-next-action.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-data-realification-next-action`);
}

if (!reviewGate.includes("scripts/check-public-beta-data-realification-next-action.mjs")) {
  problems.push(`${reviewGatePath} missing public beta data realification next action checker`);
}

const expectedOutput = {
  status: "public_beta_data_realification_next_action_ready",
  ceoRecommendation: "twse_openapi_runtime_mock_consumer_wiring_next_public_runtime_parallel",
  pmMainline: "prepare_twse_openapi_runtime_mock_consumer_wiring_readiness",
  a1Next: "twse_openapi_runtime_consumer_adapter_synthetic_case_notes",
  a2Next: "runtime_mock_consumer_public_boundary_copy_guardrail",
  fallbackIfRightsStayBlocked: "continue_public_beta_runtime_readability_and_production_readonly_guards"
};

if (output.status !== expectedOutput.status) problems.push("status mismatch");
for (const [key, value] of Object.entries(expectedOutput).filter(([key]) => key !== "status")) {
  if (output.decision?.[key] !== value) problems.push(`decision.${key} mismatch`);
}

const expectedCoverage = {
  fullLevel1ExpectedRows: 360,
  fullLevel1ObservedRows: 182,
  fullLevel1MissingRows: 178,
  twEquityObservedRows: 180,
  twEquityExpectedRows: 180,
  twiiMissingRows: 60,
  etfMissingRows: 118
};

for (const [key, value] of Object.entries(expectedCoverage)) {
  if (output.coverage?.[key] !== value) problems.push(`coverage.${key} must be ${value}`);
}

if (output.sourceBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
if (output.sourceBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
if (output.sourceBoundary?.realDataDisplayActive !== false) problems.push("realDataDisplayActive must be false");
if (output.sourceBoundary?.realScoreActive !== false) problems.push("realScoreActive must be false");

for (const [key, value] of Object.entries(output.hardStops ?? {})) {
  if (value !== false) problems.push(`hardStops.${key} must be false`);
}

if ((output.missingEvidence ?? []).length !== 0) problems.push("missingEvidence must be empty");

for (const phrase of [
  "docs/A1_DATA_COVERAGE_NEXT_BATCH_HANDOFF.md",
  "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md",
  "docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md",
  "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md",
  "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md",
  "docs/TWSE_OPENAPI_BOUNDED_METADATA_TERMS_VALIDATION.md",
  "src/lib/twse-openapi-source-adapter-contract.ts",
  "src/lib/twse-openapi-parser-contract.ts",
  "src/lib/twse-openapi-parser-consumer-adapter.ts",
  "docs/A2_PUBLIC_BETA_BATCH1_TWII_CORE_ETF_TRUST_COPY.md",
  "docs/DATA_REALIFICATION_POST_FIRST_CLOSED_LOOP_NEXT_LANE_SELECTOR.md",
  "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md"
]) {
  if (!report.includes(phrase)) problems.push(`${reportPath} missing input ${phrase}`);
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /realDataDisplayActive:\s*true/u,
  /realScoreActive:\s*true/u
]) {
  if (pattern.test(report)) problems.push(`${reportPath} contains forbidden pattern ${pattern}`);
}

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: output.status,
      nextPmMainline: output.decision.pmMainline,
      nextA1: output.decision.a1Next,
      nextA2: output.decision.a2Next
    },
    null,
    2
  )
);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
