import fs from "node:fs";

const envPath = ".env.local";
const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE",
  "DATA_FRESHNESS_SOURCE"
];

const env = readEnvFile(envPath);
const defaultedEnv = {
  DATA_FRESHNESS_SUPABASE_READS: envValue("DATA_FRESHNESS_SUPABASE_READS", "disabled"),
  MARKET_SIGNAL_SUPABASE_READS: envValue("MARKET_SIGNAL_SUPABASE_READS", "disabled")
};

const envState = Object.fromEntries(
  [
    ...requiredEnv.map((name) => [
      name,
      env[name] && env[name].trim().length > 0 ? "present" : "missing"
    ]),
    ...Object.keys(defaultedEnv).map((name) => [
      name,
      env[name] && env[name].trim().length > 0 ? "present" : "default_disabled"
    ])
  ]
);
const missingEnv = Object.entries(envState)
  .filter(([, state]) => state === "missing")
  .map(([name]) => name);

const boundaries = [
  {
    name: "main_market_signal_source",
    expected: "mock",
    observed: env.NEXT_PUBLIC_DATA_SOURCE || "missing",
    status: env.NEXT_PUBLIC_DATA_SOURCE === "mock" ? "ok" : "blocked"
  },
  {
    name: "market_signal_supabase_reads",
    expected: "disabled",
    observed: defaultedEnv.MARKET_SIGNAL_SUPABASE_READS,
    status: defaultedEnv.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "warning" : "ok"
  },
  {
    name: "freshness_supabase_reads",
    expected: "disabled unless one-read gate is active",
    observed: defaultedEnv.DATA_FRESHNESS_SUPABASE_READS,
    status: defaultedEnv.DATA_FRESHNESS_SUPABASE_READS === "enabled" ? "warning" : "ok"
  }
];

const blocked = missingEnv.length > 0 || boundaries.some((item) => item.status === "blocked");

console.log(
  JSON.stringify(
    {
      boundaries,
      connectionAttempted: false,
      env: envState,
      filesWritten: false,
      mode: "supabase_readonly_local_preflight",
      missingEnv,
      mutations: false,
      nextRemoteCommand: blocked ? null : "npm run db:readonly-validate",
      publicClaimsChanged: false,
      rowPayloadsPrinted: false,
      secretsPrinted: false,
      sqlExecuted: false,
      status: blocked ? "blocked" : "ready_for_guarded_readonly_decision"
    },
    null,
    2
  )
);

if (blocked) {
  process.exitCode = 1;
}

function readEnvFile(path) {
  if (!fs.existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return index === -1 ? [line, ""] : [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

function envValue(name, fallback) {
  return env[name] && env[name].trim().length > 0 ? env[name] : fallback;
}
