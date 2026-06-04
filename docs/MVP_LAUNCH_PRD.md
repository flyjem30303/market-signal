# MVP Launch PRD And Product Baseline

Updated: 2026-06-04

This file is the lightweight product baseline added after the project had already
made runtime progress. It is intentionally short. It should increase execution
speed and decision quality without reopening a large discovery phase.

## CEO Decision

Do not pause the project for a full restart, full interview cycle, or broad UI
redesign. Continue the current runtime and bounded readonly path, while adding
only the missing product baseline that reduces repeated questions.

The current project goal remains:

- Build a Taiwan-first market signal website that can later scale globally.
- Keep the public runtime mock-only until gated data, rights, model, and release
  decisions are accepted.
- Move toward exactly one separately named bounded Supabase readonly row coverage
  attempt only after local prechecks pass.

## Target Users For MVP

Primary MVP users:

- Taiwan retail investors who want a quick market and stock condition summary.
- Users who compare Taiwan index, major stocks, and ETF candidates before doing
  deeper research elsewhere.
- Non-professional users who need plain-language risk and readiness context.

Secondary users:

- Product reviewers, data reviewers, and future operations roles validating
  whether the site can safely move from mock to real data.
- Future global users, but global market expansion is a design constraint, not
  the first launch scope.

## MVP User Problems

The MVP should help a user answer:

- What is the current mock-only market signal state?
- Which stock or ETF pages are available?
- What signals are product-flow examples versus real market evidence?
- What data, rights, model, and release gates are still blocked?
- What would need to happen before the site can claim real-data or real-score
  readiness?

The MVP should not claim:

- Buy, sell, hold, ranking, suitability, or recommendation advice.
- Real market freshness when public runtime is still mock.
- Provider rights, source license approval, row coverage points, or
  `scoreSource=real`.

## MVP Launch Definition

MVP can be considered launch-ready only when all of these are true:

- Home, briefing, weekly, and stock pages return HTTP 200 locally.
- Public pages explain mock-only state in readable language.
- `publicDataSource=mock` and `scoreSource=mock` are visibly and technically
  preserved until later gates.
- Local build, localhost full health, public language quality, and full review
  gate pass.
- Legal and Investment local outcomes remain recorded as accepted for planning
  only.
- Bounded readonly final local alignment is ready, or the CEO explicitly chooses
  to keep launch mock-only without remote row coverage evidence.
- A1 data evidence and A2 public-copy support lanes have no launch-blocking
  open issues.
- I has reviewed deployment, environment variables, rollback, monitoring, DNS,
  and secret-handling before any public production deployment.

MVP is not launch-ready if any of these are true:

- A public route returns 500 or connection refused.
- Public copy hides the mock-only boundary.
- Any output prints secrets, raw row payloads, internal stock identifiers, SQL
  text, or raw market data.
- Runtime is promoted to Supabase or real score without a recorded gate.
- Visual polish is the only remaining work but build, health, legal, data, or
  deployment checks are still unstable.

## Requirement Baseline

MVP pages:

- `/` home: searchable entry point and market action summary.
- `/briefing`: PM/CEO state, blockers, row coverage readiness, and boundary
  summary.
- `/weekly`: weekly market summary and row coverage readiness.
- `/stocks/[symbol]`: stock or ETF signal detail, runtime boundary, investor
  action summary, and indicator roadmap.
- Legal pages: `/terms`, `/privacy`, `/disclaimer`, and `/methodology`.

MVP indicators:

- Mock health score.
- Mock pullback risk score.
- Mock composite signal.
- Data quality state.
- Freshness/source boundary.
- Row coverage readiness state.
- Investor action summary with non-advisory wording.
- Indicator roadmap that clearly separates current mock signals from future
  professional indicators.

Deferred indicators:

- Real scoring.
- Backtested confidence claims.
- Provider-backed real freshness.
- Paid alerts.
- User accounts and favorites.
- Global market ranking.
- Portfolio suitability or recommendation logic.

## UX And F Design Timing

F / Product Design should not run a full visual redesign now. F should be
activated in three levels:

1. Now: create or maintain a lightweight UI/UX design brief and flag
   comprehension blockers only.
2. Before public launch: review first-screen hierarchy, mobile readability,
   disclosure placement, trust copy, and user flow clarity.
3. Final polish: visual styling, spacing, component polish, annotation-based UI
   review, and screenshot-driven refinements.

Codex design or browser skills are best used in the final polish and launch QA
phase, not during the current bounded readonly/runtime foundation work. Use the
in-app browser for verification after meaningful frontend changes.

## Planning Gap Decision

The project did not start with a formal Plan-mode discovery phase or full
requirements interview. CEO decision:

- Do not restart discovery now.
- Use this PRD as the current product baseline.
- Add small requirement notes only when they change launch scope, target user,
  gate meaning, or role ownership.
- Revisit a deeper discovery cycle after MVP launch-readiness, when real user
  feedback or usage analytics can guide the next product version.

## Annotation And Final Design Review

Annotation-based screen review should be used near final UI polish, not during
data/runtime foundation work.

Use annotation earlier only for:

- Text overlap.
- Mobile breakage.
- First-screen confusion.
- Missing mock/real boundary.
- User-facing language that implies investment advice or real data approval.

## Current Efficiency Rules

To improve future development speed:

- Prefer larger coherent slices over many small governance-only slices.
- Keep local-only reports and checkers when they prevent repeated mistakes.
- Do not add new role-review documents unless authorization meaning changes.
- Run build and localhost checks sequentially, not in parallel with review gate.
- If Next build reports a missing page that exists, stop Next, clear `.next`,
  rebuild, then recover the dev server.
- UI polish waits unless it affects comprehension, launch trust, or runtime
  boundary clarity.
- PM remains integration owner. A1, A2, F, and I support the mainline; they do
  not independently promote runtime state.

## Non-Negotiable Boundaries

- No SQL execution.
- No Supabase writes.
- No raw market data fetch or ingestion.
- No provider terms approval from this PRD.
- No public source promotion from this PRD.
- No `scoreSource=real` promotion from this PRD.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.

## Current CEO Recommendation

After this product baseline is recorded, return to the mainline:

1. Solidify the build/dev-server recovery preflight because it has repeatedly
   slowed verification.
2. Then decide whether to separately name exactly one bounded Supabase readonly
   row coverage attempt.
3. Keep public runtime mock-only until post-run review and later gates allow a
   separate promotion discussion.
