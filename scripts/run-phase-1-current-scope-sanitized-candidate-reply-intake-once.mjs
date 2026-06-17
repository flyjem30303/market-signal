import fs from "node:fs";

const replyPath = getArg("--reply");
const problems = [];

if (!replyPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_sanitized_candidate_reply_intake_blocked_missing_reply",
    replyAcceptedNow: false,
    candidateArtifactPathAcceptedNow: false,
    candidateArtifactReadNow: false,
    candidateRowsAcceptedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_current_scope_sanitized_candidate_reply_json",
    problems: ["--reply is required"]
  });
  process.exit(1);
}

const reply = parseJson(read(replyPath), replyPath);
const result = validateFutureReply(reply);
const accepted = problems.length === 0 && result.problems.length === 0;

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_sanitized_candidate_reply_intake_accepted_no_row_payloads"
    : "phase_1_current_scope_sanitized_candidate_reply_intake_rejected_no_row_payloads",
  replyPath,
  replyAcceptedNow: accepted,
  candidateArtifactPathAcceptedNow: accepted,
  candidateArtifactPath: accepted ? reply.candidateArtifactPath : null,
  candidateArtifactReadNow: false,
  candidateRowsAcceptedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: accepted
    ? "current_scope_sanitized_candidate_artifact_path_shape_ready_no_row_payloads"
    : "keep_mock_and_request_repair",
  problems: problems.concat(result.problems)
});

if (!accepted) process.exit(1);

function validateFutureReply(reply) {
  const localProblems = [];
  for (const field of [
    "candidateArtifactPath",
    "artifactId",
    "phase1Universe",
    "scope",
    "sourceLane",
    "coverageWindowSessions",
    "aggregateRowCount",
    "symbolsCoveredCount",
    "dateBounds",
    "duplicateCount",
    "rejectedCount",
    "missingRequiredFieldCount",
    "forbiddenFieldCount",
    "sanitizedAggregateOnly",
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded",
    "safetyFlags"
  ]) {
    if (!(field in reply)) localProblems.push(`${field} is required`);
  }
  if (reply.phase1Universe !== "twii_plus_listed_stock_daily_close") {
    localProblems.push("phase1Universe must be twii_plus_listed_stock_daily_close");
  }
  if (reply.scope !== "twii_plus_listed_stock_daily_close") {
    localProblems.push("scope must be twii_plus_listed_stock_daily_close");
  }
  for (const [field, expected] of Object.entries({
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false
  })) {
    if (reply[field] !== expected) localProblems.push(`${field} must be ${expected}`);
  }
  if (reply.safetyFlags?.publicDataSource !== "mock") localProblems.push("publicDataSource must remain mock");
  if (reply.safetyFlags?.scoreSource !== "mock") localProblems.push("scoreSource must remain mock");
  for (const [field, expected] of Object.entries({
    candidateArtifactReadNow: false,
    candidateRowsAcceptedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false
  })) {
    if (reply.safetyFlags?.[field] !== expected) localProblems.push(`${field} must be ${expected}`);
  }
  if (containsDeferredSymbols(reply)) localProblems.push("deferred ETF symbols must not be part of current-scope reply");
  if (containsForbiddenPayloadKeys(reply)) localProblems.push("reply must not include row/raw/stock-id payload fields");
  return { problems: localProblems };
}

function containsDeferredSymbols(value) {
  if (typeof value === "string") return /\b(0050|006208)\b/u.test(value);
  if (Array.isArray(value)) return value.some(containsDeferredSymbols);
  if (value && typeof value === "object") return Object.values(value).some(containsDeferredSymbols);
  return false;
}

function containsForbiddenPayloadKeys(value) {
  if (!value || typeof value !== "object") return false;
  for (const key of Object.keys(value)) {
    if (/^(rows|raw|payload|rawPayload|rowPayload|stockIds|stockIdPayload|secrets|secret)$/iu.test(key)) return true;
  }
  return Object.values(value).some(containsForbiddenPayloadKeys);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read reply JSON: ${error.message}`);
    return "{}";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
