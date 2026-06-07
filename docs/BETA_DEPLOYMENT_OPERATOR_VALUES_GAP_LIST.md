# Beta Deployment Operator Values Gap List

Status: `beta_deployment_operator_values_gap_list_ready_external_values_pending`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `compress_operator_values_gap_before_executable_packet_candidate`.

The local launch proof bundle is captured and reusable, but the executable deployment packet remains blocked by a small set of safe non-secret operator values. PM should keep this gap list short and actionable so the future packet can be created without reopening broad governance.

This gap list does not deploy, does not create or mutate a hosting project, does not run deployment commands, does not upload secrets, does not mutate platform environment variables, does not change DNS or SSL, does not connect to Supabase, does not run SQL, does not write Supabase, does not modify `daily_prices`, and does not promote public runtime state.

Current route: `operator_values_gap_fill_then_executable_packet_candidate`.

Current outcome: `external_operator_values_gap_identified_packet_blocked`.

## Source Inputs

This gap list is grounded in:

- `docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md`
- `docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md`
- `docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md`
- `docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Accepted baseline:

- Local launch proof bundle snapshot is `local_launch_proof_bundle_snapshot_ready_external_values_pending`.
- Local proof outcome is `local_proof_bundle_ready_external_operator_values_pending`.
- Minimal operator values sheet is `beta_deployment_operator_values_minimal_sheet_ready_not_filled`.
- Operator values completion gate is `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`.
- Safe fill recheck outcome is `external_operator_values_still_pending_executable_packet_blocked`.
- Executable packet candidate gate remains `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.

## PM Auto-Refresh Values

PM may refresh these values during the same future executable packet creation window:

| Value | Refresh command | Packet status |
| --- | --- | --- |
| Deployment source branch | `git branch --show-current` | `repo_refreshable_not_final` |
| Source commit | `git rev-parse --short HEAD` | `repo_refreshable_not_final` |
| Worktree state | `git status --short` | `repo_refreshable_not_final` |
| Local proof bundle | current proof commands from `docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md` | `repo_refreshable_not_final` |

PM should not ask for these values separately unless local commands fail.

## External Values Still Required

The future executable packet candidate needs these safe non-secret values:

| Gap | Required value | Safe format | Owner | Current status |
| --- | --- | --- | --- | --- |
| Hosting provider | Provider name | Plain provider name only | PM / I | `external_operator_value_pending` |
| Hosting project | Project name | Plain project name only | PM / I | `external_operator_value_pending` |
| Temporary Beta URL | Public URL | Public URL without secret query string | PM / I | `external_operator_value_pending` |
| Exact platform action | Human action summary | Human-readable action only, no command | PM / I | `external_operator_value_pending` |
| Environment variable owner | Role or person name | Name only, no values | PM / I | `external_operator_value_pending` |
| Secret input owner | Role or person name | Name only, no secret | PM / I | `external_operator_value_pending` |
| Secret handling channel | Out-of-repo channel name | Channel name only, no tokenized link | PM / I | `external_operator_value_pending` |
| Rollback owner | Role or person name | Name only | I | `external_operator_value_pending` |
| Rollback reference | Prior deployment label or fallback route | Non-secret label or route | I | `external_operator_value_pending` |
| Incident owner | Role or person name | Name only | PM / I | `external_operator_value_pending` |
| First-response channel | Channel name | Channel name only, no private tokenized link | PM / I | `external_operator_value_pending` |
| Maximum downtime before rollback | Time threshold | Explicit time threshold | PM / I | `external_operator_value_pending` |
| Post-run review path | Repo-relative review path | `docs/reviews/...md` | PM | `external_operator_value_pending` |

## Accepted Defer Values

These values may remain deferred for the first temporary Beta if the deployment target is a platform preview or Beta URL:

| Value | Accepted defer |
| --- | --- |
| Custom domain | `DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES` |
| DNS / SSL | `DEFER_DNS_SSL_UNTIL_CUSTOM_DOMAIN_SELECTED` |

If a custom domain is selected before Beta health passes, DNS/SSL moves back to `external_operator_value_pending`.

## Never Fill In Repo

Never write these values into this gap list, another repo document, logs, issue text, screenshots, or commit messages:

- deployment token;
- API token;
- private preview token;
- private dashboard token;
- registrar credential;
- SSL private key;
- env value;
- service role key;
- Supabase secret;
- raw payload;
- row payload;
- stock id payload;
- private invite token;
- payment credential.

If a needed value falls into this list, mark the gap `blocked_external_operator_input_pending` and keep it out of the repo.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must not treat this gap list as source-rights approval, market-data approval, parser approval, candidate generation approval, Supabase read approval, Supabase write approval, `daily_prices` mutation approval, row coverage approval, public source promotion, or score promotion.

A2 remains assigned to public trust and disclosure support. A2 should only re-enter this deployment lane if PM needs a route-level public trust-copy regression pass before packet creation.

## Packet Readiness Rule

PM may create a separate executable packet candidate only when:

1. every `external_operator_value_pending` gap is replaced by a safe non-secret value or an accepted defer value;
2. repo-refreshable values are refreshed in the same packet creation window;
3. no never-fill-in-repo value appears;
4. `publicDataSource=mock` remains unchanged;
5. `scoreSource=mock` remains unchanged;
6. local proof bundle is refreshed or accepted for the packet window;
7. the packet remains a separate reviewed artifact before any deployment action.

Until then, the current outcome stays `external_operator_values_gap_identified_packet_blocked`.

## Hard Stops

This gap list does not authorize:

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

## Next Route

The next route is `fill_safe_operator_values_or_continue_local_launch_runtime_data_work`, not deployment.

If operator values remain unavailable, CEO/PM should continue local work on runtime promotion readiness, source-rights gates, coverage gates, or public trust copy without changing runtime source state.

## Verification

Focused verification:

- `node scripts/check-beta-deployment-operator-values-gap-list.mjs`
- `cmd.exe /c npm run check:beta-deployment-operator-values-gap-list`
- `node scripts/check-review-gates.mjs`
