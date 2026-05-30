const requiredEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

const plannedObjects = [
  "daily_prices",
  "twse_stock_day_staging",
  "market_assets",
  "model_runs",
  "data_freshness"
];

const env = Object.fromEntries(
  requiredEnvNames.map((name) => [
    name,
    process.env[name] ? "present" : "missing"
  ])
);

const missingEnv = Object.entries(env)
  .filter(([, state]) => state === "missing")
  .map(([name]) => name);

const result = {
  connection: "not_run",
  env,
  filesWritten: false,
  mode: "read_only_remote_validation",
  mutations: false,
  objects: plannedObjects.map((name) => ({
    countStatus: "not_run",
    name,
    reachable: "not_run"
  })),
  publicClaimsChanged: false,
  reason: missingEnv.length > 0 ? "missing_required_environment" : "remote_execution_not_approved",
  rowLimit: 5,
  rowPayloadsPrinted: false,
  rpcCalled: false,
  scoreSourceRealChanged: false,
  secretsPrinted: false,
  sourceDepthReadyChanged: false,
  sqlExecuted: false,
  status: "blocked"
};

console.log(JSON.stringify(result, null, 2));
process.exitCode = 1;
