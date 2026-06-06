import fs from "node:fs";
import path from "node:path";

const CONFIRMATION_VALUE = "CEO_APPROVED_TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_ONCE";
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const TARGETS = ["staging_twse_stock_day_runs", "staging_twse_stock_day_prices"];
const POST_RUN_REVIEW_PATH = "docs/reviews/TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_POST_RUN_REVIEW_2026-06-06.md";

loadProcessEnvFromDotEnvLocal();

const confirmationAccepted = process.env.TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_CONFIRMATION === CONFIRMATION_VALUE;
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const expectedColumns = {
  staging_twse_stock_day_prices: [
    "close_price",
    "exchange_code",
    "high_price",
    "low_price",
    "open_price",
    "price_change",
    "quality_flags",
    "run_id",
    "source_fetched_at",
    "source_id",
    "source_row_hash",
    "symbol",
    "trade_date",
    "trade_value",
    "transaction_count",
    "volume"
  ].sort(),
  staging_twse_stock_day_runs: [
    "attribution_text",
    "created_by",
    "decision",
    "duplicate_trade_dates",
    "failed_month_count",
    "finished_at",
    "http_status_summary",
    "license_url",
    "missing_required_field_count",
    "non_numeric_price_count",
    "non_numeric_volume_amount_count",
    "parser_flag_count",
    "rate_limit_policy",
    "requested_month_count",
    "requested_symbol_count",
    "review_status",
    "run_id",
    "run_type",
    "source_id",
    "source_note_count",
    "source_url_template",
    "started_at",
    "successful_month_count",
    "total_candidate_row_count",
    "zero_row_months"
  ].sort()
};
const safety = {
  dailyPricesMutated: false,
  marketDataFetched: false,
  marketDataIngested: false,
  migrationExecuted: false,
  publicDataSource: "mock",
  publicPromotionAllowed: false,
  rawPayloadsPrinted: false,
  rowCoveragePointsAllowed: false,
  rowPayloadsPrinted: false,
  scoreSource: "mock",
  scoreSourceRealAllowed: false,
  secretsPrinted: false,
  sqlExecuted: false,
  stagingRowsCreated: false,
  supabaseWriteAttempted: false
};

if (!confirmationAccepted) {
  finish({
    connectionAttempted: false,
    exposure: notRunExposure("not_run_confirmation_required"),
    postRunReviewWritten: false,
    status: "tw_equity_postgrest_schema_exposure_probe_not_run_confirmation_required"
  });
} else if (!credentialPresence.nextPublicSupabaseUrl || !credentialPresence.serviceRoleKey) {
  finish({
    connectionAttempted: false,
    exposure: notRunExposure("missing_credentials"),
    postRunReviewWritten: false,
    status: "tw_equity_postgrest_schema_exposure_probe_blocked_missing_credentials"
  });
} else {
  const exposure = await probeOpenApiSchema();
  const status = classify(exposure);
  const postRunReviewWritten = writePostRunReview({ exposure, status });
  finish({
    connectionAttempted: true,
    exposure,
    postRunReviewWritten,
    status
  });
}

async function probeOpenApiSchema() {
  const endpoint = new URL("/rest/v1/", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/openapi+json",
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    method: "GET"
  });

  if (!response.ok) {
    return {
      httpStatusCategory: categorizeHttpStatus(response.status),
      objects: notRunExposure("openapi_http_blocked").objects,
      openApiParsed: false,
      openApiReachable: false,
      problems: ["openapi_http_blocked"]
    };
  }

  let openApi;
  try {
    openApi = await response.json();
  } catch {
    return {
      httpStatusCategory: categorizeHttpStatus(response.status),
      objects: notRunExposure("openapi_json_parse_blocked").objects,
      openApiParsed: false,
      openApiReachable: true,
      problems: ["openapi_json_parse_blocked"]
    };
  }

  const definitions = openApi.definitions ?? openApi.components?.schemas ?? {};
  const objects = TARGETS.map((target) => {
    const schema = definitions[target] ?? definitions[`public.${target}`] ?? null;
    const properties = schema?.properties && typeof schema.properties === "object" ? Object.keys(schema.properties).sort() : [];
    const missingExpectedColumns = difference(expectedColumns[target], properties);
    const exposedExpectedColumns = expectedColumns[target].filter((column) => properties.includes(column));

    return {
      exposed: Boolean(schema),
      exposedExpectedColumnCount: exposedExpectedColumns.length,
      expectedColumnCount: expectedColumns[target].length,
      missingExpectedColumns,
      name: target
    };
  });

  return {
    httpStatusCategory: categorizeHttpStatus(response.status),
    objects,
    openApiParsed: true,
    openApiReachable: true,
    problems: objects.flatMap((object) => {
      if (!object.exposed) return [`${object.name}_not_exposed_in_openapi_schema`];
      if (object.missingExpectedColumns.length > 0) return [`${object.name}_missing_expected_openapi_columns`];
      return [];
    })
  };
}

function classify(exposure) {
  if (!exposure.openApiReachable) return "tw_equity_postgrest_schema_exposure_probe_openapi_not_reachable";
  if (!exposure.openApiParsed) return "tw_equity_postgrest_schema_exposure_probe_openapi_not_parseable";
  if (exposure.problems.length > 0) return "tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete";
  return "tw_equity_postgrest_schema_exposure_probe_schema_exposure_complete_write_path_still_unresolved";
}

function writePostRunReview({ exposure, status }) {
  if (!status || status.endsWith("confirmation_required") || status.endsWith("missing_credentials")) return false;

  fs.mkdirSync(path.dirname(POST_RUN_REVIEW_PATH), { recursive: true });
  const lines = [
    "# TW Equity PostgREST Schema Exposure Probe Post-Run Review",
    "",
    "Date: 2026-06-06",
    "",
    `Status: \`${status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded PostgREST OpenAPI schema exposure probe was attempted.",
    "- Target objects: `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`.",
    "- Evidence is sanitized schema metadata only.",
    "",
    "## Sanitized Result",
    "",
    `- OpenAPI reachable: \`${exposure.openApiReachable}\`.`,
    `- OpenAPI parsed: \`${exposure.openApiParsed}\`.`,
    `- Problems: ${exposure.problems.length > 0 ? exposure.problems.map((item) => `\`${item}\``).join(", ") : "`none`"}.`,
    "",
    "## Object Summary",
    "",
    ...exposure.objects.map(
      (object) =>
        `- \`${object.name}\`: exposed=\`${object.exposed}\`, exposedExpectedColumnCount=\`${object.exposedExpectedColumnCount}\`, expectedColumnCount=\`${object.expectedColumnCount}\`, missingExpectedColumns=\`${object.missingExpectedColumns.join(",") || "none"}\`.`
    ),
    "",
    "## Safety Confirmation",
    "",
    "- no SQL execution;",
    "- no migration execution;",
    "- no insert/update/upsert/delete operation;",
    "- no staging rows created;",
    "- no `daily_prices` mutation;",
    "- no market-data fetch or ingestion;",
    "- no raw payloads printed;",
    "- no row payloads printed;",
    "- no secrets printed;",
    "- `publicDataSource=mock`;",
    "- `scoreSource=mock`."
  ];

  fs.writeFileSync(POST_RUN_REVIEW_PATH, `${lines.join("\n")}\n`);
  return true;
}

function notRunExposure(reason) {
  return {
    httpStatusCategory: "not_run",
    objects: TARGETS.map((target) => ({
      exposed: false,
      exposedExpectedColumnCount: 0,
      expectedColumnCount: expectedColumns[target].length,
      missingExpectedColumns: expectedColumns[target],
      name: target
    })),
    openApiParsed: false,
    openApiReachable: false,
    problems: [reason]
  };
}

function categorizeHttpStatus(status) {
  if (status >= 200 && status < 300) return "2xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500) return "5xx";
  return "other";
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item)).sort();
}

function loadProcessEnvFromDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const key of DOTENV_LOCAL_ALLOWED_KEYS) {
    if (!process.env[key] && parsed[key]) {
      process.env[key] = parsed[key];
    }
  }
}

function parseDotEnv(text) {
  const parsed = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function finish({ connectionAttempted, exposure, postRunReviewWritten, status }) {
  console.log(
    JSON.stringify(
      {
        status,
        mode: "tw_equity_postgrest_schema_exposure_probe_once",
        confirmation: confirmationAccepted ? "present" : "missing_or_invalid",
        credentialPresence,
        connectionAttempted,
        exposure,
        postRunReview: {
          path: postRunReviewWritten ? POST_RUN_REVIEW_PATH : null,
          written: postRunReviewWritten
        },
        safety,
        outputPolicy: {
          rawOpenApiPrinted: false,
          rowPayloadsPrinted: false,
          sanitizedSchemaMetadataOnly: true,
          secretsPrinted: false,
          supabaseUrlPrinted: false
        }
      },
      null,
      2
    )
  );
}
