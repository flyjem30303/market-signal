# A2 Post-Run Review Public Copy Checklist

Status: `a2_post_run_review_public_copy_checklist_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
Mode: `local_only_copy_checklist`

## Purpose

This checklist prepares A2 public-site copy review for the moment after a future post-run review is completed.

It prevents an internal `post-run accepted` outcome from being mistaken for public real-data promotion, complete row coverage, source-rights/public redistribution approval, investment advice, or `scoreSource=real`.

This document is local-only and copy-only. It does not approve execution, source rights, row coverage scoring, runtime promotion, scoring promotion, deployment, or public copy changes.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not mutate `daily_prices`.
- Do not fetch, import, ingest, store, commit, print, or summarize raw market data.
- Do not read or output secrets.
- Do not output raw payload, row payload, stock-id payload, source body, provider body, or row-level market values.
- Do not touch UI code.
- Do not touch PM mainline gate, checker, status, board, package, runtime config, or source-promotion files.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## Core Rule

`post-run accepted` means only that the named post-run review artifact passed its own internal review boundary.

It must not be treated as any of the following unless a separate PM-approved gate explicitly says so:

- public real-data promotion;
- complete MVP coverage;
- complete Taiwan market coverage;
- source-rights approval for public display or redistribution;
- provider authorization;
- live freshness approval;
- data-quality acceptance for public claims;
- production scoring approval;
- `scoreSource=real`;
- investment advice, buy/sell/hold guidance, personalized recommendation, or validated forecast quality.

## Required Copy Review Before Public Display

| Check | Public copy question | Required safe result |
|---|---|---|
| Internal milestone | Does the copy say or imply that post-run acceptance is only an internal review state? | It must say public promotion still requires a separate PM-approved promotion gate. |
| Runtime data source | Does the copy preserve the current public runtime boundary? | Keep `publicDataSource=mock` unless PM separately approves public runtime promotion. |
| Score source | Does any score, signal, ranking, or watchlist area imply real scoring? | Keep `scoreSource=mock` unless a dedicated scoring promotion gate approves otherwise. |
| Coverage scope | Does the copy state the exact approved coverage scope without broadening it? | It must avoid "complete", "full market", "all Taiwan stocks", or similar claims unless approved by coverage gate. |
| Coverage gaps | Does the copy explain that symbols, rows, fields, windows, or asset classes may remain missing? | It must keep partial, delayed, unavailable, or missing-data language visible near coverage claims. |
| Source status | Does the copy separate source-rights progress from public redistribution approval? | It must avoid source-approved language unless PM/A1/legal approve public source wording. |
| Freshness | Does the copy avoid treating post-run recency or readback timing as live freshness? | It must describe freshness/readback metadata as context, not live market-data proof. |
| Quality | Does the copy avoid treating post-run acceptance as data-quality certification? | It must say quality/public claim readiness remains separately gated if quality is mentioned. |
| Advice risk | Does every score/action/signal surface keep a nearby limitation? | It must say not investment advice, not buy/sell/hold, not personalized recommendation, and not validated forecast. |
| User comprehension | Does the copy translate internal terms into reader-facing meaning? | Technical flags may appear in disclosure areas, but plain-language explanation must sit nearby. |
| Legal consistency | Do methodology, disclaimer, terms, privacy, SEO, and visible route copy match? | No public snippet should be stronger than the legal/trust pages. |
| SEO snippets | Could title, description, Open Graph, or search snippets overclaim? | They must not say live, real-time, complete, source-approved, or advice-oriented claims. |

## Safe Public Framing Pattern

Use this structure when a public page needs to mention a post-run result:

1. Name the post-run state as an internal review milestone.
2. State that public data display remains gated until PM explicitly promotes runtime state.
3. Preserve the technical stop lines `publicDataSource=mock` and `scoreSource=mock` where technical flags are shown.
4. State coverage as bounded and possibly partial.
5. State source/public-use wording remains subject to PM/A1/legal approval.
6. Keep non-investment-advice and model limitation wording near any score, signal, ranking, or action label.

Example safe shape:

> Post-run review has been accepted for the named internal artifact. Public real-data display is still not promoted. The public site remains in gated Beta/mock-only mode, with `publicDataSource=mock` and `scoreSource=mock`, until PM approves separate runtime, source-rights, coverage, and scoring gates.

## Unsafe Phrases Until Separately Approved

- `post-run accepted, so public real data is live`
- `post-run accepted, so launch is complete`
- `readback passed, so public data is ready`
- `write succeeded, so coverage is complete`
- `complete Taiwan market coverage`
- `fully covered`
- `all rows are approved`
- `source-rights approved for public use`
- `provider-approved public display`
- `live market data`
- `real-time data`
- `real score`
- `validated signal`
- `validated forecast`
- `investment recommendation`
- `buy/sell/hold recommendation`
- `personalized investment advice`
- `Supabase-backed public data is enabled`
- `scoreSource=real`

## Surface-Specific Checklist

| Surface | What A2 must check after post-run review | Stop line |
|---|---|---|
| Shared runtime/trust strip | The first visible line must not imply public real-data activation. | Stop if `publicDataSource=mock` is hidden, removed, or contradicted. |
| Data freshness strip | Readback/freshness language must not imply live data, complete freshness, or quality certification. | Stop if freshness is presented as public data approval. |
| Score and ranking areas | Scores must still read as mock/product-evaluation output unless scoring promotion is separately approved. | Stop if any label implies `scoreSource=real`. |
| Stock detail pages | Symbol-specific pages must not make partial data look complete or actionable. | Stop if symbol coverage is described as complete without an approved coverage gate. |
| Weekly and briefing pages | Summaries must not sound like current market advice. | Stop if copy implies latest market guidance, recommendation, or complete weekly coverage. |
| Methodology page | Method copy must separate data readiness from model validation. | Stop if model language implies validated forecast quality. |
| Disclaimer, terms, privacy | Legal/trust copy must match the strongest public claim on the site. | Stop if legal pages lag behind any real-data or source-rights claim. |
| SEO metadata | Snippets must carry the same boundaries as visible copy. | Stop if metadata says live, real-time, complete, source-approved, or advice. |

## Public Display Approval Questions

A2 should ask PM these questions before any public copy says real data, coverage, or source status is visible:

1. Which separate gate approved public runtime promotion, and does it explicitly change `publicDataSource=mock`?
2. Which separate gate approved scoring promotion, and does it explicitly change `scoreSource=mock`?
3. Which exact coverage scope is approved for public wording: asset class, symbols, sessions, fields, and missing-data downgrade rules?
4. Which source-rights/legal gate approved public display, attribution, retention, redistribution, and delayed/missing wording?
5. Which surfaces are approved to mention the milestone: visible page copy, technical disclosure, methodology, legal pages, SEO, or all of them?
6. What exact limitation text must remain near scores, rankings, watchlists, and action summaries?

## A2 Acceptance Criteria

- This checklist remains local-only and copy-only.
- It contains no SQL, Supabase instructions, secrets, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data values.
- It does not modify UI code, PM mainline gate/checker/status/board/package files, runtime config, data files, `daily_prices`, source-rights artifacts, or checker outputs.
- It treats `post-run accepted` as an internal milestone only.
- It keeps public copy bounded by mock-only runtime, partial-coverage risk, source-rights/public-use gating, non-advice language, and mock-score status.
- It explicitly blocks copy that equates post-run acceptance with public promotion, complete coverage, investment advice, or `scoreSource=real`.

## Handoff Note

This file is a preparation artifact for future A2 copy review. It did not execute SQL, connect to Supabase, read Supabase, write Supabase, mutate `daily_prices`, fetch/import/ingest/store raw market data, output secrets, output raw/row/stock-id payloads, change runtime flags, change scoring, modify UI code, or modify PM mainline gate/checker/status/board/package files.
