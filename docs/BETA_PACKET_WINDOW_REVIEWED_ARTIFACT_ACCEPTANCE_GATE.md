# Beta Packet Window Reviewed Artifact Acceptance Gate

Status: `beta_packet_window_reviewed_artifact_acceptance_gate_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `require_reviewed_acceptance_record_after_candidate_template`.

The packet-window candidate template renderer can produce a shape-only candidate object after platform values and repo proof pass. PM now needs an acceptance gate so the rendered object can be classified as `accepted` or `rejected` before any later packet-window artifact is created.

Current route: `beta_packet_window_reviewed_artifact_acceptance_gate`.

Current outcome: `acceptance_gate_ready_external_values_still_pending`.

This gate does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Command Map

Focused commands:

1. `cmd.exe /c npm run render:beta-packet-window-candidate-template`
2. PM reviews the shape-only output.
3. PM records a separate reviewed artifact later with outcome `accepted` or `rejected`.

This slice deliberately does not create the later record file because the renderer is currently blocked at `blocked_waiting_values`. It defines the acceptance shape and fail-closed rules so the next packet-window artifact is not improvised.

## Accepted Record Shape

A future reviewed artifact may be accepted only if it records all of these fields without secrets:

```json
{
  "status": "accepted",
  "source": "render:beta-packet-window-candidate-template",
  "templateStatus": "packet_window_candidate_template_ready_shape_only",
  "sourceBranch": "repo_branch_from_renderer",
  "sourceCommit": "repo_commit_from_renderer",
  "worktreeState": "clean",
  "publicDataSource": "mock",
  "scoreSource": "mock",
  "hostingProjectNameRecorded": true,
  "temporaryBetaUrlRecorded": true,
  "preExecutionReviewRequired": true,
  "deploymentAuthorized": false
}
```

The reviewed artifact may record the plain hosting project name and public temporary Beta URL only after the validator has accepted them. It must not record secrets, environment values, dashboard tokens, DNS credentials, private preview tokens, row payloads, stock id payloads, raw market data, or deployment commands.

## Rejected Record Shape

A future reviewed artifact should be rejected when:

- the template status is not `packet_window_candidate_template_ready_shape_only`;
- worktree state is not `clean`;
- `publicDataSource` is not `mock`;
- `scoreSource` is not `mock`;
- platform values include secrets, dashboard URLs, query strings, private preview tokens, or non-public hostnames;
- A2 public-route readability review is required but not yet scheduled;
- rollback owner, incident owner, or secret/env handling note is missing for the later execution window.

Rejected records must not authorize any deployment action. The next route is repair and rerender.

## Output States

| State | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_values` | Renderer has not produced a ready template. | Keep waiting for safe platform values. |
| `rejected` | PM rejects the rendered artifact shape or boundary evidence. | Repair and rerender before packet work. |
| `accepted` | PM accepts the rendered artifact shape for a separate packet-window artifact. | Prepare a later reviewed packet-window artifact, still not deployment execution. |

## PM / A1 / A2 Routing

PM route:

- Keep this gate ready while platform values are pending.
- After renderer readiness, classify the rendered object as `accepted` or `rejected`.
- Do not treat accepted as deployment authorization.

A1 route:

- Continue TWII / ETF source-rights evidence independently.

A2 route:

- Re-enter after a public temporary Beta URL is validator-accepted and PM asks for public-route readability QA.

I route:

- Provide only the plain project name and public temporary Beta URL.
- Keep private platform tokens, dashboard tokens, env values, DNS credentials, and secrets outside repo and logs.

## Acceptance

PM may classify this gate as `accepted` when:

1. the accepted and rejected record shapes are explicit;
2. the record shape requires `publicDataSource=mock`;
3. the record shape requires `scoreSource=mock`;
4. accepted still leaves `deploymentAuthorized` as false;
5. the gate references `render:beta-packet-window-candidate-template`;
6. package and review-gate registration exist;
7. hard stops are visible.

## Hard Stops

This gate does not authorize:

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

- `cmd.exe /c npm run check:beta-packet-window-reviewed-artifact-acceptance-gate`
- `cmd.exe /c npm run render:beta-packet-window-candidate-template`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
