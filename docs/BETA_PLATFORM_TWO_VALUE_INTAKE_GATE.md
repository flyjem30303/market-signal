# Beta Platform Two Value Intake Gate

Status: `beta_platform_two_value_intake_gate_ready_waiting_two_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops

## CEO Decision

CEO decision: `compress_beta_platform_intake_to_two_safe_values`.

The repo proof runner is executable and the broader operator defaults are already recorded. PM should not reopen the full operator sheet before the first temporary Beta. The current Beta executable packet blocker is now narrowed to two safe non-secret values.

Current route: `beta_platform_two_value_intake_gate`.

Current outcome: `waiting_for_hosting_project_name_and_temporary_beta_url`.

This gate does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Required Values

Only these two values are required to open the next executable packet candidate window:

| Value | Current status | Safe format | Reject if |
| --- | --- | --- | --- |
| Hosting project name | `platform_generated_value_pending` | Plain project name only, for example `taiwan-market-signal-beta`. | Contains token, dashboard URL, secret, env value, private invite, or credential. |
| Temporary Beta URL | `platform_generated_value_pending` | Public `https://...` URL without secret query string. | Contains tokenized query string, private preview token, dashboard URL, credential, or non-public URL. |

Everything else remains handled by accepted defaults or explicit defer posture:

- hosting provider posture: `vercel_or_equivalent_managed_nextjs_host`;
- exact platform action: `platform_action_description_later_no_command`;
- custom domain: `accepted_defer_until_temporary_beta_health_passes`;
- DNS/SSL: `accepted_defer_until_custom_domain`;
- env owner: `pm_i_shared_owner_default`;
- secret input owner/channel: `out_of_repo_secret_channel_required`;
- rollback and incident posture: `first_beta_default_runbook_owner_and_rollback_threshold`;
- post-run review path: `docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md`.

## Opening Rule

PM may move from this gate to `beta_deployment_executable_packet_after_platform_values` only when:

1. hosting project name is provided as a safe non-secret value;
2. temporary Beta URL is provided as a safe public URL without secret query values;
3. `run:beta-executable-packet-repo-proof` passes in the same packet window;
4. `publicDataSource=mock` remains unchanged;
5. `scoreSource=mock` remains unchanged;
6. no deployment command is recorded in repo documents or logs.

If either value is missing or unsafe, PM keeps this gate at `beta_platform_two_value_intake_gate_ready_waiting_two_values` and continues safe local work.

## PM / A1 / A2 Routing

PM route:

- Ask I / launch operator only for the two required safe values when the chairman is ready to create the platform project.
- Use `run:beta-executable-packet-repo-proof` to refresh repo proof after the values exist.
- Do not request secrets, env values, dashboard tokens, DNS credentials, private preview tokens, or deployment commands through repo artifacts.

A1 route:

- Continue TWII / ETF source-rights evidence independently.
- Do not use this gate as data-source approval, Supabase read/write approval, row coverage approval, or real promotion approval.

A2 route:

- Re-enter only after the temporary Beta URL exists and PM asks for route-level readability or trust-copy QA.

I route:

- Provide the plain hosting project name and public temporary Beta URL only.
- Keep secrets, env values, platform tokens, dashboard tokens, DNS credentials, and private preview tokens outside repo and logs.

## Acceptance

PM may classify this gate as `accepted` when:

1. the two required values are explicit;
2. all other platform/operator values are either accepted defaults or accepted defer values;
3. package and review-gate registration exist;
4. `check:beta-platform-two-value-intake-gate` passes;
5. the next route remains packet candidate creation, not deployment execution.

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

- `cmd.exe /c npm run check:beta-platform-two-value-intake-gate`
- `cmd.exe /c npm run run:beta-executable-packet-repo-proof`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
