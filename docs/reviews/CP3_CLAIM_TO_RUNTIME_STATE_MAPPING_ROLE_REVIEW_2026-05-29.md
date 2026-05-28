# CP3 Claim-To-Runtime-State Mapping Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 claim-to-runtime-state mapping drafted

Status: CP3 claim-to-runtime-state mapping role review recorded

## CEO Decision

```text
REVISE
```

The mapping is accepted as a CP3 control artifact. It does not approve runtime
implementation, public copy changes, public backtest claims, or production
`scoreSource=real`.

```text
does not approve runtime implementation
```

## Evidence

```text
docs/CP3_CLAIM_TO_RUNTIME_STATE_MAPPING_2026-05-29.md
docs/CP3_PUBLIC_CLAIM_APPROVAL_CHECKLIST_2026-05-29.md
docs/CP3_GLOBAL_MODEL_VERSION_NAMING_RULES_2026-05-29.md
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
The mapping is suitable as a future implementation contract, but the app should
not wire runtime enforcement until CP3 approves the state model and public copy
rules.
```

B / Marketing:

```text
Marketing copy should be blocked unless claim_approval_state is approved and
the runtime state supports the exact market and asset type being claimed.
```

C / Investment:

```text
Backtest and validation claims must remain tied to model_version, market,
asset_type, horizon, and approval state. Locale cannot upgrade model evidence.
```

D / Legal:

```text
Disclosure approval and source-rights state must be required for claims. Any
missing state should force unavailable, mock, or internal-only wording.
```

E / CEO:

```text
Accept the mapping as a release-control design. The next safe slice is a CP3
runtime state schema draft, still local-only and not wired into production.
```

F / Design:

```text
State names should map to visible UI states: mock, internal review, partial,
stale, unavailable, and approved. Do not hide caveats behind interaction.
```

## CEO Synthesis

```text
The role review confirms that public claims need a technical state contract.
The next local-only slice should draft the state schema before any UI or runtime
implementation is attempted.
```

## Next Implementation Slice

```text
draft CP3 runtime state schema
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
