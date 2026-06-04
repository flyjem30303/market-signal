# Role Workstreams

Updated: 2026-06-03

This file is the project-level assignment map for parallel work. It exists so PM can move faster without losing ownership boundaries.

## Why This Must Stay In Project Files

CEO / PM operating rules, A1 / A2 workstream boundaries, and the current mainline next step must be recorded in project files because conversation history can be compacted, archived, or resumed from a summary. If these decisions live only in chat, the project can lose context about who owns which lane, which actions remain blocked, and what the next safe runtime slice is.

This file is therefore the recovery anchor after any context loss:
- PM can resume without re-asking the chairman for already settled role boundaries.
- A1 and A2 can continue preparing work without crossing into each other's lane.
- Runtime work can keep moving while Supabase, SQL, raw market data, and production-source promotions remain gated.
- Future agents can distinguish current CEO direction from older checkpoint notes.
- Git backup can be skipped when the chairman asks to avoid permission prompts, without losing the project decision trail.

When chat context and this file disagree, PM must treat this file as the safer baseline, then update it after CEO/PM explicitly changes direction.

## Current Operating Model

- Mainline PM: CEO / PM / Runtime Engineering
- A1: Data / Supabase / Market Evidence
- A2: Frontend / UX Readability / Public Copy QA
- I: Cloud Deployment / DevOps / Launch Operations

PM remains the only integration owner. A1 and A2 may prepare local-only packets, reports, checkers, and bounded patches, but PM decides what enters the mainline and when it is committed. I is not a new implementation lane yet; I is a launch-readiness guard for deployment, environment, credential, DNS, monitoring, rollback, and operations risk.

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
- Continue runtime foundation toward readonly gate readiness, with the next mainline slice focused on making remote guard and freshness-runtime states product-readable while keeping technical details folded or internal.
- Keep publicDataSource=mock and scoreSource=mock until explicit release criteria are met.
- Integrate A1/A2 packets only after local checks pass.
- Ask I to review deployment, environment, credential, DNS, monitoring, and rollback impact before any public launch, production source, or cloud-environment change.
- If the chairman is away and asks to avoid permission prompts, skip Git backup, staging, commits, remote execution, and any prompt-triggering action; continue local-only checks, UI/runtime readability hardening, and documentation updates.

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
- Own the blocker-closure evidence lane for data-quality evidence and row-coverage readiness, including field-validity QA summaries, downgrade rules, and sanitized aggregate-only readiness notes.
- Keep source-rights and model-credibility dependencies visible as blockers that A1 can reference, but not approve.
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
- Own public readability support for blocker closure: make sure data-quality, source-rights, model-credibility, row-coverage, and mock-only stop lines are understandable on public/runtime surfaces.
- Keep the A2 lane focused on comprehension blockers and visible-language regressions; visual polish remains lower priority until runtime foundation is stable.
- Keep visual micro-tuning behind runtime foundation work unless it blocks user comprehension.

## Current Blocker-Closure Assignments

- PM mainline: integrate blocker closure into runtime decision surfaces, run local checks, keep Git backup coherent, and decide whether A1/A2 output is accepted.
- A1: prepare data-quality evidence, row-coverage readiness, field-validity QA, and downgrade-rule handoff material from local-only or already sanitized evidence.
- A2: review whether blocker closure is understandable to users, especially public wording for mock-only status, source-rights limits, model-credibility limits, and real-score stop lines.
- I: stay guard-only unless blocker closure work becomes production-affecting through deployment, environment, credential, DNS, monitoring, rollback, or cloud changes.

PM may run mainline, A1, and A2 in parallel. PM must not wait for A1/A2 when runtime work is locally safe, and A1/A2 must not independently commit or cross into each other's lane.

## I: Cloud Deployment / DevOps / Launch Operations

Mission:
- Prevent launch, environment, credential, DNS, monitoring, rollback, and cloud-cost risks from surprising the mainline.
- Help PM turn cloud and launch requirements into checklists before production exposure.

Owned work:
- Deployment platform selection notes, environment separation, build command checks, health checks, environment variable inventory, secret-handling rules, DNS and SSL checklist, monitoring and rollback runbooks, launch-readiness checklist, and chairman-operated account/payment/verification step lists.

Not owned:
- Runtime feature implementation, data evidence scripts, Supabase writes, SQL execution, raw market data handling, final production toggles, independent commits, entering secrets, entering OTPs, payment-card entry, or account-identity verification on behalf of the chairman.

Current next tasks:
- Prepare launch-readiness and rollback criteria only when PM moves from local runtime toward cloud/public deployment.
- Review Supabase, Vercel, DNS, and environment-variable changes before they become production-affecting.
- Escalate any action requiring chairman-owned credentials, payment, OTP, identity verification, or account permission changes.

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
- No chairman credentials, OTP, payment-card, or identity-verification input by any role other than the chairman.

## Conflict Rules

- A1 must not edit A2-owned UI copy surfaces unless PM asks.
- A2 must not edit A1-owned data evidence or Supabase readiness surfaces unless PM asks.
- A1 and A2 do not commit independently; PM integrates and commits coherent passing slices.
- I must not deploy, change DNS, change cloud settings, enter secrets, or change production environment variables without PM and chairman-directed authorization.
- I may block a production-affecting move when rollback, monitoring, environment separation, or secret handling is incomplete.
- If two roles need the same file, PM owns the merge and decides sequence.
- If a task would trigger permission prompts while the user is away, the role must pause that action and report the pending item.

## CEO Guidance

The current best structure is three execution roles plus one launch guard:
- PM mainline keeps CEO/runtime/integration velocity.
- A1 removes data-readiness pressure from the mainline.
- A2 removes visible-language and UX-readability pressure from the mainline.
- I prevents deployment, environment, credential, DNS, monitoring, rollback, and launch-operations risk from reaching production unnoticed.

A3 is not recommended yet. Add it only after A1 and A2 produce reusable output and the bottleneck becomes clearly independent. I does not count as A3 because it is a readiness guard, not an additional implementation stream.
