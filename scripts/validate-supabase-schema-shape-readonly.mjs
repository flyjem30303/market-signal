const requiredEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

const requiredConfirmation = "CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE";
const confirmation = process.env.SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION;
const rowLimit = 0;

const env = Object.fromEntries(
  requiredEnvNames.map((name) => [
    name,
    process.env[name] ? "present" : "missing"
  ])
);

const objectContracts = [
  {
    contractStatus: "local-baselined",
    expectedFieldNames: [
      "stock_id",
      "trade_date",
      "open",
      "high",
      "low",
      "close",
      "volume",
      "turnover",
      "created_at"
    ],
    name: "daily_prices",
    projection: "stock_id,trade_date,open,high,low,close,volume,turnover,created_at",
    relationshipToLocalBaseline: "matches_local_migration_and_types",
    shapeStatusWhenReachable: "ok",
    unexpectedRuntimeBlockers: []
  },
  {
    contractStatus: "needs-reconciliation",
    expectedFieldNames: [],
    name: "twse_stock_day_staging",
    projection: "*",
    relationshipToLocalBaseline: "remote_name_needs_reconciliation_with_local_staging_tables",
    shapeStatusWhenReachable: "needs-reconciliation",
    unexpectedRuntimeBlockers: [
      "local baseline uses staging_twse_stock_day_runs and staging_twse_stock_day_prices"
    ]
  },
  {
    contractStatus: "remote-only-pending-contract",
    expectedFieldCategories: [
      "market identity",
      "asset identity",
      "symbol",
      "display name",
      "exchange",
      "country",
      "currency",
      "timezone",
      "asset type",
      "active flag"
    ],
    name: "market_assets",
    projection: "*",
    relationshipToLocalBaseline: "remote_only_pending_contract",
    shapeStatusWhenReachable: "ok",
    unexpectedRuntimeBlockers: []
  },
  {
    contractStatus: "remote-only-pending-contract",
    expectedFieldCategories: [
      "model version",
      "run status",
      "source mode",
      "target object",
      "started timestamp",
      "finished timestamp",
      "review status",
      "notes or error message"
    ],
    name: "model_runs",
    projection: "*",
    relationshipToLocalBaseline: "remote_only_pending_contract",
    shapeStatusWhenReachable: "ok",
    unexpectedRuntimeBlockers: []
  },
  {
    contractStatus: "remote-only-pending-contract",
    expectedFieldCategories: [
      "target table",
      "source name",
      "latest data date",
      "freshness status",
      "run status",
      "finished timestamp",
      "row count",
      "stale reason"
    ],
    name: "data_freshness",
    projection: "*",
    relationshipToLocalBaseline: "unknown_until_later_schema_shape_execution_gate",
    shapeStatusWhenReachable: "ok",
    unexpectedRuntimeBlockers: []
  }
];

const missingEnv = Object.entries(env)
  .filter(([, state]) => state === "missing")
  .map(([name]) => name);

if (confirmation !== requiredConfirmation) {
  finish({
    confirmation: "missing_or_invalid",
    connection: "not_run",
    objects: objectContracts.map(toNotRunObject),
    reason: "missing_schema_shape_execution_confirmation",
    status: "blocked"
  });
} else if (missingEnv.length > 0) {
  finish({
    confirmation: "present",
    connection: "not_run",
    objects: objectContracts.map(toNotRunObject),
    reason: "missing_required_environment",
    status: "blocked"
  });
} else {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false
      }
    }
  );

  const objects = [];

  for (const object of objectContracts) {
    objects.push(await inspectObject(supabase, object));
  }

  const blocked = objects.some((object) => object.reachable === "blocked");

  finish({
    confirmation: "present",
    connection: blocked ? "blocked" : "ok",
    objects,
    reason: blocked ? "schema_shape_validation_blocked" : "schema_shape_validation_ok",
    status: blocked ? "blocked" : "ok"
  });
}

async function inspectObject(supabase, object) {
  const { error } = await supabase
    .from(object.name)
    .select(object.projection, { count: "exact", head: true })
    .limit(rowLimit);

  if (error) {
    return {
      contractStatus: object.contractStatus,
      expectedFieldCategories: object.expectedFieldCategories ?? undefined,
      expectedFieldNames: object.expectedFieldNames ?? undefined,
      fieldNamesPresent: "blocked",
      missingExpectedFields: "blocked",
      name: object.name,
      objectKind: "blocked",
      reachable: "blocked",
      relationshipToLocalBaseline: object.relationshipToLocalBaseline,
      shapeStatus: "blocked",
      unexpectedRuntimeBlockers: object.unexpectedRuntimeBlockers
    };
  }

  return {
    contractStatus: object.contractStatus,
    expectedFieldCategories: object.expectedFieldCategories ?? undefined,
    expectedFieldNames: object.expectedFieldNames ?? undefined,
    fieldNamesPresent:
      object.expectedFieldNames?.length > 0
        ? object.expectedFieldNames
        : "sanitized_categories_only",
    missingExpectedFields:
      object.expectedFieldNames?.length > 0
        ? "none"
        : "not_applicable_remote_contract_pending",
    name: object.name,
    objectKind: "unknown",
    reachable: "ok",
    relationshipToLocalBaseline: object.relationshipToLocalBaseline,
    shapeStatus: object.shapeStatusWhenReachable,
    unexpectedRuntimeBlockers: object.unexpectedRuntimeBlockers
  };
}

function toNotRunObject(object) {
  return {
    contractStatus: object.contractStatus,
    expectedFieldCategories: object.expectedFieldCategories ?? undefined,
    expectedFieldNames: object.expectedFieldNames ?? undefined,
    fieldNamesPresent: "not_run",
    missingExpectedFields: "not_run",
    name: object.name,
    objectKind: "not_run",
    reachable: "not_run",
    relationshipToLocalBaseline: object.relationshipToLocalBaseline,
    shapeStatus: "not_run",
    unexpectedRuntimeBlockers: object.unexpectedRuntimeBlockers
  };
}

function finish({ confirmation, connection, objects, reason, status }) {
  const result = {
    confirmation,
    connection,
    env,
    filesWritten: false,
    mode:
      confirmation === "present" && connection !== "not_run"
        ? "schema_shape_readonly_remote_validation"
        : "schema_shape_readonly_skeleton",
    mutations: false,
    objects,
    publicClaimsChanged: false,
    rawMarketDataPrinted: false,
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
  process.exitCode = status === "ok" ? 0 : 1;
}
