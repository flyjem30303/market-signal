import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-public-beta-production-build-proof.mjs";
const run = spawnSync("node", [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  maxBuffer: 1024 * 1024 * 20,
  timeout: 420000,
  windowsHide: true
});
const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
const report = parseJson(run.stdout ?? "");

expect(run.status === 0, "production build proof should exit 0");
expect(report?.status === "public_beta_production_build_ready_mock_boundary_preserved", "production build proof should be ready");
expect(report?.ok === true, "production build proof should be ok");
expect(report?.mode === "public_beta_production_build_proof", "mode should be stable");
expect(report?.build?.exitCode === 0, "build exit code should be 0");
expect(report?.build?.compiledSuccessfully === true, "build should compile successfully");
expect(report?.build?.generatedStaticPages === true, "build should generate static pages");
expect(report?.build?.hasHomeRoute === true, "build should include home route");
expect(report?.build?.hasBriefingRoute === true, "build should include briefing route");
expect(report?.build?.hasStockRoute === true, "build should include stock route");
expect(report?.build?.hasDisclaimerRoute === true, "build should include disclaimer route");
expect(report?.build?.hasTermsRoute === true, "build should include terms route");
expect(report?.build?.hasPrivacyRoute === true, "build should include privacy route");
expect(report?.runtimeBoundary?.publicDataSource === "mock", "publicDataSource must remain mock");
expect(report?.runtimeBoundary?.scoreSource === "mock", "scoreSource must remain mock");

const source = fs.readFileSync(reportPath, "utf8");
for (const phrase of [
  "No deployment or hosting mutation is executed by this report.",
  "No platform values, secrets, raw payloads, row payloads, or stock id payloads are printed.",
  "No SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
  "No source-rights approval, source promotion, score promotion, or public launch completion claim is granted."
]) {
  expect(source.includes(phrase), `source missing stop line: ${phrase}`);
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
expect(
  packageJson.scripts?.["report:public-beta-production-build-proof"] ===
    "node scripts/report-public-beta-production-build-proof.mjs",
  "package script missing report:public-beta-production-build-proof"
);
expect(
  packageJson.scripts?.["check:public-beta-production-build-proof"] ===
    "node scripts/check-public-beta-production-build-proof.mjs",
  "package script missing check:public-beta-production-build-proof"
);

const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
expect(reviewGate.includes("scripts/check-public-beta-production-build-proof.mjs"), "review gate missing checker");
expect(reviewGate.includes("public-beta-production-build-proof"), "review gate missing name");

for (const haystack of [output, source]) {
  for (const pattern of forbiddenPatterns()) {
    expect(!pattern.test(haystack), `forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "public_beta_production_build_proof_ready",
      routeLineCount: report.build.routeLineCount,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function expect(pass, message) {
  if (!pass) problems.push(message);
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /vercel deploy/iu,
    /npm run deploy/iu,
    /DEPLOYMENT_COMPLETED/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /source-rights approval is granted/iu,
    /investment advice approved/iu
  ];
}
