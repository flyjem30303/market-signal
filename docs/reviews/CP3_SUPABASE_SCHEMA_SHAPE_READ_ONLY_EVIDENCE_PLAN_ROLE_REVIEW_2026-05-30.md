# CP3 Supabase Schema-Shape Read-Only Evidence Plan Role Review

Date: 2026-05-30

Status: `CP3 Supabase schema-shape read-only evidence plan role review recorded`

Decision: `ACCEPT_SCHEMA_SHAPE_PLAN_AND_PRIORITIZE_LOCAL_SCHEMA_DOCUMENTATION_ALIGNMENT`

## Scope

This role review accepts the schema-shape read-only evidence plan as the correct next prerequisite after Supabase object reachability. It does not authorize remote schema-shape validation, does not connect to Supabase, does not run SQL, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not promote CP3 readiness, and does not approve public claims.

## Reviewed Artifacts

- `docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_2026-05-30.md`
- `docs/reviews/CP3_POST_REACHABILITY_NEXT_PREREQUISITE_OPTIONS_MAP_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_POST_RUN_REVIEW_ROLE_REVIEW_2026-05-30.md`
- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0003_twse_stock_day_staging.sql`
- `src/lib/supabase/database.types.ts`
- `src/lib/repositories/supabase-raw-market-repository.ts`
- `scripts/check-cp3-supabase-schema-shape-read-only-evidence-plan.mjs`
- `scripts/check-review-gates.mjs`

## Role Findings

### CEO

The schema-shape plan is accepted. The next best slice is local schema documentation alignment before validator design because the project already found a contract gap: `daily_prices` has local schema/type support, while `twse_stock_day_staging` needs object-name reconciliation and `market_assets`, `model_runs`, and `data_freshness` are reachable remotely but not represented in local migration/type baselines.

### PM

This plan gives the team a clean path from reachability to runtime readiness without overclaiming. PM prioritizes a local documentation alignment slice because it creates a stable contract for Engineering, QA, Data, and Security before any future remote schema-shape validator is drafted.

### Engineering

Engineering accepts the evidence format and object matrix. Engineering recommends documenting the canonical local/remote contract first, including whether remote-only objects are tables, views, aliases, or compatibility objects. A validator design should follow only after the contract is explicit.

### QA

QA accepts the plan because it separates object reachability, schema shape, data quality, freshness, scoring correctness, and public claims. QA requires the next slice to preserve `not_ready` status and to prove that no remote validation occurred.

### Data

Data accepts the plan as a schema prerequisite only. Data does not accept shape evidence as freshness, completeness, historical coverage, price integrity, or source-depth evidence.

### Security

Security accepts the plan because it requires sanitized JSON and blocks row values, sample rows, key material, SQL result payloads, raw market data, and unredacted secret-bearing errors. Security requires any future remote validation to have a separate execution gate.

### Legal

Legal accepts the plan only as internal readiness work. No public claim, source-depth production wording, or real score-source promotion may be made from this plan.

## Accepted Decisions

- Schema-shape evidence is the correct prerequisite after reachability.
- Local schema documentation alignment should happen before remote validator design.
- `daily_prices` is the only reviewed object with clear local schema/type support in this slice.
- `twse_stock_day_staging` requires object-name reconciliation.
- `market_assets`, `model_runs`, and `data_freshness` require local/remote contract documentation before runtime wiring.
- Future remote schema-shape validation requires a separate execution decision gate.

## Still Blocked

- Remote schema-shape validation is blocked.
- Supabase connection is blocked in this role-review slice.
- SQL execution is blocked.
- Migration execution is blocked.
- Supabase writes are blocked.
- Insert, update, upsert, delete, RPC, and storage writes are blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit are blocked.
- `.env.local` modification is blocked.
- `scoreSource=real` remains blocked.
- CP3 readiness promotion remains blocked.
- Public market-data claims remain blocked.
- Additional object reachability retries remain blocked unless a new gate authorizes them.

## CEO Synthesis

The schema-shape evidence plan is accepted, but the CEO chooses local schema documentation alignment as the next slice before validator design. This is faster than premature remote validation because it reduces ambiguity around object names and ownership without touching Supabase. It also improves the eventual validator specification and lowers the chance that runtime wiring encodes the wrong contract.

## Next Slice

Create a local-only CP3 Supabase schema contract alignment document that:

- maps reachable remote objects to local migrations, generated types, and runtime repositories
- marks each object as local-baselined, needs reconciliation, or remote-only pending contract
- records expected field categories for remote-only objects
- identifies which objects are runtime-critical versus review/support-only
- keeps SQL, writes, remote validation, ingestion, public claims, `scoreSource=real`, and readiness promotion blocked

## Verification Expectations

- This role review checker passes.
- Schema-shape evidence plan checker passes.
- Post-reachability options map checker passes.
- Review gates pass.
- TypeScript check passes.
- No remote validation is executed in this slice.
- CP3 remains `not_ready`.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
