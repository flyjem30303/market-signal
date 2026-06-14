# Role Workstreams

Updated: 2026-06-14

This file is the project-level assignment map for parallel work. It exists so PM can move faster without losing ownership boundaries after context compaction or thread handoff.

## Why This Must Stay In Project Files

CEO / PM operating rules, A1 / A2 / A3 / A4 boundaries, and the current mainline next step must be recorded in project files because conversation history can be compacted, archived, or resumed from a summary.

When chat context and this file disagree, PM must treat this file as the safer baseline, then update it after CEO/PM explicitly changes direction.

## Current Operating Model

- Mainline PM: CEO / PM / Runtime Engineering.
- A1: Data / Source / Coverage.
- A2: Public Copy / Product Safety.
- A3: Launch / Production Engineering.
- A4: Membership MVP Planning.
- D: Legal / Source Rights Review.
- F: Product Design / UIUX.

PM remains the only integration owner. A1, A2, A3, and A4 may prepare local artifacts, reports, checkers, and bounded patches, but PM decides what enters the mainline and when it is committed.

## Mainline PM

Mission:

- Lead CEO direction, product scope, runtime engineering, integration, review gates, build health, and Git backup.
- Keep Phase 1 public/free launch readiness moving with larger coherent slices when governance becomes too fine.
- Decide when A1, A2, A3, or A4 output is ready for mainline review.

Owned work:

- Runtime state and public comprehension.
- Home / briefing / weekly / stock / methodology / disclaimer / terms / privacy.
- Public mock disclosure.
- Local health checks.
- Review-gate registration.
- Build recovery.
- Final integration commits.

Current next tasks:

- Continue Phase 1 public/free BRIEF validation.
- Keep publicDataSource=mock and scoreSource=mock until explicit release criteria are met.
- Integrate A1/A2/A3/A4 packets only after local checks pass.

## A1: Data / Source / Coverage

Mission:

- Prepare data-source, source-rights, coverage, ingestion, and backfill readiness without mutating remote systems.
- Convert market evidence into sanitized, aggregate, reviewable handoff packets.

Owned work:

- Legal/free automated data-source evidence.
- Coverage universe and row coverage readiness.
- Field-contract planning.
- Ingestion/backfill readiness.
- Sanitized candidate artifact hygiene.

Not owned:

- Public UI copy.
- Runtime page layout.
- Final production toggles.
- Git commits.
- SQL execution.
- Supabase writes.
- staging rows.
- `daily_prices` writes.
- raw market-data fetch/storage/commit.

Current next tasks:

- Continue legal/free automated source and coverage proof.
- Keep data-line source and coverage work independent from PM public runtime work.
- Escalate before any remote attempt, SQL, data write, raw-data fetch, or production source promotion.

## A2: Public Copy / Product Safety

Mission:

- Improve public comprehension, trust, and disclosure without slowing runtime foundation.

Owned work:

- Public page copy QA.
- Visible-language checkers.
- Data-source and update-time wording.
- Delayed/non-real-time wording.
- Non-investment-advice wording.
- No-official-endorsement wording.
- Free/member boundary wording.

Not owned:

- Data evidence scripts.
- Raw market evidence.
- Runtime source promotion.
- Production data-source toggles.
- Git commits.

Current next tasks:

- Repair only launch-blocking public trust and readability issues.
- Keep cosmetic polish lower priority until Phase 1 public/free experience is stable.

## A3: Launch / Production Engineering

Mission:

- Prevent deployment, environment, credential, DNS, monitoring, rollback, and launch-operations risk from surprising the mainline.

Owned work:

- Vercel checks.
- Environment-variable inventory.
- Metadata / sitemap / robots.
- Smoke checks.
- Monitoring.
- Rollback runbooks.
- Post-deploy reports.

Not owned:

- Runtime feature implementation.
- Supabase writes.
- SQL execution.
- Raw market-data handling.
- Entering secrets, OTPs, payment cards, or account-verification data.

Current next tasks:

- Keep remote monitoring aligned with the revised BRIEF.
- Review production-affecting changes before PM or chairman acts.

## A4: Membership MVP Planning

Mission:

- Keep Phase 2 membership MVP ready without slowing Phase 1.

Owned work:

- Market three-layer interpretation plan.
- watchlist / alert / post-market review MVP spec.
- Free/member boundary.
- Conversion metric plan.
- Member safety wording.

Not owned:

- Login implementation.
- Payment implementation.
- Persisted watchlist.
- Personalized alert execution.
- Member-only content gating.
- Git commits.

Current next tasks:

- Run as a small 5% planning-only lane for Phase 2 membership readiness.
- Prepare `membership_mvp_scope_and_free_paid_boundary` when it does not slow Phase 1.
- Pause immediately if PM needs capacity for Phase 1 public route readability, route health, launch checks, or data-boundary clarity.

## D: Legal / Source Rights Review

Mission:

- Review source/provider terms and internal authorization paths so PM can decide whether a data lane may move forward.

Owned work:

- Provider terms review summaries.
- Source-rights constraints.
- Attribution/retention/redistribution/commercial-use notes.
- Legal risk labels for PM.

Not owned:

- SQL.
- Supabase reads/writes.
- staging rows.
- `daily_prices`.
- market-data fetch/ingest/storage.
- runtime toggles.

## F: Product Design / UIUX

Mission:

- Use the MVP Launch PRD as the product baseline for design timing, annotation review, and launch-stage polish.

Current next tasks:

- Stay lightweight now.
- Flag comprehension blockers only.
- Full visual redesign waits until runtime and data-source foundations stabilize.

## Shared Safety Boundaries

All roles must keep these boundaries until CEO/PM explicitly changes the stage:

- No SQL execution.
- No Supabase writes.
- No staging rows.
- No daily_prices writes.
- No raw market data fetch.
- No raw market data ingest, storage, or commit.
- No secrets or raw payload printing.
- Keep publicDataSource=mock.
- Keep scoreSource=mock.
- No chairman credentials, OTP, payment-card, or identity-verification input by any role other than the chairman.

## Conflict Rules

- A1 must not edit A2-owned UI copy surfaces unless PM asks.
- A2 must not edit A1-owned data evidence or Supabase readiness surfaces unless PM asks.
- A3 must not deploy, change DNS, change cloud settings, enter secrets, or change production environment variables without PM and chairman-directed authorization.
- A4 must not implement Phase 2 runtime features during Phase 1.
- A1/A2/A3/A4 do not commit independently; PM integrates and commits coherent passing slices.
- If two roles need the same file, PM owns the merge and decides sequence.

## Current Blocker-Closure Assignments

- PM mainline: integrate blocker closure into runtime decision surfaces, run local checks, keep Git backup coherent, and decide whether role output is accepted.
- A1: prepare data-quality evidence, row-coverage readiness, field-validity QA, and downgrade-rule handoff material.
- A2: review whether blocker closure is understandable to users, especially public wording for mock-only status, source-rights limits, model-credibility limits, and real-score stop lines.
- A3: stay guard-only unless work becomes production-affecting through deployment, environment, credential, DNS, monitoring, rollback, or cloud changes.
- A4: keep Phase 2 membership planning ready, but do not block Phase 1.

PM may run mainline, A1, A2, A3, and A4 in parallel. Current CEO allocation is PM 50%, A1 20%, A2 10%, A3 15%, and A4 5% planning-only. PM must not wait for support lanes when runtime work is locally safe.
