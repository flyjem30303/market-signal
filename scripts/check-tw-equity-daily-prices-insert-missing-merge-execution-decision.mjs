import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_EXECUTION_DECISION.md";
const runnerDocPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_RUNNER_IMPLEMENTATION.md";
const authPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_SKIP_EXISTING_MERGE_AUTHORIZATION_PACKET.md";
const runnerPath = "scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const runnerDoc = read(runnerDocPath);
const auth = read(authPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "Status: `tw_equity_daily_prices_insert_missing_merge_execution_decision_ready_for_one_attempt`",
  "CEO authorizes PM to execute exactly one bounded production `daily_prices` merge",
  "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
  "AUTH-003",
  "data/candidates/tw-equity-staging-candidate.json",
  "insert_missing_skip_existing_no_overwrite",
  "scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs",
  "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md",
  "expected inserted rows: `177`",
  "expected existing exact-match skipped rows: `3`",
  "expected final target rows after write: `180`",
  "--confirm-bounded-daily-prices-merge --execute",
  "one insert-only `daily_prices` mutation attempt",
  "SQL execution",
  "`daily_prices` update/upsert/delete",
  "running the command more than once",
  "publicDataSource=supabase",
  "scoreSource=real",
  "Row coverage points remain blocked"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrases] of [
  [
    runnerDocPath,
    runnerDoc,
    [
      "Status: `tw_equity_daily_prices_insert_missing_merge_runner_implemented_not_executed`",
      "real Supabase execution remains blocked until a separate execution decision is accepted",
      "Expected insert rows: `177`",
      "Expected skip rows: `3`",
      "Expected final target rows: `180`"
    ]
  ],
  [
    authPath,
    auth,
    [
      "expected inserted rows: `177`",
      "expected skipped existing rows: `3`",
      "expected final target rows for the accepted 3-symbol x 60-session scope: `180`",
      "Never update, overwrite, upsert, or delete production rows in this policy"
    ]
  ]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
  }
}

for (const phrase of [
  "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
  "executeBoundedInsertMissingMerge",
  ".from(\"daily_prices\").insert",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "stockIdsPrinted: false",
  "serviceRoleKeyPrinted: false"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-daily-prices-insert-missing-merge-execution-decision"] !==
  "node scripts/check-tw-equity-daily-prices-insert-missing-merge-execution-decision.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-daily-prices-insert-missing-merge-execution-decision`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-daily-prices-insert-missing-merge-execution-decision.mjs")) {
    problems.push(`${pathName} missing execution decision checker command`);
  }
  if (!text.includes("tw-equity-daily-prices-insert-missing-merge-execution-decision")) {
    problems.push(`${pathName} missing execution decision checker name`);
  }
}

for (const phrase of [
  "Latest TW equity daily_prices insert-missing merge execution decision slice",
  "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_EXECUTION_DECISION.md",
  "scripts/check-tw-equity-daily-prices-insert-missing-merge-execution-decision.mjs",
  "tw_equity_daily_prices_insert_missing_merge_execution_decision_ready_for_one_attempt"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

const noExecute = spawnSync(
  process.execPath,
  [
    runnerPath,
    "--authorization-id",
    "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
    "--staging-scope",
    "AUTH-003",
    "--policy-id",
    "insert_missing_skip_existing_no_overwrite",
    "--candidate-input",
    "data/candidates/tw-equity-staging-candidate.json",
    "--post-run-review",
    "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md",
    "--confirm-bounded-daily-prices-merge"
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE"
    },
    shell: false
  }
);

if (noExecute.status !== 0) {
  problems.push(`execution decision preflight command must pass without execution: ${noExecute.stdout || noExecute.stderr}`);
} else {
  const parsed = parseJson(noExecute.stdout);
  if (parsed.status !== "ready_for_manual_execution_gate_not_executed") problems.push("preflight status mismatch");
  if (parsed.localPreflightReady !== true) problems.push("preflight must be locally ready");
  if (parsed.connectionAttempted !== false) problems.push("preflight must not connect");
  if (parsed.writeAttempted !== false || parsed.mutations !== false) problems.push("preflight must not write");
  if (parsed.candidateInputAccepted !== true) problems.push("preflight candidate must be accepted");
  if (parsed.publicDataSource !== "mock" || parsed.scoreSource !== "mock") problems.push("preflight must preserve mock public/scoring state");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("preflight output is not valid JSON");
    return {};
  }
}
