# CP3 Global Model Version Naming Rules Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Global model-version naming rules drafted

Status: global model-version naming rules role review recorded

## CEO Decision

```text
REVISE
```

The naming rules are accepted as a global expansion control artifact, but they
do not approve runtime scoring, public real-score claims, or production
`scoreSource=real`.

## Evidence

```text
docs/CP3_GLOBAL_MODEL_VERSION_NAMING_RULES_2026-05-29.md
docs/CP3_TW_STOCK_DATA_QUALITY_DOWNGRADE_MATRIX_2026-05-29.md
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
The naming convention is implementable and keeps market, asset type, model
family, version, and approval state visible. The current Taiwan candidate name
should be normalized before runtime use.
```

B / Marketing:

```text
Approval state must not leak into public promise language. A candidate or review
model is not launch evidence.
```

C / Investment:

```text
Market and asset-type isolation is required. Taiwan stock approval must not
approve ETF, US stock, or index scoring.
```

D / Legal:

```text
Locale must remain separate from model version. Translating the UI does not
transfer source rights, disclosure approval, or model approval across markets.
```

E / CEO:

```text
Accept these rules as a global architecture guard. The next local-only slice is
to define a CP3 public claim approval checklist.
```

F / Design:

```text
Approval state should drive internal badges and unavailable states, but public
UI should avoid exposing technical version codes until disclosure is approved.
```

## CEO Synthesis

```text
The role review confirms Taiwan-first development can continue if every future
model keeps market, asset type, and approval state explicit. The next local-only
slice should convert claim limits into a public claim approval checklist.
```

## Next Implementation Slice

```text
draft CP3 public claim approval checklist
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
