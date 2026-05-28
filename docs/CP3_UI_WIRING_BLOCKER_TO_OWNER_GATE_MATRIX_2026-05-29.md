# CP3 UI Wiring Blocker-To-Owner Gate Matrix

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 UI wiring blocker-to-owner gate matrix recorded

## CEO Decision

```text
REVISE
```

This matrix does not clear any blocker. It assigns each blocker to an owner,
required evidence, checker, exit condition, and blocked runtime action so future
work can proceed without confusing planning readiness with launch readiness.

```text
owner, required evidence, checker, exit condition, and blocked runtime action
```

## Matrix

| Blocker | Owner | Required evidence | Checker | Exit condition | Blocked runtime action |
| --- | --- | --- | --- | --- | --- |
| Runtime state source not approved | A / PM+Dev | Repository source, freshness state, locale, market, asset type, score source, and fallback behavior documented | `scripts/check-cp3-runtime-state-schema-draft.mjs` plus future runtime source gate checker | CEO approves runtime state source gate | Importing policy into public pages or wiring policy into data fetching |
| Source-depth production gate remains not_ready | C / Investment | Historical coverage, missing-date handling, adjusted price assumptions, endpoint stability, legal field usage, and sample thresholds reviewed | `scripts/check-cp3-tw-stock-source-depth.mjs` plus future source-depth evidence checker | Source-depth gate no longer reports not_ready | Setting `scoreSource=real` or showing validated score claims |
| UI placement implementation not approved | F / Design | Responsive placement, score area hierarchy, caveat placement, stale / partial / unavailable / approved states, and mobile fit reviewed | Future UI placement implementation checker | CEO and Design approve component placement | Importing UI copy tokens into public pages or public components |
| Legal disclosure copy not approved | D / Legal | Non-advisory copy, market-specific delay wording, model limitation wording, privacy / terms alignment, and no personalized investment advice wording reviewed | Future legal disclosure checker | Legal approves disclosure copy and placement | Showing score interpretation without required disclosure |
| Public claim approval not approved | B / Marketing plus C / Investment | Exact public phrases mapped to runtime state, data quality state, model version, evidence level, and page context | `scripts/check-cp3-public-claim-approval-checklist.mjs` plus future claim release checker | CEO approves public claim release gate | Publishing validated, predictive, or backtest-based public claims |
| Production score-source gate not approved | E / CEO | Source-depth gate, runtime source gate, public claim gate, legal gate, rollback gate, and monitoring gate all approved | Future production score-source gate checker | CEO explicitly approves production score source | Setting `scoreSource=real` |
| Rollback and monitoring not approved | A / PM+Dev | Rollback behavior, stale data behavior, unavailable data behavior, diagnostics, release monitoring, and incident owner documented | Future rollback and monitoring checker | CEO approves rollback and monitoring gate | Releasing runtime score UI without fallback and monitoring |

## Required Future Checkers

```text
future runtime source gate checker
future source-depth evidence checker
future UI placement implementation checker
future legal disclosure checker
future claim release checker
future production score-source gate checker
future rollback and monitoring checker
```

## Current Static Guards

```text
scripts/check-cp3-runtime-policy-draft.mjs blocks public policy imports
scripts/check-cp3-ui-copy-tokens-draft.mjs blocks public copy token imports
scripts/check-review-gates.mjs includes this blocker-to-owner matrix checker
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Non-Negotiable Guardrails

```text
blocker-to-owner gate matrix only
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
The blocker ownership model is now explicit. The next safe slice is a role
review for this matrix, then a decision on which future checker to draft first.
Runtime wiring remains blocked.
```

## Next Implementation Slice

```text
record CP3 UI wiring blocker-to-owner gate matrix role review
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
