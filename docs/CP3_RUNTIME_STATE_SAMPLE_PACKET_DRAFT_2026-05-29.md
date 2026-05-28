# CP3 Runtime State Sample Packet Draft

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 runtime state sample packet draft recorded

## CEO Decision

```text
REVISE
```

This sample packet draft is a local-only planning artifact. It is not a JSON
seed file, not market data, not a runtime repository, not a public UI import,
not a Supabase migration, and not approval to set `scoreSource=real`.

```text
not a JSON seed file
```

## Packet Fields

```text
market
asset_type
locale
model_version
scoreSource
model_approval_state
data_quality_state
freshness_state
source_depth_state
source_rights_state
backtest_approval_state
disclosure_approval_state
claim_approval_state
fallback_display_state
evidence_bundle_id
last_reviewed_at
review_owner
public_claim_level
blocked_reason
```

## Sample Packet: Mock

```text
sample_name: mock
market: tw
asset_type: stock
locale: zh-TW
model_version: cp3.tw.stock.local-draft
scoreSource: mock
model_approval_state: candidate
data_quality_state: unavailable
freshness_state: unknown
source_depth_state: not_ready
source_rights_state: not_ready
backtest_approval_state: not_ready
disclosure_approval_state: not_ready
claim_approval_state: not_ready
fallback_display_state: mock
evidence_bundle_id: none
last_reviewed_at: none
review_owner: E / CEO
public_claim_level: none
blocked_reason: planning artifact only
```

## Sample Packet: Unavailable

```text
sample_name: unavailable
market: tw
asset_type: stock
locale: zh-TW
model_version: cp3.tw.stock.local-draft
scoreSource: unavailable
model_approval_state: review
data_quality_state: unavailable
freshness_state: unknown
source_depth_state: not_ready
source_rights_state: review
backtest_approval_state: not_ready
disclosure_approval_state: review
claim_approval_state: not_ready
fallback_display_state: unavailable
evidence_bundle_id: local-planning-only
last_reviewed_at: 2026-05-29
review_owner: A / PM+Dev
public_claim_level: none
blocked_reason: required source evidence unavailable
```

## Sample Packet: Real Candidate

```text
sample_name: real_candidate
market: tw
asset_type: stock
locale: zh-TW
model_version: cp3.tw.stock.local-draft
scoreSource: real_candidate
model_approval_state: review
data_quality_state: partial
freshness_state: stale
source_depth_state: review
source_rights_state: review
backtest_approval_state: review
disclosure_approval_state: review
claim_approval_state: not_ready
fallback_display_state: internal_review
evidence_bundle_id: local-review-draft
last_reviewed_at: 2026-05-29
review_owner: C / Investment
public_claim_level: internal_only
blocked_reason: candidate evidence cannot support public score display
```

## Sample Packet: Blocked Real

```text
sample_name: blocked_real
market: tw
asset_type: stock
locale: zh-TW
model_version: cp3.tw.stock.local-draft
scoreSource: real
model_approval_state: approved
data_quality_state: complete
freshness_state: fresh
source_depth_state: not_ready
source_rights_state: approved
backtest_approval_state: approved
disclosure_approval_state: approved
claim_approval_state: approved
fallback_display_state: unavailable
evidence_bundle_id: blocked-source-depth
last_reviewed_at: 2026-05-29
review_owner: E / CEO
public_claim_level: none
blocked_reason: source_depth_state not_ready blocks approved display
```

## Packet Validation Rules

```text
mock sample must map scoreSource=mock to fallback_display_state=mock
unavailable sample must map scoreSource=unavailable to fallback_display_state=unavailable
real_candidate sample must map scoreSource=real_candidate to fallback_display_state=internal_review
blocked_real sample must not map scoreSource=real to approved display while source_depth_state=not_ready
every sample must include disclosure_approval_state
every sample must include claim_approval_state
every sample must include blocked_reason
no sample may authorize personalized investment advice
no sample may authorize predictive claims
no sample may authorize public backtest claims
locale must never upgrade market approval
asset_type must never upgrade market approval
```

## Non-Negotiable Guardrails

```text
runtime state sample packet draft only
do not create JSON market data
do not create CSV market data
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
do not implement runtime repository
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
The sample packet draft makes state combinations reviewable without changing
runtime behavior. The next safe slice is a role review, then a checker-focused
gate for sample packet validation before any runtime implementation.
```

```text
without changing runtime behavior
```

## Next Implementation Slice

```text
record CP3 runtime state sample packet role review
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
