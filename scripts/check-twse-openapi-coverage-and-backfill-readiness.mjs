import fs from "node:fs";

const readmePath = "docs/TWSE_OPENAPI_COVERAGE_UNIVERSE_AND_BACKFILL_READINESS.md";
const coverageStatusPath = "scripts/check-public-beta-data-realification-next-action.mjs";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const readme = read(readmePath);
const coverageStatusSource = read(coverageStatusPath);
const status = read(statusPath);
const roleSource = read(rolePath);
const pkgSource = read(packagePath);
const reviewGateSource = read(reviewGatePath);

for (const phrase of [
  "Coverage Universe and Backfill Readiness",
  "Coverage scope split",
  "Phase 0: Synthetic handoff hardening",
  "Phase 1: Runtime mock wiring readiness",
  "Phase 2: Controlled live ingestion dry-run",
  "Phase 3: Backfill readiness",
  "publicDataSource = \"mock\"",
  "scoreSource = \"mock\"",
  "fixturePolicy",
  "no row insertion",
  "no row mutation",
  "no writes"
]) {
  if (!readme.includes(phrase)) problems.push(`${readmePath} missing: ${phrase}`);
}

for (const phrase of [
  "prepare_twse_openapi_runtime_mock_consumer_wiring_readiness",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch",
  "twse_openapi_runtime_consumer_adapter_synthetic_case_notes",
  "coverage_universe"
]) {
  if (!status.includes(phrase)) {
    problems.push(`${statusPath} missing: ${phrase}`);
  }
  if (!roleSource.includes(phrase) && phrase !== "coverage_universe") {
    problems.push(`${rolePath} missing: ${phrase}`);
  }
}

if (!coverageStatusSource.includes("twse_openapi_runtime_mock_consumer_wiring_readiness")) {
  problems.push(`${coverageStatusPath} missing: twse_openapi_runtime_mock_consumer_wiring_readiness`);
}

const pkg = JSON.parse(pkgSource);
if (
  !pkg.scripts?.["check:twse-openapi-coverage-and-backfill-readiness"] ||
  pkg.scripts["check:twse-openapi-coverage-and-backfill-readiness"] !==
    "node scripts/check-twse-openapi-coverage-and-backfill-readiness.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-coverage-and-backfill-readiness script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-coverage-and-backfill-readiness.mjs",
  "twse-openapi-coverage-and-backfill-readiness",
  "expectStatus: \"ok\""
]) {
  if (!reviewGateSource.includes(phrase)) problems.push(`${reviewGatePath} missing reference: ${phrase}`);
}

for (const pattern of [
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /rawMarketDataFetch:\s*true/u,
  /sqlExecution:\s*true/u,
  /supabaseWrite:\s*true/u,
  /daily_prices/u
]) {
  if (pattern.test(readme)) {
    problems.push(`${readmePath} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      artifact: readmePath,
      guardedStatus: "twse_openapi_coverage_backfill_readiness_draft",
      nextRoute: "twse_openapi_runtime_mock_consumer_wiring_readiness"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
