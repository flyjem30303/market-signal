# TWII Bounded Readonly Preflight Runner Stub

Updated: 2026-06-09

Status: `twii_bounded_readonly_preflight_runner_stub_ready_fail_closed`

## Purpose

This slice implements a local runner stub for the future TWII bounded readonly preflight.

The stub is intentionally fail-closed. Without an explicit one-attempt confirmation, it writes only a sanitized blocked summary. Even with a confirmation, this stub does not connect to Supabase; a later GOAL must separately authorize and implement exactly one bounded readonly attempt.

## Upstream Design

The upstream design must remain accepted:

- `docs/TWII_BOUNDED_READONLY_PREFLIGHT_CANDIDATE_DESIGN.md`
- `twii_bounded_readonly_preflight_candidate_design_ready`
- `accepted_as_design_only_readonly_preflight_candidate`

## Stub Command

```powershell
cmd.exe /c npm run run:twii-bounded-readonly-preflight-once -- --attempt-id twii-readonly-preflight-stub-20260609 --candidate-artifact-path data\candidates\twii-sanitized-candidate.json --mode aggregate-only-readonly
cmd.exe /c npm run report:twii-bounded-readonly-preflight-post-run-review -- --summary-path tmp\twii-bounded-readonly-preflight-stub-twii-readonly-preflight-stub-20260609.json
```

Expected default result:

- `twii_bounded_readonly_preflight_stub_blocked_confirmation_required`
- `blocked_fail_closed_no_remote_attempt`

## Confirmation Contract

The future confirmation token is:

```text
CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE
```

This stub records the token requirement but does not use it to open a remote connection. A later implementation GOAL must still be separately authorized before any Supabase readonly attempt.

## Sanitized Summary Contract

The stub summary must include only:

- no-secret `attemptId`;
- candidate artifact path label;
- mode;
- upstream design status;
- candidate artifact aggregate status;
- confirmation presence;
- fail-closed status;
- stop-line safety flags.

It must not include row payloads, source payloads, stock id payloads, secrets, raw API responses, private dashboard links, connection strings, or SQL statements.

## Post-Run Review Meaning

The post-run review accepts the default blocked summary only as evidence that the local stub fails closed correctly.

It does not approve a real readonly attempt, data writes, row acceptance, row coverage scoring, source promotion, or real score.

## Stop Line

No SQL.

No Supabase connection.

No Supabase write.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No raw payload output.

No row payload output.

No stock id payload output.

No secret output.

No public source or real-score promotion.

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.
