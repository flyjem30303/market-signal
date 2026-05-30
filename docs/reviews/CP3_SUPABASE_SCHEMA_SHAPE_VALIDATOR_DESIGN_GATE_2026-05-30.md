# CP3 Supabase Schema-Shape Validator Design Gate

Date: 2026-05-30

Status: `CP3 Supabase schema-shape validator design gate recorded`

Decision: `DESIGN_SCHEMA_SHAPE_VALIDATOR_WITHOUT_EXECUTION_AUTHORIZATION`

## Scope

This design gate specifies how a future schema-shape validator should behave after local schema contract alignment. It does not implement the validator, does not connect to Supabase, does not run remote validation, does not run SQL, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not promote CP3 readiness, and does not approve public claims.

## Design Inputs

- `docs/reviews/CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_ROLE_REVIEW_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_2026-05-30.md`
- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0003_twse_stock_day_staging.sql`
- `src/lib/supabase/database.types.ts`
- `src/lib/repositories/supabase-raw-market-repository.ts`
- `src/lib/repositories/supabase-data-freshness-repository.ts`

## Validator Objective

The future validator should answer one narrow question:

Can the reachable Supabase objects expose the expected field names or documented reconciliation status needed before runtime wiring depends on them?

The future validator must not prove data quality, data freshness, row completeness, historical depth, model credibility, source-depth readiness, public claims, or `scoreSource=real` readiness.

## Proposed Future Validator Name

Proposed script name:

- `scripts/validate-supabase-schema-shape-readonly.mjs`

This file is not created in this slice.

## Required Confirmation Gate

If implemented later, the validator must fail closed unless:

- a separate execution decision gate authorizes exactly one run
- process environment includes `SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION`
- confirmation value equals `CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE`
- required Supabase environment variables are present in process environment
- `.env.local` is not modified

## Proposed Object Rules

### `daily_prices`

Contract status: `local-baselined`

Expected fields:

- `stock_id`
- `trade_date`
- `open`
- `high`
- `low`
- `close`
- `volume`
- `turnover`
- `created_at`

Future validator behavior:

- verify object is reachable
- verify expected field names can be projected by name
- report missing expected fields
- report no row payloads printed
- do not validate historical depth
- do not validate data quality
- do not write `daily_prices`

### `twse_stock_day_staging`

Contract status: `needs-reconciliation`

Expected validation behavior:

- verify object is reachable only if a future execution gate allows it
- classify object kind as `table`, `view`, `alias`, `remote_only`, `unknown`, or `blocked`
- report whether it appears reconciled with `staging_twse_stock_day_runs` or `staging_twse_stock_day_prices`
- do not fetch staging source rows
- do not approve staging-to-production movement
- do not write staging rows

### `market_assets`

Contract status: `remote-only-pending-contract`

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

Future validator behavior:

- report sanitized field names or blocked status
- classify whether the remote shape can support global asset identity discussion
- do not claim global coverage
- do not wire runtime to this object

### `model_runs`

Contract status: `remote-only-pending-contract`

Expected field categories:

- model version
- run status
- source mode
- target object
- started timestamp
- finished timestamp
- review status
- notes or error message

Future validator behavior:

- report sanitized field names or blocked status
- classify whether the remote shape can support score provenance discussion
- do not write model run rows
- do not promote model credibility
- do not set `scoreSource=real`

### `data_freshness`

Contract status: `remote-only-pending-contract`

Expected field categories:

- target table
- source name
- latest data date
- freshness status
- run status
- finished timestamp
- row count
- stale reason

Future validator behavior:

- report sanitized field names or blocked status
- classify relationship to local `data_runs` as `matches`, `summarizes`, `replaces`, `unrelated`, `unknown`, or `blocked`
- do not claim freshness quality
- do not replace runtime `data_runs` behavior without later review

## Required Sanitized Output Shape

Any future validator output must be JSON with:

- `status`
- `mode`
- `confirmation`
- `filesWritten`
- `mutations`
- `sqlExecuted`
- `rpcCalled`
- `secretsPrinted`
- `rowPayloadsPrinted`
- `rawMarketDataPrinted`
- `scoreSourceRealChanged`
- `sourceDepthReadyChanged`
- `publicClaimsChanged`
- `objects[].name`
- `objects[].contractStatus`
- `objects[].reachable`
- `objects[].shapeStatus`
- `objects[].objectKind`
- `objects[].fieldNamesPresent`
- `objects[].missingExpectedFields`
- `objects[].unexpectedRuntimeBlockers`
- `objects[].relationshipToLocalBaseline`

The future validator must not print:

- row values
- sample rows
- key material
- key prefixes
- key suffixes
- key lengths
- SQL result payloads
- raw market data
- unredacted secret-bearing errors

## Required Safety Implementation Rules

Future implementation must:

- use Supabase client metadata/query projection only as read-only evidence
- set a strict row limit of `0` or avoid row selection where possible
- never call `insert`, `update`, `upsert`, `delete`, `rpc`, or storage writes
- never execute raw SQL
- never create seed SQL
- never write output files automatically
- never mutate `.env.local`
- return fail-closed JSON on missing confirmation
- return fail-closed JSON on missing environment variables
- return fail-closed JSON on malformed remote responses

## Execution Boundary

This design gate does not authorize implementation or execution. The next slice may draft a validator skeleton only if it remains local and fail-closed. A later execution decision gate is required before any command may connect to Supabase.

## Acceptance Criteria For Future Role Review

The design can move forward only if role review confirms:

- validator skeleton is fail-closed by default
- aggregate review gates do not run remote validation
- sanitized output shape is enforced
- no row payloads are printed
- no SQL execution is possible
- no Supabase write methods are present
- no public claim is enabled
- `scoreSource=real` remains blocked
- CP3 remains `not_ready`

## CEO Synthesis

The validator design is acceptable as a local-only design gate because it translates the schema contract alignment into an auditable future validator shape. The CEO does not authorize implementation or execution in this slice. The next safest step is role review of this design gate, followed by a fail-closed skeleton only if the review accepts the design.

## Next Slice

- Perform role review of this schema-shape validator design gate.
- Do not implement the validator in the role-review slice.
- Do not execute remote validation.
- Keep SQL, writes, ingestion, public claims, `scoreSource=real`, and CP3 readiness promotion blocked.

## Verification Expectations

- This schema-shape validator design gate checker passes.
- Local schema contract alignment checker passes.
- Review gates pass.
- TypeScript check passes.
- No validator implementation is created in this slice.
- No remote validation is executed in this slice.
- CP3 remains `not_ready`.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
