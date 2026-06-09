import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-beta-platform-values-route-preview.mjs";

const run = spawnSync("node", [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  maxBuffer: 1024 * 1024 * 10,
  timeout: 360000,
  windowsHide: true
});

const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
const report = parseJson(run.stdout ?? "");

expect(run.status === 0, "route preview report should exit 0");
expect(report?.status === "beta_platform_values_route_preview_ready_repo_safeguard_pending", "route preview status should be ready with repo safeguard pending");
expect(report?.ok === true, "route preview should be ok");
expect(report?.mode === "beta_platform_values_route_preview", "mode should be stable");
expect(report?.safePlaceholderSimulation?.valuesPrinted === false, "placeholder values must not be printed");
expect(report?.safePlaceholderSimulation?.valuesStored === false, "placeholder values must not be stored");
expect(report?.safePlaceholderSimulation?.validatorStatus === "accepted_two_value_shape_only", "safe placeholder values should pass validator");
expect(report?.proofMap?.status === "repo_proof_blocked", "current proof map should stop at repo proof safeguard");
expect(report?.proofMap?.stoppedAt === "packet-window-dry-run", "proof map should stop at dry run");
expect(report?.proofMap?.repoProofWorktreeState === "needs_pm_review_before_packet_creation", "repo proof should preserve current PM review state");
expect(report?.previewEvidence?.repoPreflight?.execution === "delegated_to_manual_command", "repo preflight should be delegated by default");
expect(
  report?.previewEvidence?.repoPreflight?.delegatedToManualCommand === "cmd.exe /c npm run report:pm-worktree-review-preflight",
  "repo preflight should expose the manual preflight command"
);
expect(report?.runtimeBoundary?.publicDataSource === "mock", "publicDataSource must remain mock");
expect(report?.runtimeBoundary?.scoreSource === "mock", "scoreSource must remain mock");

for (const command of [
  "cmd.exe /c npm run report:beta-platform-proof-status",
  "cmd.exe /c npm run report:pm-worktree-review-preflight",
  "cmd.exe /c npm run run:beta-packet-window-proof-map"
]) {
  expect(report?.nextCommands?.includes(command), `missing next command ${command}`);
}

const source = fs.readFileSync(reportPath, "utf8");
for (const phrase of [
  "Only safe placeholder platform values are used by this report.",
  "BETA_PLATFORM_ROUTE_PREVIEW_RUN_PREFLIGHT",
  "delegated_to_manual_command",
  "No real platform values are printed or stored by this report.",
  "No deployment, hosting mutation, SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
  "No source-rights approval, source promotion, score promotion, investment-advice claim, or public launch completion claim is granted."
]) {
  expect(source.includes(phrase), `source missing stop line: ${phrase}`);
}

for (const haystack of [output, source]) {
  for (const pattern of forbiddenPatterns()) {
    expect(!pattern.test(haystack), `forbidden pattern ${String(pattern)}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
expect(
  packageJson.scripts?.["report:beta-platform-values-route-preview"] ===
    "node scripts/report-beta-platform-values-route-preview.mjs",
  "package script missing report:beta-platform-values-route-preview"
);
expect(
  packageJson.scripts?.["check:beta-platform-values-route-preview"] ===
    "node scripts/check-beta-platform-values-route-preview.mjs",
  "package script missing check:beta-platform-values-route-preview"
);

const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
expect(reviewGate.includes("scripts/check-beta-platform-values-route-preview.mjs"), "review gate missing checker");
expect(reviewGate.includes("beta-platform-values-route-preview"), "review gate missing name");

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "beta_platform_values_route_preview_ready",
  proofMapStatus: report.proofMap.status,
  publicDataSource: "mock",
  scoreSource: "mock"
}, null, 2));

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
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
    /DEPLOYMENT_COMPLETED/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /source-rights approval is granted/iu,
    /investment advice approved/iu
  ];
}
