# CP3 UI Wiring Launch-Blocker Implementation Plan

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 UI wiring launch-blocker implementation plan recorded

## CEO Decision

```text
REVISE
```

This plan does not approve public UI wiring. It defines the local-only work
required before CP3 runtime policy, UI copy tokens, source-depth state, or
score-source display can be imported into public pages or public components.

```text
local-only work required
```

## Objective

```text
turn launch blockers into explicit implementation gates
preserve public data source mock
preserve scoreSource mock
keep runtime policy draft non-runtime
keep UI copy tokens draft non-runtime
prevent accidental public imports
```

## Implementation Sequence

```text
1. keep current static guards active
2. define approved runtime state source contract
3. define source-depth evidence gate
4. define UI placement implementation gate
5. define legal disclosure gate
6. define public claim release gate
7. define production score-source gate
8. define rollback and monitoring gate
9. require CEO synthesis before runtime wiring
```

## Gate Requirements

### Runtime State Source Gate

```text
approved only after source table, repository, freshness state, locale, market,
asset type, and score source are mapped without connecting to Supabase during
the planning phase
```

```text
without connecting to Supabase during the planning phase
```

### Source-Depth Evidence Gate

```text
approved only after historical coverage, missing-date behavior, adjusted
price assumptions, endpoint stability, and legal field usage are documented
and reviewed
```

### UI Placement Implementation Gate

```text
approved only after copy placement, disclosure placement, responsive layout,
internal review state, partial state, stale state, unavailable state, and
approved state are reviewed without importing draft tokens into public pages
```

### Legal Disclosure Gate

```text
approved only after non-advisory copy, data delay copy, model limitation copy,
market-specific disclosure, and no personalized investment advice wording are
reviewed
```

### Public Claim Release Gate

```text
approved only after every public phrase maps to an approved runtime state,
approved data quality state, approved model version, and approved evidence
level
```

### Production Score-Source Gate

```text
approved only after scoreSource=real is explicitly authorized by CEO and
review gates pass with source-depth production gate no longer not_ready
```

### Rollback And Monitoring Gate

```text
approved only after rollback behavior, stale data behavior, unavailable data
behavior, diagnostics, and release monitoring are documented
```

## Static Guard Expectations

```text
scripts/check-cp3-runtime-policy-draft.mjs must continue blocking public imports
scripts/check-cp3-ui-copy-tokens-draft.mjs must continue blocking public imports
scripts/check-review-gates.mjs must include this implementation plan checker
TypeScript noEmit must pass
```

## Non-Negotiable Guardrails

```text
implementation plan only
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
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

## CEO Synthesis

```text
The launch blocker list is now actionable, but none of the blockers are cleared.
The next safe slice is a role review for this implementation plan before any
runtime or public UI work begins.
```

## Next Implementation Slice

```text
record CP3 UI wiring launch-blocker implementation plan role review
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
