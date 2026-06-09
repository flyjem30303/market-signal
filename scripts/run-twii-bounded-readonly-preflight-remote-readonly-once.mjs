import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ATTEMPT_ID = "twii-bounded-readonly-preflight-20260609-a";
const AUTHORIZATION_PHRASE = "CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A";
const CANDIDATE_PATH = "data/candidates/twii-sanitized-candidate.json";
const CONFIRMATION = "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE";
const DEFAULT_OUT_DIR = "tmp/twii-bounded-readonly-preflight-20260609-a";
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const MODE = "aggregate-only-readonly";

const args = parseArgs(process.argv.slice(2));
const problems = [];

loadProcessEnvFromDotEnvLocal();

const attemptId = args["attempt-id"];
const authorizationPhrase = args["authorization-phrase"];
const candidateArtifactPath = normalizePath(args["candidate-artifact-path"] ?? "");
const confirmation = args.confirm;
const executeReadonly = args["execute-readonly"] === "true";
const mode = args.mode;
const outDir = normalizePath(args["out-dir"] ?? DEFAULT_OUT_DIR);
const summaryPath = path.join(outDir, `twii-bounded-readonly-preflight-remote-readonly-${ATTEMPT_ID}.json`);

if (attemptId !== ATTEMPT_ID) problems.push("attempt_id_mismatch");
if (authorizationPhrase !== AUTHORIZATION_PHRASE) problems.push("authorization_phrase_mismatch");
if (candidateArtifactPath !== CANDIDATE_PATH) problems.push("candidate_artifact_path_mismatch");
if (confirmation !== CONFIRMATION) problems.push("confirmation_token_mismatch");
if (mode !== MODE) problems.push("mode_must_be_aggregate_only_readonly");
if (!executeReadonly) problems.push("execute_readonly_flag_required");
if (!isSafeOutDir(outDir)) problems.push("out_dir_must_be_local_tmp");

const candidateHandoff = candidateArtifactPath === CANDIDATE_PATH
  ? runJson([
      "scripts/report-twii-sanitized-candidate-artifact-chain-handoff.mjs",
      "--candidate-artifact-path",
      candidateArtifactPath
    ])
  : {};
if (candidateHandoff.status !== "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet") {
  problems.push("candidate_artifact_handoff_not_ready");
}

const packet = runJson(["scripts/report-twii-bounded-readonly-preflight-single-attempt-execution-packet.mjs"]);
if (packet.status !== "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed") {
  problems.push("single_attempt_packet_not_ready");
}

const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
if (!credentialPresence.nextPublicSupabaseUrl) problems.push("missing_next_public_supabase_url");
if (!credentialPresence.serviceRoleKey) problems.push("missing_service_role_key");

const preflightBlocked = problems.length > 0;
const remoteResult = preflightBlocked ? skippedRemoteResult() : await runReadonlyProbe();
const status = preflightBlocked
  ? "twii_bounded_readonly_preflight_remote_readonly_blocked_preflight"
  : remoteResult.status;
const outcome = preflightBlocked
  ? "blocked_no_remote_attempt"
  : remoteResult.outcome;

const summary = {
  status,
  outcome,
  attemptId,
  authorizationPhrase: authorizationPhrase === AUTHORIZATION_PHRASE ? "present" : "missing_or_invalid",
  candidateArtifactPath,
  candidateArtifactStatus: candidateHandoff.status ?? null,
  credentialPresence,
  mode,
  packetStatus: packet.status ?? null,
  probes: remoteResult.probes,
  readonlyAttempted: remoteResult.readonlyAttempted,
  summaryPath: normalizePath(summaryPath),
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: remoteResult.connectionAttempted,
    supabaseReadAttempted: remoteResult.readonlyAttempted,
    supabaseWriteAttempted: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  outputPolicy: {
    aggregateStatusOnly: true,
    rowPayloadIncluded: false,
    rawPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    supabaseUrlPrinted: false
  },
  stopLine:
    "No SQL, Supabase write, market-data fetch, ingestion, daily_prices mutation, staging rows, candidate row acceptance, row coverage scoring, raw/row/stock-id payload output, secret output, public source promotion, or scoreSource=real occurred.",
  problems
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
if (problems.length > 0) process.exit(1);

async function runReadonlyProbe() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });

  const probes = [];
  probes.push(await probeHeadCount(supabase, "stocks", "id"));
  probes.push(await probeHeadCount(supabase, "daily_prices", "trade_date"));
  const blocked = probes.some((probe) => probe.reachable !== "ok");

  return {
    connectionAttempted: true,
    outcome: blocked ? "remote_readonly_sanitized_probe_blocked" : "remote_readonly_sanitized_probe_completed",
    probes,
    readonlyAttempted: true,
    status: blocked
      ? "twii_bounded_readonly_preflight_remote_readonly_blocked_sanitized_probe"
      : "twii_bounded_readonly_preflight_remote_readonly_completed_sanitized_probe"
  };
}

async function probeHeadCount(supabase, table, projection) {
  const { count, error } = await supabase.from(table).select(projection, { count: "exact", head: true }).limit(1);
  if (error) {
    return {
      count: null,
      countStatus: "blocked",
      errorCategory: categorizeError(error),
      errorCode: sanitizeCode(error.code),
      reachable: "blocked",
      table
    };
  }

  return {
    count: typeof count === "number" ? count : null,
    countStatus: typeof count === "number" ? "ok" : "count_unavailable",
    errorCategory: "none",
    errorCode: "none",
    reachable: "ok",
    table
  };
}

function skippedRemoteResult() {
  return {
    connectionAttempted: false,
    outcome: "blocked_no_remote_attempt",
    probes: [
      skippedProbe("stocks"),
      skippedProbe("daily_prices")
    ],
    readonlyAttempted: false,
    status: "twii_bounded_readonly_preflight_remote_readonly_blocked_preflight"
  };
}

function skippedProbe(table) {
  return {
    count: null,
    countStatus: "not_run",
    errorCategory: "not_run",
    errorCode: "not_run",
    reachable: "not_run",
    table
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

function loadProcessEnvFromDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const key of DOTENV_LOCAL_ALLOWED_KEYS) {
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

function runJson(commandArgs) {
  const run = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${commandArgs[0]}_stdout_not_json`);
    return {};
  }
}

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

function normalizePath(value) {
  return String(value).replace(/\\/g, "/");
}

function isSafeOutDir(value) {
  return value === "tmp" || value.startsWith("tmp/");
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function sanitizeCode(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "unknown";
}
