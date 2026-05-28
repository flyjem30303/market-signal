# CP1 Follow-up: Supabase Market Trust Review

Date: 2026-05-29

Trigger:

- Supabase bootstrap validation passed.
- Supabase freshness is enabled locally.
- The next decision is whether real raw market data can move beyond smoke tests.

Command:

```text
node --env-file=.env.local scripts/review-supabase-market-trust.mjs
```

Result:

```text
decision: PROCEED_INTERNAL_ONLY
latest_data_run.as_of_date: 2026-05-27
latest_data_run.source_name: TWSE OpenAPI
latest_data_run.status: complete
public_preview_symbols: 7
raw_ready_symbols: 7
blocked_symbols: 0
missing_symbols: 0
public_release_gate.approved: false
```

Sample reviewed symbols:

```text
0050, 006208, 2330, 2454, 2317, 2308, 2382
```

ETF note:

- `0050` and `006208` have latest price rows.
- They do not have stock-style fundamentals in the current TWSE seed.
- This is treated as an internal warning, not a blocker, because ETF valuation
  fields need a separate ETF-specific data model.

## A / PM + Developer

A confirms the raw market read path is strong enough for internal preview work:

- all current public preview symbols resolve in Supabase
- all reviewed symbols have latest price rows
- stock-style fundamentals exist for the reviewed common stocks
- ETFs are correctly identified and should not be forced into common-stock
  fundamentals

A recommends adding a reusable trust review command before any public data source
switch.

## B / Marketing

B approves using this review internally to support product planning.

B does not approve public marketing claims based on these raw rows yet, because
the score and interpretation layers are still mock.

## C / Investment Advisor

C approves continuing to examine real quote data internally.

C requires separate treatment for ETFs before public product copy or investment
interpretation uses ETF valuation fields.

## D / Legal

D approves internal-only review.

D does not approve public release because `score_ready_for_public_use` remains
false and the public release gate is explicitly closed.

## F / Product Design / UIUX

F recommends the next UI work stay behind internal diagnostics. Any mixed
real/raw plus mock/score display must label both layers clearly.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

Real raw market data is now acceptable for internal preview and diagnostics.
The public product remains on mock repository data. The next implementation
slice may improve internal review tooling or prepare a stricter public-release
gate, but must not switch `NEXT_PUBLIC_DATA_SOURCE=supabase`.

## Not Approved

```text
NEXT_PUBLIC_DATA_SOURCE=supabase
Public real-data stock UI
Public mixed raw-data + mock-score UI
Real model score claims
ETF valuation interpretation without ETF-specific data model
```
