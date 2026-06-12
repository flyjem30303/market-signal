# Role Workstreams

Updated: 2026-06-07

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
- D: Legal / Source Rights Review
- F: Product Design / UIUX, activated from the product baseline in `docs/MVP_LAUNCH_PRD.md`
- I: Cloud Deployment / DevOps / Launch Operations

PM remains the only integration owner. A1 and A2 may prepare local-only packets, reports, checkers, and bounded patches, but PM decides what enters the mainline and when it is committed. D provides legal/source-rights evidence and does not execute data or runtime work. I is not a new implementation lane yet; I is a launch-readiness guard for deployment, environment, credential, DNS, monitoring, rollback, and operations risk.

## Active Goal - 2026-06-12

GOAL: complete `OFFICIAL-001` through `OFFICIAL-012` in `docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md` for the `official_open_data_api` route.

Completion definition:
- every official source intake field has a safe non-secret accepted / blocked / bounded conclusion;
- data.gov / TWSE OpenAPI is separated from blocked TWSE website automation;
- no field authorizes SQL, Supabase writes, staging rows, `daily_prices` mutation, raw market-data fetch/storage/output, `publicDataSource=supabase`, `scoreSource=real`, or investment advice;
- checker and focused review gate pass;
- PM records status and Git backup after passing checks.

Parallel work split:
- PM: integrate the official-source intake packet, checker, status, review gate, and Git backup.
- A1: prepare the next bounded metadata / terms / field-contract validation packet for TWSE OpenAPI without fetching market rows.
- A2: prepare public attribution, delayed-data, non-investment-advice, source-gap, and no-official-endorsement copy.
- D: remain available for source-rights wording review if PM finds a legal ambiguity, but do not run data or runtime work.

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
- Continue the active GOAL toward `official_001_012_complete_for_official_open_data_api`.
- Current mainline route is `twii_open_data_source_intake_completion_then_bounded_metadata_terms_validation`.
- Keep runtime foundation, route health, launch engineering, and data promotion handoff moving, but do not proceed to real-data promotion until the open-data source gate and official-source intake packet remain passing.
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
- Maintain source-rights and market evidence support for TWII and ETF while PM continues the mainline.
- Prepare TWSE OpenAPI bounded metadata / terms / field-contract validation using swagger metadata and open-data references only; do not fetch market rows.
- Confirm daily close, same-day trading information, attribution, retention, display, derived analysis, and aggregate-only review requirements from safe references.
- Own coverage closure support from `182/360` toward `360/360`, including field-validity QA summaries, downgrade rules, sanitized aggregate-only readiness notes, and candidate artifact hygiene when PM asks.
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
- Repair only launch-blocking public trust readability issues while PM continues the mainline.
- Prepare copy for `official_open_data_api`: source attribution, update-time display, delayed/non-real-time data wording, non-investment-advice wording, source-gap wording, and no-official-endorsement wording.
- Prioritize mock-only, partial coverage, missing/delayed data, data freshness, score/model limitation, risk, and non-investment-advice clarity before cosmetic polish.
- Own public readability support for blocker closure: make sure data-quality, source-rights, model-credibility, row-coverage, and mock-only stop lines are understandable on public/runtime surfaces.
- Keep the A2 lane focused on comprehension blockers and visible-language regressions; visual polish remains lower priority until runtime foundation is stable.
- Keep visual micro-tuning behind runtime foundation work unless it blocks user comprehension.

## F: Product Design / UIUX

Mission:
- Use the MVP Launch PRD as the product baseline for interface design timing, design-skill usage, annotation review, and launch-stage polish.

Owned work:
- UI/UX design brief, visual hierarchy review, first-screen comprehension review, mobile readability, disclosure placement, design annotation review, and final visual polish.

Not owned:
- Supabase readiness, SQL, raw market data, runtime source promotion, scoring promotion, or independent commits.

Current next tasks:
- F / Product Design should use docs/MVP_LAUNCH_PRD.md before proposing visual changes.
- Stay lightweight now: flag comprehension blockers only.
- Wait until runtime and bounded readonly foundations stabilize before doing full visual redesign or annotation-heavy UI review.

## D: Legal / Source Rights Review

Mission:
- Review source/provider terms and internal authorization paths so PM can decide whether a data lane may move from blocked to bounded repair, accepted, or still blocked.
- Keep legal/source-rights evidence no-secret and decision-oriented.

Owned work:
- Provider terms review summaries, source-rights constraints, attribution/retention/redistribution/commercial-use notes, internal feed authorization path review, and legal risk labels for PM.
- D's current assignment is `docs/D_SOURCE_TERMS_REVIEW_ASSIGNMENT.md`.

Not owned:
- SQL, Supabase reads/writes, staging rows, `daily_prices`, market-data fetch/ingest/storage, candidate artifacts, runtime toggles, `publicDataSource=supabase`, `scoreSource=real`, UI copy, or Git commits.

Current next tasks:
- Confirm whether the intended TWII source terms allow the project's planned internal evaluation, storage, derived display, public wording, attribution, retention, and commercial/Beta use path.
- Confirm whether any internal feed owner/approval path exists and can authorize project use.
- Return only no-secret labels and summaries to PM/A1 using the four-slot A1 evidence shape; do not copy contract text or private links into repo files.

## Current Blocker-Closure Assignments

- PM mainline: integrate blocker closure into runtime decision surfaces, run local checks, keep Git backup coherent, and decide whether A1/A2 output is accepted.
- A1: prepare data-quality evidence, row-coverage readiness, field-validity QA, and downgrade-rule handoff material from local-only or already sanitized evidence.
- A2: review whether blocker closure is understandable to users, especially public wording for mock-only status, source-rights limits, model-credibility limits, and real-score stop lines.
- D: confirm source/provider terms and internal authorization path for TWII before PM may consider source-rights outcome gates.
- I: stay guard-only unless blocker closure work becomes production-affecting through deployment, environment, credential, DNS, monitoring, rollback, or cloud changes.

PM may run mainline, A1, and A2 in parallel. PM must not wait for A1/A2 when runtime work is locally safe, and A1/A2 must not independently commit or cross into each other's lane.

## Dynamic A1 / A2 Reassignment

PM must treat A1 and A2 as rolling support lanes, not one-time helpers.

When A1 or A2 completes a task:
- PM reviews the output and classifies it as accepted, rejected, or needs bounded repair.
- PM integrates accepted output only after the relevant local checker passes.
- PM immediately assigns the next highest-value lane-specific task when useful work remains.
- PM records the new assignment in project files or status notes when it affects launch direction.
- PM continues the mainline without waiting when safe.

This rule exists because the project GOAL now moves toward formal launch engineering, where data readiness, runtime promotion, public trust copy, and deployment readiness can advance in parallel.

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
