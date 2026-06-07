import { spawnSync } from "node:child_process";
import { buildPublicBetaGoalReadinessRollup } from "./lib/public-beta-goal-readiness-rollup.mjs";

const mainline = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-mainline-current-route"]);
const report = mainline.json ?? {};

const rollup = buildPublicBetaGoalReadinessRollup(report, {
  sourceReports: {
    betaMainlineCurrentRoute: {
      exitCode: mainline.exitCode,
      parsedJson: Boolean(mainline.json),
      stderrPrinted: mainline.stderr.length > 0
    }
  }
});

console.log(JSON.stringify(rollup, null, 2));

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 300000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim()
  };
}

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
