# CP3 UI State And Disclosure Placement Plan Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 UI state and disclosure placement plan drafted

Status: CP3 UI state and disclosure placement plan role review recorded

## CEO Decision

```text
REVISE
```

The placement plan is accepted as a CP3 UX trust-control artifact. It is not
approved for UI implementation, runtime policy imports, data fetching changes,
public copy changes, public backtest claims, or production `scoreSource=real`.

```text
not approved for UI implementation
```

## Evidence

```text
docs/CP3_UI_STATE_DISCLOSURE_PLACEMENT_PLAN_2026-05-29.md
docs/reviews/CP3_RUNTIME_POLICY_IMPLEMENTATION_READINESS_GATE_2026-05-29.md
src/lib/cp3-runtime-policy.draft.ts
```

## Non-Negotiable Guardrails

```text
role review only
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

## Role Review

A / PM+Dev:

```text
The placement plan gives future implementation clear state locations. It should
remain a planning artifact until a separate implementation gate approves which
components can show which state.
```

B / Marketing:

```text
Mock, partial, stale, internal_review, and unavailable states must be visible
before any persuasive language. Marketing should not soften unavailable or stale
states into optimistic product claims.
```

C / Investment:

```text
Approved visual states must not imply investment advice. Internal review and
partial data states cannot be used as evidence of model reliability.
```

D / Legal:

```text
Non-advisory wording, source attribution, and missing-data notices must be near
the score area. Hidden or hover-only caveats are not sufficient for public
claims.
```

E / CEO:

```text
Accept the plan as a disclosure placement artifact. Runtime UI implementation
remains blocked until copy, source, disclosure, and release gates are approved.
```

F / Design:

```text
State labels need consistent hierarchy: status near score header, missing-data
detail near explanation, and disclosure near methodology. The design should not
make mock or partial states feel less important than the score number.
```

## CEO Synthesis

```text
The role review confirms UI placement is a trust boundary. The next safe slice
is a CEO gate deciding whether to draft non-runtime UI copy tokens without
shipping them.
```

## Next Implementation Slice

```text
record CEO gate for non-runtime CP3 UI copy token draft
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
