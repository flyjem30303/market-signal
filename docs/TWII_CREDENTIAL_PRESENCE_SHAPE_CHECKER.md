# TWII Credential Presence Shape Checker

Status: `twii_credential_presence_shape_checker_ready_no_execution`
Outcome: `credential_presence_shape_checker_ready_runtime_still_blocked`

This gate converts the accepted TWII server-only implementation scaffold into a local credential presence shape checker. It checks only whether required environment variable names are present as keys and whether those names have a safe uppercase shape. It does not read, print, validate, or connect with any credential value.

Canonical files:

- `data/source-gates/twii-credential-presence-shape-checker.json`
- `scripts/report-twii-credential-presence-shape-checker.mjs`
- `scripts/check-twii-credential-presence-shape-checker.mjs`
- `docs/TWII_CREDENTIAL_PRESENCE_SHAPE_CHECKER.md`

Scope anchors:

- `sourceScaffoldPath=data/source-gates/twii-server-only-implementation-scaffold.json`
- `targetTable=daily_prices`
- `targetLane=TWII`
- `targetScope=twii_index_daily_prices_missing_rows`
- `maxRows=60`
- `credentialCheckMode=presence_shape_only_no_secret_read`
- `requiredEnvNames=[NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TWII_ONE_ATTEMPT_EXECUTE, TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE]`
- `outputMode=boolean_shape_missing_name_unsafe_count_only`

Prepared state:

- `credentialPresenceShapeCheckerPrepared=true`
- `credentialValuesRead=false`
- `secretValuesPrinted=false`

No-execution state:

- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseWritesEnabled=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`

This checker does not authorize SQL, Supabase reads, Supabase writes, credential value reads, market-data fetching, row payload output, stock-id payload output, raw payload output, row acceptance, or scoreSource real promotion.

CEO/PM interpretation: this is the first locally executable credential-adjacent gate, but its output stays limited to required count, present count, missing environment names, unsafe name count, and no-value safety flags.
