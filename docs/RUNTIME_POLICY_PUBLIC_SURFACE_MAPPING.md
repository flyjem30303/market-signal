# Runtime Policy Public Surface Mapping

Status: `runtime_policy_public_surface_mapping_ready_mock_boundary_preserved`

CEO decision: `map_first_closed_loop_policy_to_public_surfaces_without_real_promotion`

This mapping converts the accepted first closed-loop runtime policy into public-surface rules. It does not implement UI by itself, does not promote runtime data source, and does not authorize a real score source.

## Source Evidence

- `docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md`
- `docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `src/lib/public-runtime-boundary-copy.ts`
- `src/components/trust-runtime-boundary-notice.tsx`
- `src/components/data-freshness-strip.tsx`
- `src/lib/runtime-promotion-readiness-summary.ts`

Accepted evidence:

- first closed-loop status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`
- accepted sub-scope: `accepted_first_closed_loop_complete`
- accepted TW equity symbols: `2330`, `2382`, `2308`
- TW equity sub-scope rows: `180/180`
- full MVP rows: `182/360`
- missing rows: `178`
- blocked symbols: `TWII` `0/60`, `0050` `1/60`, `006208` `1/60`
- runtime stop line: `publicDataSource=mock`
- score stop line: `scoreSource=mock`

## Mapping Rules

The first closed-loop evidence may be shown as Beta context only. It must not be framed as real runtime promotion, full market coverage, investment advice, or real score approval.

| Public surface | Allowed public message | Required boundary | Forbidden wording |
| --- | --- | --- | --- |
| `/` home | First TW equity closed-loop evidence exists for a limited sub-scope. | Public runtime remains `publicDataSource=mock`; score remains `scoreSource=mock`; coverage is partial; missing or delayed data can lower confidence. | real-time, fully real, production real data, complete market coverage, live market freshness, scoreSource=real |
| `/stocks/[symbol]` stock detail | Symbol-level context may later mention accepted evidence only for `2330`, `2382`, and `2308`. `TWII`, `0050`, and `006208` must remain blocked or incomplete if surfaced. | Stock pages remain mock-only reading surfaces; any score or action text is model-limited decision-support context. | buy/sell/hold advice, real score approved, full source coverage, real runtime score |
| `/briefing` | CEO/PM summary may mention `180/180` sub-scope and full MVP blocked at `182/360`. | Missing universe must be visible when discussing readiness. | public launch completed, real promotion accepted, full coverage ready |
| `/weekly` | Weekly copy may use the same aggregate Beta evidence context. | Must repeat partial coverage, model limitation, and non-investment-advice boundary. | live weekly market data, complete row coverage, real scoring |
| `/methodology` | Methodology may explain that scoring remains mock and first closed-loop evidence is not a promotion gate. | Promotion requires separate runtime and score gates. | formally validated real score, real-data model approval |
| `/disclaimer`, `/terms`, `/privacy` | Legal/trust pages may repeat mock-only runtime, partial coverage, missing/delayed data, model limitation, and no-advice language. | No personalized recommendations and no investment advice. | investment advice claim, guaranteed outcome, personalized recommendation |
| shared trust/freshness/footer/site navigation | Shared copy may use the accepted A2 trust phrase set and source-depth context. | Keep `publicDataSource=mock`, `scoreSource=mock`, partial coverage, and freshness metadata clear. | publicDataSource=supabase, scoreSource=real, complete coverage, live freshness |

## Implementation Boundary

This mapping allows a later bounded public-surface copy patch from mapping only if the patch keeps the runtime and score boundaries unchanged.

Allowed next implementation route:

- `bounded_public_surface_copy_patch_from_mapping`

Still blocked:

- runtime promotion
- score promotion
- full MVP row coverage claim
- public real-data claim
- investment advice claim
- public launch completion claim

## Role Routing

- PM mainline: `public_surface_copy_patch_from_mapping`
- A1 support lane: `twii_etf_blocked_universe_candidate_and_rights_path`
- A2 support lane: `partial_coverage_public_beta_copy_alignment`

## Hard Stops

This mapping does not authorize:

- SQL execution
- Supabase write
- staging row creation
- `daily_prices` mutation
- raw market-data fetch
- raw market-data ingest
- raw market-data storage
- raw market-data commit
- raw payload output
- row payload output
- stock id payload output
- secret output
- additional row coverage points
- full MVP coverage claim
- public source promotion
- `publicDataSource=supabase`
- real score promotion
- `scoreSource=real`
- investment advice claim
- public launch completion claim

## Verification

Required local checks for this mapping:

- `npm run check:runtime-policy-public-surface-mapping`
- `npm run check:runtime-promotion-policy-from-first-closed-loop`
- `npm run check:public-runtime-boundary-coverage`
- `npm run check:public-visible-language-quality`
- `npm run check:site-chrome-readability`
- `npm run check:public-route-loop`
- `node scripts/check-review-gates.mjs`

The next route is `bounded_public_surface_copy_patch_from_mapping_or_blocked_universe_candidate_path`.
