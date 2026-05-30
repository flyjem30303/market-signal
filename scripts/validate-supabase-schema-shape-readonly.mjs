const requiredEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

const requiredConfirmation = "CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE";
const confirmation = process.env.SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION;

const env = Object.fromEntries(
  requiredEnvNames.map((name) => [
    name,
    process.env[name] ? "present" : "missing"
  ])
);

const objects = [
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
    fieldNamesPresent: "not_run",
    missingExpectedFields: "not_run",
    name: "daily_prices",
    objectKind: "not_run",
    reachable: "not_run",
    relationshipToLocalBaseline: "matches_local_migration_and_types",
    shapeStatus: "not_run",
    unexpectedRuntimeBlockers: []
  },
  {
    contractStatus: "needs-reconciliation",
    expectedFieldNames: [],
    fieldNamesPresent: "not_run",
    missingExpectedFields: "not_run",
    name: "twse_stock_day_staging",
    objectKind: "not_run",
    reachable: "not_run",
    relationshipToLocalBaseline: "remote_name_needs_reconciliation_with_local_staging_tables",
    shapeStatus: "not_run",
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
    fieldNamesPresent: "not_run",
    missingExpectedFields: "not_run",
    name: "market_assets",
    objectKind: "not_run",
    reachable: "not_run",
    relationshipToLocalBaseline: "remote_only_pending_contract",
    shapeStatus: "not_run",
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
    fieldNamesPresent: "not_run",
    missingExpectedFields: "not_run",
    name: "model_runs",
    objectKind: "not_run",
    reachable: "not_run",
    relationshipToLocalBaseline: "remote_only_pending_contract",
    shapeStatus: "not_run",
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
    fieldNamesPresent: "not_run",
    missingExpectedFields: "not_run",
    name: "data_freshness",
    objectKind: "not_run",
    reachable: "not_run",
    relationshipToLocalBaseline: "unknown_until_later_schema_shape_execution_gate",
    shapeStatus: "not_run",
    unexpectedRuntimeBlockers: []
  }
];

const missingEnv = Object.entries(env)
  .filter(([, state]) => state === "missing")
  .map(([name]) => name);

let reason = "remote_schema_shape_execution_not_implemented";

if (confirmation !== requiredConfirmation) {
  reason = "missing_schema_shape_execution_confirmation";
} else if (missingEnv.length > 0) {
  reason = "missing_required_environment";
}

finish({
  confirmation: confirmation === requiredConfirmation ? "present" : "missing_or_invalid",
  connection: "not_run",
  reason,
  status: "blocked"
});

function finish({ confirmation, connection, reason, status }) {
  const result = {
    confirmation,
    connection,
    env,
    filesWritten: false,
    mode: "schema_shape_readonly_skeleton",
    mutations: false,
    objects,
    publicClaimsChanged: false,
    rawMarketDataPrinted: false,
    reason,
    rowLimit: 0,
    rowPayloadsPrinted: false,
    rpcCalled: false,
    scoreSourceRealChanged: false,
    secretsPrinted: false,
    sourceDepthReadyChanged: false,
    sqlExecuted: false,
    status
  };

  console.log(JSON.stringify(result, null, 2));
  process.exitCode = 1;
}
