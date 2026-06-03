# Role Workstreams

Updated: 2026-06-03

This file is the project-level assignment map for parallel work. It exists so PM can move faster without losing ownership boundaries.

## Current Operating Model

- Mainline PM: CEO / PM / Runtime Engineering
- A1: Data / Supabase / Market Evidence
- A2: Frontend / UX Readability / Public Copy QA

PM remains the only integration owner. A1 and A2 may prepare local-only packets, reports, checkers, and bounded patches, but PM decides what enters the mainline and when it is committed.

## Mainline PM

Mission:
- Lead CEO direction, product scope, runtime engineering, integration, review gates, build health, and Git backup.
- Keep the project moving with larger coherent slices when governance becomes too fine.
- Decide when A1 or A2 output is ready for mainline review.

Owned work:
- Runtime state, runtime decision summary, fail-closed behavior, public mock disclosure, local health checks, review-gate registration, build recovery, and final integration commits.
- Cross-role conflict resolution.
- Stage percentage and next-slice selection.

Current next tasks:
- Continue runtime foundation toward readonly gate readiness.
- Keep publicDataSource=mock and scoreSource=mock until explicit release criteria are met.
- Integrate A1/A2 packets only after local checks pass.

## A1: Data / Supabase / Market Evidence

Mission:
- Prepare data evidence and Supabase readiness work without mutating remote systems.
- Convert market evidence into sanitized, aggregate, reviewable handoff packets.

Owned work:
- Data evidence ladder, readonly readiness packets, Supabase local preflight summaries, market evidence acceptance criteria, and sanitized post-run review records.
- A1 handoff artifacts and local-only evidence checkers.

Not owned:
- Public UI copy, runtime page layout, runtime decision helper wording, final production toggle, Git commits, SQL execution, Supabase writes, staging rows, daily_prices writes, raw market data storage.

Current next tasks:
- Maintain the A1 market evidence handoff packet.
- Prepare the next readonly/data evidence packet only from already approved or sanitized evidence.
- Escalate to PM before any remote attempt, SQL, or production source promotion.

## A2: Frontend / UX Readability / Public Copy QA

Mission:
- Improve the public experience without slowing the runtime foundation.
- Find and prepare fixes for visible copy, first-screen clarity, mojibake, confusing labels, and public disclosure readability.

Owned work:
- Public page copy QA, visible-language checkers, UI readability worklists, small copy-only patches, dashboard navigation labels, briefing/weekly/home/stock page readability candidates.

Not owned:
- Supabase/data evidence scripts, raw market evidence, A1 packets, runtime state helpers, score source promotion, production data-source toggles, Git commits.

Current next tasks:
- Audit public UI copy and produce an A2 visible-copy worklist.
- Prioritize launch-blocking readability issues before cosmetic polish.
- Keep visual micro-tuning behind runtime foundation work unless it blocks user comprehension.

## Shared Safety Boundaries

All roles must keep these boundaries until CEO/PM explicitly changes the stage:
- No SQL execution.
- No Supabase writes.
- No staging rows.
- No daily_prices writes.
- No raw market data fetch, ingest, storage, or commit.
- No secrets or raw payload printing.
- Keep publicDataSource=mock.
- Keep scoreSource=mock.

## Conflict Rules

- A1 must not edit A2-owned UI copy surfaces unless PM asks.
- A2 must not edit A1-owned data evidence or Supabase readiness surfaces unless PM asks.
- A1 and A2 do not commit independently; PM integrates and commits coherent passing slices.
- If two roles need the same file, PM owns the merge and decides sequence.
- If a task would trigger permission prompts while the user is away, the role must pause that action and report the pending item.

## CEO Guidance

The current best structure is three roles, not more:
- PM mainline keeps CEO/runtime/integration velocity.
- A1 removes data-readiness pressure from the mainline.
- A2 removes visible-language and UX-readability pressure from the mainline.

A3 is not recommended yet. Add it only after A1 and A2 produce reusable output and the bottleneck becomes clearly independent.
