export type SupabaseReadonlyEnvState = "default_disabled" | "missing" | "present";
export type SupabaseReadonlyBoundaryStatus = "blocked" | "ok" | "warning";
export type SupabaseReadonlyPreflightStatus = "blocked" | "ready_for_guarded_readonly_decision";

export type SupabaseReadonlyBoundary = {
  expected: string;
  name: string;
  observed: string;
  status: SupabaseReadonlyBoundaryStatus;
};

export type SupabaseReadonlyLocalPreflight = {
  boundaries: SupabaseReadonlyBoundary[];
  connectionAttempted: false;
  env: Record<string, SupabaseReadonlyEnvState>;
  missingEnv: string[];
  mutations: false;
  nextRemoteCommand: string | null;
  rowPayloadsPrinted: false;
  secretsPrinted: false;
  sqlExecuted: false;
  status: SupabaseReadonlyPreflightStatus;
};

type SupabaseReadonlyPreflightEnv = Record<string, string | undefined>;

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE",
  "DATA_FRESHNESS_SOURCE"
] as const;

const defaultDisabledEnv = ["DATA_FRESHNESS_SUPABASE_READS", "MARKET_SIGNAL_SUPABASE_READS"] as const;

export function getSupabaseReadonlyLocalPreflight(
  env: SupabaseReadonlyPreflightEnv = process.env
): SupabaseReadonlyLocalPreflight {
  const defaultedEnv = {
    DATA_FRESHNESS_SUPABASE_READS: envValue(env.DATA_FRESHNESS_SUPABASE_READS, "disabled"),
    MARKET_SIGNAL_SUPABASE_READS: envValue(env.MARKET_SIGNAL_SUPABASE_READS, "disabled")
  };
  const envState: Record<string, SupabaseReadonlyEnvState> = {
    ...Object.fromEntries(requiredEnv.map((name) => [name, hasValue(env[name]) ? "present" : "missing"])),
    ...Object.fromEntries(defaultDisabledEnv.map((name) => [name, hasValue(env[name]) ? "present" : "default_disabled"]))
  };
  const missingEnv = Object.entries(envState)
    .filter(([, state]) => state === "missing")
    .map(([name]) => name);
  const boundaries: SupabaseReadonlyBoundary[] = [
    {
      expected: "mock",
      name: "main_market_signal_source",
      observed: env.NEXT_PUBLIC_DATA_SOURCE || "missing",
      status: env.NEXT_PUBLIC_DATA_SOURCE === "mock" ? "ok" : "blocked"
    },
    {
      expected: "disabled",
      name: "market_signal_supabase_reads",
      observed: defaultedEnv.MARKET_SIGNAL_SUPABASE_READS,
      status: defaultedEnv.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "warning" : "ok"
    },
    {
      expected: "disabled unless one-read gate is active",
      name: "freshness_supabase_reads",
      observed: defaultedEnv.DATA_FRESHNESS_SUPABASE_READS,
      status: defaultedEnv.DATA_FRESHNESS_SUPABASE_READS === "enabled" ? "warning" : "ok"
    }
  ];
  const blocked = missingEnv.length > 0 || boundaries.some((boundary) => boundary.status === "blocked");

  return {
    boundaries,
    connectionAttempted: false,
    env: envState,
    missingEnv,
    mutations: false,
    nextRemoteCommand: blocked ? null : "npm run db:readonly-validate",
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    sqlExecuted: false,
    status: blocked ? "blocked" : "ready_for_guarded_readonly_decision"
  };
}

function envValue(value: string | undefined, fallback: string) {
  return hasValue(value) ? value : fallback;
}

function hasValue(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
