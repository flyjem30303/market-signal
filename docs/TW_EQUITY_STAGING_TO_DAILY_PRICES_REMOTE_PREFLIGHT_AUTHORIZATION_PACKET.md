# TW Equity Staging To Daily Prices Remote Preflight Authorization Packet

Date: 2026-06-07

Status: `tw_equity_staging_to_daily_prices_remote_preflight_authorization_ready_not_executed`.

## CEO Decision

CEO may authorize exactly one future bounded Supabase readonly preflight for the accepted `AUTH-003` staging scope. This packet prepares the authorization boundary and the immediate post-run review requirement. It does not execute the preflight, does not create a Supabase connection, does not run SQL, and does not mutate `daily_prices`.

## Prerequisites

- Merge design packet: `tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed`.
- Local dry-run preflight: `tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt`.
- Accepted staging scope: `AUTH-003` only.
- Expected symbols: `2330`, `2382`, `2308`.
- Expected sessions: `60` per symbol.
- Expected production rows after a later successful merge: `180`.
- Conflict policy for the first merge remains `insert_only_no_overwrite`.
- Immediate post-run review template must exist before execution.

## Authorization Candidate

- Authorization id: `TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001`.
- Attempt limit: `1`.
- Attempt type: `bounded_supabase_readonly_preflight`.
- Target staging run: `AUTH-003`.
- Target production relation: `daily_prices`.
- Output type: `sanitized_aggregate_counts_only`.
- Required command status: `implemented_fail_closed_not_executed`.
- Execution status: `not_executed`.

## Future Exact Command Contract

A later runner may execute only after this implementation checker proves the command exists and fail-closed behavior is active. The future command shape is:

```powershell
node --env-file=.env.local scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs --authorization-id TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001 --staging-scope AUTH-003 --candidate-input data/candidates/tw-equity-staging-candidate.json --post-run-review docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_2026-06-07.md --confirm-bounded-readonly-preflight --execute
```

If the runner is missing, credentials are missing, expected gates fail, or a second attempt is requested in the same slice, execution must remain blocked.

## Allowed Remote Read Scope

The future bounded readonly preflight may read only aggregate counts needed to decide whether a later production merge is safe:

| Count name | Expected value |
| --- | ---: |
| `staging_run_count` | `1` |
| `staging_price_count` | `180` |
| `distinct_symbol_count` | `3` |
| `stock_mapping_count` | `3` |
| `unmapped_symbol_count` | `0` |
| `duplicate_staging_key_count` | `0` |
| `duplicate_production_key_count` | `0` |
| `existing_daily_prices_target_count` | `0` |

The future preflight must not print row payloads, raw market payloads, source payloads, `stock_id` values, secrets, or SQL text.

## Fail-Closed Outcomes

- If all aggregate counts match, status may be `remote_preflight_passed_merge_still_requires_separate_authorization`.
- If any aggregate count is missing or unexpected, status must be `remote_preflight_blocked_count_mismatch`.
- If target rows already exist, status must be `remote_preflight_blocked_existing_daily_prices_target_rows`.
- If a schema, credential, policy, or network issue occurs, status must be `remote_preflight_blocked_infrastructure_or_permission`.
- No outcome from this preflight can award row coverage points or promote `publicDataSource` / `scoreSource`.

## Post-Run Review Requirement

The immediate review artifact must use:

`docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_<DATE>.md`

The review must record:

- authorization id;
- exact command;
- execution count;
- connection status;
- sanitized aggregate count statuses;
- accepted/rejected decision;
- blocked/promoted status;
- whether a later production merge authorization may be prepared;
- confirmation that `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Stop Lines

Stop before execution if:

- the local dry-run preflight checker fails;
- the future runner does not exist or has not been checked;
- the exact authorization id is absent;
- the command would run SQL;
- the command would write Supabase;
- the command would mutate `daily_prices`;
- the command would print row payloads or secrets;
- the post-run review path is not named.

## Promotion Boundary

This packet does not authorize:

- SQL execution;
- Supabase write;
- `daily_prices` mutation;
- production merge;
- rollback mutation;
- row coverage points;
- public source promotion;
- `scoreSource=real`;
- investment claims based on production data.

## Next Slice

Implement the fail-closed remote preflight runner or create a runner implementation gate proving the future command blocks until the exact authorization, environment, and post-run review path are present.
