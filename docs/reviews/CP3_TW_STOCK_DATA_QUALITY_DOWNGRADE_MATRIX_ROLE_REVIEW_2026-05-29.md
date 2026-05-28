# CP3 Taiwan Stock Data Quality Downgrade Matrix Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Taiwan stock data-quality downgrade matrix drafted

Status: Taiwan stock data-quality downgrade matrix role review recorded

## CEO Decision

```text
REVISE
```

The downgrade matrix is useful and should remain part of CP3 review, but it is
not approved for runtime scoring or public real-score claims.

## Evidence

```text
docs/CP3_TW_STOCK_DATA_QUALITY_DOWNGRADE_MATRIX_2026-05-29.md
docs/CP3_TW_STOCK_MODEL_CANDIDATES.md
docs/CP3_MODEL_CREDIBILITY_PLAN.md
```

## Non-Negotiable Guardrails

```text
role review only
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Role Review

A / PM+Dev:

```text
The matrix gives engineering a stable degradation contract. Next implementation
should stay declarative until CP3 approves runtime scoring.
```

B / Marketing:

```text
The forbidden-claims list is necessary. Partial, stale, and unavailable states
must not be rewritten into optimistic product copy.
```

C / Investment:

```text
Price-trend missing should force unavailable. The draft caps are directionally
reasonable, but weights and caps need validation against future backtest
evidence.
```

D / Legal:

```text
Any source-rights blocker should force unavailable. Public wording must avoid
real-score, validated-signal, prediction, and recommendation language until
approved.
```

E / CEO:

```text
Accept the matrix as a CP3 review artifact. Do not approve runtime scoring. The
next safe slice is to define model-version naming rules for global expansion.
```

F / Design:

```text
The UI needs explicit states for complete, partial, stale, unavailable, and
internal review before any real-score surface is considered.
```

## CEO Synthesis

```text
The role review confirms that missing-data behavior is a trust boundary, not a
minor UI detail. The next local-only slice should define global model-version
naming rules so Taiwan-first development does not block global expansion later.
```

## Next Implementation Slice

```text
draft global model-version naming rules
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
