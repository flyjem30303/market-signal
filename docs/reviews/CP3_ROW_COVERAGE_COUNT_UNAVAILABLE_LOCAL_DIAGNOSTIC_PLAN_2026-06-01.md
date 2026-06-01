# CP3 Row Coverage Count Unavailable Local Diagnostic Plan

Status: `CP3 row coverage count_unavailable local diagnostic plan recorded`

Decision: `DIAGNOSE_COUNT_UNAVAILABLE_LOCALLY_BEFORE_SECOND_REMOTE_ATTEMPT`

Trigger: `CP3 row coverage remote-capable runner one-attempt post-run review recorded`

## Scope

This plan diagnoses the blocked `count_unavailable` result from the first row coverage readonly attempt. It does not run a second remote attempt, does not connect to Supabase, does not run SQL, does not write Supabase, does not write staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not print secrets, does not output row payloads, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Local Evidence

```text
EVIDENCE-001 first remote-capable row coverage attempt returned status blocked
EVIDENCE-002 first attempt returned reason aggregate_count_incomplete
EVIDENCE-003 first attempt returned observedTotalRows 0
EVIDENCE-004 first attempt returned missingRows 360
EVIDENCE-005 first attempt returned count_unavailable for TWII, 0050, 006208, 2330, 2382, and 2308
EVIDENCE-006 generated Supabase types define daily_prices.stock_id
EVIDENCE-007 generated Supabase types define daily_prices.trade_date
EVIDENCE-008 generated Supabase types do not define daily_prices.symbol
EVIDENCE-009 docs/DATA_SCHEMA.md describes daily_prices stock_id and trade_date
EVIDENCE-010 docs/DATA_SCHEMA.md does not list symbol as a daily_prices column
EVIDENCE-011 generated Supabase types define stocks.symbol
EVIDENCE-012 generated Supabase types define stocks.id
EVIDENCE-013 current runner queries daily_prices with .select("symbol", { count: "exact", head: true })
EVIDENCE-014 current runner filters daily_prices with .eq("symbol", symbol)
```

## Primary Diagnostic Finding

```text
FINDING-001 primary suspected cause is query contract mismatch
FINDING-002 runner currently assumes daily_prices has symbol
FINDING-003 local schema evidence says daily_prices uses stock_id
FINDING-004 local schema evidence says symbol lives on stocks
FINDING-005 count_unavailable can plausibly occur because symbol is not a daily_prices column
FINDING-006 this finding is local-only and does not prove remote RLS, policy, or relation state
```

## Secondary Possible Causes

```text
CAUSE-001 Supabase relation daily_prices may not exist in the connected project
CAUSE-002 daily_prices may exist but differ from generated local types
CAUSE-003 daily_prices may exist but RLS or grants may block count queries
CAUSE-004 service role credential may not match the intended project
CAUSE-005 PostgREST may reject head/count queries when selected column is invalid
CAUSE-006 expected symbols may need stock_id lookup through stocks before daily_prices coverage counting
CAUSE-007 index asset TWII may not map to a stock_id in the current stocks table
CAUSE-008 ETFs 0050 and 006208 may need stock_id mapping before daily_prices counting
```

## Recommended Fix Direction

```text
FIX-001 do not retry the same symbol-column query
FIX-002 prepare a local runner query-contract revision
FIX-003 resolve symbols to stock ids through stocks before daily_prices count
FIX-004 count daily_prices by stock_id instead of symbol
FIX-005 keep head/count aggregate reads only
FIX-006 keep sanitized symbol identifiers and aggregate observedRows only
FIX-007 do not print stock_id values unless a separate redaction policy approves them
FIX-008 keep canAwardRowCoveragePoints false until a post-run review accepts evidence
FIX-009 keep scoreSource mock
FIX-010 require a new one-attempt gate before any second remote attempt
```

## Role Review

```text
CEO-FINDING-001 do not spend another remote attempt on a likely query-shape mismatch
CEO-FINDING-002 next progress should be a bounded local code fix plus static checker update
PM-FINDING-001 this is a good acceleration point because the root-cause hypothesis is concrete
PM-FINDING-002 a second attempt should wait until the runner aligns with generated schema
ENGINEERING-FINDING-001 daily_prices.symbol is not present in generated types
ENGINEERING-FINDING-002 daily_prices.stock_id and stocks.symbol are present in generated types
ENGINEERING-FINDING-003 current runner should be changed from symbol filter to stock_id coverage counting
DATA-FINDING-001 row coverage should count expected rows per mapped asset, not assume raw symbol storage in daily_prices
DATA-FINDING-002 missing mapping for an asset should be reported separately from missing price rows
SECURITY-FINDING-001 diagnostics must not print keys, prefixes, suffixes, lengths, stock_id payloads, or raw rows
LEGAL-PUBLIC-CLAIMS-FINDING-001 no public claim may be based on the blocked attempt
LEGAL-PUBLIC-CLAIMS-FINDING-002 scoreSource=real remains blocked
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 create a local query-contract revision gate for runner fix
NEXT-SLICE-002 update runner to resolve stock_id from stocks by symbol before counting daily_prices
NEXT-SLICE-003 update static checker to require stock_id counting and reject daily_prices.symbol assumptions
NEXT-SLICE-004 run fail-closed checker and review gates locally
NEXT-SLICE-005 do not run a second remote attempt until a new one-attempt execution gate is recorded
NEXT-SLICE-006 keep public data source mock
NEXT-SLICE-007 keep scoreSource mock
NEXT-SLICE-008 keep row coverage points unawarded
NEXT-SLICE-009 keep CP3 not_ready
```

## Verification Expectations

```text
scripts/check-row-coverage-count-unavailable-local-diagnostic-plan.mjs passes
scripts/check-row-coverage-remote-capable-runner-one-attempt-post-run-review.mjs passes
scripts/check-row-coverage-readonly-guarded-runner.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
localhost health passes
no second remote attempt occurs
SQL execution remains blocked
Supabase writes remain blocked
public claims remain blocked
```
