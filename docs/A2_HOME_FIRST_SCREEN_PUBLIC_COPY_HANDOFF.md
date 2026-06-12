# A2 Home First Screen Public Copy Handoff

## Purpose

A2 supports the BRIEF product/runtime line by keeping the home first screen understandable, safe, and free of internal execution language. The public surface should help a visitor read the current market atmosphere quickly without implying live data, investment advice, or real-data promotion.

## BRIEF Elements To Preserve

| Element | First-screen intent | Public-copy rule |
| --- | --- | --- |
| 30 second market atmosphere | A visitor can understand the market mood within 30 seconds. | Keep a plain-language mood summary near the top of the home page before process detail. |
| 3 minute action judgment | A visitor can identify the next observation direction within 3 minutes. | Show the next observation or decision direction as a watch/check/review action, not as a trade command. |
| Three-layer view | The home page keeps a scan path from market mood to why it appears to deeper evidence. | Preserve a three-layer reading path: market atmosphere, action judgment, and evidence/runtime boundary. |
| Mock boundary | The first screen remains honest about demo/mock status. | Keep `publicDataSource=mock` and `scoreSource=mock`; do not imply official, production, complete, or real-time data. |
| Non-investment advice | Public copy must not become a buy/sell or allocation instruction. | Keep the boundary visible: informational only, not investment advice, not a recommendation. |
| No engineering strings | Public copy should not expose internal execution vocabulary. | Do not show engineering/process strings such as `hard blockers`, `cmd.exe`, `packet proof`, or `pre-launch executable` in first-screen public copy. |

## First Screen Safety Boundary

- Keep the public product language focused on market atmosphere, why the state appears, and what to observe next.
- Keep BRIEF copy compatible with `publicDataSource=mock` and `scoreSource=mock`.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch, store, print, or submit raw market data.
- Do not print secrets or raw payloads.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## PM Absorption Notes

PM can use this handoff as the acceptance checklist for home first-screen copy. If PM later edits `src/components/dashboard-shell.tsx`, the first screen should keep the BRIEF order: market atmosphere first, next observation/action judgment second, evidence and mock boundary third. Any engineering wording should stay in internal docs or local check output, not in public copy.

## Local Checker

Run:

```sh
npm run check:a2-home-first-screen-public-copy-handoff
```

The checker is local-only. It verifies this handoff, package script wiring, review-gate registration, and a conservative first-screen scan of `src/components/dashboard-shell.tsx`.
