import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["scripts/report-cp3-tw-stock-dry-run.mjs", "2330"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

const report = result.status === 0 ? JSON.parse(result.stdout) : null;
const dryRun = report?.dry_run;
const failures = [
  result.status === 0 ? null : "report-command-failed",
  report?.status === "report" ? null : "missing-report-status",
  dryRun?.scoreSource === "mock" ? null : "scoreSource-not-mock",
  dryRun?.public_eligible === false ? null : "public-eligible-not-false",
  dryRun?.model_version === "tw-stock-signal-v0.1-candidate-dry-run" ? null : "wrong-model-version",
  dryRun?.missing_module_flags?.includes("fundamentals") ? null : "missing-fundamentals-flag",
  dryRun?.missing_module_flags?.includes("flow") ? null : "missing-flow-flag",
  dryRun?.missing_module_flags?.includes("market-context") ? null : "missing-market-context-flag",
  dryRun?.missing_module_flags?.includes("macro-risk") ? null : "missing-macro-risk-flag",
  dryRun?.warnings?.includes("not investment advice") ? null : "missing-advice-warning",
  report?.source?.persistence === "none" ? null : "persistence-not-none"
].filter(Boolean);

console.log(
  JSON.stringify(
    {
      failures,
      status: failures.length === 0 ? "ok" : "blocked",
      symbol: dryRun?.symbol ?? null
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
