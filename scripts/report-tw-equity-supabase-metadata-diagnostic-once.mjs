import fs from "node:fs";
import path from "node:path";

const CONFIRMATION_VALUE = "CEO_APPROVED_TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_ONCE";
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const DEFAULT_TARGETS = ["staging_twse_stock_day_runs", "staging_twse_stock_day_prices"];
const DEFAULT_POST_RUN_REVIEW_PATH = "docs/reviews/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_POST_RUN_REVIEW_2026-06-06.md";

const args = parseArgs(process.argv.slice(2));
const requestedTargets = parseTargets(args.target ?? DEFAULT_TARGETS.join(","));
const postRunReviewPath = args["post-run-review"] ?? DEFAULT_POST_RUN_REVIEW_PATH;
const confirmation = process.env.TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_CONFIRMATION;
const confirmationAccepted = confirmation === CONFIRMATION_VALUE;

loadProcessEnvFromDotEnvLocal();

const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const targetValidation = validateTargets(requestedTargets);
const localStaticEvidence = collectLocalStaticEvidence();
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
    classification: {
      nextDecision: "provide_confirmation_before_metadata_diagnostic",
      problems: ["missing_tw_equity_supabase_metadata_diagnostic_confirmation"],
      status: "tw_equity_supabase_metadata_diagnostic_not_run_confirmation_required"
    },
    connectionAttempted: false,
    objects: notRunObjects(requestedTargets, "not_run_confirmation_required"),
    reviewWritten: false,
    status: "tw_equity_supabase_metadata_diagnostic_not_run_confirmation_required"
  });
} else if (!targetValidation.ok) {
  finish({
    classification: {
      nextDecision: "fix_target_argument_before_metadata_diagnostic",
      problems: targetValidation.problems,
      status: "tw_equity_supabase_metadata_diagnostic_blocked_invalid_target_scope"
    },
    connectionAttempted: false,
    objects: notRunObjects(requestedTargets, "invalid_target_scope"),
    reviewWritten: false,
    status: "tw_equity_supabase_metadata_diagnostic_blocked_invalid_target_scope"
  });
} else if (!credentialPresence.nextPublicSupabaseUrl || !credentialPresence.serviceRoleKey) {
  finish({
    classification: {
      nextDecision: "provide_required_supabase_credentials_before_metadata_diagnostic",
      problems: ["missing_required_supabase_credentials"],
      status: "tw_equity_supabase_metadata_diagnostic_blocked_missing_credentials"
    },
    connectionAttempted: false,
    objects: notRunObjects(requestedTargets, "missing_credentials"),
    reviewWritten: false,
    status: "tw_equity_supabase_metadata_diagnostic_blocked_missing_credentials"
  });
} else {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });

  const objects = [];
  for (const target of requestedTargets) {
    objects.push(await readonlyMetadataProbe(supabase, target));
  }

  const classification = classify({ localStaticEvidence, objects });
  const reviewWritten = writePostRunReview({ classification, objects, status: classification.status });

  finish({
    classification,
    connectionAttempted: true,
    objects,
    reviewWritten,
    status: classification.status
  });
}

async function readonlyMetadataProbe(supabase, name) {
  const { count, error } = await supabase.from(name).select("run_id", { count: "exact", head: true }).limit(1);

  if (error) {
    return {
      count: null,
      countStatus: "blocked",
      errorCategory: categorizeError(error),
      errorCode: sanitizeCode(error.code),
      name,
      reachable: "blocked"
    };
  }

  return {
    count,
    countStatus: "ok",
    errorCategory: "none",
    errorCode: "none",
    name,
    reachable: "ok"
  };
}

function classify({ localStaticEvidence, objects }) {
  const problems = [];
  const canonicalReachable = objects.every((object) => object.reachable === "ok");
  const objectOrCacheBlocked = objects.some((object) => object.errorCategory === "object_missing_or_schema_cache");
  const accessBlocked = objects.some((object) => object.errorCategory === "access_policy_or_credential_scope");
  const columnBlocked = objects.some((object) => object.errorCategory === "column_contract_or_schema_cache");
  const projectOrNetworkBlocked = objects.some((object) => object.errorCategory === "project_url_or_network");

  if (!localStaticEvidence.localMigrationExists) problems.push("local_staging_migration_missing");
  if (!localStaticEvidence.localMigrationDeclaresRunsTable) problems.push("local_runs_table_contract_missing");
  if (!localStaticEvidence.localMigrationDeclaresPricesTable) problems.push("local_prices_table_contract_missing");
  if (!localStaticEvidence.localRunIdUuidContractPresent) problems.push("local_run_id_uuid_contract_missing");

  if (canonicalReachable) {
    return {
      nextDecision: "open_separate_write_path_metadata_or_dashboard_comparison_before_any_third_write_attempt",
      problems,
      status: "tw_equity_supabase_metadata_diagnostic_metadata_reachable_insert_blocker_unresolved"
    };
  }

  if (objectOrCacheBlocked) {
    problems.push("canonical_objects_not_available_to_postgrest_or_schema_cache");
    return {
      nextDecision: "repair_remote_canonical_staging_objects_or_refresh_postgrest_schema_cache_before_retry",
      problems,
      status: "tw_equity_supabase_metadata_diagnostic_metadata_schema_cache_or_object_not_available"
    };
  }

  if (accessBlocked) {
    problems.push("canonical_objects_access_or_policy_blocked");
    return {
      nextDecision: "inspect_service_role_scope_rls_policy_and_schema_exposure_before_retry",
      problems,
      status: "tw_equity_supabase_metadata_diagnostic_metadata_access_or_policy_blocked"
    };
  }

  if (columnBlocked) {
    problems.push("canonical_objects_column_contract_or_schema_cache_blocked");
    return {
      nextDecision: "repair_column_contract_or_refresh_schema_cache_before_retry",
      problems,
      status: "tw_equity_supabase_metadata_diagnostic_metadata_column_contract_or_cache_blocked"
    };
  }

  if (projectOrNetworkBlocked) {
    problems.push("project_or_network_blocked");
    return {
      nextDecision: "resolve_project_url_or_network_reachability_before_retry",
      problems,
      status: "tw_equity_supabase_metadata_diagnostic_metadata_project_or_network_blocked"
    };
  }

  problems.push("metadata_diagnostic_unclassified_readonly_error");
  return {
    nextDecision: "inspect_sanitized_error_codes_before_retry",
    problems,
    status: "tw_equity_supabase_metadata_diagnostic_unclassified_readonly_blocker"
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

function collectLocalStaticEvidence() {
  const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
  const migration = fs.existsSync(migrationPath) ? fs.readFileSync(migrationPath, "utf8") : "";

  return {
    canonicalMigrationPath: migrationPath,
    localMigrationDeclaresPricesTable: migration.includes("create table if not exists public.staging_twse_stock_day_prices"),
    localMigrationDeclaresRunsTable: migration.includes("create table if not exists public.staging_twse_stock_day_runs"),
    localMigrationExists: fs.existsSync(migrationPath),
    localRunIdUuidContractPresent: migration.includes("run_id uuid")
  };
}

function writePostRunReview({ classification, objects, status }) {
  if (!postRunReviewPath || status.endsWith("not_run_confirmation_required")) return false;

  fs.mkdirSync(path.dirname(postRunReviewPath), { recursive: true });
  const lines = [
    "# TW Equity Supabase Metadata Diagnostic Post-Run Review",
    "",
    "Date: 2026-06-06",
    "",
    `Status: \`${status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded read-only metadata diagnostic was attempted.",
    "- Target objects: `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`.",
    "- Evidence is sanitized aggregate evidence only.",
    "",
    "## Sanitized Result",
    "",
    `- Classification: \`${status}\`.`,
    `- Next decision: \`${classification.nextDecision}\`.`,
    `- Problems: ${classification.problems.length > 0 ? classification.problems.map((item) => `\`${item}\``).join(", ") : "`none`"}.`,
    "",
    "## Object Summary",
    "",
    ...objects.map(
      (object) =>
        `- \`${object.name}\`: reachable=\`${object.reachable}\`, countStatus=\`${object.countStatus}\`, count=\`${object.count ?? "null"}\`, errorCategory=\`${object.errorCategory}\`, errorCode=\`${object.errorCode}\`.`
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

  fs.writeFileSync(postRunReviewPath, `${lines.join("\n")}\n`);
  return true;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (typeof next === "string" && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}

function parseTargets(value) {
  return value
    .split(",")
    .map((target) => target.trim())
    .filter(Boolean);
}

function validateTargets(targets) {
  const problems = [];
  if (targets.length !== DEFAULT_TARGETS.length) problems.push("target_count_must_equal_two");
  for (const target of DEFAULT_TARGETS) {
    if (!targets.includes(target)) problems.push(`missing_target_${target}`);
  }
  for (const target of targets) {
    if (!DEFAULT_TARGETS.includes(target)) problems.push(`unexpected_target_${target}`);
  }

  return {
    ok: problems.length === 0,
    problems
  };
}

function notRunObjects(targets, reason) {
  return targets.map((name) => ({
    count: null,
    countStatus: "not_run",
    errorCategory: reason,
    errorCode: "not_run",
    name,
    reachable: "not_run"
  }));
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

function sanitizeCode(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "unknown";
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function finish({ classification, connectionAttempted, objects, reviewWritten, status }) {
  const result = {
    status,
    mode: "tw_equity_supabase_metadata_diagnostic_once",
    confirmation: confirmationAccepted ? "present" : "missing_or_invalid",
    credentialPresence,
    targetValidation,
    connectionAttempted,
    localStaticEvidence,
    objects,
    classification,
    postRunReview: {
      path: reviewWritten ? postRunReviewPath : null,
      written: reviewWritten
    },
    safety,
    outputPolicy: {
      rowPayloadsPrinted: false,
      sanitizedAggregateEvidenceOnly: true,
      sanitizedErrorCodesOnly: true,
      secretsPrinted: false,
      supabaseUrlPrinted: false
    }
  };

  console.log(JSON.stringify(result, null, 2));
}
