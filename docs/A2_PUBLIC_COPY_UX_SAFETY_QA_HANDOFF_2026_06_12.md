# A2 Public Copy / UX Safety QA Handoff - 2026-06-12

Owner lane: A2 Public Copy / UX Safety

Scope: local-only public copy QA for the BRIEF product/runtime line.

This handoff checks whether the public surfaces support the BRIEF target:

- 30 seconds: users can understand market mood.
- 3 minutes: users can decide whether to watch, intensify observation, or reduce risk.
- Every primary signal explains status, cause, update time, impact level, next step, mock/real boundary, and non-investment-advice limits.

## A2 Boundary Held

This slice is documentation-only and copy-safety-only.

- No SQL was run.
- No Supabase connection was attempted.
- No Supabase write was attempted.
- No staging rows were created.
- No `daily_prices` mutation was attempted.
- No market-data endpoint was fetched.
- No raw market data was fetched, stored, printed, or committed.
- No secrets or raw payloads were printed.
- `publicDataSource=mock` remains the only allowed public-source state.
- `scoreSource=mock` remains the only allowed score-source state.
- No copy should imply personalized investment advice, buy/sell instruction, guaranteed return, or real-time market-data availability.

## Route-Level QA Matrix

| Surface | BRIEF 30-second mood | BRIEF 3-minute action | Cause / update / impact / next step | Mock / real boundary | A2 status |
| --- | --- | --- | --- | --- | --- |
| Home `/` | Present. Home copy frames the product as a red/yellow/green market-mood dashboard and includes 30-second market-mood wording. | Present. Home copy includes the 3-minute observation path and next-action language. | Present in the home market loop and alert structure: alert cards expose cause, update time, impact level, and next step. | Present. Home surfaces keep mock-only Beta and non-advice language visible. | Acceptable for public Beta readability; keep reducing internal governance noise when it appears below the fold. |
| Briefing `/briefing` | Present. Briefing copy explicitly says users can understand the day's market mood within 30 seconds. | Present. Briefing copy provides a 3-minute reading flow. | Present. Briefing warning and summary sections include status, cause, update time, impact level, and next step. | Present. Briefing copy keeps `publicDataSource=mock`, `scoreSource=mock`, not real-time data, and not buy/sell advice visible. | Acceptable for public Beta readability; continue guarding against process terms becoming visible. |
| Stock detail `/stocks/[symbol]` | Present after PM mainline integration. Stock detail now adds a top decision brief for a 30-second stock-state read. | Present after PM mainline integration. Stock detail now adds the 3-minute review prompt. | Present after PM mainline integration. Stock detail now adds cause, update time, impact level, and next step near the top of the runtime surface. | Present. It states `publicDataSource=mock`, `scoreSource=mock`, not real-time data, and no buy/sell advice. | Acceptable for public Beta readability after PM checker pass; keep watching for internal terms below the fold. |

## Public Copy Acceptance Rules

Use these as A2 acceptance rules for future public-copy patches:

1. The first visible decision surface must answer: what is the current mood, why is it shown, how fresh is it, how serious is it, and what should the user inspect next.
2. The page can use "observe", "check", "compare", "review", "wait", "reduce risk exposure", or "increase attention"; it must not use buy, sell, hold, target price, guaranteed return, or personalized allocation wording.
3. Mock / real boundaries must stay close to signal cards, not only in footer/legal pages.
4. If the page shows a score, it must also show a data-quality or mock/source limitation nearby.
5. If a route is not yet real-data eligible, public copy should say "demo data", "mock-only", "formal market data is not enabled yet", or an equivalent plain-language boundary.
6. Avoid exposing internal execution terms on public pages: A1, A2, PM, CEO, packet, gate, runbook, preflight, post-run, candidate row, staging row, and authorization phrase should stay in internal docs unless PM intentionally exposes a simplified public explanation.
7. If a technical stop line must appear, pair it with a user meaning. Example: `publicDataSource=mock` means the page is still showing demo/public Beta data rather than official live market data.

## Current A2 Findings

Accepted:

- Home and briefing now align with the BRIEF target strongly enough for public Beta readability.
- Stock detail is now acceptable for public Beta readability because the PM slice moved the key decision summary above deeper runtime detail and refreshed the stock-focused gates.
- The shared legal pages already support the non-investment-advice boundary.

Needs PM integration:

- Keep stock detail in the route-level copy audit set so future data-source labels do not weaken the mock boundary or non-advice language.
- Existing internal process sections should remain available to PM, but public pages should keep them below user-facing market mood, action path, and boundary copy.
- Older A2 checker expectations still contain stale mojibake/process markers in some places; PM should refresh those only when they become blockers for a changed surface.

Not needed now:

- Full visual redesign.
- F-style final UI polish.
- More governance panels above the first user decision surface.
- Any data-source promotion or real-score wording.

## Recommended Next A2 Task

After PM completes the stock-detail decision brief integration, A2 should run one focused copy audit on visible public routes:

1. Home `/`
2. Briefing `/briefing`
3. Stock detail `/stocks/2330`
4. Stock detail `/stocks/0050`
5. Legal boundary routes: `/disclaimer`, `/methodology`, `/terms`, `/privacy`

The audit should record only public-copy risks:

- missing 30-second market mood;
- missing 3-minute action path;
- missing cause, update time, impact level, or next step;
- mock/real boundary too far from the signal;
- non-investment-advice copy missing or too legalistic;
- internal process words visible above the fold;
- stale mojibake or unreadable text.

## PM Intake Summary

A2 recommends PM accept this QA handoff as the copy-safety baseline for the next route-level public-copy regression gate, then continue route-to-route consistency work across home, briefing, and stock detail.

This handoff does not authorize SQL, Supabase access, staging writes, `daily_prices` mutation, market-data fetching, source promotion, `publicDataSource=supabase`, `scoreSource=real`, real-time-data claims, or investment advice.
