import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const inputPath = args.input ?? process.env.PHASE_1_CURRENT_SCOPE_STAGING_CANDIDATE_INPUT_PATH;
const outputPath = args.output ?? process.env.PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH;
const sourceRightsStatus = args.sourceRightsStatus ?? process.env.PHASE_1_CURRENT_SCOPE_SOURCE_RIGHTS_STATUS;
const fieldContractStatus = args.fieldContractStatus ?? process.env.PHASE_1_CURRENT_SCOPE_FIELD_CONTRACT_STATUS;
const problems = [];

if (!inputPath) problems.push("--input or PHASE_1_CURRENT_SCOPE_STAGING_CANDIDATE_INPUT_PATH is required");
if (!outputPath) problems.push("--output or PHASE_1_CURRENT_SCOPE_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH is required");
if (sourceRightsStatus !== "accepted") problems.push("source_rights_status_must_be_accepted");
if (fieldContractStatus !== "accepted") problems.push("field_contract_status_must_be_accepted");

const outputPolicy = outputPath ? classifyOutputPath(outputPath) : null;
if (outputPolicy?.insideCommittedCandidateFolder) problems.push("output_must_not_be_under_data_candidates");
if (outputPolicy?.insideRepository && !outputPolicy.gitIgnored) problems.push("output_must_be_outside_git_or_gitignored");

const source = inputPath ? readJson(inputPath, "input") : {};
const candidatePrices = Array.isArray(source.candidatePrices) ? source.candidatePrices : [];
if (candidatePrices.length < 1) problems.push("input_candidate_prices_missing");

const rows = [];
const rejectedRows = [];
const seen = new Set();

for (const price of candidatePrices) {
  const row = normalizePrice(price);
  if (!row.accepted) {
    rejectedRows.push(row.reason);
    continue;
  }
  const key = `${row.value.symbol}|${row.value.trade_date}`;
  if (seen.has(key)) {
    rejectedRows.push("duplicate_symbol_trade_date");
    continue;
  }
  seen.add(key);
  rows.push(row.value);
}

if (rows.length < 1) problems.push("no_current_scope_rows_after_normalization");
if (!rows.some((row) => row.symbol === "TWII")) problems.push("twii_rows_missing");
if (!rows.some((row) => isListedStockSymbol(row.symbol))) problems.push("listed_stock_rows_missing");

const accepted = problems.length === 0;
const artifact = accepted
  ? {
      artifactId: `phase-1-current-scope-row-payload-${new Date().toISOString().slice(0, 10)}`,
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
    ? "phase_1_current_scope_candidate_conversion_ready"
    : "phase_1_current_scope_candidate_conversion_blocked",
  converterMode: "tw_equity_staging_candidate_to_current_scope_artifact",
  inputPathProvided: Boolean(inputPath),
  outputPathProvided: Boolean(outputPath),
  outputWritten: accepted,
  outputPath: accepted ? outputPath : null,
  sourceRightsStatusAccepted: sourceRightsStatus === "accepted",
  fieldContractStatusAccepted: fieldContractStatus === "accepted",
  inputCandidatePricesCount: candidatePrices.length,
  normalizedRowCount: rows.length,
  rejectedRowCount: rejectedRows.length,
  symbolsCoveredCount: new Set(rows.map((row) => row.symbol)).size,
  symbolsCoveredPreview: [...new Set(rows.map((row) => row.symbol))].sort().slice(0, 12),
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

function normalizePrice(price) {
  if (!price || typeof price !== "object" || Array.isArray(price)) return reject("invalid_price_row");

  const symbol = String(price.symbol ?? "");
  if (!isListedStockSymbol(symbol) && symbol !== "TWII") return reject("symbol_not_in_current_scope");
  if (/^00\d+/u.test(symbol)) return reject("deferred_etf_symbol");

  const tradeDate = String(price.trade_date ?? "");
  if (!isValidIsoDate(tradeDate)) return reject("invalid_trade_date");

  const close = toFiniteNumber(price.close_price);
  if (close === null) return reject("invalid_close_price");

  const sourceUpdatedAt = String(price.source_fetched_at ?? source.candidateRun?.finished_at ?? "");
  if (!isValidIsoTimestamp(sourceUpdatedAt)) return reject("invalid_source_updated_at");

  const sourceRowHash = String(price.source_row_hash ?? "");
  if (sourceRowHash.trim().length < 1) return reject("missing_source_row_hash");

  const normalized = {
    symbol,
    trade_date: tradeDate,
    close,
    source_name: String(price.source_id ?? source.sourceId ?? "twse-stock-day"),
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

  return { accepted: true, value: normalized };
}

function reject(reason) {
  return { accepted: false, reason };
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
  const gitDir = path.join(path.resolve("."), ".git");
  if (!fs.existsSync(gitDir)) return false;
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
  return /^[1-9]\d{3}$/u.test(symbol);
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
