import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const node = process.execPath;
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";

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

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;

try {
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
        managedServer: managedServer
          ? {
              command: managedServer.commandLabel,
              started: true
            }
          : {
              started: false
            },
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
} finally {
  if (managedServer) {
    stopManagedServer(managedServer.child);
  }
}

function runNpmScript(check) {
  const result = spawnSync("cmd.exe", ["/c", "npm", "run", check.script], {
    encoding: "utf8",
    env: {
      ...process.env,
      LOCALHOST_BASE_URL: baseUrl,
      LOCALHOST_HEALTH_BASE_URL: baseUrl,
      LOCALHOST_HEALTH_MANAGE_SERVER: "false",
      PUBLIC_BETA_PRODUCTION_URL: process.env.PUBLIC_BETA_PRODUCTION_URL ?? baseUrl
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

async function startTemporaryServer() {
  const hasProductionBuild = fs.existsSync(".next/BUILD_ID");
  const args = hasProductionBuild
    ? ["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", "3000"]
    : ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", "3000"];
  const child = spawn(node, args, {
    cwd: process.cwd(),
    env: normalizeEnv(process.env),
    stdio: "ignore",
    windowsHide: true
  });

  const ready = await waitForRoot();
  if (!ready) {
    child.kill();
    throw new Error("temporary localhost server did not become ready");
  }

  return {
    child,
    commandLabel: hasProductionBuild ? "next start" : "next dev"
  };
}

async function waitForRoot() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canFetchRoot()) return true;
    await delay(1000);
  }

  return false;
}

async function canFetchRoot() {
  try {
    const response = await fetch(new URL("/", baseUrl), { cache: "no-store" });
    return response.status === 200;
  } catch {
    return false;
  }
}

function normalizeEnv(env) {
  const next = { ...env };
  if (next.Path && next.PATH) {
    delete next.PATH;
  }
  return next;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stopManagedServer(child) {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    return;
  }

  child.kill();
}
