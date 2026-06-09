import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-public-beta-mock-launch-proof-bundle.mjs";
const run = spawnSync("node", [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: process.env,
  timeout: 360000,
  windowsHide: true
});
const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
const report = parseJson(run.stdout ?? "");

expect(run.status === 0, "report should exit 0 when local mock proof passes");
expect(
  report?.status === "public_beta_mock_launch_proof_bundle_ready_external_inputs_pending",
  "report should be ready with external inputs pending"
);
expect(report?.ok === true, "report should be ok");
expect(report?.mode === "public_beta_mock_launch_proof_bundle", "mode should be stable");
expect(report?.localProof?.allRequiredChecksPassed === true, "all required local checks should pass");
expect(report?.localProof?.checkedCount === 6, "checked count should be 6");
expect(report?.localProof?.executedCount === 1, "executed count should be 1");
expect(report?.localProof?.delegatedCount === 5, "delegated count should be 5");
expect([1, 2].includes(report?.remainingHardBlockers?.count), "remaining hard blocker count should be 1 or 2 depending on A1 evidence state");
expect(
  report?.remainingHardBlockers?.platform?.status === "blocked_waiting_two_platform_values",
  "platform blocker should still wait for two values"
);
expect(
  [
    "blocked_waiting_a1_twii_four_slot_no_secret_evidence",
    "a1_twii_four_slot_evidence_ready_for_outcome_gate_route"
  ].includes(report?.remainingHardBlockers?.a1TwiiEvidence?.status),
  "A1 status should wait for four no-secret slots or be ready for outcome-gate route"
);
expect(report?.runtimeBoundary?.publicDataSource === "mock", "publicDataSource must remain mock");
expect(report?.runtimeBoundary?.scoreSource === "mock", "scoreSource must remain mock");
expect(report?.nextAction === "use_single_external_input_request_then_response_readiness", "nextAction should route to single external input request");
expect(report?.nextExecutableStep?.lane === "external_input_request", "nextExecutableStep should use external_input_request lane");
expect(
  report?.nextExecutableStep?.command === "cmd.exe /c npm run report:public-beta-external-input-request",
  "nextExecutableStep should point to public beta external input request"
);
expect(
  report?.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-request"),
  "nextCommands should include public beta external input request"
);
expect(
  report?.nextCommands?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness"),
  "nextCommands should include public beta external input response readiness"
);

for (const name of [
  "beta-runtime-fast-health",
  "public-beta-core-route-quick-proof",
  "public-visible-language-quality",
  "public-beta-launch-readiness-panel",
  "beta-platform-proof-status",
  "a1-twii-evidence-completion-status"
]) {
  expect(report?.localProof?.passed?.includes(name), `passed checks missing ${name}`);
}

for (const name of [
  "beta-runtime-fast-health",
  "public-visible-language-quality",
  "public-beta-launch-readiness-panel",
  "beta-platform-proof-status",
  "a1-twii-evidence-completion-status"
]) {
  const check = report?.checks?.find((item) => item.name === name);
  expect(check?.execution === "delegated_to_focused_gate", `${name} should be delegated to focused gate`);
  expect(typeof check?.delegatedToFocusedGate === "string", `${name} should include delegated focused command`);
}

const source = fs.readFileSync(reportPath, "utf8");
for (const phrase of [
  "This bundle proves local mock-only readiness, not public launch completion.",
  "No deployment or hosting mutation is executed.",
  "No platform values, secrets, raw payloads, row payloads, or stock id payloads are printed.",
  "No SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
  "No source-rights approval, source promotion, score promotion, or investment-advice claim is granted."
]) {
  expect(source.includes(phrase), `source missing stop line: ${phrase}`);
}

for (const phrase of [
  "delegatedChecks",
  "delegated_to_focused_gate",
  "nextExecutableStep",
  "use_single_external_input_request_then_response_readiness",
  "cmd.exe /c npm run report:public-beta-external-input-request",
  "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
  "Daily focused review gate executes the delegated runtime, trust, readiness, platform, and A1 checks separately."
]) {
  expect(source.includes(phrase), `source missing delegation phrase: ${phrase}`);
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
expect(
  packageJson.scripts?.["report:public-beta-mock-launch-proof-bundle"] ===
    "node scripts/report-public-beta-mock-launch-proof-bundle.mjs",
  "package script missing report:public-beta-mock-launch-proof-bundle"
);
expect(
  packageJson.scripts?.["check:public-beta-mock-launch-proof-bundle"] ===
    "node scripts/check-public-beta-mock-launch-proof-bundle.mjs",
  "package script missing check:public-beta-mock-launch-proof-bundle"
);

const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
expect(reviewGate.includes("scripts/check-public-beta-mock-launch-proof-bundle.mjs"), "review gate missing checker");
expect(reviewGate.includes("public-beta-mock-launch-proof-bundle"), "review gate missing name");

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
      guardedStatus: "public_beta_mock_launch_proof_bundle_ready",
      checkedCount: report.localProof.checkedCount,
      remainingHardBlockers: report.remainingHardBlockers.count,
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
