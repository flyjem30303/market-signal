# Beta Packet Window Executable Candidate Template

Status: `beta_packet_window_executable_candidate_template_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_packet_window_candidate_template_before_platform_values`.

The packet-window dry run can now decide whether two platform values plus repo proof are ready. PM needs a single candidate template renderer so, when the dry run becomes ready, the next packet-window candidate has a consistent shape and does not reopen broad deployment governance.

Current route: `beta_packet_window_executable_candidate_template`.

Current outcome: `candidate_template_ready_external_values_still_pending`.

This template renderer does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Command

Focused command:

- `cmd.exe /c npm run render:beta-packet-window-candidate-template`

Required environment variables:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

The renderer executes this local-only command map:

1. run `run:beta-packet-window-candidate-dry-run`;
2. stop with `blocked_waiting_values`, `rejected_unsafe_values`, or `repo_proof_blocked` unless dry run reports `packet_window_candidate_ready_shape_only`;
3. refresh `git branch --show-current` and `git rev-parse --short HEAD` only after dry run is ready;
4. emit a no-secret candidate template object for PM review.

The renderer does not write the candidate object to disk. PM must create a separate reviewed packet-window artifact later if the output is accepted.

## Candidate Template Shape

When ready, the renderer emits:

- `status`: `packet_window_candidate_template_ready_shape_only`;
- `packetCandidateAllowed`: `true`;
- `launchBoundary.publicDataSource`: `mock`;
- `launchBoundary.scoreSource`: `mock`;
- `platformValues.hostingProjectName`: the safe plain project name from `BETA_HOSTING_PROJECT_NAME`;
- `platformValues.temporaryBetaUrl`: the safe public temporary Beta URL from `BETA_TEMPORARY_URL`;
- `repoProof.sourceBranch`: refreshed branch name;
- `repoProof.sourceCommit`: refreshed short commit hash;
- `repoProof.worktreeState`: `clean`;
- `requiredPreExecutionReview`: post-render PM review, A2 public-route readability review after URL access, secret/env handling check, rollback note, and incident owner note.

The template is shape-only. It is not a deployment execution packet and does not authorize any platform action.

## Output States

| State | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_values` | One or both platform values are missing. | Keep waiting for I / launch operator values. |
| `rejected_unsafe_values` | Values were provided but failed local safety checks. | Request corrected non-secret values. |
| `repo_proof_blocked` | Values passed, but repo proof or worktree state is not ready. | Repair repo/runtime proof before rendering candidate. |
| `packet_window_candidate_template_ready_shape_only` | Values and repo proof are ready; template object is emitted for PM review. | Create a separate reviewed packet-window artifact before any deployment action. |

## PM / A1 / A2 Routing

PM route:

- Use this renderer after `run:beta-packet-window-candidate-dry-run` reports `packet_window_candidate_ready_shape_only`.
- Treat the renderer output as a candidate template, not as deployment authorization.
- Create a separate reviewed packet-window artifact only if the output is accepted.

A1 route:

- Continue TWII / ETF source-rights evidence independently.

A2 route:

- Re-enter after a public temporary Beta URL is validator-accepted and PM asks for public-route readability QA.

I route:

- Provide only the plain project name and public temporary Beta URL.
- Keep private platform tokens, dashboard tokens, env values, DNS credentials, and secrets outside repo and logs.

## Acceptance

PM may classify this template as `accepted` when:

1. `render:beta-packet-window-candidate-template` exists;
2. package and review-gate registration exist;
3. absent values return `blocked_waiting_values`;
4. unsafe values route through `rejected_unsafe_values`;
5. candidate rendering depends on `packet_window_candidate_ready_shape_only`;
6. ready output is shape-only and requires a separate reviewed artifact;
7. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Hard Stops

This template does not authorize:

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

- `cmd.exe /c npm run check:beta-packet-window-executable-candidate-template`
- `cmd.exe /c npm run render:beta-packet-window-candidate-template`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
