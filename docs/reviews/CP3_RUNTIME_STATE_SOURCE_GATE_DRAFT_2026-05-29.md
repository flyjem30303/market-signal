# CP3 Runtime State Source Gate Draft

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 UI wiring blocker-to-owner matrix role review selected runtime state source as first future checker

Status: CP3 runtime state source gate draft recorded

## CEO Decision

```text
REVISE
```

This gate draft does not approve runtime wiring. It defines the required state
source contract that must exist before any public page or public component can
know whether it is rendering mock, internal review, partial, stale,
unavailable, or approved CP3 score state.

```text
required state source contract
mock, internal review, partial, stale, unavailable, or approved CP3 score state
```

## Source Contract Requirements

```text
state source contract must identify market
state source contract must identify asset_type
state source contract must identify locale
state source contract must identify model_version
state source contract must identify scoreSource
state source contract must identify model_approval_state
state source contract must identify data_quality_state
state source contract must identify freshness_state
state source contract must identify source_depth_state
state source contract must identify source_rights_state
state source contract must identify backtest_approval_state
state source contract must identify disclosure_approval_state
state source contract must identify claim_approval_state
state source contract must identify fallback_display_state
state source contract must identify evidence_bundle_id
state source contract must identify last_reviewed_at
state source contract must identify review_owner
```

## Required Source Boundaries

```text
planning source only
not a database schema
not a Supabase migration
not a remote validator
not a runtime repository
not a public UI import
not a public component import
not a production score source
```

## Display State Mapping

```text
scoreSource=mock maps to mock display state
scoreSource=unavailable maps to unavailable display state
scoreSource=real_candidate maps to internal_review display state
scoreSource=real maps to approved display state only after all approval states are approved
partial data_quality_state maps to partial display state
stale freshness_state maps to stale display state
blocked approval state maps to unavailable display state
missing required field maps to unavailable display state
```

## Approval Rules

```text
public approved display requires scoreSource=real
public approved display requires model_approval_state=approved
public approved display requires data_quality_state=complete
public approved display requires freshness_state=fresh
public approved display requires source_depth_state=approved
public approved display requires source_rights_state=approved
public approved display requires backtest_approval_state=approved
public approved display requires disclosure_approval_state=approved
public approved display requires claim_approval_state=approved
public approved display requires evidence_bundle_id
public approved display requires last_reviewed_at
public approved display requires review_owner
```

## Claim Boundaries

```text
runtime state source must not authorize personalized investment advice
runtime state source must not authorize predictive claims
runtime state source must not authorize backtest claims before approval
runtime state source must not authorize global coverage from locale alone
runtime state source must not authorize market coverage from asset_type alone
runtime state source must not clear source-depth not_ready
```

## Non-Negotiable Guardrails

```text
runtime state source gate draft only
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
do not read remote data
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
do not clear source-depth not_ready
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## CEO Synthesis

```text
The runtime state source gate gives future UI work a contract, but it does not
approve implementation. The next safe slice is role review for this gate, then
drafting a non-runtime checker that ensures future state source artifacts keep
mock, candidate, and approved states separated.
```

```text
does not approve implementation
```

## Next Implementation Slice

```text
record CP3 runtime state source gate role review
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
