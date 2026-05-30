# CP3 Post-Reachability Next-Prerequisite Options Map

Date: 2026-05-30

Status: `CP3 post-reachability next-prerequisite options map recorded`

Decision: `RECOMMEND_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_BEFORE_RUNTIME_WIRING`

## Scope

Supabase object reachability is accepted as a narrow CP3 prerequisite. This options map decides the next bounded prerequisite after reachability. It does not run SQL, does not write Supabase, does not ingest market data, does not set `scoreSource=real`, does not promote CP3 readiness, and does not approve public claims.

## Current Accepted Prerequisite

- Supabase object reachability: accepted.
- Evidence type: sanitized read-only validator result.
- Accepted objects: `daily_prices`, `twse_stock_day_staging`, `market_assets`, `model_runs`, `data_freshness`.
- Remaining status: CP3 remains `not_ready`.

## Option A: Schema-Shape Read-Only Evidence

Description: Create a bounded read-only evidence plan and checker for expected schema shape, without running SQL and without committing row payloads.

Primary value:

- Confirms whether the reachable objects expose the minimum structure needed by the runtime path.
- Reduces risk before wiring UI/runtime against Supabase-backed assumptions.
- Builds a bridge between reachability and runtime implementation.

Allowed work in this option:

- Draft schema-shape evidence requirements.
- Define expected object/column presence at a document level.
- Add static checker for the evidence plan.
- Keep all evidence sanitized.
- Require a separate execution gate before any future remote schema-shape validation.

Blocked work in this option:

- Running SQL is blocked.
- Running migrations is blocked.
- Writing Supabase is blocked.
- Fetching, parsing, ingesting, or committing market data is blocked.
- Setting `scoreSource=real` is blocked.
- Promoting CP3 readiness is blocked.

Risks:

- It may feel slower than UI wiring.
- It still requires a later execution gate if remote schema-shape validation is needed.

CEO assessment: highest decision quality. This is the best next prerequisite because runtime wiring depends on schema assumptions.

## Option B: Mock-Only Runtime Wiring

Description: Continue wiring the UI/runtime state using mock-only source boundaries and existing local fixtures.

Primary value:

- Produces visible product progress sooner.
- Improves user-facing flow while real-data gates remain blocked.
- Can proceed without touching Supabase again.

Allowed work in this option:

- Wire mock-only runtime state.
- Improve UI state disclosure.
- Keep public data source mock.
- Keep `scoreSource=real` blocked.
- Add local tests and review gates.

Blocked work in this option:

- Supabase remote validation is blocked unless a new gate authorizes it.
- SQL and writes are blocked.
- Real market-data ingestion is blocked.
- Public claims are blocked.
- CP3 readiness promotion is blocked.

Risks:

- UI wiring could encode assumptions that later schema-shape evidence rejects.
- Product progress may look real to stakeholders even though data source remains mock.

CEO assessment: valuable but second priority. It should follow schema-shape evidence unless a demo deadline forces mock-only progress.

## Option C: Data Freshness Read-Only Plan

Description: Plan how freshness will be checked once schema-shape evidence is accepted.

Primary value:

- Prepares the next data-quality gate.
- Keeps source freshness, stale-data handling, and user disclosure visible.

Risks:

- Premature before schema shape is accepted.
- Could create a plan on top of uncertain table assumptions.

CEO assessment: defer. It is important, but it should follow schema-shape evidence.

## Option D: Additional Supabase Retry

Description: Repeat object reachability or run a broader remote check.

Primary value:

- Low value now that one successful read-only retry exists.

Risks:

- Repeats a closed question.
- Consumes review capacity without improving the next implementation decision.
- Requires a new authorization gate.

CEO assessment: reject for now. Additional remote retries remain blocked unless a new concrete need emerges.

## CEO Recommendation

Proceed with Option A: Schema-Shape Read-Only Evidence. It is the smallest useful step after object reachability because it validates the assumptions that runtime wiring would otherwise depend on. It also keeps the project moving toward runtime and Supabase readiness without jumping into SQL, writes, ingestion, or real score-source promotion.

## PM Execution Plan

Next slice should create:

- `CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN`
- a static checker for the plan
- aggregate review-gate entry

Next slice should not:

- run SQL
- connect to Supabase
- write Supabase
- modify `.env.local`
- fetch or ingest market data
- commit row payloads
- set `scoreSource=real`
- promote CP3 readiness

## Status Impact

- Supabase object reachability: accepted.
- Next recommended prerequisite: schema-shape read-only evidence plan.
- CP3 readiness: remains `not_ready`.
- Public data source: remains mock.
- `scoreSource=real`: remains blocked.
- SQL/write/ingestion/public claims: remain blocked.

## Verification Expectations

- This options map checker passes.
- Post-run role review checker passes.
- Review gates pass.
- TypeScript check passes.
- No remote validation is executed in this slice.
- CP3 remains `not_ready`.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
