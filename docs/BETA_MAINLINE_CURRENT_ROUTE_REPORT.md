# Beta Mainline Current Route Report

Status: `beta_mainline_current_route_report_ready`

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Public Copy / Trust / Legal / UX Readiness

## CEO Decision

CEO decision: `keep_beta_mainline_moving_with_a1_a2_parallel_routes`

PM should use one current-route report before choosing the next Beta launch slice. The report keeps the mainline focused on Beta launch readiness while A1 and A2 continue in parallel. It does not replace the individual reports; it summarizes them into the next route.

## Command

```powershell
cmd.exe /c npm run report:beta-mainline-current-route
cmd.exe /c npm run check:beta-mainline-current-route
cmd.exe /c npm run check:public-beta-core-route-quick-proof
cmd.exe /c npm run report:pm-worktree-review-preflight
```

## Route Logic

The report reads:

- `report:beta-platform-unblock-kit`
- `report:beta-launch-next-action`
- `report:a1-source-rights-next-action`
- `report:a1-source-rights-readiness-summary`
- `report:a1-exact-source-rights-evidence-worksheet`
- `report:a1-twii-four-slot-reply-request`
- `report:a1-twii-evidence-completion-status`
- `check:a1-twii-evidence-intake-mini-packet`
- `report:a1-source-rights-evidence-batch-brief`
- `report:a1-source-rights-reviewed-outcome-surface`
- `report:a2-public-copy-readability-candidates`
- `check:public-beta-core-route-quick-proof`
- `report:pm-worktree-review-preflight`

If an accepted reviewed artifact exists, PM routes to `render:beta-pre-execution-packet-candidate`.

If the two platform values are present and response-readiness accepts the shape, PM routes to `run:public-beta-post-reply-route-once`.

If platform values are missing, PM waits only for:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

The mainline report surfaces `platformOperatorHandoff`, which carries only placeholder reply lines:

- `BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>`
- `BETA_TEMPORARY_URL=https://<public-beta-hostname>/`

It also repeats the safe-shape reminders, the next validator command, the post-value proof-map command, and the reviewed-artifact outcome recorder command. It does not print real platform values and keeps `valuesAreNotStoredInRepo=true`.

While those two values are missing, `pmMainline.nextCommand` now routes first to:

```powershell
cmd.exe /c npm run report:public-beta-external-input-request
```

The mainline report also surfaces `externalInputRequest` without invoking the standalone external-input report, avoiding recursive report execution. The embedded summary has exactly two no-secret reply blocks:

- `beta_platform_two_values`
- `a1_twii_four_slot_no_secret_evidence`

The mainline report also embeds `externalInputRequest.pmOneScreenReplyPacket`, the shortest copyable PM/A1 handoff:

- Block 1 - Beta platform two values: `BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>` and `BETA_TEMPORARY_URL=https://<public-beta-hostname>/`.
- Block 2 - A1 TWII four-slot no-secret evidence: `vendor-terms-evidence`, `internal-feed-owner-evidence`, `field-contract-evidence`, and `asset-mapping-evidence`.
- Each A1 slot must include `evidenceSlotId`, `sourceReferenceLabel`, `safeEvidenceSummary`, and `remainingRisk`.
- Platform after-reply route: `cmd.exe /c npm run report:public-beta-external-input-response-readiness`, then `cmd.exe /c npm run run:public-beta-post-reply-route-once`.
- A1 after-reply route includes `cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once`.
- Fail-fast rule: if any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to `report:a1-twii-four-slot-reply-request`.

Both blocks route PM first to `report:public-beta-external-input-response-readiness`, the one local after-reply readiness report that summarizes whether platform values and A1 four-slot evidence can proceed.
That response-readiness report emits a single `nextExecutableStep`, so PM can act on one shortest next command instead of scanning a broad command list.
The first block asks only for `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL`, then routes PM to `report:public-beta-external-input-response-readiness`, `run:public-beta-post-reply-route-once`, and `report:beta-mainline-current-route`. The combined one-command runner performs response-readiness, two-value validation, packet-window proof-map, and A1 post-reply routing internally, so PM does not manually split those steps unless debugging a failed runner.
The second block asks A1 for the four TWII no-secret evidence fields, then routes PM to `check:a1-twii-evidence-response-shape`, `report:a1-twii-evidence-pm-classification-route`, `report:a1-source-rights-reviewed-outcome-surface`, and `report:a1-source-rights-readiness-summary`.

The mainline report also embeds `externalInputRequest.pmReplyPacketContract` so PM can see the same reply contract from the main route report:

- Status: `pm_reply_packet_contract_ready`
- Complete reply requires `beta_platform_two_values`: `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL`.
- Complete reply requires `a1_twii_four_slot_no_secret_evidence`: all four TWII slots, each with `evidenceSlotId`, `sourceReferenceLabel`, `safeEvidenceSummary`, and `remainingRisk`.
- Forbidden content includes secrets, dashboard URLs, Supabase URLs, private preview tokens, copied contract text, raw market data, row payloads, and stock-id payloads.
- First command after any reply: `cmd.exe /c npm run report:public-beta-external-input-response-readiness`.
- One-runner after shape-safe reply: `cmd.exe /c npm run run:public-beta-post-reply-route-once`.
- A1 one-runner after evidence reply: `cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once`.
- Done signals include `platform_two_values_shape_valid`, `a1_four_twii_slots_present_in_no_secret_shape`, and `response_readiness_routes_to_post_reply_one_runner`.
- Still not allowed: storing platform values in repo, recording A1 evidence from the request, deploying from the request, or promoting `publicDataSource` / `scoreSource`.

The mainline report also surfaces `pmRouteRouter` from `report:beta-launch-next-action`.
This gives PM one lightweight router summary inside the current-route report:

- router command: `cmd.exe /c npm run report:beta-launch-next-action`
- current PM command while values are missing: `cmd.exe /c npm run report:public-beta-external-input-request`
- current A1 command while evidence is pending: `cmd.exe /c npm run report:a1-twii-four-slot-reply-request`
- first command after A1 replies: `cmd.exe /c npm run report:public-beta-external-input-response-readiness`

`pmRouteRouter` is read-only and does not record evidence, approve source rights, deploy, execute SQL, connect to Supabase, fetch market data, or promote source/score state.

While those external inputs are missing, the report returns `pmDefaultWhenBlocked.active=true`.
That default route prevents repeated governance expansion:

- Refresh focused local runtime proof only when runtime code or route health changes.
- Keep A1 on the TWII four-slot no-secret evidence request.
- Keep A2 on urgent public-copy regression repairs only.
- Do not reopen broad deployment governance.
- Do not expand A2 visual polish before platform values arrive.
- Do not create a packet-window artifact before both platform values validate.

A1 remains on exact TWII/ETF source-rights evidence intake until the exact ledger can open a separate TWII or ETF source-rights outcome gate.
Its PM-facing immediate command is now `cmd.exe /c npm run report:a1-twii-four-slot-reply-request`; the full worksheet stays available as background evidence context, not the shortest next handoff.
The mainline report also surfaces `parallelRoutes.a1.readiness`, including ready lanes, blocked lanes, TWII pending count, ETF pending count, and the A1 readiness next command.
The mainline report also surfaces `parallelRoutes.a1.priorityDecision`, keeping TWII first through `twii_source_rights_unblock_first_etf_parallel_rights_option`, preserving ETF as a parallel option, and marking the priority decision as non-executable.
The mainline report also surfaces `parallelRoutes.a1.worksheetBatch`, including the pending TWII/ETF slot groups and the recommended non-executable `twii_source_rights_unblock_first_batch`.
That batch keeps A1 focused on the four TWII source-rights slots before the readiness summary is rerun; it does not approve source rights, candidate generation, row coverage, Supabase access, SQL, ingestion, public source promotion, or real scoring.
The mainline report also surfaces `parallelRoutes.a1.miniPacket`, which points PM/A1 to `docs/A1_TWII_EVIDENCE_INTAKE_MINI_PACKET.md` and keeps the immediate handoff to the four TWII slots only. This is the preferred narrow A1 surface when PM wants progress without reopening the full 10-slot worksheet.
The mainline report also surfaces `parallelRoutes.a1.batchBrief`, which summarizes the TWII-first batch brief: batch id, lane, four pending slot ids, required no-secret output shape, PM handoff note, next readiness command, and fail-closed safety flags. This lets PM assign the current A1 evidence task from the mainline route report without opening the full worksheet.
The mainline report also surfaces `parallelRoutes.a1.reviewedOutcomeSurface`, which summarizes the PM reviewed-outcome routes for the four TWII slots: `accepted` routes only to the separate TWII source-rights outcome gate, `rejected` and `blocked` stay blocked, and `needs_bounded_repair` routes to bounded repair. It also confirms no evidence is recorded and no Supabase or market-data access is enabled by the route report.
The mainline report also surfaces `parallelRoutes.a1.pmClassificationRoute`, which gives PM the four dry-run-only classification options for each TWII slot: `accepted`, `rejected`, `needs_bounded_repair`, and `blocked`. This keeps the post-A1-reply review path visible from the same PM route report before any reviewed outcome gate is considered.
The mainline report also surfaces `parallelRoutes.a1.completionStatus`, including `slotIds`, `pmClassificationQueue`, and `pmQueueRule`. This lets PM see the four pending TWII slots, the response-readiness-first command order, the A1 post-reply one-runner, the no-secret shape guard, the PM classification command, the four allowed classification options, and the current remaining risk for each slot from the same mainline report.

A2 remains on public Beta trust copy, legal disclosure, first-screen readability, and user-understanding checks. If urgent first-screen blockers are zero, A2 should patch only launch-blocking public-copy regressions.
The mainline report surfaces `parallelRoutes.a2.decisionSupport`, so PM can see the next A2 maintenance slice without reading the full public-copy scanner output. While urgent first-screen candidates are zero, that route stays on `a2-checker-hardening`.
The mainline report also surfaces `parallelRoutes.a2.launchBlockingStatus`. When this status is `clear` and `hardBlocker=false`, PM should treat P2 copy or visual polish as deferred work, not as a public Beta blocker.
The A2 scanner also emits `scannerIntegrity`, which is guarded by `check:a2-public-copy-readability-candidates` so public-copy QA remains local-only, network-free, env-free, localhost-independent, Supabase-client-free, and raw-payload-free.

The mainline report surfaces `runtimeHealth` from `check:beta-runtime-fast-health`, including checked route count, HTTP `200` status, and the runtime boundary. This keeps PM's Beta packet route tied to actual local public-route health without running the heavier milestone-only localhost full-health gate every time.

The mainline report also surfaces `coreRouteQuickProof`, which runs the focused public Beta quick proof across the nine core routes, route-local trust/readiness contracts, mojibake guard, and mock-only runtime boundary. This gives PM a faster local proof before reopening broader review gates.

The mainline report also surfaces `pmWorktreeReview` from `report:pm-worktree-review-preflight`. This shows whether packet candidate creation is blocked by a dirty or unreviewed worktree, plus changed-file counts by A1 evidence support, Beta deployment/packet chain, public runtime/trust surface, and PM-decision buckets. It does not stage, commit, push, reset, or approve deployment.

When the worktree is classified as a safeguard-ready Beta readiness set, `pmWorktreeReview.nextRoute` still follows the active hard blocker chain: `collect_external_input_response_then_run_public_beta_post_reply_one_runner`. This keeps the PM route aligned with the combined external-input request instead of falling back to the older platform-only route.

The mainline report also surfaces `goalReadiness` from the shared public Beta GOAL readiness rollup helper. This keeps the active GOAL visible in the same PM route report: runtime core routes, Beta platform values and packet readiness, A1 source-rights and coverage frontier, A2 public trust copy, and the mock-only promotion boundary. The embedded rollup is built in memory from the current mainline report and does not invoke the standalone rollup command, so the mainline route avoids recursive report execution. Its first `nextBestActions` entry matches the PM mainline route and points to `cmd.exe /c npm run report:public-beta-external-input-request`.

## Safety Boundary

This report is a local route report only.

- `publicDataSource=mock`
- `scoreSource=mock`
- No deployment is authorized.
- No hosting resource is created or mutated.
- No platform environment value is printed.
- No SQL is executed.
- No Supabase connection, read, or write is executed.
- No staging rows or `daily_prices` rows are created or modified.
- No raw market data is fetched, stored, ingested, or committed.
- No secrets, raw payloads, row payloads, or stock id payloads are printed.

## PM Usage

Use this report when the next action is unclear after A1 or A2 changes. It should prevent repeated broad governance by giving PM one consolidated route:

1. Continue Beta platform value / packet work when safe.
2. Use `report:public-beta-external-input-request` as the first PM handoff while platform values and A1 TWII evidence are both missing; the mainline report also surfaces `externalInputRequest.pmCopyableReplyChecklist` and `externalInputRequest.pmReplyPacketContract` for the two platform lines, four A1 evidence slots, forbidden content, done signals, and still-not-allowed boundaries.
3. After any external reply, use `report:public-beta-external-input-response-readiness`, then continue with `run:public-beta-post-reply-route-once` before opening packet-window review or A1 outcome-gate work.
4. Keep A1 source-rights and coverage evidence moving in parallel through `report:a1-twii-four-slot-reply-request`, `check:a1-twii-evidence-intake-mini-packet`, `report:a1-source-rights-readiness-summary`, `report:a1-exact-source-rights-evidence-worksheet`, `report:a1-source-rights-evidence-batch-brief`, and `report:a1-source-rights-reviewed-outcome-surface`.
5. Keep A2 public trust and first-screen readiness stable.
6. Check `goalReadiness` to see which public Beta GOAL items are ready, blocked, or held before choosing another broad slice.
7. Do not promote real data or real scores until a separate promotion gate passes.
