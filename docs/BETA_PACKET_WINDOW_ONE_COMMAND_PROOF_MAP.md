# Beta Packet Window One-Command Proof Map

Status: `beta_packet_window_one_command_proof_map_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `compress_packet_window_preflight_to_one_safe_command_map`.

The Beta packet-window chain is now complete but spread across several focused commands. PM needs one safe proof-map runner so, when the hosting project name and temporary Beta URL arrive, the packet-window readiness chain can be evaluated in one predictable sequence.

Current route: `beta_packet_window_one_command_proof_map`.

Current outcome: `one_command_proof_map_ready_external_values_still_pending`.

This proof map does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Command

Focused command:

- `cmd.exe /c npm run run:beta-packet-window-proof-map`

The runner executes this local-only sequence:

1. `validate:beta-platform-two-values`;
2. `run:beta-packet-window-candidate-dry-run`;
3. `render:beta-packet-window-candidate-template`;
4. `render:beta-packet-window-reviewed-artifact-record-template`.

The runner stops at the first non-ready state and reports the next route. It does not write files. It does not convert `pending_pm_review` into `accepted`. It does not authorize deployment.

When Git backup is intentionally deferred, the packet-window dry-run step may use the repo proof runner's no-Git PM snapshot as the worktree safeguard. If the two platform values pass shape validation, repo proof passes, and `pmSnapshot.unresolvedCount=0`, the one-command proof map can continue to the no-secret reviewed artifact record template without requiring a clean Git worktree.

## Output States

| State | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_values` | One or both platform values are missing. | Keep waiting for safe platform values. |
| `rejected_unsafe_values` | Platform values are unsafe or non-public. | Request corrected non-secret values. |
| `repo_proof_blocked` | Values passed but repo proof, route health, TypeScript, or worktree state blocks packet readiness. | Repair repo/runtime proof. |
| `candidate_template_blocked` | Candidate template could not be rendered even after prior steps. | Repair template renderer or inputs. |
| `reviewed_artifact_template_blocked` | No-secret reviewed artifact template could not be rendered. | Repair artifact record template. |
| `reviewed_artifact_template_ready_pending_pm_review` | The full preflight chain produced a no-secret record template. | PM records `accepted` or `rejected` in a separate reviewed artifact. |

## Proof Summary

The runner summary must include:

- `publicDataSource=mock`;
- `scoreSource=mock`;
- step name;
- step status;
- step exit code;
- next route;
- `deploymentAuthorized=false`;
- record template allowed only after all previous steps pass.

## PM / A1 / A2 Routing

PM route:

- While either platform value is missing, route PM back to `cmd.exe /c npm run report:public-beta-external-input-request`.
- After I / operator replies, run `cmd.exe /c npm run report:public-beta-external-input-response-readiness` before this proof map.
- Use this runner after platform values arrive.
- If it stops at `blocked_waiting_values`, do not spend more local engineering on platform values.
- If it reaches `reviewed_artifact_template_ready_pending_pm_review`, PM may create a separate reviewed artifact and classify it as `accepted` or `rejected`.
- Do not treat this runner as deployment authorization.

A1 route:

- Continue TWII / ETF source-rights evidence independently.

A2 route:

- Re-enter after a public temporary Beta URL is validator-accepted and PM asks for public-route readability QA.

I route:

- Provide only the plain project name and public temporary Beta URL.
- Keep private platform tokens, dashboard tokens, env values, DNS credentials, and secrets outside repo and logs.

## Acceptance

PM may classify this proof map as `accepted` when:

1. `run:beta-packet-window-proof-map` exists;
2. package and review-gate registration exist;
3. absent values stop at `blocked_waiting_values`;
4. the step order is explicit;
5. the runner does not write files;
6. the runner never converts `pending_pm_review` into `accepted`;
7. safe placeholder platform values can reach `reviewed_artifact_template_ready_pending_pm_review` through the no-Git PM snapshot path;
8. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Hard Stops

This proof map does not authorize:

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

- `cmd.exe /c npm run check:beta-packet-window-one-command-proof-map`
- `cmd.exe /c npm run run:beta-packet-window-proof-map`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
