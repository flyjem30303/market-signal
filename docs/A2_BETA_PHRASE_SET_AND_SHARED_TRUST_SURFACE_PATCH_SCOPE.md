# A2 Beta Phrase Set And Shared Trust Surface Patch Scope

Status: `a2_beta_phrase_set_and_shared_trust_surface_patch_scope_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_phrase_set_and_patch_scope`

## Boundary

This package converts the accepted A2 public Beta trust-copy readiness work into an implementation-ready phrase set and patch scope. It is documentation and checker work only. It does not edit page code, redesign UI, run SQL, connect to Supabase, write Supabase, fetch/ingest/store raw market data, print secrets, print raw payloads, print row payloads, print stock id payloads, change runtime toggles, deploy, or promote public source/score state.

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim real-source wording before PM/runtime promotion approval.
- Do not claim complete coverage before PM/A1 accepts coverage evidence and downgrade rules.
- Do not claim investment advice, buy/sell/hold instructions, guaranteed returns, validated forecasts, or real-score evidence.
- Do not touch data evidence, Supabase, runtime toggles, raw market artifacts, PM deployment execution packets, GOAL files, or A1 source-rights evidence.

## Source Documents Referenced

- `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md`
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md`
- `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md`
- `docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md`
- `src/lib/public-runtime-boundary-copy.ts`
- `src/components/trust-runtime-boundary-notice.tsx`
- `src/components/public-runtime-state-strip.tsx`
- `src/components/data-freshness-strip.tsx`
- `src/app/layout.tsx`
- `src/app/disclaimer/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/methodology/page.tsx`

## CEO Decision

CEO decision: `approve_a2_beta_phrase_set_before_shared_trust_surface_patch`.

PM selects this route because public Beta launch needs route-readable trust copy, but broad visual polish remains lower priority than data/runtime foundations. A2 should patch shared trust surfaces first because those surfaces affect home, stocks, briefing, weekly, methodology, disclaimer, terms, privacy, and footer/legal comprehension.

Next route: `bounded_shared_trust_surface_copy_patch_then_route_health`.

## Approved Beta Phrase Set

Use these phrases as the first implementation baseline. Future edits may improve style, but must keep the same safety meaning.

| Trust topic | Approved phrase intent | Required exact token |
|---|---|---|
| Mock-only mode | The public Beta is a mock-facing product flow and decision-support reading experience. | `mock-only` |
| Public source stop line | Public data source is not promoted to Supabase. | `publicDataSource=mock` |
| Score stop line | Score source is not promoted to real scoring. | `scoreSource=mock` |
| Freshness | Freshness is metadata/readiness context, not a live market guarantee. | `data freshness metadata` |
| Partial coverage | Coverage is incomplete until evidence and downgrade gates pass. | `partial coverage` |
| Missing/delayed data | Missing, delayed, stale, unavailable, or unvalidated data must lower confidence. | `missing/delayed data` |
| Model limitation | Scores are simplified mock/model outputs, not validated forecasts. | `model limitation` |
| Non-advice | Signals, scores, rankings, and action summaries are not investment advice. | `non-investment advice` |
| Risk | Readers remain responsible for decisions and should verify independently. | `risk disclosure` |

## Rejected Public Beta Claims

Do not publish any phrase with these meanings before separate PM/runtime/data promotion gates pass:

- `real market data is live`.
- `complete coverage is approved`.
- `publicDataSource=supabase is approved`.
- `scoreSource=real is approved`.
- `validated forecast`.
- `buy/sell/hold advice`.
- `personalized recommendation`.
- `guaranteed return`.
- `professional investment advice`.
- `source redistribution approved`.

## Shared Trust Surface Patch Scope

Patch these shared surfaces first when PM moves from document scope to implementation scope:

| Surface | File | Patch priority | Required visible meaning |
|---|---|---|---|
| Runtime boundary copy source | `src/lib/public-runtime-boundary-copy.ts` | `P0_shared_source_of_truth` | `mock-only`, `publicDataSource=mock`, `scoreSource=mock`, data freshness metadata, partial coverage, missing/delayed data, model limitation, non-investment advice. |
| Trust runtime notice | `src/components/trust-runtime-boundary-notice.tsx` | `P0_shared_notice` | Reader-facing public Beta boundary without internal workflow language or mojibake. |
| Public runtime strip | `src/components/public-runtime-state-strip.tsx` | `P1_shared_status_strip` | Exact stop lines plus readable mock/real boundary. |
| Data freshness strip | `src/components/data-freshness-strip.tsx` | `P1_shared_freshness` | Freshness metadata is not live-market approval and missing/delayed data lowers confidence. |
| Footer/site chrome | `src/app/layout.tsx` | `P1_site_wide_footer` | Non-investment advice, mock-only state, and links to methodology/disclaimer/terms/privacy remain visible. |
| Legal route trust alignment | `src/app/disclaimer/page.tsx`, `src/app/terms/page.tsx`, `src/app/privacy/page.tsx` | `P2_legal_route_copy` | Legal copy uses the same mock/coverage/freshness/model/non-advice phrase family. |
| Methodology route trust alignment | `src/app/methodology/page.tsx` | `P2_methodology_copy` | Model limitation and promotion gate boundaries are clearer than product marketing claims. |

## Route-Level Impact

The shared-surface patch should improve these routes without route-specific redesign:

- `/`
- `/briefing`
- `/weekly`
- `/stocks/[symbol]`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`

Route-specific copy patches may follow only after shared surfaces pass focused checks.

## Implementation Stop Lines

The next implementation slice must stop before:

- SQL.
- Supabase connection.
- Supabase write.
- staging row creation.
- `daily_prices` mutation.
- raw market data fetch/ingest/store/commit.
- secret output.
- raw payload output.
- row payload output.
- stock id payload output.
- row coverage point award.
- production deployment.
- preview deployment.
- DNS/SSL mutation.
- platform env mutation.
- public source promotion.
- real score promotion.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- investment advice.

## PM Acceptance Criteria

PM may accept this package when:

- The approved phrase set names the required trust topics.
- Rejected public Beta claims are explicit.
- Shared trust surfaces are prioritized before broad visual polish.
- Route-level impact is listed without claiming launch completion.
- The next implementation route is bounded and copy-only.
- `publicDataSource=mock` and `scoreSource=mock` remain unchanged.
- A2 remains blocked from data, Supabase, source-rights, deployment, and runtime promotion work.

## Suggested Next A2 Task

Run a bounded shared trust-surface copy patch using this phrase set. Limit code changes to `src/lib/public-runtime-boundary-copy.ts`, `src/components/trust-runtime-boundary-notice.tsx`, `src/components/public-runtime-state-strip.tsx`, `src/components/data-freshness-strip.tsx`, and `src/app/layout.tsx` unless PM explicitly chooses legal route-local copy in the same slice. After the patch, run focused language checks, public route loop, TypeScript, and a route health check.
