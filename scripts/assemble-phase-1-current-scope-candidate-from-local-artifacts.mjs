import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const twiiInputPath = args.twiiInput ?? process.env.PHASE_1_CURRENT_SCOPE_TWII_ROW_INPUT_PATH;
const listedStockInputPath = args.listedStockInput ?? process.env.PHASE_1_CURRENT_SCOPE_LISTED_STOCK_INPUT_PATH;
const outputPath = args.output ?? process.env.PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH;
const sourceRightsStatus = args.sourceRightsStatus ?? process.env.PHASE_1_CURRENT_SCOPE_SOURCE_RIGHTS_STATUS;
const fieldContractStatus = args.fieldContractStatus ?? process.env.PHASE_1_CURRENT_SCOPE_FIELD_CONTRACT_STATUS;
const problems = [];

if (!twiiInputPath) problems.push("--twii-input or PHASE_1_CURRENT_SCOPE_TWII_ROW_INPUT_PATH is required");
if (!listedStockInputPath) problems.push("--listed-stock-input or PHASE_1_CURRENT_SCOPE_LISTED_STOCK_INPUT_PATH is required");
if (!outputPath) problems.push("--output or PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH is required");
if (sourceRightsStatus !== "accepted") problems.push("source_rights_status_must_be_accepted");
if (fieldContractStatus !== "accepted") problems.push("field_contract_status_must_be_accepted");

const outputPolicy = outputPath ? classifyOutputPath(outputPath) : null;
if (outputPolicy?.insideCommittedCandidateFolder) problems.push("output_must_not_be_under_data_candidates");
if (outputPolicy?.insideRepository && !outputPolicy.gitIgnored) problems.push("output_must_be_outside_git_or_gitignored");

const twiiInput = twiiInputPath ? readJson(twiiInputPath, "twii input") : {};
const listedStockInput = listedStockInputPath ? readJson(listedStockInputPath, "listed stock input") : {};

const twiiRows = extractTwiiRows(twiiInput);
const listedStockRows = extractListedStockRows(listedStockInput);
const rows = dedupeRows([...twiiRows, ...listedStockRows]);
const symbols = new Set(rows.map((row) => row.symbol));

if (twiiRows.length < 1) problems.push("twii_rows_missing");
if (listedStockRows.length < 1) problems.push("listed_stock_rows_missing");
if (rows.length !== twiiRows.length + listedStockRows.length) problems.push("duplicate_rows_removed");
if (rows.some((row) => /^00\d+/u.test(row.symbol))) problems.push("deferred_etf_symbol_present");

const accepted = problems.length === 0;
const artifact = accepted
  ? {
      artifactId: `phase-1-current-scope-assembled-local-${new Date().toISOString().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
      scope: "twii_plus_listed_stock_daily_close",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      sourceRightsStatus,
      fieldContractStatus,
      sanitizedRowPayloadIncluded: true,
      rawPayloadIncluded: false,
      stockIdPayloadIncluded: false,
      secretsIncluded: false,
      expectedRows: rows.length,
      rows
    }
  : null;

if (accepted) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
}

emit({
  status: accepted
    ? "phase_1_current_scope_local_candidate_assembly_ready"
    : "phase_1_current_scope_local_candidate_assembly_blocked",
  assemblerMode: "current_scope_twii_plus_listed_stock_from_local_artifacts",
  outputWritten: accepted,
  outputPath: accepted ? outputPath : null,
  sourceRightsStatusAccepted: sourceRightsStatus === "accepted",
  fieldContractStatusAccepted: fieldContractStatus === "accepted",
  twiiRowCount: twiiRows.length,
  listedStockRowCount: listedStockRows.length,
  assembledRowCount: rows.length,
  symbolsCoveredCount: symbols.size,
  symbolsCoveredPreview: [...symbols].sort().slice(0, 12),
  outputPolicy,
  problems,
  safety: {
    marketDataFetched: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  }
});

if (!accepted) process.exit(1);

function extractTwiiRows(input) {
  const rows = Array.isArray(input.rows) ? input.rows : [];
  return rows.filter((row) => row?.symbol === "TWII").map(normalizeExistingRow).filter(Boolean);
}

function extractListedStockRows(input) {
  const priceRows = Array.isArray(input.candidatePrices) ? input.candidatePrices : [];
  if (priceRows.length > 0) {
    return priceRows.map((row) => normalizeListedStockPrice(row, input)).filter(Boolean);
  }
  const rows = Array.isArray(input.rows) ? input.rows : [];
  return rows
    .filter((row) => isListedStockSymbol(row?.symbol))
    .map(normalizeExistingRow)
    .filter(Boolean);
}

function normalizeExistingRow(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  if (row.symbol !== "TWII" && !isListedStockSymbol(row.symbol)) return null;
  if (!isValidIsoDate(row.trade_date)) return null;
  const close = toFiniteNumber(row.close);
  if (close === null) return null;
  if (!isValidIsoTimestamp(row.source_updated_at)) return null;
  if (!isNonEmptyString(row.source_name) || !isNonEmptyString(row.source_row_hash)) return null;

  const normalized = {
    symbol: row.symbol,
    trade_date: row.trade_date,
    close,
    source_name: row.source_name,
    source_updated_at: row.source_updated_at,
    source_row_hash: row.source_row_hash
  };
  for (const field of ["open", "high", "low", "volume"]) {
    const value = toFiniteNumber(row[field]);
    if (value !== null) normalized[field] = value;
  }
  return normalized;
}

function normalizeListedStockPrice(price, input) {
  if (!price || typeof price !== "object" || Array.isArray(price)) return null;
  const symbol = String(price.symbol ?? "");
  if (!isListedStockSymbol(symbol)) return null;
  const tradeDate = String(price.trade_date ?? "");
  if (!isValidIsoDate(tradeDate)) return null;
  const close = toFiniteNumber(price.close_price);
  if (close === null) return null;
  const sourceUpdatedAt = String(price.source_fetched_at ?? input.candidateRun?.finished_at ?? "");
  if (!isValidIsoTimestamp(sourceUpdatedAt)) return null;
  const sourceRowHash = String(price.source_row_hash ?? "");
  if (!isNonEmptyString(sourceRowHash)) return null;

  const normalized = {
    symbol,
    trade_date: tradeDate,
    close,
    source_name: String(price.source_id ?? input.sourceId ?? "twse-stock-day"),
    source_updated_at: sourceUpdatedAt,
    source_row_hash: sourceRowHash
  };
  for (const [from, to] of [
    ["open_price", "open"],
    ["high_price", "high"],
    ["low_price", "low"],
    ["volume", "volume"]
  ]) {
    const value = toFiniteNumber(price[from]);
    if (value !== null) normalized[to] = value;
  }
  return normalized;
}

function dedupeRows(rows) {
  const seen = new Set();
  const deduped = [];
  for (const row of rows) {
    const key = `${row.symbol}|${row.trade_date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }
  return deduped;
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`${label}_json_unreadable:${error.message}`);
    return {};
  }
}

function classifyOutputPath(filePath) {
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

function toFiniteNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return value;
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

function isListedStockSymbol(symbol) {
  return /^[1-9]\d{3}$/u.test(String(symbol ?? ""));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

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

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
