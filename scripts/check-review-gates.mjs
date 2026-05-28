import { spawnSync } from "node:child_process";

const node = process.execPath;
const checks = [
  {
    command: [node, "-e", "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json ok')"],
    expectStatus: "ok",
    name: "package-json"
  },
  {
    command: [node, "--experimental-strip-types", "scripts/check-asset-type-policy.mjs"],
    expectStatus: "ok",
    name: "asset-policy"
  },
  {
    command: [node, "scripts/check-internal-route-exposure.mjs"],
    expectStatus: "ok",
    name: "internal-route-exposure"
  },
  {
    command: [node, "scripts/check-cp1-snapshot.mjs"],
    expectStatus: "ok",
    name: "cp1-snapshot"
  },
  {
    command: [node, "scripts/check-cp1-to-cp2.mjs"],
    expectStatus: "not_ready",
    name: "cp1-to-cp2"
  },
  {
    command: [node, "scripts/check-score-source-ui.mjs"],
    expectStatus: "ok",
    name: "score-source-ui"
  },
  {
    command: [node, "scripts/check-etf-source-gate.mjs"],
    expectStatus: "blocked",
    name: "etf-source-gate"
  },
  {
    command: [node, "scripts/check-etf-due-diligence.mjs"],
    expectStatus: "blocked",
    name: "etf-due-diligence"
  },
  {
    command: [node, "scripts/check-etf-mis-validation-plan.mjs"],
    expectStatus: "not_ready",
    name: "etf-mis-validation"
  },
  {
    command: [node, "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--experimental-strip-types", "scripts/report-etf-source-readiness.mjs"],
    expectStatus: "report",
    name: "etf-source-report"
  },
  {
    command: [node, "node_modules/typescript/bin/tsc", "--noEmit"],
    expectStatus: "ok",
    name: "typescript"
  }
];

const results = checks.map(runCheck);
const failed = results.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      results,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exitCode = 1;
}

function runCheck(check) {
  const result = spawnSync(check.command[0], check.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const observedStatus = readStatus(output, result.status);
  const pass = check.expectStatus === "report" ? result.status === 0 && output.includes("ETF Source Readiness Report") : observedStatus === check.expectStatus;

  return {
    exit_code: result.status,
    expected_status: check.expectStatus,
    name: check.name,
    observed_status: observedStatus,
    pass
  };
}

function readStatus(output, exitCode) {
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    try {
      const parsed = JSON.parse(output.slice(jsonStart, jsonEnd + 1));
      if (parsed.status) return parsed.status;
    } catch {
      // Non-JSON output is fine for commands like TypeScript.
    }
  }

  return exitCode === 0 ? "ok" : "blocked";
}
