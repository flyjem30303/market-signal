import fs from "node:fs";
import path from "node:path";

const EXPECTED = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  confirmation: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: "2330,2382,2308",
  target: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

loadProcessEnvFromDotEnvLocal();
const args = parseArgs(process.argv.slice(2));
const problems = [];

if (args.authorizationId !== EXPECTED.authorizationId) problems.push("authorization_id_mismatch");
if (args.lane !== EXPECTED.lane) problems.push("lane_mismatch");
if (args.symbols !== EXPECTED.symbols) problems.push("symbols_mismatch");
if (Number(args.sessions) !== EXPECTED.sessions) problems.push("sessions_mismatch");
if (args.target !== EXPECTED.target) problems.push("target_relation_mismatch");
if (Number(args.maxRows) !== EXPECTED.maxRows) problems.push("max_rows_mismatch");
if (args.postRunReview !== EXPECTED.postRunReview) problems.push("post_run_review_mismatch");

const executionRequested = args.execute === "true" || args.execute === true;
const confirmationPresent = process.env.TW_EQUITY_STAGING_WRITE_CONFIRMATION === EXPECTED.confirmation;
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const rollbackDryRunAvailable = args.rollbackDryRun === "true" || args.rollbackDryRun === true;
const localPreflightProblems = [];

if (executionRequested) {
  if (!confirmationPresent) localPreflightProblems.push("missing_write_confirmation");
  if (!credentialPresence.nextPublicSupabaseUrl) localPreflightProblems.push("missing_next_public_supabase_url");
  if (!credentialPresence.serviceRoleKey) localPreflightProblems.push("missing_service_role_key");
  if (!rollbackDryRunAvailable) localPreflightProblems.push("missing_rollback_dry_run_posture");
}

if (executionRequested) {
  problems.push(...localPreflightProblems);
  problems.push("runner_skeleton_has_no_supabase_write_implementation");
}

const status = problems.length === 0 ? "ready_for_manual_execution_gate_not_executed" : "blocked";

console.log(
  JSON.stringify(
    {
      authorizationId: args.authorizationId ?? "missing",
      canAwardRowCoveragePoints: false,
      canClaimRealDataLive: false,
      canPromotePublicSource: false,
      canSetScoreSourceReal: false,
      connectionAttempted: false,
      confirmationPresent,
      credentialPresence,
      exactCommandMatched: problems.length === 0,
      executionAttempted: false,
      executionRequested,
      filesWritten: false,
      lane: args.lane ?? "missing",
      marketDataFetched: false,
      marketDataIngested: false,
      maxRows: Number(args.maxRows) || 0,
      mode: "tw_equity_staging_write_fail_closed_runner_skeleton",
      mutations: false,
      postRunReview: args.postRunReview ?? "missing",
      problems,
      publicDataSource: "mock",
      publicRedistributionBlocked: true,
      rollbackDryRunAvailable,
      rowPayloadsPrinted: false,
      scoreSource: "mock",
      secretsPrinted: false,
      serviceRoleKeyPrinted: false,
      sourcePayloadsPrinted: false,
      sqlExecuted: false,
      status,
      symbols: args.symbols ? args.symbols.split(",") : [],
      targetRelation: args.target ?? "missing",
      writeImplementationReady: false
    },
    null,
    2
  )
);

process.exitCode = problems.length === 0 ? 0 : 1;

function parseArgs(tokens) {
  const parsed = {};

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;

    const key = toCamelCase(token.slice(2));
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
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
    const value = trimmed.slice(separator + 1).trim();
    parsed[key] = normalizeDotEnvValue(value);
  }
  return parsed;
}

function normalizeDotEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if ((quote === "\"" || quote === "'") && trimmed[trimmed.length - 1] === quote) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
