import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));
const artifactPath =
  args.candidateArtifact ??
  process.env.PHASE_1_TWII_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH;
const problems = [];

if (!artifactPath) problems.push("candidate_artifact_path_missing");

const artifact = artifactPath ? readJson(artifactPath) : {};
const rows = Array.isArray(artifact.rows) ? artifact.rows : [];
const tradeDates = [];
let missingRequiredFieldCount = 0;
let forbiddenFieldCount = 0;
let duplicateCount = 0;
let invalidTradeDateCount = 0;
const seenKeys = new Set();

const requiredTopLevel = [
  "artifactId",
  "createdAt",
  "scope",
  "sanitizedRowPayloadIncluded",
  "rawPayloadIncluded",
  "stockIdPayloadIncluded",
  "secretsIncluded",
  "expectedRows",
  "rows"
];
const requiredRowFields = [
  "symbol",
  "trade_date",
  "close",
  "source_name",
  "source_updated_at",
  "source_row_hash"
];
const allowedRowFields = new Set([...requiredRowFields, "open", "high", "low", "volume"]);

for (const field of requiredTopLevel) {
  if (!(field in artifact)) problems.push(`missing_top_level_field:${field}`);
}

if (artifact.scope !== "twii_index_daily_prices_missing_rows") problems.push("scope_mismatch");
if (artifact.symbol !== undefined && artifact.symbol !== "TWII") problems.push("symbol_must_be_TWII");
if (artifact.lane !== undefined && artifact.lane !== "TWII") problems.push("lane_must_be_TWII");
if (artifact.sanitizedRowPayloadIncluded !== true) problems.push("sanitized_row_payload_not_included");
if (artifact.rawPayloadIncluded !== false) problems.push("raw_payload_must_be_excluded");
if (artifact.stockIdPayloadIncluded !== false) problems.push("stock_id_payload_must_be_excluded");
if (artifact.secretsIncluded !== false) problems.push("secrets_must_be_excluded");
if (artifact.expectedRows !== 60) problems.push("expected_rows_must_be_60");
if (rows.length !== 60) problems.push("row_count_must_be_60");

if (!("sourceRightsStatus" in artifact) && !("sourceRightsGateStatus" in artifact)) {
  problems.push("source_rights_status_missing");
}
if (!("fieldContractStatus" in artifact) && !("fieldContractVersion" in artifact)) {
  problems.push("field_contract_status_missing");
}

for (const row of rows) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    missingRequiredFieldCount += 1;
    continue;
  }
  for (const field of requiredRowFields) {
    if (!(field in row)) missingRequiredFieldCount += 1;
  }
  for (const field of Object.keys(row)) {
    if (!allowedRowFields.has(field)) forbiddenFieldCount += 1;
  }
  if (row.symbol !== "TWII") problems.push("unexpected_symbol");
  if (typeof row.trade_date === "string" && isValidIsoDate(row.trade_date)) {
    tradeDates.push(row.trade_date);
  } else {
    invalidTradeDateCount += 1;
  }
  if (typeof row.symbol === "string" && typeof row.trade_date === "string") {
    const key = `${row.symbol}|${row.trade_date}`;
    if (seenKeys.has(key)) duplicateCount += 1;
    seenKeys.add(key);
  }
  if (typeof row.close !== "number" || !Number.isFinite(row.close)) problems.push("invalid_close");
}

if (missingRequiredFieldCount > 0) problems.push("missing_required_row_fields");
if (forbiddenFieldCount > 0) problems.push("forbidden_row_fields_present");
if (duplicateCount > 0) problems.push("duplicate_symbol_trade_date_rows");
if (invalidTradeDateCount > 0) problems.push("invalid_trade_date");

const sortedDates = tradeDates.slice().sort();
const accepted =
  problems.length === 0 &&
  rows.length === 60 &&
  seenKeys.size === 60;

const output = {
  status: accepted
    ? "phase_1_twii_sanitized_row_payload_candidate_artifact_validated_summary_only"
    : "phase_1_twii_sanitized_row_payload_candidate_artifact_blocked",
  validatorMode: "summary_only_no_row_output",
  artifactPathProvided: Boolean(artifactPath),
  rowCount: rows.length,
  expectedRows: artifact.expectedRows ?? null,
  symbolsCovered: rows.some((row) => row?.symbol === "TWII") ? ["TWII"] : [],
  dateBounds: {
    minTradeDate: sortedDates[0] ?? null,
    maxTradeDate: sortedDates[sortedDates.length - 1] ?? null
  },
  duplicateCount,
  missingRequiredFieldCount,
  forbiddenFieldCount,
  invalidTradeDateCount,
  accepted,
  problems,
  safety: {
    rowPayloadOutput: false,
    rawPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  }
};

console.log(JSON.stringify(output, null, 2));
process.exitCode = 0;

function parseArgs(tokens) {
  const parsed = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`candidate_artifact_unreadable:${error.message}`);
    return {};
  }
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === value;
}
