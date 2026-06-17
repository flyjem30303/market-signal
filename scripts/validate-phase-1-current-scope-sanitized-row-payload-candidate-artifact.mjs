import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const artifactPath = args.candidateArtifact ?? process.env.PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH;
const problems = [];

if (!artifactPath) problems.push("candidate_artifact_path_missing");
const candidatePathPolicy = artifactPath ? classifyCandidatePath(artifactPath) : null;
if (candidatePathPolicy?.insideCommittedCandidateFolder) problems.push("candidate_artifact_path_must_stay_outside_data_candidates");
if (candidatePathPolicy?.insideRepository && !candidatePathPolicy.gitIgnored) problems.push("candidate_artifact_path_must_be_outside_git_or_ignored");

const artifact = artifactPath ? readJson(artifactPath) : {};
const rows = Array.isArray(artifact.rows) ? artifact.rows : [];
const symbols = new Set();
const tradeDates = [];
const symbolCounts = new Map();
const seenKeys = new Set();

let duplicateCount = 0;
let missingRequiredFieldCount = 0;
let forbiddenFieldCount = 0;
let invalidTradeDateCount = 0;
let invalidSourceMetadataCount = 0;
let invalidOptionalNumberCount = 0;
let invalidPriceCount = 0;
let etfSymbolCount = 0;
let listedStockSymbolCount = 0;
let twiiRowCount = 0;

const requiredTopLevel = [
  "artifactId",
  "createdAt",
  "scope",
  "phase1Universe",
  "sourceRightsStatus",
  "fieldContractStatus",
  "sanitizedRowPayloadIncluded",
  "rawPayloadIncluded",
  "stockIdPayloadIncluded",
  "secretsIncluded",
  "expectedRows",
  "rows"
];
const requiredRowFields = ["symbol", "trade_date", "close", "source_name", "source_updated_at", "source_row_hash"];
const allowedRowFields = new Set([...requiredRowFields, "open", "high", "low", "volume"]);
const deferredEtfSymbols = new Set(["0050", "006208"]);

for (const field of requiredTopLevel) {
  if (!(field in artifact)) problems.push(`missing_top_level_field:${field}`);
}

if (artifact.scope !== "twii_plus_listed_stock_daily_close") problems.push("scope_mismatch");
if (artifact.phase1Universe !== "twii_plus_listed_stock_daily_close") problems.push("phase1_universe_mismatch");
if (artifact.sanitizedRowPayloadIncluded !== true) problems.push("sanitized_row_payload_not_included");
if (artifact.rawPayloadIncluded !== false) problems.push("raw_payload_must_be_excluded");
if (artifact.stockIdPayloadIncluded !== false) problems.push("stock_id_payload_must_be_excluded");
if (artifact.secretsIncluded !== false) problems.push("secrets_must_be_excluded");
if (artifact.sourceRightsStatus !== "accepted") problems.push("source_rights_status_not_accepted");
if (artifact.fieldContractStatus !== "accepted") problems.push("field_contract_status_not_accepted");
if (!Number.isInteger(artifact.expectedRows) || artifact.expectedRows < 1) problems.push("expected_rows_must_be_positive_integer");
if (Number.isInteger(artifact.expectedRows) && rows.length !== artifact.expectedRows) problems.push("row_count_must_match_expected_rows");
if (typeof artifact.createdAt !== "string" || !isValidIsoTimestamp(artifact.createdAt)) problems.push("invalid_created_at");

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

  if (typeof row.symbol === "string") {
    symbols.add(row.symbol);
    symbolCounts.set(row.symbol, (symbolCounts.get(row.symbol) ?? 0) + 1);
    if (row.symbol === "TWII") twiiRowCount += 1;
    if (isListedStockSymbol(row.symbol)) listedStockSymbolCount += 1;
    if (deferredEtfSymbols.has(row.symbol) || /^00\d+/u.test(row.symbol)) etfSymbolCount += 1;
  }
  if (typeof row.trade_date === "string") tradeDates.push(row.trade_date);
  if (typeof row.symbol === "string" && typeof row.trade_date === "string") {
    const key = `${row.symbol}|${row.trade_date}`;
    if (seenKeys.has(key)) duplicateCount += 1;
    seenKeys.add(key);
  }

  if (typeof row.symbol !== "string" || (!isListedStockSymbol(row.symbol) && row.symbol !== "TWII")) problems.push("unexpected_symbol");
  if (typeof row.trade_date !== "string" || !isValidIsoDate(row.trade_date)) invalidTradeDateCount += 1;
  if (typeof row.close !== "number" || !Number.isFinite(row.close) || row.close < 0) invalidPriceCount += 1;
  if (!isNonEmptyString(row.source_name)) invalidSourceMetadataCount += 1;
  if (!isNonEmptyString(row.source_row_hash)) invalidSourceMetadataCount += 1;
  if (typeof row.source_updated_at !== "string" || !isValidIsoTimestamp(row.source_updated_at)) invalidSourceMetadataCount += 1;
  for (const optionalNumberField of ["open", "high", "low", "volume"]) {
    if (optionalNumberField in row && !isFiniteNonNegativeNumber(row[optionalNumberField])) invalidOptionalNumberCount += 1;
  }
}

if (missingRequiredFieldCount > 0) problems.push("missing_required_row_fields");
if (forbiddenFieldCount > 0) problems.push("forbidden_row_fields_present");
if (duplicateCount > 0) problems.push("duplicate_symbol_trade_date_rows");
if (invalidTradeDateCount > 0) problems.push("invalid_trade_date");
if (invalidPriceCount > 0) problems.push("invalid_close");
if (invalidSourceMetadataCount > 0) problems.push("invalid_source_metadata");
if (invalidOptionalNumberCount > 0) problems.push("invalid_optional_number_fields");
if (etfSymbolCount > 0) problems.push("deferred_etf_symbol_present");
if (twiiRowCount < 1) problems.push("twii_rows_missing");
if (listedStockSymbolCount < 1) problems.push("listed_stock_rows_missing");

const sortedDates = tradeDates.slice().sort();
const accepted = problems.length === 0;

console.log(JSON.stringify({
  status: accepted
    ? "phase_1_current_scope_sanitized_row_payload_candidate_artifact_validated_aggregate_only"
    : "phase_1_current_scope_sanitized_row_payload_candidate_artifact_blocked",
  validatorMode: "current_scope_aggregate_only_no_row_output",
  artifactPathProvided: Boolean(artifactPath),
  candidatePathPolicy,
  rowCount: rows.length,
  expectedRows: artifact.expectedRows ?? null,
  symbolsCoveredCount: symbols.size,
  symbolsCoveredPreview: [...symbols].sort().slice(0, 12),
  symbolCountsPreview: Object.fromEntries([...symbolCounts.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(0, 12)),
  dateBounds: {
    minTradeDate: sortedDates[0] ?? null,
    maxTradeDate: sortedDates[sortedDates.length - 1] ?? null
  },
  duplicateCount,
  missingRequiredFieldCount,
  forbiddenFieldCount,
  invalidTradeDateCount,
  invalidSourceMetadataCount,
  invalidOptionalNumberCount,
  invalidPriceCount,
  etfSymbolCount,
  listedStockSymbolCount,
  twiiRowCount,
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
}, null, 2));

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

function classifyCandidatePath(filePath) {
  const resolved = path.resolve(filePath);
  const repositoryRoot = path.resolve(".");
  const committedCandidateFolder = path.resolve("data/candidates");
  const relativeToCandidateFolder = path.relative(committedCandidateFolder, resolved);
  const relativeToRepository = path.relative(repositoryRoot, resolved);
  const insideRepository =
    relativeToRepository === "" ||
    (!relativeToRepository.startsWith("..") && !path.isAbsolute(relativeToRepository));
  return {
    insideCommittedCandidateFolder:
      relativeToCandidateFolder !== "" &&
      !relativeToCandidateFolder.startsWith("..") &&
      !path.isAbsolute(relativeToCandidateFolder),
    insideRepository,
    gitIgnored: insideRepository ? isGitIgnored(relativeToRepository) : null,
    allowedStoragePolicy: "local_or_external_path_outside_git_or_gitignored"
  };
}

function isGitIgnored(relativePath) {
  const run = spawnSync("git", ["check-ignore", "--quiet", "--", relativePath], {
    cwd: process.cwd(),
    shell: false,
    windowsHide: true
  });
  return run.status === 0;
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isValidIsoTimestamp(value) {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isListedStockSymbol(symbol) {
  return /^[1-9]\d{3}$/u.test(symbol);
}
