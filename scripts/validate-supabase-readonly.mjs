const requiredEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

const requiredConfirmation = "CP3_SUPABASE_READONLY_REMOTE_VALIDATE";
const confirmation = process.env.SUPABASE_READONLY_VALIDATE_CONFIRMATION;
const rowLimit = 5;

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
const confirmationStatus = confirmation === requiredConfirmation ? "present" : "missing_or_invalid";

if (missingEnv.length > 0) {
  block("missing_required_environment");
} else if (confirmation !== requiredConfirmation) {
  block("remote_execution_not_approved");
} else {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const objects = [];

  for (const name of plannedObjects) {
    objects.push(await countObject(supabase, name));
  }

  const blocked = objects.some((object) => object.reachable === "blocked" || object.countStatus === "blocked");

  finish({
    connection: blocked ? "blocked" : "ok",
    objects,
    reason: blocked ? "read_only_validation_blocked" : "read_only_validation_ok",
    status: blocked ? "blocked" : "ok"
  });
}

async function countObject(supabase, name) {
  const { error } = await supabase
    .from(name)
    .select("*", { count: "exact", head: true })
    .limit(rowLimit);

  if (error) {
    return {
      countStatus: "blocked",
      name,
      reachable: "blocked"
    };
  }

  return {
    countStatus: "ok",
    name,
    reachable: "ok"
  };
}

function block(reason) {
  finish({
    connection: "not_run",
    objects: plannedObjects.map((name) => ({
      countStatus: "not_run",
      name,
      reachable: "not_run"
    })),
    reason,
    status: "blocked"
  });
}

function finish({ connection, objects, reason, status }) {
  const result = {
    confirmation: confirmationStatus,
    connection,
    env,
    filesWritten: false,
    mode: "read_only_remote_validation",
    mutations: false,
    objects,
    publicClaimsChanged: false,
    reason,
    rowLimit,
    rowPayloadsPrinted: false,
    rpcCalled: false,
    scoreSourceRealChanged: false,
    secretsPrinted: false,
    sourceDepthReadyChanged: false,
    sqlExecuted: false,
    status
  };

  console.log(JSON.stringify(result, null, 2));

  if (status !== "ok") {
    process.exitCode = 1;
  }
}
