import fs from "node:fs";
import path from "node:path";

const CONFIRMATION_VALUE = "CEO_APPROVED_TW_EQUITY_PGRST205_READONLY_DIAGNOSTIC_ONCE";
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const confirmation = process.env.TW_EQUITY_PGRST205_READONLY_CONFIRMATION;
const readonlyRequested = confirmation === CONFIRMATION_VALUE;
const targetObjects = [
  {
    expectedColumns: "run_id",
    localMigrationPhrase: "create table if not exists public.staging_twse_stock_day_runs",
    name: "staging_twse_stock_day_runs",
    purpose: "canonical_run_metadata_table"
  },
  {
    expectedColumns: "run_id",
    localMigrationPhrase: "create table if not exists public.staging_twse_stock_day_prices",
    name: "staging_twse_stock_day_prices",
    purpose: "canonical_candidate_price_table"
  },
  {
    expectedColumns: "*",
    localMigrationPhrase: "twse_stock_day_staging",
    name: "twse_stock_day_staging",
    purpose: "legacy_or_prior_remote_contract_name"
  }
];

loadProcessEnvFromDotEnvLocal();

const localStaticEvidence = collectLocalStaticEvidence();
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const safety = {
  dailyPricesMutated: false,
  marketDataFetched: false,
  marketDataIngested: false,
  mutations: false,
  publicDataSource: "mock",
  rawPayloadsPrinted: false,
  rowPayloadsPrinted: false,
  scoreSource: "mock",
  secretsPrinted: false,
  serviceRoleKeyPrinted: false,
  sqlExecuted: false,
  stagingRowsCreated: false,
  supabaseWriteRetried: false
};

if (!readonlyRequested) {
  finish({
    classification: "not_run_confirmation_required",
    connectionAttempted: false,
    objects: targetObjects.map((object) => ({
      errorCategory: "not_run",
      errorCode: "not_run",
      name: object.name,
      purpose: object.purpose,
      reachable: "not_run"
    })),
    problems: ["missing_tw_equity_pgrst205_readonly_confirmation"],
    status: "tw_equity_pgrst205_root_cause_gate_not_run_confirmation_required"
  });
} else if (!credentialPresence.nextPublicSupabaseUrl || !credentialPresence.serviceRoleKey) {
  finish({
    classification: "blocked_missing_credentials",
    connectionAttempted: false,
    objects: targetObjects.map((object) => ({
      errorCategory: "not_run",
      errorCode: "not_run",
      name: object.name,
      purpose: object.purpose,
      reachable: "not_run"
    })),
    problems: ["missing_required_supabase_credentials"],
    status: "tw_equity_pgrst205_root_cause_gate_blocked_missing_credentials"
  });
} else {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });

  const objects = [];
  for (const object of targetObjects) {
    objects.push(await readonlyHeadCount(supabase, object));
  }

  const classification = classify({ localStaticEvidence, objects });
  finish({
    classification,
    connectionAttempted: true,
    objects,
    problems: classification.problems,
    status: classification.status
  });
}

async function readonlyHeadCount(supabase, object) {
  const { count, error } = await supabase
    .from(object.name)
    .select(object.expectedColumns, { count: "exact", head: true })
    .limit(1);

  if (error) {
    return {
      count: null,
      countStatus: "blocked",
      errorCategory: categorizeError(error),
      errorCode: sanitizeCode(error.code),
      name: object.name,
      purpose: object.purpose,
      reachable: "blocked"
    };
  }

  return {
    count,
    countStatus: "ok",
    errorCategory: "none",
    errorCode: "none",
    name: object.name,
    purpose: object.purpose,
    reachable: "ok"
  };
}

function collectLocalStaticEvidence() {
  const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
  const migration = fs.existsSync(migrationPath) ? fs.readFileSync(migrationPath, "utf8") : "";

  return {
    canonicalMigrationPath: migrationPath,
    localMigrationDeclaresPricesTable: migration.includes("create table if not exists public.staging_twse_stock_day_prices"),
    localMigrationDeclaresRunsTable: migration.includes("create table if not exists public.staging_twse_stock_day_runs"),
    localMigrationEnablesPricesRls: migration.includes("alter table public.staging_twse_stock_day_prices enable row level security"),
    localMigrationEnablesRunsRls: migration.includes("alter table public.staging_twse_stock_day_runs enable row level security"),
    localMigrationExists: fs.existsSync(migrationPath),
    localMigrationIsDraftOnly: migration.includes("Candidate draft only. Do not execute until CEO approves migration execution.")
  };
}

function classify({ localStaticEvidence, objects }) {
  const byName = Object.fromEntries(objects.map((object) => [object.name, object]));
  const canonicalObjects = [byName.staging_twse_stock_day_runs, byName.staging_twse_stock_day_prices];
  const canonicalBlockedByObjectAvailability = canonicalObjects.some(
    (object) => object?.errorCategory === "object_missing_or_schema_cache"
  );
  const canonicalReachable = canonicalObjects.every((object) => object?.reachable === "ok");
  const canonicalAccessBlocked = canonicalObjects.some((object) => object?.errorCategory === "access_policy_or_credential_scope");
  const legacyReachable = byName.twse_stock_day_staging?.reachable === "ok";
  const problems = [];

  if (!localStaticEvidence.localMigrationExists) problems.push("local_staging_migration_missing");
  if (!localStaticEvidence.localMigrationDeclaresRunsTable) problems.push("local_runs_table_contract_missing");
  if (!localStaticEvidence.localMigrationDeclaresPricesTable) problems.push("local_prices_table_contract_missing");
  if (!localStaticEvidence.localMigrationIsDraftOnly) problems.push("local_migration_draft_warning_missing");

  if (canonicalReachable) {
    return {
      nextDecision: "open_separate_ceo_retry_or_schema_cache_refresh_decision_before_any_write",
      problems,
      status: "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry"
    };
  }

  if (canonicalBlockedByObjectAvailability && legacyReachable) {
    problems.push("canonical_objects_blocked_but_legacy_contract_readable");
    return {
      nextDecision: "decide_between_target_naming_reconciliation_and_canonical_migration_repair",
      problems,
      status: "tw_equity_pgrst205_root_cause_gate_target_naming_drift_possible"
    };
  }

  if (canonicalBlockedByObjectAvailability) {
    problems.push("canonical_objects_not_available_to_postgrest_or_schema_cache");
    return {
      nextDecision: "repair_remote_canonical_staging_objects_or_refresh_postgrest_schema_cache_before_retry",
      problems,
      status: "tw_equity_pgrst205_root_cause_gate_remote_canonical_objects_not_available_or_schema_cache"
    };
  }

  if (canonicalAccessBlocked) {
    problems.push("canonical_objects_access_or_policy_blocked");
    return {
      nextDecision: "inspect_service_role_scope_rls_policy_and_schema_exposure_before_retry",
      problems,
      status: "tw_equity_pgrst205_root_cause_gate_access_policy_or_credential_scope"
    };
  }

  problems.push("canonical_objects_blocked_by_unclassified_readonly_error");
  return {
    nextDecision: "inspect_sanitized_error_codes_before_retry",
    problems,
    status: "tw_equity_pgrst205_root_cause_gate_unclassified_readonly_blocker"
  };
}

function categorizeError(error) {
  const code = sanitizeCode(error.code);

  if (code === "42P01" || code === "PGRST205") return "object_missing_or_schema_cache";
  if (code === "42501" || code === "PGRST301" || code === "PGRST302") return "access_policy_or_credential_scope";
  if (code === "08006" || code === "PGRST000") return "project_url_or_network";
  if (code === "PGRST204") return "column_contract_or_schema_cache";
  if (code === "unknown") return "unknown";

  return "other_sanitized_error_code";
}

function sanitizeCode(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "unknown";
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

function finish({ classification, connectionAttempted, objects, problems, status }) {
  const classificationPayload =
    typeof classification === "string"
      ? {
          nextDecision: "provide_confirmation_before_readonly_diagnostic",
          problems,
          status
        }
      : classification;

  const result = {
    status,
    mode: "tw_equity_pgrst205_root_cause_readonly_gate",
    confirmation: readonlyRequested ? "present" : "missing_or_invalid",
    credentialPresence,
    connectionAttempted,
    localStaticEvidence,
    objects,
    classification: classificationPayload,
    safety,
    filesWrittenByReport: false,
    outputPolicy: {
      rowPayloadsPrinted: false,
      secretsPrinted: false,
      sanitizedErrorCodesOnly: true,
      supabaseUrlPrinted: false
    }
  };

  console.log(JSON.stringify(result, null, 2));
}
