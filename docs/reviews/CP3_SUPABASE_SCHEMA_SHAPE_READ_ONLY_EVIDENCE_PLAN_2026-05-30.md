# CP3 Supabase Schema-Shape Read-Only Evidence Plan

Date: 2026-05-30

Status: `CP3 Supabase schema-shape read-only evidence plan recorded`

Decision: `PLAN_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_BEFORE_RUNTIME_WIRING`

## Scope

This plan defines document-level schema-shape evidence requirements after Supabase object reachability was accepted. It does not connect to Supabase, does not run SQL, does not run remote validation, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, and does not promote CP3 readiness.

## Evidence Goal

The next schema-shape evidence must answer one narrow question:

Can the project prove, with sanitized read-only evidence, that the reachable Supabase objects expose the minimum table/view shape required by the CP3 runtime path?

This is not a data-quality gate, not a data-freshness gate, not a scoring-correctness gate, not a public-claim gate, and not a production-readiness gate.

## Local Baseline Sources

The plan uses these local sources as the baseline before any future remote evidence is considered:

- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0003_twse_stock_day_staging.sql`
- `src/lib/supabase/database.types.ts`
- `src/lib/repositories/supabase-raw-market-repository.ts`
- `scripts/validate-supabase-readonly.mjs`
- `docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_POST_RUN_REVIEW_ROLE_REVIEW_2026-05-30.md`
- `docs/reviews/CP3_POST_REACHABILITY_NEXT_PREREQUISITE_OPTIONS_MAP_2026-05-30.md`

## Object Shape Matrix

### `daily_prices`

Local baseline status: defined in `supabase/migrations/0001_initial_schema.sql` and `src/lib/supabase/database.types.ts`.

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

Runtime dependency:

- `src/lib/repositories/supabase-raw-market-repository.ts` reads `close`, `high`, `low`, `open`, `trade_date`, `turnover`, and `volume`.

Future remote evidence expectation:

- Prove object exists.
- Prove minimum fields are queryable by name.
- Prove read-only query can project field names without printing row payloads.
- Do not validate row completeness in this gate.

### `twse_stock_day_staging`

Local baseline status: remote object is reachable, but local migration defines `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`; the exact object name `twse_stock_day_staging` needs reconciliation before runtime assumptions depend on it.

Minimum reconciliation questions:

- Is `twse_stock_day_staging` a table, view, alias, or remote-only object?
- Does it map to `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`, or a later Supabase object not represented locally?
- Which fields are required for CP3 runtime, and which are staging-review-only?

Future remote evidence expectation:

- Prove object kind or documented alias.
- Prove sanitized field list only.
- Do not fetch source rows.
- Do not approve staging-to-production movement.

### `market_assets`

Local baseline status: reachable remotely, but no local migration or generated TypeScript definition was found in this slice.

Minimum reconciliation questions:

- Is `market_assets` a table, view, or remote-only compatibility object?
- Is it intended to replace or complement `stocks` and `market_exchanges`?
- Which identity fields are required for global markets?

Provisional expected field categories:

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

Future remote evidence expectation:

- Prove sanitized field categories or field names.
- Prove relationship to `stocks` / `market_exchanges` before runtime wiring.
- Do not claim global coverage.

### `model_runs`

Local baseline status: reachable remotely, but no local migration or generated TypeScript definition was found in this slice.

Minimum reconciliation questions:

- Is `model_runs` a table, view, or remote-only object?
- Is it intended to track scoring model executions, model versioning, dry-run evidence, or production score provenance?
- Which fields are required to support score-source disclosure without enabling `scoreSource=real`?

Provisional expected field categories:

- model version
- run status
- source mode
- target object
- started timestamp
- finished timestamp
- review status
- notes or error message

Future remote evidence expectation:

- Prove sanitized field categories or field names.
- Do not write model run rows.
- Do not promote model credibility.
- Do not set `scoreSource=real`.

### `data_freshness`

Local baseline status: reachable remotely, but no local migration or generated TypeScript definition was found in this slice. Local code currently references `data_runs` for freshness behavior.

Minimum reconciliation questions:

- Is `data_freshness` a table, view, or remote-only compatibility object?
- Does it replace, summarize, or complement `data_runs`?
- Which fields support stale-data disclosure in `/briefing` and stock pages?

Provisional expected field categories:

- target table
- source name
- latest data date
- freshness status
- run status
- finished timestamp
- row count
- stale reason

Future remote evidence expectation:

- Prove sanitized field categories or field names.
- Prove relationship to `data_runs`.
- Do not claim freshness quality from shape alone.

## Required Evidence Format For Future Remote Validation

Any future schema-shape validation must produce sanitized JSON with:

- `status`
- `mode`
- `objects[].name`
- `objects[].reachable`
- `objects[].shapeStatus`
- `objects[].fieldNamesPresent`
- `objects[].missingExpectedFields`
- `objects[].unexpectedRuntimeBlockers`
- `filesWritten`
- `mutations`
- `sqlExecuted`
- `rpcCalled`
- `secretsPrinted`
- `rowPayloadsPrinted`
- `scoreSourceRealChanged`
- `sourceDepthReadyChanged`
- `publicClaimsChanged`

The future validator must not print row values, sample rows, key material, SQL result payloads, raw market data, or unredacted errors containing secrets.

## Execution Gate Requirement

This plan does not authorize remote schema-shape validation. A separate execution decision gate is required before any future command may connect to Supabase, inspect remote field names, or use a confirmation variable.

## Acceptance Criteria

Schema-shape evidence can be accepted later only if:

- Every reachable object has a documented local baseline or a documented remote-only reconciliation path.
- `daily_prices` minimum runtime fields are confirmed.
- `twse_stock_day_staging` object identity is reconciled.
- `market_assets`, `model_runs`, and `data_freshness` have documented shape status.
- No row payloads are printed.
- No SQL is executed.
- No Supabase writes occur.
- No market data is fetched, parsed, ingested, or committed.
- No public claim is made.
- `scoreSource=real` remains blocked.
- CP3 remains `not_ready` until later role review.

## CEO Synthesis

The highest-value next prerequisite is not another reachability retry and not immediate runtime wiring. It is a schema-shape evidence path that reconciles local schema assumptions with reachable remote objects. This gives Engineering and PM enough structure to decide whether runtime wiring can safely remain mock-only or whether schema documentation must be updated first.

## Next Slice

- Perform role review of this schema-shape read-only evidence plan.
- Decide whether to draft a schema-shape read-only validator design or update local schema documentation first.
- Do not execute remote schema-shape validation in the role-review slice.
- Keep SQL, writes, ingestion, public claims, `scoreSource=real`, and CP3 readiness promotion blocked.

## Verification Expectations

- This schema-shape evidence plan checker passes.
- Post-reachability options map checker passes.
- Review gates pass.
- TypeScript check passes.
- No remote validation is executed in this slice.
- CP3 remains `not_ready`.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
