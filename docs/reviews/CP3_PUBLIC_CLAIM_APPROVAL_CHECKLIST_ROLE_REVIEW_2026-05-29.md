# CP3 Public Claim Approval Checklist Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 public claim approval checklist drafted

Status: CP3 public claim approval checklist role review recorded

## CEO Decision

```text
REVISE
```

The checklist is accepted as a CP3 trust-control artifact. It does not approve
public copy changes, public backtest claims, runtime scoring, or production
`scoreSource=real`.

```text
does not approve public copy changes
```

## Evidence

```text
docs/CP3_PUBLIC_CLAIM_APPROVAL_CHECKLIST_2026-05-29.md
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
Any public claim must be traceable to runtime state. If the app still runs mock
data, public copy must not imply real model output.
```

B / Marketing:

```text
The forbidden-claims list is necessary and should be treated as launch-blocking.
Marketing can explain product intent, but not validation, outperformance, or
advisor-like claims.
```

C / Investment:

```text
Backtest and model claims require evidence by market, asset type, horizon, and
regime. A Taiwan stock validation claim cannot transfer to ETF or US stock
coverage.
```

D / Legal:

```text
Non-advisory framing, source attribution, freshness wording, and model limits
must be visible near the claim, not buried in separate documentation.
```

E / CEO:

```text
Accept the checklist as a public-trust gate. The next safe slice is a CP3
claim-to-runtime-state mapping so every future claim has a technical source of
truth.
```

F / Design:

```text
The claim location must include visible caveats and state labels. A polished UI
must not make partial, stale, or mock data look authoritative.
```

## CEO Synthesis

```text
The role review confirms public claims are a cross-functional release gate, not
a copywriting detail. The next local-only slice should map claim categories to
runtime state fields so engineering can block unsupported wording.
```

## Next Implementation Slice

```text
draft CP3 claim-to-runtime-state mapping
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
