# Runtime Autonomy Handoff

Updated: 2026-06-04

This is the short recovery note for autonomous CEO / PM runtime continuation. Use it when the chat is compacted, the chairman is away, or a heartbeat resumes with limited context.

## Current Mainline

- Owner: PM mainline, under CEO direction.
- Active lane: CEO / PM / Runtime Engineering.
- Support lanes: A1 handles Data / Supabase / Market Evidence; A2 handles Frontend / UX Readability / Public Copy QA; I handles Cloud Deployment / DevOps / Launch Operations readiness.
- Integration rule: PM is the only integration owner. A1, A2, and I prepare inputs; PM decides what enters mainline.

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

1. Runtime guard summary readability and display-only fields.
2. Freshness / readonly / mock-boundary copy that prevents user or operator confusion.
3. Local static checker coverage for public language, fail-closed behavior, and review-gate registration.
4. TypeScript and local route health.
5. Documentation updates that preserve context after compaction.

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
