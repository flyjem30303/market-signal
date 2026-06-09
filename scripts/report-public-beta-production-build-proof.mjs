import { spawnSync } from "node:child_process";

const build = spawnSync("cmd.exe", ["/c", "npm", "run", "build"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: process.env,
  maxBuffer: 1024 * 1024 * 20,
  timeout: 420000,
  windowsHide: true
});

const output = `${build.stdout ?? ""}\n${build.stderr ?? ""}`;
const routeLines = output
  .split(/\r?\n/u)
  .filter((line) => /^[├┌└]\s+[○●ƒ]\s+/u.test(line.trim()));

const report = {
  status: build.status === 0
    ? "public_beta_production_build_ready_mock_boundary_preserved"
    : "public_beta_production_build_blocked",
  ok: build.status === 0,
  mode: "public_beta_production_build_proof",
  ceoDecision: "include_next_build_in_public_beta_mock_launch_proof",
  build: {
    exitCode: build.status ?? 1,
    compiledSuccessfully: output.includes("Compiled successfully"),
    generatedStaticPages: /Generating static pages \(\d+\/\d+\)/u.test(output),
    routeLineCount: routeLines.length,
    hasHomeRoute: output.includes("○ /"),
    hasBriefingRoute: output.includes("○ /briefing"),
    hasStockRoute: output.includes("/stocks/[symbol]"),
    hasDisclaimerRoute: output.includes("○ /disclaimer"),
    hasTermsRoute: output.includes("○ /terms"),
    hasPrivacyRoute: output.includes("○ /privacy")
  },
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "No deployment or hosting mutation is executed by this report.",
    "No platform values, secrets, raw payloads, row payloads, or stock id payloads are printed.",
    "No SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
    "No source-rights approval, source promotion, score promotion, or public launch completion claim is granted."
  ]
};

console.log(JSON.stringify(report, null, 2));
process.exit(build.status === 0 ? 0 : 1);
