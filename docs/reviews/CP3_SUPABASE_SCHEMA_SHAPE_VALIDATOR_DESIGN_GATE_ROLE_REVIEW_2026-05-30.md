# CP3 Supabase Schema-Shape Validator Design Gate Role Review

Date: 2026-05-30

Status: `CP3 Supabase schema-shape validator design gate role review recorded`

Decision: `ACCEPT_DESIGN_AND_ALLOW_FAIL_CLOSED_SCHEMA_SHAPE_VALIDATOR_SKELETON`

## Scope

This role review accepts the schema-shape validator design gate and allows the next slice to create a local fail-closed skeleton only. It does not authorize implementation that connects to Supabase, does not authorize remote schema-shape validation, does not run SQL, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not promote CP3 readiness, and does not approve public claims.

## Reviewed Artifacts

- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_VALIDATOR_DESIGN_GATE_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_ROLE_REVIEW_2026-05-30.md`
- `scripts/check-cp3-supabase-schema-shape-validator-design-gate.mjs`
- `scripts/check-cp3-supabase-local-schema-contract-alignment.mjs`
- `scripts/check-review-gates.mjs`

## Role Findings

### CEO

The design gate is accepted because it translates the local schema contract alignment into a clear future validator shape. The next slice may create a fail-closed skeleton, but it must not connect to Supabase or perform remote validation. Execution remains a separate future decision.

### PM

The design is specific enough for a bounded implementation slice. PM accepts a skeleton because it gives Engineering something concrete to test locally while still preserving the runtime and data boundaries.

### Engineering

Engineering accepts the output shape, confirmation guard, and object-specific rules. The skeleton must default to fail-closed JSON, must not import or instantiate a Supabase client for remote use, and must not be wired into aggregate gates as an executing remote validator.

### QA

QA accepts the design only if the skeleton has local tests/checkers proving fail-closed behavior, missing confirmation behavior, no SQL path, no write methods, no row payload output, and no aggregate remote execution.

### Data

Data accepts the design as schema-shape planning only. It remains not data quality, not freshness, not completeness, not historical depth, not model credibility, and not source-depth readiness.

### Security

Security accepts the design because it blocks key material, key prefixes, key suffixes, key lengths, row values, sample rows, SQL result payloads, raw market data, and unredacted secret-bearing errors. Future skeleton must preserve those output guarantees.

### Legal

Legal accepts the design only as internal readiness work. No public claim, global coverage claim, source-depth production language, or `scoreSource=real` promotion is permitted.

## Accepted Decisions

- Schema-shape validator design is accepted.
- Next slice may create `scripts/validate-supabase-schema-shape-readonly.mjs` as a fail-closed skeleton only.
- Skeleton may define constants, expected object contracts, sanitized output shape, and fail-closed guard behavior.
- Skeleton must not connect to Supabase.
- Skeleton must not run remote validation.
- Skeleton must not execute SQL.
- Skeleton must not call `insert`, `update`, `upsert`, `delete`, `rpc`, or storage writes.
- Skeleton must not print row payloads.
- Skeleton must not modify `.env.local`.
- Aggregate review gates may check skeleton safety but must not execute remote validation.

## Required Skeleton Behavior

The next skeleton must:

- exit with fail-closed JSON unless explicitly authorized in a later execution gate
- report `status: "blocked"` when confirmation is absent
- report `mode: "schema_shape_readonly_skeleton"`
- report `filesWritten: false`
- report `mutations: false`
- report `sqlExecuted: false`
- report `rpcCalled: false`
- report `secretsPrinted: false`
- report `rowPayloadsPrinted: false`
- report `rawMarketDataPrinted: false`
- report `scoreSourceRealChanged: false`
- report `sourceDepthReadyChanged: false`
- report `publicClaimsChanged: false`
- include object contract metadata for `daily_prices`, `twse_stock_day_staging`, `market_assets`, `model_runs`, and `data_freshness`

## Still Blocked

- Remote schema-shape validation is blocked.
- Supabase connection is blocked.
- SQL execution is blocked.
- Migration execution is blocked.
- Supabase writes are blocked.
- Insert, update, upsert, delete, RPC, and storage writes are blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit are blocked.
- `.env.local` modification is blocked.
- `scoreSource=real` remains blocked.
- CP3 readiness promotion remains blocked.
- Public market-data claims remain blocked.
- Validator execution approval remains blocked until a later execution decision gate.

## CEO Synthesis

The CEO accepts the validator design and authorizes only a local fail-closed skeleton as the next slice. This is the smallest useful move toward runtime readiness because it converts the design into a testable safety boundary without touching Supabase. It still keeps execution, SQL, writes, ingestion, public claims, and real score-source promotion blocked.

## Next Slice

- Create the fail-closed schema-shape validator skeleton.
- Add a skeleton safety checker.
- Add aggregate review-gate entry for skeleton safety only.
- Do not connect to Supabase.
- Do not execute remote validation.
- Do not run SQL.
- Do not write Supabase.
- Keep CP3 as `not_ready`.

## Verification Expectations

- This role review checker passes.
- Schema-shape validator design gate checker passes.
- Local schema contract alignment checker passes.
- Review gates pass.
- TypeScript check passes.
- No validator remote execution is created in this slice.
- No remote validation is executed in this slice.
- CP3 remains `not_ready`.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
