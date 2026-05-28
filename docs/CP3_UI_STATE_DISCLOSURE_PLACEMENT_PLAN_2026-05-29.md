# CP3 UI State And Disclosure Placement Plan

Status: draft, not approved

Purpose:

- Define where future CP3 score states, caveats, and disclosure text should
  appear before any runtime policy wiring.
- Prevent partial, stale, mock, or internal-review states from looking like
  approved real scores.
- Keep Taiwan-first UX decisions compatible with future global markets and
  multiple user locales.

## Scope

This is a local-only planning artifact. It does not approve UI implementation,
runtime imports, public copy changes, real scoring, or production
`scoreSource=real`.

Out of scope:

```text
component implementation
runtime policy imports
data fetching changes
Supabase reads or writes
SQL migrations
public real-score claims
```

## Non-Negotiable Guardrails

```text
UI placement plan only
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

## State Placement Draft

| State | Required Visible Placement | User Meaning | Public Claim Limit |
|---|---|---|---|
| mock | score header and methodology area | sample/demo only | no real-score claim |
| internal_review | score header, score detail area, and internal-only page | not public evidence | internal only |
| partial | score header and missing-data detail | incomplete source coverage | no validated claim |
| stale | score header and timestamp/freshness strip | data may be outdated | freshness note only |
| unavailable | score area replacement state | score cannot be shown | no score claim |
| approved | score header, methodology, and disclosure area | approved score candidate | only after all gates approve |

## Disclosure Placement Rules

```text
non-advisory wording must be visible near any score area
source attribution must be visible near freshness or methodology details
missing-data state must be visible before any score explanation
mock state must be visible above the fold when mock score is shown
internal_review state must never appear as public validation evidence
locale changes must translate copy without changing approval state
```

## Global UX Rules

```text
market identity must be visible near model status
asset type must be visible near model status
model_version should stay internal until disclosure approval
global coverage cannot be implied by a Taiwan-only approved state
US stock, Taiwan ETF, and global index states need their own approval context
```

## CEO Current Decision

```text
REVISE
```

This placement plan is ready for role review. It is not approved for UI
implementation, runtime wiring, public copy changes, or production
`scoreSource=real`.

## Next Implementation Slice

```text
review CP3 UI state and disclosure placement plan by role
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
