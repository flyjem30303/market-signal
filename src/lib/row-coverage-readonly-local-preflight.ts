import { buildRowCoverageReadonlyValidationContract } from "@/lib/row-coverage-readonly-validation-contract";

export type RowCoverageReadonlyEnvState = "default_disabled" | "missing" | "present";
export type RowCoverageReadonlyBoundaryStatus = "blocked" | "ok" | "warning";
export type RowCoverageReadonlyPreflightStatus = "blocked" | "ready_for_guarded_readonly_decision";

export type RowCoverageReadonlyBoundary = {
  expected: string;
  name: string;
  observed: string;
  status: RowCoverageReadonlyBoundaryStatus;
};

export type RowCoverageReadonlyLocalPreflight = {
  boundaries: RowCoverageReadonlyBoundary[];
  canAwardRowCoveragePoints: false;
  canClaimCoverage: false;
  canSetScoreSourceReal: false;
  connectionAttempted: false;
  env: Record<string, RowCoverageReadonlyEnvState>;
  filesWritten: false;
  missingEnv: string[];
  mode: "row_coverage_readonly_local_preflight";
  mutations: false;
  nextLocalAction: "create guarded row coverage read-only runner";
  nextRemoteCommand: null;
  publicDataSource: "mock";
  rowPayloadsPrinted: false;
  scoreSource: "mock";
  secretsPrinted: false;
  sqlExecuted: false;
  status: RowCoverageReadonlyPreflightStatus;
  targetRelation: "daily_prices";
};

type RowCoverageReadonlyPreflightEnv = Record<string, string | undefined>;

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE",
  "ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION"
] as const;

const defaultDisabledEnv = ["DATA_FRESHNESS_SUPABASE_READS", "MARKET_SIGNAL_SUPABASE_READS"] as const;

export function getRowCoverageReadonlyLocalPreflight(
  env: RowCoverageReadonlyPreflightEnv = process.env
): RowCoverageReadonlyLocalPreflight {
  const contract = buildRowCoverageReadonlyValidationContract();
  const envState: Record<string, RowCoverageReadonlyEnvState> = {
    ...Object.fromEntries(requiredEnv.map((name) => [name, hasValue(env[name]) ? "present" : "missing"])),
    ...Object.fromEntries(defaultDisabledEnv.map((name) => [name, hasValue(env[name]) ? "present" : "default_disabled"]))
  };
  const missingEnv = Object.entries(envState)
    .filter(([, state]) => state === "missing")
    .map(([name]) => name);
  const boundaries: RowCoverageReadonlyBoundary[] = [
    {
      expected: "mock",
      name: "main_market_signal_source",
      observed: env.NEXT_PUBLIC_DATA_SOURCE || "missing",
      status: env.NEXT_PUBLIC_DATA_SOURCE === "mock" ? "ok" : "blocked"
    },
    {
      expected: "CP3_ROW_COVERAGE_READONLY_VALIDATE",
      name: "row_coverage_confirmation",
      observed: env.ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION ? "present" : "missing",
      status:
        env.ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION === "CP3_ROW_COVERAGE_READONLY_VALIDATE" ? "ok" : "blocked"
    },
    {
      expected: "not_run",
      name: "remote_connection",
      observed: contract.remoteConnection,
      status: contract.remoteConnection === "not_run" ? "ok" : "blocked"
    },
    {
      expected: "disabled",
      name: "market_signal_supabase_reads",
      observed: envValue(env.MARKET_SIGNAL_SUPABASE_READS, "disabled"),
      status: env.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "warning" : "ok"
    },
    {
      expected: "disabled",
      name: "freshness_supabase_reads",
      observed: envValue(env.DATA_FRESHNESS_SUPABASE_READS, "disabled"),
      status: env.DATA_FRESHNESS_SUPABASE_READS === "enabled" ? "warning" : "ok"
    }
  ];
  const blocked = missingEnv.length > 0 || boundaries.some((boundary) => boundary.status === "blocked");

  return {
    boundaries,
    canAwardRowCoveragePoints: false,
    canClaimCoverage: false,
    canSetScoreSourceReal: false,
    connectionAttempted: false,
    env: envState,
    filesWritten: false,
    missingEnv,
    mode: "row_coverage_readonly_local_preflight",
    mutations: false,
    nextLocalAction: "create guarded row coverage read-only runner",
    nextRemoteCommand: null,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    secretsPrinted: false,
    sqlExecuted: false,
    status: blocked ? "blocked" : "ready_for_guarded_readonly_decision",
    targetRelation: contract.targetRelation
  };
}

function envValue(value: string | undefined, fallback: string) {
  return hasValue(value) ? value : fallback;
}

function hasValue(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
