# A1 Supabase Market Evidence Handoff Candidate

Status: `candidate_ready_for_pm_integration_not_execution`

Scope: A1 local-only preparation for PM mainline handoff. This packet is sanitized context only, not an execution approval. Keep `publicDataSource=mock` and `scoreSource=mock`.

## 目前 A1 evidence 線已具備什麼

- A1 sanitized handoff packet is ready for mainline review, not promotion.
- Supabase readonly local preflight reports the mock boundary and disabled read switches without making a remote connection.
- Supabase readonly decision packet is ready for CEO review while safety flags remain false.
- Row coverage readonly preexecution packet is ready to present, still requiring explicit execution authorization.
- Existing packet language blocks public source promotion, real score source, row coverage points, and data-quality lift.

## 還缺什麼才可進下一個 bounded readonly gate

- PM/CEO must explicitly choose the next bounded gate scope.
- Same-slice immediate local prechecks must pass before any authorized attempt.
- Operator must restate the approved scope, one-attempt limit, and no-retry rule.
- Post-run review fields must be prepared before execution begins.
- Source-rights and model-credibility approvals remain outside A1 local preparation.

## 哪些可以 local-only 補強

- Refresh this candidate after new sanitized reports land.
- Diff A1 handoff, Supabase readonly decision, and row coverage preexecution states for drift.
- Tighten PM summary wording so it cannot imply promotion or scoring.
- Audit candidate output for identifiers, credentials, endpoint URLs, row payloads, and source-promotion language.
- Prepare an empty post-run review checklist without filling it from remote output.

## 哪些一定要 PM/CEO 明確授權才可做

- Any bounded readonly remote attempt.
- Any Supabase credential or network use.
- Any validation against stored market tables.
- Any same-slice execution command approval.
- Any post-run acceptance decision that changes evidence status.
- Any row coverage points, data-quality lift, public source promotion, or real score source.

## 建議 PM 主線下一個整合點

Recommended integration point: `pm_decision_packet_for_exactly_one_bounded_readonly_gate`.

PM should integrate this A1 candidate with the existing mainline readonly bridge, then ask CEO whether to authorize exactly one bounded readonly gate in a separate execution slice. If CEO does not explicitly authorize it, the default decision is `keep_local_review_only_mock_runtime`.

This candidate must not execute a remote attempt, connect to Supabase, write market storage, fetch or ingest market data, award evidence points, change public source, or change score source.

## Stop Line

This A1 candidate is local-only PM integration context. It is不可執行; it does not run remote checks, connect to Supabase, write storage, fetch or ingest market data, print secrets or row payloads, award points, promote publicDataSource, or set scoreSource real.
