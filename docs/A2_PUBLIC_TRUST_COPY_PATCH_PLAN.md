# A2 Public Trust Copy Patch Plan

Status: `a2_public_trust_copy_patch_plan_ready`
Updated: 2026-06-10
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Source handoff: `docs/A2_PUBLIC_DATA_TRUST_COPY_HANDOFF.md`
Mode: `local_only_copy_plan`

## Purpose

This plan converts the A2 public data trust copy handoff into the next smallest copy-only patch sequence.

It is intentionally limited to public readability, launch-risk explanation, and public copy direction. It does not change runtime behavior, source approval, evidence gates, scoring, data ingestion, deployment, PM mainline state, or any data gate artifact.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not fetch, import, store, commit, or print raw market data.
- Do not read or output secrets.
- Do not touch PM mainline data gate files.
- Do not touch A1 data evidence, source-rights artifacts, candidate artifacts, or checker outputs.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim complete coverage, live market freshness, real-source approval, redistribution approval, validated forecast quality, or investment advice.

## Minimal Patch Order

| Order | Surface | Launch-blocking reason | Suggested copy direction | Deferrable UI polish | Non-executable boundary |
|---:|---|---|---|---|---|
| 1 | Shared runtime state strip | This is the central repeated trust surface. If users cannot read that the public site is mock-only, partial, and not authorized for real scores, every downstream page can be misunderstood. | Rewrite as plain public Chinese: current public view is Beta/mock-only; `publicDataSource=mock`; `scoreSource=mock`; public claims are not real market-data approval, not a validated forecast, and not investment advice. Keep the exact technical flags visible in a secondary clause. | Typography, icon choice, spacing, and tooltip wording can wait until the readable stop line is accepted. | Copy-only. Do not change runtime state, config, promotion gates, source decisions, or scoring logic. |
| 2 | Data freshness strip | Freshness metadata can be misread as live-data proof, data-quality acceptance, or source-rights approval. That confusion is launch-blocking on any public page that displays market context. | State that freshness information is display context only. It does not mean live market data is approved, coverage is complete, source rights are cleared, or real scores are enabled. Mention missing, delayed, or unavailable data in reader-facing language. | Better timestamp layout, badges, skeleton states, or hover details can wait. | Copy-only. Do not fetch freshness data, backfill rows, update data files, call Supabase, or print raw rows/timestamps from market payloads. |
| 3 | Footer | The footer appears everywhere and is the fallback disclosure if a route-level message is missed. Corrupted or unclear footer labels weaken every public trust boundary. | Replace footer labels with readable public Chinese: mock-only Beta, partial coverage possible, not buy/sell/hold advice, not personalized advice, and key links to methodology, disclaimer, privacy, and terms. Keep wording calm and non-alarmist. | Link grouping, visual hierarchy, responsive layout, and icon polish can wait unless text is clipped. | Copy-only. Do not change routing, analytics, consent behavior, legal policy meaning, or data-source flags. |
| 4 | `/weekly` | Weekly summaries are easy to read as current market guidance. If first-screen copy is unclear, users may treat mock summaries as live weekly advice or complete coverage. | Put the trust boundary near the first-screen summary: weekly reading is a product-flow/mock interpretation, not live market advice, not complete market coverage, and not a validated forecast. Avoid "latest" unless paired with local/mock context. | Chart captions, card density, cadence microcopy, and screenshot polish can wait. | Copy-only. Do not generate new weekly data, import market data, alter report cadence logic, or change source freshness calculations. |
| 5 | `/methodology` | This page carries credibility. If methodology copy is unreadable or too confident, users may infer formal model validation, investment recommendation quality, or real-score readiness. | Explain each score/module as mock model output for product evaluation. Say plainly that it is not a validated forecast, not personalized advice, and may be affected by partial or stale data. Keep technical flags available but translate their meaning nearby. | Diagrams, accordions, examples, glossary tooltips, and module visual polish can wait. | Copy-only. Do not change scoring weights, formulas, model labels, quality gates, or methodology enforcement checks. |
| 6 | Legal pages: `/disclaimer`, `/privacy`, `/terms` | Legal and disclosure pages must be readable before public launch. If route-local legal copy is corrupted or vague, users may miss non-advice, mock-only, privacy, and data-boundary limits even when shared notices exist. | Use readable public Chinese for non-investment-advice, mock-only Beta, no personalized recommendation, partial or delayed data risk, and generic source-rights limits. Keep source-specific approval language out until PM/A1/legal approve it. | Layout cleanup, section anchors, richer examples, and legal design polish can wait after core readability is fixed. | Copy-only. Do not alter policy commitments, data retention behavior, cookie/consent mechanics, provider-specific rights claims, or PM/legal approval state. |

## Copy Principles For The Patch

- Put reader-facing meaning before internal implementation labels.
- Keep exact stop-line flags where they matter: `publicDataSource=mock` and `scoreSource=mock`.
- Say what the UI is not: not live market-data approval, not complete coverage, not validated forecast, not buy/sell/hold, not personalized advice.
- Keep source-rights wording generic until PM/A1/legal approve source-specific public claims.
- Prefer short, stable Chinese sentences that can be reused across surfaces.
- Avoid adding new promises about data freshness, coverage percentage, source authorization, forecast accuracy, or launch readiness.

## Recommended Slice Shape

1. Patch shared runtime state strip copy.
2. Patch data freshness strip copy.
3. Patch footer copy and trust-link labels.
4. Patch `/weekly` first-screen and route-local trust copy.
5. Patch `/methodology` method explanation and score limitation copy.
6. Patch `/disclaimer`, `/privacy`, and `/terms` route-local legal/readability copy.

Each patch should be reviewable as a small copy-only diff. If PM requests enforcement, add or update only the smallest relevant copy/readability checker in a separate follow-up task.

## Handoff Note

This document is a planning artifact only. It did not execute SQL, connect to Supabase, write Supabase, fetch/import/store raw market data, read secrets, change runtime flags, or modify PM/A1 gate artifacts.
