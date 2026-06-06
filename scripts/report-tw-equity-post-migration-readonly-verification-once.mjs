import fs from "node:fs";
import path from "node:path";

const CONFIRMATION_VALUE = "CEO_APPROVED_TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_ONCE";
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const OUTCOME_PATH = "data/source-gates/tw-equity-staging-migration-apply-outcomes.json";
const OUTCOME_ID = "tw-equity-staging-migration-apply-0003";
const POST_RUN_REVIEW_PATH =
  "docs/reviews/TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const TARGETS = [
  {
    expectedSelect: "run_id",
    name: "staging_twse_stock_day_runs",
    purpose: "canonical_run_metadata_table"
  },
  {
    expectedSelect: "run_id",
    name: "staging_twse_stock_day_prices",
    purpose: "canonical_candidate_price_table"
  }
];

loadProcessEnvFromDotEnvLocal();

const confirmationAccepted =
  process.env.TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_CONFIRMATION === CONFIRMATION_VALUE;
const migrationOutcome = loadMigrationOutcome();
const migrationOutcomeAccepted = migrationOutcome.outcome === "accepted";
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const safety = {
  dailyPricesMutated: false,
  marketDataFetched: false,
  marketDataIngested: false,
  migrationExecutedByPm: false,
  publicDataSource: "mock",
  publicPromotionAllowed: false,
  rawPayloadsPrinted: false,
  rowCoveragePointsAllowed: false,
  rowPayloadsPrinted: false,
  scoreSource: "mock",
  scoreSourceRealAllowed: false,
  secretsPrinted: false,
  serviceRoleKeyPrinted: false,
  sqlExecutedByPm: false,
  stagingRowsCreated: false,
  supabaseWriteAttempted: false
};

if (!confirmationAccepted) {
  finish({
    connectionAttempted: false,
    objects: notRunObjects("not_run_confirmation_required"),
    postRunReviewWritten: false,
    status: "tw_equity_post_migration_readonly_verification_not_run_confirmation_required"
  });
} else if (!migrationOutcomeAccepted) {
  finish({
    connectionAttempted: false,
    objects: notRunObjects("migration_apply_outcome_accepted_required"),
    postRunReviewWritten: false,
    status: "tw_equity_post_migration_readonly_verification_blocked_migration_outcome_required"
  });
} else if (!credentialPresence.nextPublicSupabaseUrl || !credentialPresence.serviceRoleKey) {
  finish({
    connectionAttempted: false,
    objects: notRunObjects("missing_credentials"),
    postRunReviewWritten: false,
    status: "tw_equity_post_migration_readonly_verification_blocked_missing_credentials"
  });
} else {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });

  const objects = [];
  for (const target of TARGETS) {
    objects.push(await readonlyHeadCount(supabase, target));
  }

  const status = classify(objects);
  const postRunReviewWritten = writePostRunReview({ objects, status });
  finish({
    connectionAttempted: true,
    objects,
    postRunReviewWritten,
    status
  });
}

async function readonlyHeadCount(supabase, target) {
  const { count, error } = await supabase.from(target.name).select(target.expectedSelect, {
    count: "exact",
    head: true
  });

  if (error) {
    return {
      count: null,
      countStatus: "blocked",
      errorCategory: categorizeError(error),
      errorCode: sanitizeCode(error.code),
      name: target.name,
      purpose: target.purpose,
      reachable: "blocked"
    };
  }

  return {
    count,
    countStatus: "ok",
    errorCategory: "none",
    errorCode: "none",
    name: target.name,
    purpose: target.purpose,
    reachable: "ok"
  };
}

function classify(objects) {
  const allReachable = objects.every((object) => object.reachable === "ok");
  if (allReachable) return "tw_equity_post_migration_readonly_verification_tables_reachable_no_write";

  const objectMissing = objects.some((object) => object.errorCategory === "object_missing_or_schema_cache");
  if (objectMissing) return "tw_equity_post_migration_readonly_verification_blocked_object_or_schema_cache";

  const accessBlocked = objects.some((object) => object.errorCategory === "access_policy_or_credential_scope");
  if (accessBlocked) return "tw_equity_post_migration_readonly_verification_blocked_access_policy_or_credential_scope";

  return "tw_equity_post_migration_readonly_verification_blocked_unclassified_readonly_error";
}

function writePostRunReview({ objects, status }) {
  fs.mkdirSync(path.dirname(POST_RUN_REVIEW_PATH), { recursive: true });
  const lines = [
    "# TW Equity Post-Migration Readonly Verification Post-Run Review",
    "",
    "Date: 2026-06-07",
    "",
    `Status: \`${status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded post-migration readonly verification was attempted.",
    "- Target objects: `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`.",
    "- Evidence is sanitized aggregate metadata only.",
    "- Verification uses `head: true` exact counts and does not read row payloads.",
    "",
    "## Migration Apply Outcome Gate",
    "",
    `- Required outcome id: \`${OUTCOME_ID}\`.`,
    `- Required outcome observed: \`${migrationOutcome.outcome}\`.`,
    `- Outcome recorded by: \`${migrationOutcome.recordedBy ?? "not_recorded"}\`.`,
    `- Outcome recorded at: \`${migrationOutcome.recordedAt ?? "not_recorded"}\`.`,
    "",
    "## Sanitized Object Summary",
    "",
    ...objects.map(
      (object) =>
        `- \`${object.name}\`: reachable=\`${object.reachable}\`, countStatus=\`${object.countStatus}\`, count=\`${object.count ?? "n/a"}\`, errorCategory=\`${object.errorCategory}\`, errorCode=\`${object.errorCode}\`.`
    ),
    "",
    "## Safety Confirmation",
    "",
    "- no SQL execution by PM;",
    "- no migration execution by PM;",
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

function notRunObjects(reason) {
  return TARGETS.map((target) => ({
    count: null,
    countStatus: "not_run",
    errorCategory: reason,
    errorCode: "not_run",
    name: target.name,
    purpose: target.purpose,
    reachable: "not_run"
  }));
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

function loadMigrationOutcome() {
  if (!fs.existsSync(OUTCOME_PATH)) {
    return {
      id: OUTCOME_ID,
      outcome: "missing",
      recordedAt: null,
      recordedBy: null
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(OUTCOME_PATH, "utf8"));
    const outcome = Array.isArray(parsed.outcomes)
      ? parsed.outcomes.find((item) => item.id === OUTCOME_ID)
      : null;

    return {
      id: outcome?.id ?? OUTCOME_ID,
      outcome: outcome?.outcome ?? "missing",
      recordedAt: outcome?.recordedAt ?? null,
      recordedBy: outcome?.recordedBy ?? null
    };
  } catch {
    return {
      id: OUTCOME_ID,
      outcome: "unreadable",
      recordedAt: null,
      recordedBy: null
    };
  }
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

function finish({ connectionAttempted, objects, postRunReviewWritten, status }) {
  console.log(
    JSON.stringify(
      {
        status,
        mode: "tw_equity_post_migration_readonly_verification_once",
        confirmation: confirmationAccepted ? "present" : "missing_or_invalid",
        migrationOutcomeGate: {
          accepted: migrationOutcomeAccepted,
          outcome: migrationOutcome.outcome,
          outcomePath: OUTCOME_PATH,
          recordedAt: migrationOutcome.recordedAt,
          recordedBy: migrationOutcome.recordedBy,
          requiredOutcomeId: OUTCOME_ID
        },
        credentialPresence,
        connectionAttempted,
        objects,
        postRunReview: {
          path: postRunReviewWritten ? POST_RUN_REVIEW_PATH : null,
          written: postRunReviewWritten
        },
        safety,
        outputPolicy: {
          rawPayloadsPrinted: false,
          rowPayloadsPrinted: false,
          sanitizedAggregateMetadataOnly: true,
          secretsPrinted: false,
          supabaseUrlPrinted: false
        }
      },
      null,
      2
    )
  );
}
