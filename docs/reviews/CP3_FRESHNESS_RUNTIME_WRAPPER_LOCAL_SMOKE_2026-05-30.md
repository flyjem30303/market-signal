# CP3 Freshness Runtime Wrapper Local Smoke

Status: `CP3 freshness runtime wrapper local smoke recorded`

Decision: `VERIFY_RUNTIME_WRAPPER_BEHAVIOR_LOCALLY_WITH_INJECTED_CLIENT`

## Scope

This larger CEO implementation slice adds a local smoke path for the freshness runtime wrapper. It verifies the public wrapper can be exercised with injected environment values and an injected Supabase client factory while preserving the default runtime behavior. It does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Implementation Evidence

- `src/lib/data-freshness-source.ts` exports `createDataFreshnessSnapshotGetter`.
- `src/lib/data-freshness-source.ts` keeps `getDataFreshnessSnapshot` as the default exported runtime getter instance.
- The default getter still uses `process.env`.
- The default getter still uses `createServerSupabaseClient` only through a lazy factory.
- The wrapper accepts injected `env` values for local smoke checks.
- The wrapper accepts an injected `createSupabaseClient` factory for local smoke checks.

## Local Smoke Cases

| Case | Input source | Supabase runtime reads | Expected client calls | Expected snapshot |
| --- | --- | --- | --- | --- |
| default mock | unset | unset | 0 | mock |
| explicit mock | mock | enabled | 0 | mock |
| disabled Supabase | supabase | disabled | 0 | mock |
| enabled Supabase candidate fallback | supabase | enabled | 1 | mock fallback |
| invalid source | invalid | disabled | 0 | throws unsupported source |

## Guardrails

- `DATA_FRESHNESS_SOURCE` still defaults to `mock`.
- `DATA_FRESHNESS_SUPABASE_READS` still defaults to `disabled`.
- A Supabase client may be created only when `DATA_FRESHNESS_SOURCE=supabase` and `DATA_FRESHNESS_SUPABASE_READS=enabled`.
- A Supabase candidate failure still returns a mock freshness snapshot.
- The smoke checker must not import `.env.local`.
- The smoke checker must not require a real Supabase URL or service role key.
- The smoke checker must not call a real Supabase client.
- The smoke checker must not print secret values.

## Role Review

CEO finding: This slice is the right acceleration step because it moves from static source-selection confidence to runtime-wrapper behavior confidence without opening remote execution.

PM finding: The wrapper is now easier to test and safer to evolve because runtime dependencies are injectable while the production call remains unchanged.

Engineering finding: The injection point is narrow and preserves the repository boundary. Future tests can validate runtime behavior without mutating `process.env` or requiring Supabase credentials.

QA finding: The local smoke cases cover default behavior, explicit mock behavior, disabled Supabase behavior, fallback behavior, and invalid source rejection.

Security finding: The checker does not load `.env.local`, does not print secrets, and does not instantiate the real Supabase client.

Data finding: `data_runs` remains the only gated Supabase freshness candidate. `data_freshness` remains excluded from runtime repository selection.

## CEO Verdict

Accepted as the next larger runtime-readiness slice. The project can continue toward a controlled read-only runtime activation path after local wrapper smoke coverage remains green through review gates and build.

## Next Slice

NEXT-SLICE-001 add a read-only runtime activation readiness packet that references this local smoke evidence.
NEXT-SLICE-002 keep Supabase execution blocked unless a separate one-attempt read-only activation gate is explicitly approved.
NEXT-SLICE-003 keep public data source mock and `scoreSource=real` blocked.
