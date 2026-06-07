# Beta Pre-Execution Packet Candidate Template

Status: `beta_pre_execution_packet_candidate_template_ready_waiting_accepted_artifact`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_pre_execution_candidate_after_accepted_packet_window_artifact_not_deployment`.

The Beta packet-window chain now has a two-value operator handoff, one-command proof map, reviewed artifact outcome recorder, and packet-to-deployment bridge. PM needs one executable local renderer for the next step after an accepted no-secret reviewed artifact exists.

Current route: `beta_pre_execution_packet_candidate_template`.

Current outcome: `waiting_for_accepted_packet_window_reviewed_artifact`.

This template does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Renderer

Command:

- `cmd.exe /c npm run render:beta-pre-execution-packet-candidate`

The renderer reads only no-secret local review artifacts:

- `docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_*.md`

It does not write an output file. It emits JSON for PM review.

## Current States

| State | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_accepted_reviewed_artifact` | No accepted packet-window reviewed artifact exists. | Keep waiting for two safe platform values, proof map, and PM accepted review. |
| `rejected_or_blocked_reviewed_artifact_requires_repair` | The latest reviewed artifact is rejected, blocked, or unsafe. | Repair packet-window artifact before pre-execution. |
| `pre_execution_packet_candidate_ready_not_authorized` | An accepted no-secret reviewed artifact exists and the local candidate can be rendered. | PM may prepare a separate execution review packet, still not deployment execution. |

## Candidate Shape

When ready, the candidate JSON must include:

- `status: "pre_execution_packet_candidate_ready_not_authorized"`;
- `deploymentAuthorized: false`;
- `publicDataSource: "mock"`;
- `scoreSource: "mock"`;
- selected reviewed artifact path;
- source branch and commit;
- worktree state;
- route health targets;
- public temporary Beta URL as already recorded by the accepted validator artifact;
- hosting project name as already recorded by the accepted validator artifact;
- rollback owner/reference placeholders;
- incident owner/channel placeholders;
- env/secret owner placeholders without values;
- post-run review path;
- hard-stop list.

The renderer may include safe placeholder strings for fields that must still be filled by I or PM, but it must not include secrets, tokens, platform commands, raw payloads, SQL, market-data rows, stock-level payloads, or executable deployment instructions.

No deployment command is emitted.

## PM / A1 / A2 Routing

PM route:

- If the renderer returns `blocked_waiting_accepted_reviewed_artifact`, continue waiting for two safe platform values and packet-window review.
- If it returns `pre_execution_packet_candidate_ready_not_authorized`, create a separate execution review packet candidate before any deployment command exists.
- Do not treat this candidate as deployment authorization.

A1 route:

- Continue TWII / ETF source-rights, coverage, and Supabase evidence work independently.
- Do not treat a Beta pre-execution candidate as data-source approval.

A2 route:

- Re-enter after a validator-accepted public temporary Beta URL exists and PM asks for public route copy QA.
- Keep visual polish behind trust, legal, mock/real, and route clarity.

I route:

- Provide only safe non-secret operator values when PM asks.
- Keep platform tokens, private preview tokens, dashboard tokens, DNS credentials, and env values outside repo and logs.

## Acceptance

PM may classify this template as `accepted` when:

1. the renderer exists;
2. no accepted artifact produces `blocked_waiting_accepted_reviewed_artifact`;
3. rejected or blocked artifacts do not produce a ready candidate;
4. accepted artifacts must preserve `deploymentAuthorized=false`;
5. `publicDataSource=mock` remains required;
6. `scoreSource=mock` remains required;
7. package and review-gate registration exist;
8. hard stops remain visible;
9. no deployment command is emitted.

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

- `cmd.exe /c npm run check:beta-pre-execution-packet-candidate-template`
- `cmd.exe /c npm run render:beta-pre-execution-packet-candidate`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
