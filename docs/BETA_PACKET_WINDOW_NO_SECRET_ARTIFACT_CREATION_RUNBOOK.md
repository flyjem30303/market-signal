# Beta Packet Window No-Secret Artifact Creation Runbook

Status: `beta_packet_window_no_secret_artifact_creation_runbook_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_no_secret_reviewed_artifact_template_after_acceptance_gate`.

The reviewed artifact acceptance gate defines how PM classifies a rendered packet-window candidate as `accepted` or `rejected`. PM now needs a concrete no-secret artifact creation runbook and record template so the later reviewed artifact is consistent, safe to inspect, and clearly not a deployment execution packet.

Current route: `beta_packet_window_no_secret_artifact_creation_runbook`.

Current outcome: `artifact_creation_runbook_ready_external_values_still_pending`.

This runbook does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Command

Focused command:

- `cmd.exe /c npm run render:beta-packet-window-reviewed-artifact-record-template`

The renderer executes this local-only command map:

1. run `render:beta-packet-window-candidate-template`;
2. stop with the renderer's blocked or rejected state until the candidate template is `packet_window_candidate_template_ready_shape_only`;
3. emit a no-secret reviewed artifact record template with outcome `pending_pm_review`;
4. require PM to save a separate artifact only after manual acceptance or rejection.

## Artifact Path Convention

Future reviewed artifacts should use:

```text
docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_YYYY-MM-DD.md
```

If more than one artifact is reviewed on the same date, append a short suffix:

```text
docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_YYYY-MM-DD_02.md
```

## No-Secret Record Template

The renderer may emit this shape only after the candidate renderer is ready:

```json
{
  "status": "pending_pm_review",
  "allowedOutcomes": ["accepted", "rejected"],
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
  "deploymentAuthorized": false,
  "requiredFollowUps": [
    "PM records accepted or rejected",
    "A2 reviews public-route readability after URL is reachable",
    "I confirms secret/env handling outside repo",
    "PM confirms rollback and incident owner before any later execution packet"
  ]
}
```

Allowed future artifact values:

- plain hosting project name after validator acceptance;
- public temporary Beta URL after validator acceptance;
- source branch and short commit;
- clean worktree state;
- mock runtime and mock score boundary;
- accepted/rejected PM outcome;
- no-secret rollback, incident, and A2 review notes.

Forbidden future artifact values:

- secrets;
- environment values;
- dashboard tokens;
- DNS credentials;
- private preview tokens;
- executable deployment commands;
- SQL;
- row payloads;
- stock id payloads;
- raw market data;
- Supabase service keys;
- any value that implies public launch completion.

## PM / A1 / A2 Routing

PM route:

- Use this renderer only after platform values exist or to confirm the safe waiting state.
- Save a reviewed artifact later only after the record template is ready and PM can classify it as `accepted` or `rejected`.
- Do not treat a saved artifact as deployment authorization.

A1 route:

- Continue TWII / ETF source-rights evidence independently.

A2 route:

- Re-enter after a public temporary Beta URL is validator-accepted and PM asks for public-route readability QA.

I route:

- Provide only the plain project name and public temporary Beta URL.
- Keep private platform tokens, dashboard tokens, env values, DNS credentials, and secrets outside repo and logs.

## Acceptance

PM may classify this runbook as `accepted` when:

1. `render:beta-packet-window-reviewed-artifact-record-template` exists;
2. package and review-gate registration exist;
3. absent platform values do not emit a record template;
4. ready output is `pending_pm_review`, not `accepted`;
5. future artifact path convention is explicit;
6. forbidden values are explicit;
7. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Hard Stops

This runbook does not authorize:

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

- `cmd.exe /c npm run check:beta-packet-window-no-secret-artifact-creation-runbook`
- `cmd.exe /c npm run render:beta-packet-window-reviewed-artifact-record-template`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
