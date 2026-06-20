# A1 Full TWSE Equity Historical Coverage Safe Implementation Plan

Updated: 2026-06-18

Status: `a1_full_twse_equity_historical_coverage_safe_plan_ready_dry_run_only`

Owner: A1 Data Coverage Background Line

## 1. Scope Recommendation

Recommended coverage range:

- Universe: TWSE listed common-stock equities only, resolved from `stocks` where `country=TW`, `exchange=TWSE`, `asset_type=stock`, `is_etf=false`, and `is_active=true`.
- Exclusions for this packet: ETF, index lanes, TPEx/OTC, warrants, preferred shares, delisted/inactive issues, corporate-action adjustment, fundamentals, flows, and scoring.
- Target relation after later authorization: `daily_prices`.
- Future staging relation: `staging_twse_stock_day_runs` plus `staging_twse_stock_day_prices`.
- First executable expansion shape: report-only dry-run inventory for aggregate counts, not market-row storage.
- Historical window recommendation: configurable by month range, defaulting to a small pilot window before any full-history crawl.

This packet does not claim that full上市 coverage is complete. It defines the safe path to measure and prepare it.

## 2. Current Repo Evidence

- Local production table shape exists in `supabase/migrations/0001_initial_schema.sql`: `stocks` and `daily_prices` with primary key `(stock_id, trade_date)`.
- Local staging table draft exists in `supabase/migrations/0003_twse_stock_day_staging.sql`: `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`.
- Existing TWSE STOCK_DAY design docs already define parser, metadata, validation, staging, readback, and production-write stop lines.
- Existing local report-only equity runner is limited to `2330,2382,2308`, `60` sessions, and `180` expected rows.
- Existing write runners require explicit authorization and are not suitable for autonomous full-universe execution.

## 3. TWSE Source Support

Supported candidate source:

- `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={YYYYMMDD}&stockNo={symbol}`
- Strength: symbol-month historical daily OHLCV source already modeled in repo scripts and candidate artifacts.
- Limitation: not a one-call all-symbol full-history endpoint; full上市 coverage requires symbol by month iteration, rate limiting, retry control, and source-rights approval.

Official OpenAPI posture:

- `https://openapi.twse.com.tw/` exposes an OAS service under `https://openapi.twse.com.tw/v1`.
- Repo evidence currently treats OpenAPI v1 as useful for current/open-data routes and treats `www.twse.com.tw/exchangeReport/STOCK_DAY` as the historical individual-stock route.
- Therefore the safe implementation should not assume TWSE OpenAPI v1 alone can fill full historical per-symbol coverage.

## 4. Dry-Run First Implementation Boundaries

Default mode must be dry-run/report-only.

Allowed before new authorization:

- Read local docs, schema files, and package scripts.
- Produce aggregate-only inventory plans.
- Validate command shape, batch size, month range, and target table contract.
- Use synthetic or local metadata for planning.
- Print sanitized aggregate fields only.

Not allowed from this packet:

- market endpoint fetch
- SQL execution
- Supabase connection
- Supabase write
- staging-row creation
- `daily_prices` mutation
- raw payload, row payload, source URL payload, stock-id list, or secret output
- public runtime promotion to `publicDataSource=supabase`
- score promotion to `scoreSource=real`
- row coverage credit award

## 5. Proposed Execution Phases

### Phase A: Full-Universe Inventory Dry Run

Goal: decide the exact universe and expected work without printing symbols.

Inputs:

- `stocks` table contract
- active TWSE listed-equity filter
- approved month range
- per-symbol month cap

Output:

- active listed-equity count
- requested month count
- theoretical request count
- estimated trading-session rows
- batch count
- stop-line status

### Phase B: Bounded Source-Depth Pilot

Goal: prove source support on a tiny symbol/month sample.

Required before execution:

- PM approval for source-depth pilot
- D/legal approval for attribution, storage, retention, redistribution, and derived-score use
- exact allowed sample size
- exact rate limit

Default output:

- aggregate HTTP status counts
- parser flag counts
- zero-row month counts
- no row payloads

### Phase C: Staging Candidate Generation

Goal: create sanitized candidate artifacts only after source-depth evidence is accepted.

Required:

- explicit candidate artifact authorization
- candidate path approval
- no-secret validation
- no raw payload persistence

### Phase D: Staging Write

Goal: write only to staging after separate CEO/PM authorization.

Required:

- staging migration confirmed applied remotely
- RLS and server-only credential posture confirmed
- rollback dry-run count ready
- one-attempt command with confirmation phrase

### Phase E: Missing-Only `daily_prices` Merge

Goal: insert missing rows only, never overwrite existing rows.

Required:

- accepted staging readback
- overlap classification
- insert-missing/skip-existing policy
- aggregate post-run review
- no public source or score promotion

## 6. Recommended Commands

Current safe command:

```text
cmd.exe /c npm run check:a1-full-twse-equity-historical-coverage-safe-plan
cmd.exe /c npm run report:a1-full-twse-equity-inventory-dry-run
cmd.exe /c npm run check:a1-full-twse-equity-inventory-dry-run
```

Phase A inventory dry-run reads only `data/seeds/stocks.seed.json` and prints aggregate counts. It does not print stock IDs or market rows. Current local seed evidence resolves `1083` active TWSE listed common-stock equities after excluding ETF, index, inactive, non-TWSE, and non-four-digit symbols.

Existing related dry-run/check commands:

```text
cmd.exe /c npm run check:cp3-twse-stock-day-controlled-ingestion-design
cmd.exe /c npm run check:cp3-twse-stock-day-dry-run-reporter-design
cmd.exe /c npm run report:tw-equity-local-report-only-dry-run
cmd.exe /c npm run check:tw-equity-local-report-only-runner
cmd.exe /c npm run check:supabase-twse-stock-day-staging-schema
```

Do not run write commands for this packet.

## 7. Authorization Still Missing

- Full上市 universe approval and exclusion policy.
- TWSE STOCK_DAY legal/source-rights approval for automated historical collection, storage, redistribution, attribution, retention, and derived-score use.
- Rate-limit/fair-use policy for all-symbol month iteration.
- Remote Supabase schema exposure and staging table confirmation.
- Server-only credential usage approval.
- Candidate artifact path approval for full-universe sanitized outputs.
- Staging write authorization.
- `daily_prices` insert-missing merge authorization.
- Rollback/quarantine and readback approval.
- Public `publicDataSource=supabase` promotion approval.
- `scoreSource=real` promotion approval.

## 8. Recommendation

Phase A is now locally executable through the full-universe inventory dry-run checker. Phase B bounded source-depth pilot has one sanitized result recorded at `data/evidence-intake/a1-bounded-source-depth-pilot-result-20260618.json`.

Next recommended slice is now executable as a plan-only dry run:

```text
cmd.exe /c npm run report:a1-rate-limited-candidate-generation-plan
cmd.exe /c npm run check:a1-rate-limited-candidate-generation-plan
cmd.exe /c npm run report:a1-rate-limited-candidate-generation-execution-packet
cmd.exe /c npm run check:a1-rate-limited-candidate-generation-execution-packet
cmd.exe /c npm run check:a1-full-twse-equity-rate-limited-candidate-runner
```

The plan uses local seed evidence only and estimates `1083` TWSE listed common-stock equities, `3249` symbol-month requests for a 3-month first candidate window, `71478` expected session rows, `50` symbols per batch, and `22` batches. It does not fetch market data, print stock IDs, create candidate row payloads, connect to Supabase, write staging rows, mutate `daily_prices`, or promote public/real score settings.

The execution packet is still no-execution. It only makes the future one-attempt boundary explicit: generated candidate artifacts must stay under `tmp/a1-full-twse-equity-candidates/`, must not be committed, and must receive post-run review before any staging-write discussion.

The bounded runner is implemented but fail-closed by default:

```text
cmd.exe /c "set A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_CONFIRM=A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_2026_06_18&& npm run run:a1-full-twse-equity-rate-limited-candidate-generation-once"
```

Do not run this command until CEO/PM explicitly names the one-attempt candidate artifact generation decision. A normal default run must remain blocked and must not fetch, write files, connect to Supabase, run SQL, mutate `daily_prices`, print stock IDs, or promote public/real score settings.

Keep full-universe market fetch, Supabase read/write, staging, and `daily_prices` mutation closed until the candidate path, rate-limit policy, staging write, merge, rollback, and promotion authorizations are accepted.

## 9. First Bounded Candidate Attempt Post-Run

First bounded attempt result:

- Artifact path: `tmp/a1-full-twse-equity-candidates/20260618T141642Z-candidate.json`
- Attempted requests: `3249`
- Candidate rows: `57654`
- Unique TWSE listed common-stock universe count: `1083`
- SQL executed: `false`
- Supabase connected: `false`
- Supabase write: `false`
- `daily_prices` mutation: `false`
- Public source promotion: `false`
- Score source promotion: `false`

Post-run review status: `candidate_post_run_review_blocked`.

Block reason: the artifact was generated before the runner enforced requested-month window filtering. Aggregate review found `40` out-of-window rows and `125` parser flags. The artifact remains useful as evidence that the route and rate-limit shape can complete, but it is not safe for staging validation or write discussion.

Repair applied after the first attempt:

- `scripts/run-a1-full-twse-equity-rate-limited-candidate-generation-once.mjs` now rejects rows outside the requested month window.
- Rejected rows are counted as `outOfWindowRowCount` and `row_outside_requested_window`.
- `scripts/report-a1-full-twse-equity-candidate-post-run-review.mjs` records aggregate-only post-run review.
- `scripts/check-a1-full-twse-equity-candidate-post-run-review.mjs` verifies aggregate review, date-window review, and no Supabase/SQL/`daily_prices` mutation.

Next recommended action: run one corrected bounded candidate attempt, then run post-run review again. Do not advance to staging write unless the corrected artifact has zero out-of-window rows, zero duplicate symbol-date rows, and passes sanitized row validation.

## 10. Corrected Candidate Attempt And Current-Scope Validation

Corrected bounded attempt result:

- Artifact path: `tmp/a1-full-twse-equity-candidates/20260618T152613Z-candidate.json`
- Attempted requests: `3249`
- Candidate rows before cleanup: `57440`
- Out-of-window rows rejected by runner: `45`
- SQL executed: `false`
- Supabase connected: `false`
- Supabase write: `false`
- `daily_prices` mutation: `false`

Cleanup result:

- Cleaned artifact path: `tmp/a1-full-twse-equity-candidates/20260618T152613Z-cleaned-candidate.json`
- Candidate rows after duplicate cleanup: `57398`
- Out-of-window rows in cleaned artifact: `0`
- Duplicate symbol-date rows in cleaned artifact: `0`
- Post-run review status: `candidate_post_run_review_ready_for_validation`

Current Phase 1 merge result:

- Merged artifact path: `tmp/a1-full-twse-equity-candidates/phase-1-current-scope-twii-plus-full-listed-stock-row-payload.json`
- Scope: `twii_plus_listed_stock_daily_close`
- Symbols covered: `1084` (`TWII` plus `1083` TWSE listed common-stock equities)
- Rows: `57458`
- TWII rows: `60`
- Listed-stock rows: `57398`
- Date bounds: `2026-03-19` to `2026-06-18`
- Duplicate rows: `0`
- Invalid trade dates: `0`
- Invalid price rows: `0`
- Validator status: `phase_1_current_scope_sanitized_row_payload_candidate_artifact_validated_aggregate_only`

This is still a local sanitized candidate artifact, not production data. It does not authorize staging writes, `daily_prices` merge, public runtime promotion, or `scoreSource=real`.

Next recommended action: prepare and run the existing bounded write preflight against this validated artifact, then decide whether to name a separate staging write attempt.
