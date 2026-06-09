# Beta Platform Unblock Kit

Status: `beta_platform_unblock_kit_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Source Rights, A2 Public Copy QA, I Launch Ops

## CEO Decision

CEO decision: `keep_beta_mainline_waiting_only_for_two_safe_platform_values_then_post_reply_one_runner`.

The Beta packet chain is already locally prepared. The current blocker is not more planning; it is only the two safe platform values:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

PM should not reopen broad deployment governance while those values are missing. PM should keep A1/A2 moving in parallel and use this kit to resume the packet window as soon as the two values exist.

## Command

Run the local unblock report:

- `cmd.exe /c npm run report:beta-platform-unblock-kit`

The report does not print the values. It reports only whether each value is present, the next command, the proof-map route, A1/A2/I support-lane actions, and stop lines.

The report also includes a placeholder-only operator reply template. Replace the placeholders outside tracked repo documents, then run the response-readiness report:

```text
BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>
BETA_TEMPORARY_URL=https://<public-beta-hostname>/
```

The template is intentionally not a storage location for real values. Do not paste real platform values into tracked docs or reports.

## Mainline Route

Current missing-value command:

- `cmd.exe /c npm run report:public-beta-external-input-request`

After the operator or A1 replies:

- `cmd.exe /c npm run report:public-beta-external-input-response-readiness`

After both platform values are present, run the response-readiness report and then the combined post-reply one-runner:

- `cmd.exe /c npm run run:public-beta-post-reply-route-once`

The combined one-runner performs response-readiness, two-value validation, packet-window proof map, and A1 post-reply routing internally as applicable. Use the standalone validator, platform proof runner, or proof-map command only to debug a failed runner.

Diagnostic-only commands:

- `cmd.exe /c npm run validate:beta-platform-two-values`
- `cmd.exe /c npm run run:beta-packet-window-proof-map`
- `cmd.exe /c npm run run:beta-platform-two-value-proof-map-once`

These diagnostic commands are not the PM routine next step. The PM routine path is response-readiness first, then `run:public-beta-post-reply-route-once`.

After the proof map reaches pending PM review:

- `cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note "PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision."`

Acceptance of the reviewed artifact is still not deployment authorization. It only allows the next pre-execution packet candidate step.

## Parallel Lane Routing

A1:

- Continue TWII vendor/internal evidence or ETF source-rights fallback.
- If all required TWII evidence is accepted later, prepare the TWII source-rights outcome gate.

A2:

- Keep public Beta trust copy stable.
- Patch only launch-blocking copy if runtime surfaces change.
- Leave visual polish behind launch blockers.

I:

- Provide only the plain hosting project name and public temporary Beta URL.
- Keep dashboard tokens, private deployment URLs, DNS credentials, platform secrets, and environment secrets outside repo and logs.

## Runtime Boundary

Public runtime remains `publicDataSource=mock`.

Score runtime remains `scoreSource=mock`.

## Hard Stops

No deployment is authorized by this kit.
No hosting resource is created or mutated.
No platform environment value is printed.
No SQL is executed.
No Supabase connection or write is executed.
No staging rows or `daily_prices` rows are created or modified.
No raw market data is fetched, stored, ingested, or committed.
No secrets, raw payloads, row payloads, or stock id payloads are printed.
No public source promotion is authorized.
No real score promotion is authorized.
No investment advice claim is authorized.
No public launch completion claim is authorized.

## Verification

Focused verification:

- `cmd.exe /c npm run check:beta-platform-unblock-kit`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
