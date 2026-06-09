import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-public-beta-separated-preflight.mjs";
const run = spawnSync("node", [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  maxBuffer: 1024 * 1024 * 20,
  timeout: 720000,
  windowsHide: true
});
const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
const report = parseJson(run.stdout ?? "");

expect(run.status === 0, "separated preflight should exit 0");
expect(report?.status === "public_beta_separated_preflight_ready_external_inputs_pending", "separated preflight should be ready");
expect(report?.ok === true, "separated preflight should be ok");
expect(report?.mode === "public_beta_separated_preflight", "mode should be stable");
expect(report?.sequencePolicy?.start === "recover_next_dev_server_before_route_proof", "sequence should recover before route proof");
expect(report?.sequencePolicy?.beforeBuild === "prove_local_mock_routes_first", "sequence should prove routes before build");
expect(report?.sequencePolicy?.build === "run_production_build_as_separate_deployment_preflight", "sequence should run build separately");
expect(report?.sequencePolicy?.afterBuild === "recover_next_dev_server_then_reprove_routes", "sequence should recover after build");
expect(report?.localProof?.checkedCount === 7, "checked count should be 7");
expect(report?.localProof?.allRequiredChecksPassed === true, "all required steps should pass");
expect(report?.remainingHardBlockers === 2, "remaining hard blockers should stay 2");
expect(report?.runtimeBoundary?.publicDataSource === "mock", "publicDataSource must remain mock");
expect(report?.runtimeBoundary?.scoreSource === "mock", "scoreSource must remain mock");

for (const name of [
  "preflight-start-dev-recovery",
  "pre-build-runtime-health",
  "initial-mock-route-bundle",
  "production-build-proof",
  "dev-recovery-after-build",
  "post-recovery-runtime-health",
  "post-recovery-mock-route-bundle"
]) {
  expect(report?.localProof?.passed?.includes(name), `passed steps missing ${name}`);
}

const source = fs.readFileSync(reportPath, "utf8");
for (const phrase of [
  "Production build proof is intentionally separate from localhost route proof.",
  "No deployment or hosting mutation is executed.",
  "No platform values, secrets, raw payloads, row payloads, or stock id payloads are printed.",
  "No SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
  "No source-rights approval, source promotion, score promotion, or investment-advice claim is granted."
]) {
  expect(source.includes(phrase), `source missing stop line: ${phrase}`);
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
expect(
  packageJson.scripts?.["report:public-beta-separated-preflight"] ===
    "node scripts/report-public-beta-separated-preflight.mjs",
  "package script missing report:public-beta-separated-preflight"
);
expect(
  packageJson.scripts?.["check:public-beta-separated-preflight"] ===
    "node scripts/check-public-beta-separated-preflight.mjs",
  "package script missing check:public-beta-separated-preflight"
);

const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
expect(reviewGate.includes("scripts/check-public-beta-separated-preflight.mjs"), "review gate missing checker");
expect(reviewGate.includes("public-beta-separated-preflight"), "review gate missing name");

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
      guardedStatus: "public_beta_separated_preflight_ready",
      checkedCount: report.localProof.checkedCount,
      remainingHardBlockers: report.remainingHardBlockers,
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
