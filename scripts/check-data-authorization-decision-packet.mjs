import fs from "node:fs";

const docPath = "docs/DATA_AUTHORIZATION_DECISION_PACKET.md";
const entryGatePath = "docs/DATA_AUTHORIZATION_ENTRY_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";

const problems = [];
const blocked = [];

const doc = read(docPath);
const entryGate = read(entryGatePath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);

for (const phrase of [
  "Data Authorization Decision Packet",
  "ready_for_chairman_or_ceo_review_not_executed",
  "docs/DATA_AUTHORIZATION_ENTRY_GATE.md",
  "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION='CP3_ROW_COVERAGE_READONLY_VALIDATE'; node scripts/run-row-coverage-readonly-once.mjs",
  "Command drift stops execution",
  "exactly one",
  "readonly only",
  "sanitized aggregate JSON only",
  "`TWII`",
  "`0050`",
  "`006208`",
  "`2330`",
  "`2382`",
  "`2308`",
  "no row payloads",
  "no `stock_id` values",
  "scripts/check-data-authorization-entry-gate.mjs",
  "scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs",
  "scripts/check-row-coverage-second-attempt-final-local-preflight.mjs",
  "scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs",
  "scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs",
  "scripts/check-review-gates.mjs",
  "Required Post-Run Review",
  "remoteAttempted",
  "connectionAttempted",
  "coverageStatus",
  "observedTotalRows",
  "expectedTotalRows",
  "missingRows",
  "symbolsChecked count only",
  "sqlExecuted false",
  "mutations false",
  "filesWritten false",
  "secretsPrinted false",
  "rowPayloadsPrinted false",
  "publicDataSource remains mock",
  "scoreSource remains mock",
  "no retry was executed",
  "no promotion by itself"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath}: missing ${phrase}`);
}

for (const phrase of [
  "entry_ready_local_only",
  "one bounded readonly attempt",
  "exact command",
  "immediate post-run review",
  "no promotion by itself"
]) {
  if (!entryGate.includes(phrase)) problems.push(`${entryGatePath}: missing prerequisite ${phrase}`);
}

for (const phrase of [
  "Latest data authorization decision packet slice",
  "docs/DATA_AUTHORIZATION_DECISION_PACKET.md",
  "ready_for_chairman_or_ceo_review_not_executed",
  "exact command",
  "same-slice post-run review",
  "execution decision remains pending"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath}: missing ${phrase}`);
}

if (packageJson.scripts?.["check:data-authorization-decision-packet"] !== "node scripts/check-data-authorization-decision-packet.mjs") {
  problems.push(`${packagePath}: missing check:data-authorization-decision-packet script`);
}

if (!reviewGate.includes("scripts/check-data-authorization-decision-packet.mjs")) {
  problems.push(`${reviewGatePath}: missing checker registration`);
}

if (!reviewGate.includes('"data-authorization-decision-packet"')) {
  problems.push(`${reviewGatePath}: missing core review gate name`);
}

if (!fullHealth.includes("scripts/check-data-authorization-decision-packet.mjs")) {
  problems.push(`${fullHealthPath}: missing checker registration`);
}

for (const pattern of [
  /RUN_REMOTE_NOW/,
  /EXECUTION_COMPLETED/,
  /SQL execution is approved/i,
  /Supabase writes are approved/i,
  /market ingestion is approved/i,
  /scoreSource=real approved/i,
  /ROW_COVERAGE_POINTS_AWARDED/,
  /SUPABASE_SERVICE_ROLE_KEY=.+/i,
  /sb_secret_/i,
  /sb_publishable_/i,
  /raw payload:/i,
  /publicDataSource=supabase is approved/i,
  /scoreSource=real is approved/i
]) {
  if (pattern.test(doc)) blocked.push(`${docPath}: forbidden pattern ${String(pattern)}`);
}

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate)) {
  blocked.push(`${reviewGatePath}: review gate must not execute the row coverage runner`);
}

console.log(JSON.stringify({ blocked, problems, status: blocked.length === 0 && problems.length === 0 ? "ok" : "blocked" }, null, 2));

if (blocked.length > 0 || problems.length > 0) {
  process.exitCode = 1;
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "{}";
  }

  return fs.readFileSync(path, "utf8");
}
