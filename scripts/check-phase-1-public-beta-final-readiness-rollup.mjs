import { spawnSync } from "node:child_process";
import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredChecks = [
  {
    name: "phase-1-public-beta-candidate-final-public-readiness-scan",
    script: "check:phase-1-public-beta-candidate-final-public-readiness-scan"
  },
  {
    name: "public-beta-mock-launch-proof-bundle",
    script: "check:public-beta-mock-launch-proof-bundle"
  },
  {
    name: "public-beta-production-brief-alignment",
    script: "check:public-beta-production-brief-alignment"
  },
  {
    name: "phase-1-route-decision-order",
    script: "check:phase-1-route-decision-order"
  },
  {
    name: "public-surface-user-facing-audit",
    script: "check:public-surface-user-facing-audit"
  },
  {
    name: "phase-1-public-beta-public-visible-residue-cleanup",
    script: "check:phase-1-public-beta-public-visible-residue-cleanup"
  }
];

const forbiddenRuntimeFragments = [
  'publicDataSource: "supabase"',
  "publicDataSource=supabase",
  'scoreSource: "real"',
  "scoreSource=real",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw market data fetch is approved"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:phase-1-public-beta-final-readiness-rollup"] ===
      "node scripts/check-phase-1-public-beta-final-readiness-rollup.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-phase-1-public-beta-final-readiness-rollup.mjs") &&
      reviewGate.includes('"phase-1-public-beta-final-readiness-rollup"')
  }
];

const missingScripts = requiredChecks
  .filter((check) => !packageJson.scripts?.[check.script])
  .map((check) => check.script);

const checkResults = requiredChecks.map((check) => runNpmScript(check));
const runtimeBoundary = readRuntimeBoundary();

const status =
  registration.every((item) => item.pass) &&
  missingScripts.length === 0 &&
  checkResults.every((item) => item.pass) &&
  runtimeBoundary.pass
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      checkResults,
      missingScripts,
      mode: "phase_1_public_beta_final_readiness_rollup",
      registration,
      runtimeBoundary,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function runNpmScript(check) {
  const result = spawnSync("cmd.exe", ["/c", "npm", "run", check.script], {
    encoding: "utf8",
    env: {
      ...process.env,
      LOCALHOST_BASE_URL: process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000",
      PUBLIC_BETA_PRODUCTION_URL: process.env.PUBLIC_BETA_PRODUCTION_URL ?? process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000"
    },
    maxBuffer: 1024 * 1024 * 20
  });

  return {
    exitCode: result.status,
    name: check.name,
    pass: result.status === 0,
    script: check.script,
    stderrTail: tail(result.stderr),
    stdoutTail: tail(result.stdout)
  };
}

function readRuntimeBoundary() {
  const boundaryFiles = [
    "src/lib/runtime-product-summary.ts",
    "src/lib/public-beta-launch-readiness.ts",
    "src/components/dashboard-shell.tsx",
    "src/app/briefing/page.tsx",
    "src/app/weekly/page.tsx",
    "src/app/membership/page.tsx"
  ];

  const hits = [];
  for (const file of boundaryFiles) {
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const fragment of forbiddenRuntimeFragments) {
      if (source.includes(fragment)) hits.push(`${file}: ${fragment}`);
    }
  }

  return {
    forbiddenHits: hits,
    pass: hits.length === 0,
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function tail(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text.split(/\r?\n/u).slice(-20).join("\n");
}
