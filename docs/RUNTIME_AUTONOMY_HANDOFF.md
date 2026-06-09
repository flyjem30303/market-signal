# Runtime Autonomy Handoff

Updated: 2026-06-08

This is the short recovery note for autonomous CEO / PM runtime continuation. Use it when the chat is compacted, the chairman is away, or a heartbeat resumes with limited context.

## Current Mainline

- Owner: PM mainline, under CEO direction.
- Active lane: CEO / PM / Runtime Engineering.
- Support lanes: A1 handles Data / Supabase / Market Evidence; A2 handles Frontend / UX Readability / Public Copy QA; I handles Cloud Deployment / DevOps / Launch Operations readiness.
- Integration rule: PM is the only integration owner. A1, A2, and I prepare inputs; PM decides what enters mainline.

## Current GOAL Wording - Delivery First

Goal: push the project to a public Beta pre-launch executable state with the shortest safe path.

Operational GOAL v4:
- Remove only the real current hard blockers: missing `BETA_HOSTING_PROJECT_NAME`, missing `BETA_TEMPORARY_URL`, and missing A1 TWII four-slot no-secret source-rights evidence.
- Use the largest safe local slice that directly advances platform values, packet proof, A1 evidence classification, or runtime route health.
- Prefer one-runner commands over split command chains.
- Do not reopen governance, role review, visual polish, or broad audit loops unless they directly unlock the active chain.
- Run only the smallest checker set that proves the slice; reserve the full review gate for promotion, packet milestone, deployment readiness, or large integration.
- Keep reviewed-artifact recording on dry-run by default; apply accepted outcomes only as a separate PM decision.
- Treat UI micro-polish, broad role review, and status-only documents as deferred unless a focused checker shows they block the active launch chain.
- Do not spend a slice only proving that the project is still blocked; every routine slice should either simplify the external reply, validate the post-reply path, or reduce the next PM/A1 action to a smaller executable packet.

CEO velocity rewrite:
- Prioritize the platform -> packet -> A1 evidence -> runtime health chain.
- Use one coherent blocker-removal slice instead of many micro-governance slices.
- Use one-command runners when available.
- Run the smallest checker set that proves the slice.
- Defer UI micro-polish, broad role review, and full review gate unless they unlock the active chain.
- If a safe local next step exists, execute it instead of stopping at another recommendation.

Completion state:
- The two safe Beta platform values are available and shape-validated without printing them.
- The packet-window proof map can run through its local proof route.
- A1 has moved TWII four-slot no-secret evidence to a PM-classifiable state, or PM has recorded the exact remaining external blocker.
- Core public routes stay healthy and readable with `publicDataSource=mock` and `scoreSource=mock`.

Execution rule:
- CEO chooses the next highest-value blocker-removal slice.
- PM executes the slice immediately when it is local-only and safe.
- A1 and A2 remain parallel support lanes; PM integrates only bounded outputs that preserve mock/score boundaries.
- Do not open broad governance, role-review packets, or visual polish unless they unblock the current launch route.

Verification rule:
- Use focused checks first: TypeScript, route health, public visible-language, A1/A2 route-specific checkers, and PM worktree preflight.
- Run the full review gate only after a larger integration or before promotion/packet work.
- Each slice records only completed work, remaining hard blockers, and checks run. Everything else is milestone-review material, not routine progress work.

Hard stops:
- No deployment, SQL, Supabase write, staging row, `daily_prices` mutation, raw market-data fetch/store/commit, secret/raw payload output, `publicDataSource=supabase`, `scoreSource=real`, or Git add/commit/push unless the chairman explicitly asks.

## Current Runtime State

- Runtime source state stays local and mock-facing.
- `publicDataSource=mock` remains the public boundary.
- `scoreSource=mock` remains the scoring boundary.
- Readonly and freshness runtime work may become more readable, but remote execution and production promotion remain gated.
- Current direction: keep hardening runtime guard summaries, freshness / readonly readability, fail-closed behavior, and local route health before any new remote step.
- Mainline readonly / row coverage integration is local-ready and remote-separate. It consolidates bounded readiness, packet bridge, row coverage preexecution packet, and attempt decision into one gate. PM should keep runtime moving unless CEO explicitly names exactly one bounded readonly row coverage attempt as a separate action.
- Latest verified state: full review gate is `ok`, localhost content/full health is `ok`, and briefing / weekly row coverage panels plus the shared row coverage readiness panel are readable while preserving bounded readonly and mock-source stop lines.

## Next Safe Mainline Slice

CEO should choose the next highest-value local-only slice from this order:

1. External-input closure: make the two Beta platform values and A1 TWII four-slot no-secret reply packet smaller, clearer, and easier to run through the post-reply one-runner.
2. Packet proof and blocker route: keep `report:public-beta-external-input-response-readiness`, `run:public-beta-post-reply-route-once`, and `report:beta-mainline-current-route` aligned on the same next action.
3. A1 evidence classification readiness: reduce the remaining A1 evidence repair work to PM-classifiable no-secret slots without recording evidence or approving source rights.
4. Runtime route health and mock boundary only when a route/checker fails or the user reports a visible runtime issue.
5. Documentation updates only when they preserve compaction context or prevent repeated execution drift.

Use larger coherent slices when governance becomes too fine. Do not spend heartbeat time creating narrow role-review documents unless a missing gate would otherwise block runtime work.

If CEO chooses a data-readiness decision slice, use `npm run report:mainline-readonly-row-coverage-integration` and `npm run check:mainline-readonly-row-coverage-integration` as the local-only answer. This is still presentation and readiness work only; it does not execute the remote attempt.

## Recurring Issues To Avoid

- Heartbeat automations created from stale thread paths may fail on the second run. When that happens, continue in the active thread or workspace-local flow instead of rebuilding the same automation loop.
- Public language checkers must never treat mojibake as required text. If visible copy is corrupted, fix the public page and the checker contract together.
- When public runtime copy is rewritten, update both localhost health config and the focused checker in the same slice. Do not preserve corrupted tokens just to keep a gate green.
- Action summaries on home, stock, briefing, and weekly pages are public trust surfaces. Keep their copy readable, mock-boundary explicit, and covered by language-quality checkers.
- The PM project progress panel on `/briefing` is also a public trust surface. Keep status labels, boundary lines, allowed / blocked action text, and CEO authorization text readable; when the component uses aliases such as `sourcePacket`, update checkers to verify the alias and rendered coverage instead of forcing unreadable long property paths.
- Runtime display fields are the public-facing source of truth. UI should render display fields where available and avoid raw internal route/status tokens unless inside explicitly technical detail sections.
- A2 public-copy QA should keep P0/P1 first-screen internal-token candidates at zero. Briefing and weekly first screens should describe mock-only state in plain reader language instead of exposing raw machine tokens such as `publicDataSource=mock` or `scoreSource=mock`.
- Shared trust, freshness, and public-state components should present boundary copy in reader-facing Chinese. Keep raw machine state terms inside internal helpers/checkers or explicitly technical detail sections only.
- Shared public runtime boundary helper copy should stay reader-facing. It may keep `publicDataSource=mock` and `scoreSource=mock` in explicit stop-line disclosures, but surrounding text should explain the boundary in Chinese.
- Row coverage panels and the shared row coverage readiness panel should explain "data-row coverage readiness" in reader-facing language. Keep bounded readonly, `publicDataSource=mock`, and `scoreSource=mock` stop lines explicit, but avoid turning the first paragraph into internal runner jargon.
- Mainline readonly / row coverage integration should stay local-only. It may summarize readiness and blocked promotions, but it must not run the row coverage runner, connect to Supabase, read credentials, print payloads, or promote runtime state.
- A stale Next dev server on port 3000 can return 500 even when `next build` is clean. If localhost routes fail but build/type checks pass, run `npm run dev:recover`, then rerun localhost content/full health and public visible language checks before editing product code.
- Full review gate can take more than two minutes and may end with expected `blocked` status when remote/source gates are intentionally not ready. Read per-item `pass: true` before treating the run as a failure.

## Blocked While Chairman Is Away

- No Git backup, staging, commit, or push.
- No SQL execution.
- No Supabase writes.
- No staging rows.
- No `daily_prices` changes.
- No raw market data fetch, ingest, storage, or commit.
- No secrets or raw payload printing.
- No production source promotion.
- No Supabase public source promotion.
- No real score source activation.
- No action likely to trigger a permission prompt.

## A1 / A2 / I Interface

- A1 may prepare sanitized evidence packets and readonly readiness summaries only. A1 must not run SQL, write Supabase, fetch raw market data, or promote runtime state.
- A2 may prepare visible-copy and readability candidates only. A2 must not change data evidence, Supabase logic, or source promotion.
- I may prepare launch, environment, credential, DNS, monitoring, rollback, and deployment checklists only. I must not deploy, enter secrets, change DNS, or change production environment variables.
- PM merges only passing, bounded, local-only work.

## Verification Minimum

After each coherent local slice, run the relevant targeted checker. If the slice touches runtime UI or public copy, also run public-visible language and TypeScript checks when feasible. Run the full review gate after larger slices, accepting that expected remote/source gates may keep the overall status blocked while each listed item remains `pass: true`.
