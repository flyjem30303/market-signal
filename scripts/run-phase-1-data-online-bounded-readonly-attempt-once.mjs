import fs from "node:fs";
import path from "node:path";

const REQUIRED_CONFIRMATION = "CEO_APPROVED_PHASE1_DATA_ONLINE_READONLY_ONCE";
const DEFAULT_OUT_DIR = "tmp";
const REQUIRED_ENV_NAMES = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const problems = [];
const args = parseArgs(process.argv.slice(2));

loadProcessEnvFromDotEnvLocal();

const attemptId = args["attempt-id"];
const scope = args.scope;
const aggregateOnly = args["aggregate-only"] === "true";
const confirmation = args.confirm;
const executeRequested = args.execute === "true";
const realReadonlyBoundaryRequested = args["real-readonly-boundary"] === "true";
const executionModeRequested = realReadonlyBoundaryRequested && executeRequested;
const outDir = args["out-dir"] ?? DEFAULT_OUT_DIR;

const packet = readJson("data/evidence-intake/phase-1-bounded-readonly-attempt-packet.json");

if (packet.status !== "bounded_readonly_attempt_packet_ready_no_execution") problems.push("attempt_packet_not_ready");
if (packet.attemptId !== "phase1-data-online-readonly-20260615-a") problems.push("packet_attempt_id_mismatch");
if (attemptId !== "phase1-data-online-readonly-20260615-a") problems.push("attempt_id_mismatch");
if (scope !== "aggregate-readonly-daily-prices-level1-coverage") problems.push("scope_mismatch");
if (!aggregateOnly) problems.push("aggregate_only_flag_required");
if (!isSafeOutDir(outDir)) problems.push("out_dir_must_be_tmp");

const confirmationPresent = confirmation === REQUIRED_CONFIRMATION;
const safeAttemptId = safeFileStamp(attemptId ?? "missing");
const summaryName = executionModeRequested
  ? `phase-1-data-online-readonly-execution-${safeAttemptId}.json`
  : realReadonlyBoundaryRequested
  ? `phase-1-data-online-readonly-boundary-${safeAttemptId}.json`
  : `phase-1-data-online-readonly-stub-${safeAttemptId}.json`;
const summaryPath = normalizePath(path.join(outDir, summaryName));
const envPresence = Object.fromEntries(REQUIRED_ENV_NAMES.map((name) => [name, envPresent(name)]));
const missingEnvNames = REQUIRED_ENV_NAMES.filter((name) => !envPresence[name]);
const duplicateExecutionSummary = executionModeRequested && fs.existsSync(summaryPath);
const remoteProbe =
  executionModeRequested && problems.length === 0 && confirmationPresent && missingEnvNames.length === 0 && !duplicateExecutionSummary
    ? await runAggregateReadonlyProbe()
    : skippedAggregateProbe();

const { status, outcome } = decideStatus(remoteProbe);

const summary = {
  status,
  outcome,
  attemptId: attemptId ?? null,
  scope: scope ?? null,
  aggregateOnly,
  summaryPath,
  confirmationPresent,
  requiredConfirmation: REQUIRED_CONFIRMATION,
  boundaryMode: realReadonlyBoundaryRequested ? "real_readonly_boundary_dry_run" : "stub_fail_closed",
  requiredEnvNames: REQUIRED_ENV_NAMES,
  envPresence,
  missingEnvNames,
  aggregateProbe: remoteProbe.aggregateProbe,
  duplicateExecutionSummary,
  executionAuthorizedNow: false,
  readonlyAttemptExecutableNow: false,
  executeRequested,
  remoteAttempted: remoteProbe.remoteAttempted,
  remoteExecutionImplemented: realReadonlyBoundaryRequested,
  failClosed: true,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: remoteProbe.remoteAttempted,
    supabaseReadsEnabled: remoteProbe.remoteAttempted,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  stopLine:
    "No SQL, Supabase connection, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, raw payload output, source promotion, or scoreSource=real occurred.",
  problems
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
if (problems.length > 0) process.exit(1);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`${filePath}_not_valid_json`);
    return {};
  }
}

function normalizePath(value) {
  return String(value).replace(/\\/g, "/");
}

function isSafeOutDir(value) {
  const normalized = normalizePath(value);
  return normalized === "tmp" || normalized.startsWith("tmp/");
}

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}

function loadProcessEnvFromDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const key of REQUIRED_ENV_NAMES) {
    if (!process.env[key] && parsed[key]) process.env[key] = parsed[key];
  }
}

function parseDotEnv(text) {
  const parsed = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    parsed[trimmed.slice(0, separator).trim()] = normalizeDotEnvValue(trimmed.slice(separator + 1).trim());
  }
  return parsed;
}

function normalizeDotEnvValue(value) {
  const quote = value[0];
  if ((quote === "\"" || quote === "'") && value[value.length - 1] === quote) return value.slice(1, -1);
  return value;
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function decideStatus(probe) {
  if (problems.length > 0) {
    return {
      outcome: "blocked_invalid_input_no_remote_attempt",
      status: "phase_1_data_online_bounded_readonly_stub_blocked_invalid_input"
    };
  }
  if (!confirmationPresent) {
    return {
      outcome: "blocked_fail_closed_no_remote_attempt",
      status: "phase_1_data_online_bounded_readonly_stub_blocked_confirmation_required"
    };
  }
  if (realReadonlyBoundaryRequested && missingEnvNames.length > 0) {
    return {
      outcome: "blocked_missing_env_no_remote_attempt",
      status: "phase_1_data_online_bounded_readonly_boundary_blocked_missing_env"
    };
  }
  if (duplicateExecutionSummary) {
    return {
      outcome: "attempt_summary_already_exists_no_remote_attempt",
      status: "phase_1_data_online_bounded_readonly_blocked_duplicate_attempt_summary"
    };
  }
  if (executionModeRequested && probe.remoteAttempted && probe.aggregateProbe?.dailyPrices?.queryStatus === "ok") {
    return {
      outcome: "completed_aggregate_readonly_probe_no_write",
      status: "phase_1_data_online_bounded_readonly_completed_aggregate_probe"
    };
  }
  if (executionModeRequested && probe.remoteAttempted) {
    return {
      outcome: "blocked_aggregate_readonly_probe_no_write",
      status: "phase_1_data_online_bounded_readonly_blocked_aggregate_probe"
    };
  }
  if (realReadonlyBoundaryRequested) {
    return {
      outcome: "dry_run_real_readonly_boundary_ready_no_remote_attempt",
      status: "phase_1_data_online_bounded_readonly_boundary_dry_run_ready"
    };
  }
  if (executeRequested) {
    return {
      outcome: "blocked_execute_requested_no_remote_attempt",
      status: "phase_1_data_online_bounded_readonly_stub_blocked_execute_not_enabled"
    };
  }
  return {
    outcome: "dry_run_boundary_ready_no_remote_attempt",
    status: "phase_1_data_online_bounded_readonly_stub_dry_run_boundary_ready"
  };
}

async function runAggregateReadonlyProbe() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });

  const { count, error } = await supabase
    .from("daily_prices")
    .select("trade_date", { count: "exact", head: true });

  if (error) {
    return {
      aggregateProbe: {
        dailyPrices: {
          errorCategory: categorizeError(error),
          errorCode: sanitizeCode(error.code),
          queryStatus: "blocked",
          rowCount: null,
          table: "daily_prices"
        }
      },
      remoteAttempted: true
    };
  }

  return {
    aggregateProbe: {
      dailyPrices: {
        errorCategory: "none",
        errorCode: "none",
        queryStatus: "ok",
        rowCount: typeof count === "number" ? count : null,
        table: "daily_prices"
      }
    },
    remoteAttempted: true
  };
}

function skippedAggregateProbe() {
  return {
    aggregateProbe: {
      dailyPrices: {
        errorCategory: "not_run",
        errorCode: "not_run",
        queryStatus: "not_run",
        rowCount: null,
        table: "daily_prices"
      }
    },
    remoteAttempted: false
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
