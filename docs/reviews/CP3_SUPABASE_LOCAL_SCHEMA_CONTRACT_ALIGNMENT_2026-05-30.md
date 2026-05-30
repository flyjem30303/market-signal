# CP3 Supabase Local Schema Contract Alignment

Date: 2026-05-30

Status: `CP3 Supabase local schema contract alignment recorded`

Decision: `ALIGN_LOCAL_SCHEMA_CONTRACT_BEFORE_REMOTE_SCHEMA_VALIDATOR_DESIGN`

## Scope

This document aligns reachable Supabase objects with local migrations, generated types, and runtime repositories before any remote schema-shape validator design. It does not connect to Supabase, does not run SQL, does not run remote validation, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not promote CP3 readiness, and does not approve public claims.

## Alignment Inputs

- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_ROLE_REVIEW_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_POST_RUN_REVIEW_ROLE_REVIEW_2026-05-30.md`
- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0003_twse_stock_day_staging.sql`
- `src/lib/supabase/database.types.ts`
- `src/lib/repositories/supabase-raw-market-repository.ts`
- `src/lib/repositories/supabase-data-freshness-repository.ts`
- `scripts/validate-supabase-readonly.mjs`

## Contract Status Matrix

| Reachable object | Local migration baseline | Generated type baseline | Runtime repository usage | Contract status | Runtime criticality |
| --- | --- | --- | --- | --- | --- |
| `daily_prices` | `supabase/migrations/0001_initial_schema.sql` | `src/lib/supabase/database.types.ts` | `src/lib/repositories/supabase-raw-market-repository.ts` | `local-baselined` | runtime-critical |
| `twse_stock_day_staging` | local migration defines `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`, not the exact reachable object name | not confirmed in generated type baseline | no direct runtime repository usage confirmed in this slice | `needs-reconciliation` | review/support-only until reconciled |
| `market_assets` | no local migration baseline found in this slice | no generated type baseline found in this slice | no direct runtime repository usage confirmed in this slice | `remote-only-pending-contract` | runtime-critical for global asset identity before real global runtime |
| `model_runs` | no local migration baseline found in this slice | no generated type baseline found in this slice | no direct runtime repository usage confirmed in this slice | `remote-only-pending-contract` | review/support-only for score provenance until contract exists |
| `data_freshness` | no local migration baseline found in this slice; local freshness baseline currently uses `data_runs` | no generated type baseline found in this slice | `src/lib/repositories/supabase-data-freshness-repository.ts` uses freshness concepts but not this object as a confirmed local type | `remote-only-pending-contract` | runtime-critical for freshness disclosure only after reconciliation |

## Object Contracts

### `daily_prices`

Contract status: `local-baselined`

Local evidence:

- `supabase/migrations/0001_initial_schema.sql` defines `public.daily_prices`.
- `src/lib/supabase/database.types.ts` includes `daily_prices`.
- `src/lib/repositories/supabase-raw-market-repository.ts` reads `daily_prices`.

Minimum runtime fields:

- `stock_id`
- `trade_date`
- `open`
- `high`
- `low`
- `close`
- `volume`
- `turnover`
- `created_at`

Runtime use:

- Latest price snapshot can depend on `close`, `high`, `low`, `open`, `trade_date`, `turnover`, and `volume`.

Alignment decision:

- Keep as the canonical local-baselined price object.
- Do not write `daily_prices`.
- Do not use this alignment as historical-depth or data-quality proof.

### `twse_stock_day_staging`

Contract status: `needs-reconciliation`

Local evidence:

- `supabase/migrations/0003_twse_stock_day_staging.sql` defines `public.staging_twse_stock_day_runs`.
- `supabase/migrations/0003_twse_stock_day_staging.sql` defines `public.staging_twse_stock_day_prices`.
- The exact reachable object name `twse_stock_day_staging` is not confirmed as a local migration object in this slice.

Open contract questions:

- Is `twse_stock_day_staging` a view, compatibility alias, remote-only table, or naming mismatch?
- Should the runtime refer to `twse_stock_day_staging`, `staging_twse_stock_day_prices`, or neither?
- Is this object review/support-only, or does it become runtime-critical after staging review?

Alignment decision:

- Treat as review/support-only until reconciled.
- Do not build runtime dependency on this object yet.
- Do not move staging data to production.
- Do not write staging rows.

### `market_assets`

Contract status: `remote-only-pending-contract`

Local evidence:

- Reachability was accepted from sanitized read-only evidence.
- No local migration baseline was found in this slice.
- No generated type baseline was found in this slice.
- No direct runtime repository usage was confirmed in this slice.

Expected field categories:

- market identity
- asset identity
- symbol
- display name
- exchange
- country
- currency
- timezone
- asset type
- active flag

Alignment decision:

- Treat as global-runtime candidate only.
- Do not wire runtime to this object before contract documentation exists.
- Do not claim global coverage from reachability alone.

### `model_runs`

Contract status: `remote-only-pending-contract`

Local evidence:

- Reachability was accepted from sanitized read-only evidence.
- No local migration baseline was found in this slice.
- No generated type baseline was found in this slice.
- No direct runtime repository usage was confirmed in this slice.

Expected field categories:

- model version
- run status
- source mode
- target object
- started timestamp
- finished timestamp
- review status
- notes or error message

Alignment decision:

- Treat as score-provenance candidate only.
- Do not write model run rows.
- Do not use this object to promote model credibility.
- Do not set `scoreSource=real`.

### `data_freshness`

Contract status: `remote-only-pending-contract`

Local evidence:

- Reachability was accepted from sanitized read-only evidence.
- Local schema baseline includes `data_runs`, not confirmed `data_freshness`.
- `src/lib/repositories/supabase-data-freshness-repository.ts` uses freshness behavior, but this slice does not confirm a local generated type for `data_freshness`.

Expected field categories:

- target table
- source name
- latest data date
- freshness status
- run status
- finished timestamp
- row count
- stale reason

Alignment decision:

- Treat as freshness-disclosure candidate only.
- Reconcile relationship to `data_runs` before runtime dependency.
- Do not claim freshness quality from object reachability or shape alignment.

## Runtime Guidance

- Runtime wiring may continue only against mock/public-safe state until schema contracts are reconciled.
- `daily_prices` can be considered locally baselined for read-shape planning only.
- `twse_stock_day_staging` must not be treated as runtime-critical until its object identity is reconciled.
- `market_assets` must not be used for global runtime claims until local/remote contract is documented.
- `model_runs` must not be used for score-source promotion until contract, provenance semantics, and review gates exist.
- `data_freshness` must not replace `data_runs` behavior until the relationship is documented.

## Next Recommended Slice

Create a schema-shape validator design gate that uses this alignment as input and remains local-only. The design may specify future sanitized field-name validation, but it must not execute remote validation and must not authorize a connection.

## Still Blocked

- Remote schema-shape validation is blocked.
- Supabase connection is blocked in this slice.
- SQL execution is blocked.
- Migration execution is blocked.
- Supabase writes are blocked.
- Insert, update, upsert, delete, RPC, and storage writes are blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit are blocked.
- `.env.local` modification is blocked.
- `scoreSource=real` remains blocked.
- CP3 readiness promotion remains blocked.
- Public market-data claims remain blocked.

## CEO Synthesis

The local contract is now aligned enough to proceed to a validator design gate, not an execution gate. The most important finding is that `daily_prices` is local-baselined, while `twse_stock_day_staging`, `market_assets`, `model_runs`, and `data_freshness` still require reconciliation before runtime code or public claims depend on them.

## Verification Expectations

- This local schema contract alignment checker passes.
- Schema-shape plan role review checker passes.
- Review gates pass.
- TypeScript check passes.
- No remote validation is executed in this slice.
- CP3 remains `not_ready`.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
