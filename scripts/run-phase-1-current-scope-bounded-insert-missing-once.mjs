import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const EXPECTED = {
  authorizationId: "PHASE1-CURRENT-SCOPE-BOUNDED-WRITE-2026-06-17-A",
  acknowledgeFlag: "CEO_AUTHORIZED_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT_20260617_A",
  candidateScope: "twii_plus_listed_stock_daily_close",
  maxRows: 500,
  targetTable: "daily_prices"
};
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const validatorPath = "scripts/validate-phase-1-current-scope-sanitized-row-payload-candidate-artifact.mjs";

loadProcessEnvFromDotEnvLocal();

const args = parseArgs(process.argv.slice(2));
const problems = [];
const executionRequested = args.execute === true;
const commandAccepted =
  args.authorizationId === EXPECTED.authorizationId &&
  args.acknowledgeBoundedWriteOnce === EXPECTED.acknowledgeFlag &&
  typeof args.candidateArtifact === "string" &&
  typeof args.postRunReview === "string";
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};

if (!commandAccepted) problems.push("command_contract_mismatch");
if (executionRequested && !credentialPresence.nextPublicSupabaseUrl) problems.push("missing_next_public_supabase_url");
if (executionRequested && !credentialPresence.serviceRoleKey) problems.push("missing_service_role_key");

const candidateValidation = validateCandidateArtifact(args.candidateArtifact);
if (!candidateValidation.accepted) problems.push(...candidateValidation.problems);

const executionResult =
  executionRequested && problems.length === 0
    ? await executeBoundedInsertMissing(candidateValidation.artifact, candidateValidation.symbols)
    : skippedExecution(candidateValidation);

problems.push(...executionResult.problems);

const output = buildOutput({
  candidateValidation,
  commandAccepted,
  credentialPresence,
  executionResult,
  executionRequested,
  problems
});

if (executionRequested && args.postRunReview) writePostRunReview(args.postRunReview, output);

console.log(JSON.stringify(output, null, 2));
process.exitCode = problems.length === 0 ? 0 : 1;

function validateCandidateArtifact(filePath) {
  const validation = {
    accepted: false,
    aggregate: null,
    artifact: null,
    problems: [],
    symbols: []
  };

  if (!filePath) {
    validation.problems.push("candidate_artifact_path_missing");
    return validation;
  }

  const run = spawnSync(process.execPath, [validatorPath, "--candidate-artifact", filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  let aggregate;
  try {
    aggregate = JSON.parse(run.stdout);
  } catch {
    validation.problems.push("candidate_validator_output_unreadable");
    return validation;
  }

  validation.aggregate = aggregate;
  if (aggregate.accepted !== true) {
    validation.problems.push("candidate_validator_rejected");
    if (Array.isArray(aggregate.problems)) validation.problems.push(...aggregate.problems);
    return validation;
  }

  let artifact;
  try {
    artifact = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filePath), "utf8"));
  } catch {
    validation.problems.push("candidate_artifact_unreadable_after_validation");
    return validation;
  }

  const rows = Array.isArray(artifact.rows) ? artifact.rows : [];
  const symbols = [...new Set(rows.map((row) => row.symbol))].sort();
  if (artifact.scope !== EXPECTED.candidateScope) validation.problems.push("candidate_scope_mismatch");
  if (artifact.phase1Universe !== EXPECTED.candidateScope) validation.problems.push("candidate_phase1_universe_mismatch");
  if (rows.length < 1) validation.problems.push("candidate_rows_missing");
  if (rows.length > EXPECTED.maxRows) validation.problems.push("candidate_row_count_exceeds_bound");
  if (!symbols.includes("TWII")) validation.problems.push("candidate_twii_missing");
  if (!symbols.some((symbol) => /^[1-9]\d{3}$/u.test(symbol))) validation.problems.push("candidate_listed_stock_missing");

  validation.accepted = validation.problems.length === 0;
  validation.artifact = validation.accepted ? artifact : null;
  validation.symbols = symbols;
  return validation;
}

async function executeBoundedInsertMissing(artifact, symbols) {
  const result = {
    connectionAttempted: false,
    coverageCompleteAfterWrite: false,
    existingRowsBeforeWrite: 0,
    finalRowsAfterWrite: 0,
    insertedRows: 0,
    missingRowsAfterWrite: artifact.rows.length,
    plannedInsertRows: 0,
    problems: [],
    readbackAttempted: false,
    remoteAttempted: true,
    skippedExistingRows: 0,
    status: "blocked",
    stockMappingComplete: false,
    supabaseWriteAttempted: false,
    writeSucceeded: false
  };

  const supabase = await createWriteClient(result);
  const stockIdBySymbol = await lookupStockIdsBySymbol(supabase, symbols);
  result.stockMappingComplete = stockIdBySymbol.size === symbols.length;
  if (!result.stockMappingComplete) {
    result.problems.push("stock_mapping_incomplete");
    return result;
  }

  const rowsBySymbol = groupRowsBySymbol(artifact.rows, symbols);
  const existingKeys = await readExistingKeys(supabase, stockIdBySymbol, rowsBySymbol, result);
  if (result.problems.length > 0) return result;

  const plannedRows = [];
  for (const row of artifact.rows) {
    const stockId = stockIdBySymbol.get(row.symbol);
    const key = `${row.symbol}|${row.trade_date}`;
    if (existingKeys.has(key)) {
      result.skippedExistingRows += 1;
      continue;
    }
    plannedRows.push(toDailyPriceInsertRow(stockId, row));
  }

  result.existingRowsBeforeWrite = result.skippedExistingRows;
  result.plannedInsertRows = plannedRows.length;
  if (plannedRows.length > EXPECTED.maxRows) {
    result.problems.push("planned_insert_rows_exceed_bound");
    return result;
  }

  if (plannedRows.length > 0) {
    result.supabaseWriteAttempted = true;
    const insertResult = await supabase.from(EXPECTED.targetTable).insert(plannedRows);
    if (insertResult.error) {
      result.problems.push(sanitizeSupabaseError("daily_prices_insert_failed", insertResult.error));
      return result;
    }
    result.writeSucceeded = true;
    result.insertedRows = plannedRows.length;
  }

  const finalKeys = await readExistingKeys(supabase, stockIdBySymbol, rowsBySymbol, result);
  result.finalRowsAfterWrite = finalKeys.size;
  result.missingRowsAfterWrite = artifact.rows.length - finalKeys.size;
  result.coverageCompleteAfterWrite = result.missingRowsAfterWrite === 0;
  if (!result.coverageCompleteAfterWrite) result.problems.push("post_write_coverage_incomplete");
  result.status =
    result.problems.length === 0
      ? "phase_1_current_scope_bounded_insert_missing_passed_readback"
      : "blocked";
  return result;
}

async function createWriteClient(result) {
  result.connectionAttempted = true;
  const { createClient } = await import("@supabase/supabase-js");
  const { default: ws } = await import("ws");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    },
    realtime: {
      transport: ws
    }
  });
}

async function lookupStockIdsBySymbol(supabase, symbols) {
  const { data, error } = await supabase
    .from("stocks")
    .select("id,symbol")
    .eq("country", "TW")
    .eq("exchange", "TWSE")
    .in("symbol", symbols);

  if (error || !Array.isArray(data)) return new Map();
  const ids = new Map();
  for (const row of data) {
    if (typeof row?.id === "string" && symbols.includes(row?.symbol)) ids.set(row.symbol, row.id);
  }
  return ids;
}

async function readExistingKeys(supabase, stockIdBySymbol, rowsBySymbol, result) {
  result.readbackAttempted = true;
  const keys = new Set();
  for (const [symbol, rows] of rowsBySymbol.entries()) {
    const stockId = stockIdBySymbol.get(symbol);
    const tradeDates = rows.map((row) => row.trade_date);
    if (!stockId || tradeDates.length === 0) continue;
    const { data, error } = await supabase
      .from(EXPECTED.targetTable)
      .select("trade_date")
      .eq("stock_id", stockId)
      .in("trade_date", tradeDates);
    if (error) {
      result.problems.push(sanitizeSupabaseError("daily_prices_readback_failed", error));
      return keys;
    }
    for (const row of data ?? []) {
      if (typeof row?.trade_date === "string") keys.add(`${symbol}|${row.trade_date}`);
    }
  }
  return keys;
}

function groupRowsBySymbol(rows, symbols) {
  const grouped = new Map(symbols.map((symbol) => [symbol, []]));
  for (const row of rows) grouped.get(row.symbol)?.push(row);
  return grouped;
}

function toDailyPriceInsertRow(stockId, row) {
  return {
    close: row.close,
    high: row.high ?? null,
    low: row.low ?? null,
    open: row.open ?? null,
    stock_id: stockId,
    trade_date: row.trade_date,
    volume: row.volume ?? null
  };
}

function skippedExecution(candidateValidation) {
  return {
    connectionAttempted: false,
    coverageCompleteAfterWrite: false,
    existingRowsBeforeWrite: 0,
    finalRowsAfterWrite: 0,
    insertedRows: 0,
    missingRowsAfterWrite: candidateValidation.aggregate?.rowCount ?? 0,
    plannedInsertRows: 0,
    problems: [],
    readbackAttempted: false,
    remoteAttempted: false,
    skippedExistingRows: 0,
    status: "not_executed",
    stockMappingComplete: false,
    supabaseWriteAttempted: false,
    writeSucceeded: false
  };
}

function buildOutput({
  candidateValidation,
  commandAccepted,
  credentialPresence,
  executionResult,
  executionRequested,
  problems
}) {
  const passed = problems.length === 0 && (!executionRequested || executionResult.coverageCompleteAfterWrite);
  return {
    status: passed
      ? executionRequested
        ? executionResult.status
        : "phase_1_current_scope_bounded_insert_missing_ready_not_executed"
      : "phase_1_current_scope_bounded_insert_missing_blocked",
    mode: "phase_1_current_scope_bounded_insert_missing_once",
    authorizationId: args.authorizationId ?? "missing",
    boundedAttemptScope: EXPECTED.candidateScope,
    targetTable: EXPECTED.targetTable,
    maxRows: EXPECTED.maxRows,
    commandAccepted,
    executionRequested,
    candidateArtifactAccepted: candidateValidation.accepted,
    candidateRowCount: candidateValidation.aggregate?.rowCount ?? null,
    symbolsCoveredCount: candidateValidation.aggregate?.symbolsCoveredCount ?? null,
    symbolsCoveredPreview: candidateValidation.aggregate?.symbolsCoveredPreview ?? [],
    symbolCountsPreview: candidateValidation.aggregate?.symbolCountsPreview ?? null,
    dateBounds: candidateValidation.aggregate?.dateBounds ?? null,
    credentialPresence,
    remoteAttempted: executionResult.remoteAttempted,
    connectionAttempted: executionResult.connectionAttempted,
    stockMappingComplete: executionResult.stockMappingComplete,
    readbackAttempted: executionResult.readbackAttempted,
    existingRowsBeforeWrite: executionResult.existingRowsBeforeWrite,
    plannedInsertRows: executionResult.plannedInsertRows,
    skippedExistingRows: executionResult.skippedExistingRows,
    insertedRows: executionResult.insertedRows,
    finalRowsAfterWrite: executionResult.finalRowsAfterWrite,
    missingRowsAfterWrite: executionResult.missingRowsAfterWrite,
    coverageCompleteAfterWrite: executionResult.coverageCompleteAfterWrite,
    writeSucceeded: executionResult.writeSucceeded,
    problems,
    safety: {
      sqlExecuted: false,
      marketDataFetched: false,
      marketDataIngested: false,
      rawPayloadOutput: false,
      rowPayloadOutput: false,
      stockIdPayloadOutput: false,
      secretsOutput: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      sourcePromotion: false,
      scorePromotion: false,
      updateAttempted: false,
      upsertAttempted: false,
      deleteAttempted: false,
      insertOnlyMissingKeys: true
    }
  };
}

function writePostRunReview(filePath, output) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const lines = [
    "# Phase 1 Current-Scope Daily Prices Bounded Write Post-Run Review",
    "",
    "Date: 2026-06-17",
    "",
    `Status: \`${output.status}\`.`,
    "",
    "## Scope",
    "",
    `- Target table: \`${output.targetTable}\`.`,
    `- Bounded scope: \`${output.boundedAttemptScope}\`.`,
    `- Max rows: \`${output.maxRows}\`.`,
    "- Policy: insert missing keys only; no update, upsert, delete, or source promotion.",
    "",
    "## Sanitized Aggregate Result",
    "",
    `- Candidate rows: \`${output.candidateRowCount}\`.`,
    `- Symbols covered count: \`${output.symbolsCoveredCount}\`.`,
    `- Existing rows before write: \`${output.existingRowsBeforeWrite}\`.`,
    `- Planned insert rows: \`${output.plannedInsertRows}\`.`,
    `- Inserted rows: \`${output.insertedRows}\`.`,
    `- Skipped existing rows: \`${output.skippedExistingRows}\`.`,
    `- Final candidate-key rows after write: \`${output.finalRowsAfterWrite}\`.`,
    `- Missing rows after write: \`${output.missingRowsAfterWrite}\`.`,
    `- Coverage complete after write: \`${output.coverageCompleteAfterWrite}\`.`,
    "",
    "## Safety Confirmation",
    "",
    `- Remote attempted: \`${output.remoteAttempted}\`.`,
    `- Connection attempted: \`${output.connectionAttempted}\`.`,
    `- Readback attempted: \`${output.readbackAttempted}\`.`,
    `- Write succeeded: \`${output.writeSucceeded}\`.`,
    "- SQL executed: `false`.",
    "- Market-data fetch: `false`.",
    "- Market-data ingestion: `false`.",
    "- Raw payload output: `false`.",
    "- Row payload output: `false`.",
    "- Stock id output: `false`.",
    "- Secret output: `false`.",
    "- Public data source: `mock`.",
    "- Score source: `mock`.",
    "",
    "## Problems",
    "",
    ...(output.problems.length > 0 ? output.problems.map((problem) => `- \`${problem}\`.`) : ["- `none`."]),
    "",
    "## Next Route",
    "",
    output.coverageCompleteAfterWrite
      ? "- Prepare row coverage scoring/promotion review; do not promote public source until separate gate passes."
      : "- Keep public runtime mock and repair the blocked write/readback path before any retry."
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function sanitizeSupabaseError(prefix, error) {
  const code = typeof error?.code === "string" ? error.code : "unknown";
  return `${prefix}_${code}`;
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
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    parsed[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
  return parsed;
}

function envPresent(key) {
  return typeof process.env[key] === "string" && process.env[key].trim().length > 0;
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
