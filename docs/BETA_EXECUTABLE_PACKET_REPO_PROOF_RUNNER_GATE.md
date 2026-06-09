# Beta Executable Packet Repo Proof Runner Gate

Status: `beta_executable_packet_repo_proof_runner_gate_ready`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `make_repo_derived_packet_proof_executable_without_waiting_for_platform_values`.

The executable Beta packet is still blocked by platform-generated values, but repo-derived proof does not need to wait. PM should make branch, commit, worktree state, fast route health, TypeScript, public route loop, and mock runtime boundary repeatable now.

Current route: `beta_executable_packet_repo_proof_runner_gate`.

Current outcome: `repo_proof_runner_ready_packet_still_blocked_external_platform_values_pending`.

This gate does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Runner

Runner command:

- `cmd.exe /c npm run run:beta-executable-packet-repo-proof`

The runner collects only repo-local and localhost-safe proof:

1. `git branch --show-current`
2. `git rev-parse --short HEAD`
3. `git status --short`
4. `cmd.exe /c npm run check:beta-runtime-fast-health`
5. `cmd.exe /c npm run check:public-route-loop`
6. `cmd.exe /c npx tsc --noEmit`

The runner returns `packetCandidateAllowed: false` until platform values are present. A dirty worktree is allowed for development runs and is treated as `needs_pm_review_before_packet_creation`, but the runner now also emits a no-Git `pmSnapshot`.

When Git backup is intentionally deferred, `pmSnapshot.status=classified_beta_readiness_worktree_safeguard_ready` and `pmSnapshot.unresolvedCount=0` can satisfy the packet-window worktree safeguard without staging, committing, or pushing. This does not approve deployment; it only prevents the packet-window dry run from being blocked by a classified Beta-readiness worktree.

## Relationship To Platform Values

Platform values remain external blockers:

- hosting project name is `platform_generated_value_pending`;
- temporary Beta URL is `platform_generated_value_pending`;
- platform action description is `external_operator_value_pending`;
- env owner and secret handling owner remain `external_operator_value_pending`.

The runner can refresh repo proof before those values exist, but it cannot create an executable packet by itself.

## PM / A1 / A2 Routing

PM route:

- Use this runner after meaningful runtime or launch-preflight changes.
- If runner passes and platform values remain pending, continue `beta_deployment_executable_packet_after_platform_values_or_runtime_promotion_readiness_with_mock_boundary`.
- If runner fails, repair runtime or TypeScript before packet work.
- If platform values arrive, use this runner output as the repo-derived section of the executable packet candidate.

A1 route:

- Continue TWII / ETF source-rights evidence.
- Do not use this runner as source-rights approval, Supabase read/write approval, row coverage approval, or real promotion approval.

A2 route:

- Re-enter only if the runner fails on public route health, trust copy, or route rendering.

I route:

- Provide only safe non-secret platform values when available.
- Do not put deployment tokens, dashboard tokens, DNS credentials, env values, or secrets in repo documents or logs.

## Acceptance

PM may classify this gate as `accepted` when:

1. `run:beta-executable-packet-repo-proof` exists;
2. `check:beta-executable-packet-repo-proof-runner-gate` passes;
3. repo proof commands are explicit;
4. no-Git `pmSnapshot` is emitted when the worktree is dirty;
5. platform values remain explicit blockers;
6. `publicDataSource=mock` remains unchanged;
7. `scoreSource=mock` remains unchanged;
8. package and review-gate registration exist;
9. the runner output never marks public launch complete.

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

- `cmd.exe /c npm run check:beta-executable-packet-repo-proof-runner-gate`
- `cmd.exe /c npm run run:beta-executable-packet-repo-proof`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
