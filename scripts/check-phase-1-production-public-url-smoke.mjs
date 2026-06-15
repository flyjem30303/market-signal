import { spawnSync } from "node:child_process";

const baseUrl = process.env.PHASE_1_PUBLIC_BASE_URL ?? "https://market-signal-two.vercel.app";
const target = new URL(baseUrl);
const normalizedBaseUrl = target.origin;

const run = spawnSync(
  process.execPath,
  ["scripts/check-phase-1-public-beta-public-visible-residue-cleanup.mjs"],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      LOCALHOST_BASE_URL: normalizedBaseUrl,
      LOCALHOST_HEALTH_MANAGE_SERVER: "false"
    },
    shell: false,
    timeout: 120000,
    windowsHide: true
  }
);

let checkerOutput = {};
try {
  checkerOutput = JSON.parse(run.stdout);
} catch (error) {
  checkerOutput = {
    status: "blocked",
    parseError: error.message
  };
}

console.log(
  JSON.stringify(
    {
      status: checkerOutput.status === "ok" ? "ok" : "blocked",
      guardedStatus:
        checkerOutput.status === "ok"
          ? "phase_1_production_public_url_smoke_ready"
          : "phase_1_production_public_url_smoke_blocked",
      baseUrl: normalizedBaseUrl,
      checkedRoutes: checkerOutput.checkedRoutes ?? null,
      checkedInaccessiblePhase2Routes: checkerOutput.checkedInaccessiblePhase2Routes ?? null,
      failedRoutes: [
        ...(checkerOutput.routeResults ?? []).filter((result) => result.pass !== true),
        ...(checkerOutput.inaccessibleRouteResults ?? []).filter((result) => result.pass !== true)
      ].map((result) => ({
        route: result.route,
        status: result.status ?? null,
        forbiddenHits: result.forbiddenHits ?? [],
        missingRequiredSignals: result.missingRequiredSignals ?? [],
        mojibakeHits: result.mojibakeHits ?? []
      })),
      publicDataSource: checkerOutput.publicDataSource ?? "mock",
      scoreSource: checkerOutput.scoreSource ?? "mock"
    },
    null,
    2
  )
);

process.exitCode = 0;
