# Beta Packet Window Candidate Dry-Run Runner

Status: `beta_packet_window_candidate_dry_run_runner_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `wire_two_value_validation_to_repo_proof_before_packet_window`.

The platform blocker has already been compressed to two safe values. PM now needs one command that can decide whether those two values plus current repo proof are ready to enter a separate packet-window candidate, without reopening the broad operator sheet.

Current route: `beta_packet_window_candidate_dry_run_runner`.

Current outcome: `dry_run_runner_ready_external_values_still_pending`.

This runner does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Command

Focused command:

- `cmd.exe /c npm run run:beta-packet-window-candidate-dry-run`

Required environment variables:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

Input loading:

- The runner uses the shared Beta platform values loader.
- Values accepted from shell env or `.env.local` are carried into child packet-window checks without printing the actual values.

The runner executes the following local-only sequence:

1. run `validate:beta-platform-two-values`;
2. stop with `blocked_waiting_values` or `rejected_unsafe_values` if the values are absent or unsafe;
3. run `run:beta-executable-packet-repo-proof` only after the validator reports `accepted_two_value_shape_only`;
4. classify packet-window readiness without writing the provided values to repo documents.

## Output States

| State | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_values` | One or both platform values are missing. | Keep waiting for I / launch operator values. |
| `rejected_unsafe_values` | Values were provided but failed local safety shape checks. | Request corrected non-secret values. |
| `repo_proof_blocked` | Values passed, but repo proof, route health, TypeScript, or worktree state is not packet-ready. | Repair repo/runtime proof before packet work. |
| `packet_window_candidate_ready_shape_only` | Values passed, repo proof passed, and worktree is clean. | Create a separate executable packet-window candidate. |

`packetCandidateAllowed` can become `true` only in `packet_window_candidate_ready_shape_only`; this still does not deploy or claim public launch completion.

## PM / A1 / A2 Routing

PM route:

- Use this runner after I provides the two values.
- If `packet_window_candidate_ready_shape_only`, prepare a separate executable packet-window candidate.
- If `blocked_waiting_values`, do not spend more governance time on platform values.
- If `rejected_unsafe_values` or `repo_proof_blocked`, repair the precise failure before packet work.

A1 route:

- Continue TWII / ETF source-rights evidence independently.

A2 route:

- Re-enter only after a public temporary Beta URL is validator-accepted and PM asks for route readability QA.

I route:

- Provide only the plain project name and public temporary Beta URL.
- Keep private platform tokens, dashboard tokens, env values, DNS credentials, and secrets outside repo and logs.

## Acceptance

PM may classify this runner as `accepted` when:

1. `run:beta-packet-window-candidate-dry-run` exists;
2. package and review-gate registration exist;
3. absent values return `blocked_waiting_values`;
4. unsafe values route through `rejected_unsafe_values`;
5. repo proof runs only after `accepted_two_value_shape_only`;
6. `packetCandidateAllowed` remains false unless values pass, repo proof passes, and worktree state is clean;
7. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Hard Stops

This runner does not authorize:

- production deployment;
- preview deployment;
- deployment command execution;
- hosting project creation;
- hosting project mutation;
- DNS change;
- SSL configuration change;
- platform env mutation;
- secret output;
- secret storage action;
- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- row coverage points;
- complete MVP coverage claim;
- Supabase public-source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Verification

Focused verification:

- `cmd.exe /c npm run check:beta-packet-window-candidate-dry-run-runner`
- `cmd.exe /c npm run run:beta-packet-window-candidate-dry-run`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
