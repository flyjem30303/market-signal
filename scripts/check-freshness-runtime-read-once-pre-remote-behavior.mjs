import { spawnSync } from "node:child_process";
import fs from "node:fs";

const runnerPath = "scripts/run-freshness-runtime-read-once.mjs";
const runner = fs.readFileSync(runnerPath, "utf8");
const secretSentinels = [
  "https://secret-project.supabase.co",
  "sb_secret_should_not_print",
  "sb_anon_should_not_load_or_print"
];

const cases = [
  {
    expected: {
      reason: "missing_confirmation",
      remoteAttempted: false,
      status: "blocked"
    },
    name: "missing confirmation blocks before remote",
    overrides: {}
  },
  {
    expected: {
      reason: "public_data_source_not_mock",
      remoteAttempted: false,
      status: "blocked"
    },
    name: "public source must remain mock",
    overrides: {
      FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION: "CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT",
      NEXT_PUBLIC_DATA_SOURCE: "supabase"
    }
  },
  {
    expected: {
      reason: "freshness_runtime_gate_not_enabled",
      remoteAttempted: false,
      status: "blocked"
    },
    name: "freshness source must be supabase",
    overrides: {
      DATA_FRESHNESS_SOURCE: "mock",
      DATA_FRESHNESS_SUPABASE_READS: "enabled",
      FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION: "CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    }
  },
  {
    expected: {
      reason: "freshness_runtime_gate_not_enabled",
      remoteAttempted: false,
      status: "blocked"
    },
    name: "supabase freshness reads must be enabled",
    overrides: {
      DATA_FRESHNESS_SOURCE: "supabase",
      DATA_FRESHNESS_SUPABASE_READS: "disabled",
      FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION: "CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT",
      NEXT_PUBLIC_DATA_SOURCE: "mock"
    }
  }
];

const results = cases.map(runCase);
const sourceProblems = [];

if (!runner.includes('const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]')) {
  sourceProblems.push("runner must allowlist only URL and service role credential loading");
}

if (runner.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
  sourceProblems.push("runner must not load or reference anon key");
}

if (!runner.includes("remoteAttempted: false")) {
  sourceProblems.push("runner must preserve pre-remote blocked output");
}

const failed = results.filter((result) => !result.pass);
const status = failed.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      results,
      sourceProblems,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}

function runCase(testCase) {
  const child = spawnSync(process.execPath, [runnerPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      PATH: process.env.PATH,
      SystemRoot: process.env.SystemRoot,
      TEMP: process.env.TEMP,
      TMP: process.env.TMP,
      NEXT_PUBLIC_SUPABASE_URL: secretSentinels[0],
      SUPABASE_SERVICE_ROLE_KEY: secretSentinels[1],
      NEXT_PUBLIC_SUPABASE_ANON_KEY: secretSentinels[2],
      ...testCase.overrides
    }
  });

  let parsed = null;
  try {
    parsed = JSON.parse(child.stdout);
  } catch {
    // Report below.
  }

  const problems = [];
  if (child.status !== 1) problems.push(`expected exit 1, got ${child.status}`);
  if (!parsed) {
    problems.push("stdout is not JSON");
  } else {
    for (const [key, value] of Object.entries(testCase.expected)) {
      if (parsed[key] !== value) {
        problems.push(`${key} expected ${String(value)}, got ${String(parsed[key])}`);
      }
    }
  }

  const combinedOutput = `${child.stdout ?? ""}\n${child.stderr ?? ""}`;
  for (const sentinel of secretSentinels) {
    if (combinedOutput.includes(sentinel)) {
      problems.push(`output leaked sentinel: ${sentinel}`);
    }
  }

  return {
    exitCode: child.status,
    name: testCase.name,
    output: parsed,
    pass: problems.length === 0,
    problems
  };
}
