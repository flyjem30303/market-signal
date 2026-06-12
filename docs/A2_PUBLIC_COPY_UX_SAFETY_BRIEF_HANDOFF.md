# A2 Public Copy / UX Safety Brief Handoff

## Goal

A2 supports the BRIEF product/runtime line by making public pages easier and safer to read. The target user should understand the market mood within 30 seconds and know the next observation direction within 3 minutes.

## Scope

- Review public copy on `/`, `/briefing`, `/stocks/TWII`, `/stocks/2330`, methodology, weekly, disclaimer, terms, and privacy pages.
- Replace internal governance wording with user-facing wording when it appears on public pages.
- Keep runtime copy honest: `publicDataSource=mock`, `scoreSource=mock`, no real-time claim, no investment advice, no official-data claim.
- Add or update local-only copy safety checks when public language can regress.

## Current PM Intake

PM found a public runtime card with unreadable text in `src/components/twse-openapi-runtime-mock-consumer-wire-card.tsx`. The mainline fixed this card to show:

- `市場氛圍示範`
- status
- summary
- cause
- update time
- impact level
- data boundary
- next observation
- safety line

This is accepted as the first A2-facing integration point because it directly supports the BRIEF requirement: users should see market mood, why it is shown, and what to observe next.

## Public Copy Risk List

| Risk | Public Impact | A2 Action |
| --- | --- | --- |
| Internal words such as A1, A2, PM, CEO, packet, gate, preflight, post-run appear on public pages | Users see process noise instead of product meaning | Replace with user-facing labels such as data support, review step, source check, or next verification |
| Mock wording is hidden or too technical | Users may think the site is live trading data | Keep visible copy saying demo/mock data and demo/mock scores |
| Real-data wording appears before promotion | Users may over-trust unfinished data | Block wording that implies official, real-time, complete, production, or investment-grade status |
| Safety copy is too legalistic | Users skip it | Keep one clear sentence near each signal surface: not investment advice, not real-time data, not a buy/sell recommendation |
| Data readiness copy dominates the page | BRIEF product experience slows down | Prefer market mood, cause, update time, and next observation above detailed governance state |

## Required Boundary

- Do not fetch market data.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not print secrets or raw payloads.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not state or imply investment advice.

## Completion Definition

A2 work is ready for PM intake when:

1. Public pages can show market mood, cause, update time, impact level, next observation, and safety line without internal process language.
2. Mock/real boundaries remain visible on public signal surfaces.
3. Local checker coverage exists for the changed public-copy surface.
4. A2 reports changed files, checks run, remaining public-copy risks, and the next recommended A2 task.

## Next Recommended A2 Task

Audit `/briefing` visible copy and replace any unreadable or internal-process language that appears above the fold. Prioritize user-facing market mood and next observation wording over governance detail.
