# CP3 Local-Only Decision Quality Worklist

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Remote read-only validation pre-execution approval gate returned REVISE

Status: CP3 local-only decision quality worklist recorded

## CEO Decision

```text
PROCEED
```

Remote validation remains blocked, but local-only decision-quality work can
continue. The goal is to improve CP3 review readiness without touching
Supabase, running SQL, or changing the public scoring source.

## Evidence

```text
docs/CP3_MODEL_CREDIBILITY_PLAN.md
docs/CP3_TW_STOCK_MODEL_CANDIDATES.md
docs/CP3_TW_STOCK_BACKTEST_METHOD.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_REMOTE_READ_ONLY_VALIDATION_PRE_EXECUTION_APPROVAL_GATE_2026-05-29.md
```

## Non-Negotiable Guardrails

```text
local-only worklist
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

## Priority Worklist

```text
1. tighten Taiwan stock model candidate decision questions
2. define data-quality downgrade matrix for missing modules
3. define backtest regime taxonomy draft
4. define public claim approval checklist
5. define global expansion model-version naming rules
```

## Role Inputs

A / PM+Dev:

```text
Prefer small review artifacts with static gates. Avoid runtime implementation
until source depth and approval gates are green.
```

B / Marketing:

```text
Prepare claim limits before any real-score demo exists. Do not use validation
language as promotional copy.
```

C / Investment:

```text
Focus on model defensibility, failure examples, and data-quality downgrade
rules before score implementation.
```

D / Legal:

```text
Keep source rights, redistribution, and not-investment-advice language ahead of
public scoring.
```

E / CEO:

```text
Approve local-only decision-quality work. Do not approve remote execution or
real public scoring.
```

F / Design:

```text
Prepare missing-data and confidence states before exposing real score details.
```

## CEO Synthesis

```text
The project should keep moving locally while remote validation waits for human
approval. The next best slice is a Taiwan stock data-quality downgrade matrix
because it affects model trust, UI states, and public claim limits.
```

## Next Implementation Slice

```text
draft Taiwan stock data-quality downgrade matrix
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
