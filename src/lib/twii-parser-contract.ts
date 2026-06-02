export type TwiiParserFailureClass =
  | "none"
  | "no_rows"
  | "field_mismatch"
  | "duplicate_dates"
  | "calendar_gap_unresolved"
  | "rights_unapproved"
  | "parser_design_blocked";

export type TwiiSyntheticSourceRow = readonly [string, string, string?, string?, string?];

export type TwiiParserContractRow = {
  normalizedDate: string;
  normalizedIndexValue: number;
};

export type TwiiParserContractResult = {
  duplicateTradeDateCount: number;
  failureClass: TwiiParserFailureClass;
  fieldParseFailureCount: number;
  rows: TwiiParserContractRow[];
};

export const TWII_PARSER_CONTRACT_BOUNDARY = {
  assetMapping: "TWII_internal_market_asset_pending",
  fixturePolicy: "synthetic_rows_only",
  publicDataSource: "mock",
  scoreSource: "mock",
  sourceCandidate: "official-exchange-index",
  targetSymbol: "TWII"
} as const;

export function parseTwiiSyntheticRows(rows: readonly TwiiSyntheticSourceRow[]): TwiiParserContractResult {
  if (rows.length === 0) {
    return {
      duplicateTradeDateCount: 0,
      failureClass: "no_rows",
      fieldParseFailureCount: 0,
      rows: []
    };
  }

  const dateCounts = new Map<string, number>();
  const parsedRows: TwiiParserContractRow[] = [];
  let fieldParseFailureCount = 0;

  for (const row of rows) {
    const normalizedDate = parseRocDate(row[0]);
    const normalizedIndexValue = parseNumericCell(row[1]);

    if (!normalizedDate || normalizedIndexValue === null) {
      fieldParseFailureCount += 1;
      continue;
    }

    dateCounts.set(normalizedDate, (dateCounts.get(normalizedDate) ?? 0) + 1);
    parsedRows.push({ normalizedDate, normalizedIndexValue });
  }

  const duplicateTradeDateCount = [...dateCounts.values()].filter((count) => count > 1).length;
  const failureClass = pickFailureClass({ duplicateTradeDateCount, fieldParseFailureCount, parsedRowCount: parsedRows.length });

  return {
    duplicateTradeDateCount,
    failureClass,
    fieldParseFailureCount,
    rows: parsedRows
  };
}

export function parseRocDate(value: string): string {
  const match = value.trim().match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (!match) return "";

  const year = Number(match[1]) + 1911;
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return "";
  }

  return `${year.toString().padStart(4, "0")}-${match[2]}-${match[3]}`;
}

export function parseNumericCell(value: string): number | null {
  const normalized = value.trim().replaceAll(",", "");
  if (normalized === "" || /^-+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickFailureClass(input: {
  duplicateTradeDateCount: number;
  fieldParseFailureCount: number;
  parsedRowCount: number;
}): TwiiParserFailureClass {
  if (input.parsedRowCount === 0) return "no_rows";
  if (input.fieldParseFailureCount > 0) return "field_mismatch";
  if (input.duplicateTradeDateCount > 0) return "duplicate_dates";
  return "none";
}
