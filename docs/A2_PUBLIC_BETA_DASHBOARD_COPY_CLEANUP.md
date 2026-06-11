# A2 Public Beta Dashboard Copy Cleanup

Status: `a2_public_beta_dashboard_copy_cleanup_ready`

Owner lane: A2 Public Trust / Product Copy

Scope: local-only user-language and developer-residue cleanup recommendation for the public Beta index status dashboard. This file is for PM adoption, public copy cleanup, briefing routing, and trust-language alignment only.

Current public posture:

- `publicDataSource=mock`
- `scoreSource=mock`
- Batch 1 may be described as a readiness lane.
- Batch 1 must not be described as live real data, real scoring, complete market coverage, trading guidance, or investment performance evidence.

This file does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, raw market-data fetch, raw market-data storage, raw market-data ingest, raw market-data commit, secret/env reading, authorization value reading, confirmation phrase reading, real decision value reading, candidate row acceptance, public real-data promotion, or `scoreSource=real`.

## 1. Public Page Information To Keep

Public pages should keep information that helps a general user understand what the dashboard is, what it can be used for, and what limits apply today.

Keep these items visible on public pages:

| Public information | User-facing reason | Recommended public language |
| --- | --- | --- |
| Dashboard purpose | Users need to know this is a market-status briefing, not an instruction engine. | `This Beta dashboard summarizes market mood and attention levels so you can review context before making your own decisions.` |
| Current status label | Users need a simple first-read state. | `Market mood`, `Attention`, `Watch closer`, or `Reduce risk review` |
| Plain explanation | Users need to understand why the state appears without seeing internal gates or raw values. | `The dashboard is showing a higher attention state because the mock-source signal moved away from the calm baseline.` |
| Update or freshness label | Users need to know whether the state is simulated, delayed, blocked, or last updated. | `Beta source state: mock. Last dashboard update: [PM inserts public-safe time label].` |
| Mock/real boundary | Users should not mistake the Beta for accepted live market evidence. | `This Beta view uses mock-source signals while real-data rights, fields, freshness, and database gates are still under review.` |
| Non-investment-advice note | Any score, status, or alert can be misread as advice. | `This dashboard is a decision aid, not investment advice. It does not recommend buying, selling, or timing the market.` |
| Batch 1 scope | Users can understand why TWII and core ETF are mentioned first. | `Batch 1 focuses on broad-market reference points first, starting with TWII and core ETF readiness.` |
| Next safe action | Users need a low-pressure next step. | `Use the explanation to review your own assumptions, time horizon, and risk limits.` |
| Missing or blocked state | Silence can imply confidence. | `Real-data display remains blocked until the required source, field, freshness, and runtime checks are accepted.` |

Public pages should use human words before technical labels. If exact technical states are needed, put them in a compact disclosure or methodology detail, not as the main explanation.

## 2. Developer Or Process Information To Move To Briefing/Internal

The public dashboard should not read like an execution log, packet router, or engineering gate report. The following information is useful for PM, A1, A2, and internal reviewers, but should be moved to `/briefing`, internal docs, admin-only notes, or PM handoff surfaces.

Move these items out of general public pages:

| Move to internal | Why it should not lead public copy | Safer public replacement |
| --- | --- | --- |
| `publicDataSource=mock`, `scoreSource=mock` as the main headline | Exact flags are useful but not reader-first. | `This Beta is mock-source today.` |
| Supabase table, schema, write path, readonly path, or readback details | These are implementation details and can imply hidden production state. | `Database readiness is still under review.` |
| `daily_prices`, staging rows, candidate rows, row coverage, idempotency, rollback runner names | These terms are operational and may create false certainty. | `Real-data coverage and fallback behavior still need accepted checks.` |
| Gate names, packet names, command names, route labels, run IDs, and script output | They are internal workflow artifacts, not user trust explanations. | `This state has not yet passed the required real-data review.` |
| Operator values, authorization fields, confirmation phrases, secrets/env placeholders | These must not appear publicly and are not needed for users. | Do not replace publicly; omit entirely. |
| Raw source, raw row, raw payload, stock-id payload, or copied contract text | These can violate data, legal, or privacy boundaries. | `Source review is pending.` |
| A1/A2/PM lane mechanics | Users need outcome clarity, not team routing. | `The Beta is still being reviewed before real-data display.` |
| Internal blocker counts without context | Counts can sound like coverage proof or launch proof. | `Some readiness checks are still incomplete.` |
| Real-score or promotion language before acceptance | It can imply investment-signal readiness. | `Scoring remains in Beta demonstration mode.` |

Recommended placement:

- Public page: status, explanation, mock-source note, non-advice note, freshness label, Batch 1 plain-language scope.
- `/briefing`: gate names, PM route, readiness checklist, Batch 1 blocker map, A1/A2 next work.
- Internal docs: command names, table names, row coverage mechanics, Supabase readiness details, write/readback/rollback packet references.

## 3. Batch 1 Readiness Public Copy Rewrite

Current Batch 1 readiness should be rewritten as a user-understandable Beta state, not as an engineering promotion claim.

Use this structure:

| Public area | Avoid | Use instead |
| --- | --- | --- |
| First-screen Batch 1 line | `Batch 1 ready for real data` | `Batch 1 is the first readiness lane for broad-market reference points.` |
| TWII/core ETF explanation | `TWII and ETF real display approved` | `TWII and core ETF are being reviewed first because they help explain broad market pressure without turning the Beta into stock-picking.` |
| Readiness status | `Source rights, field contract, cadence, readonly/write gates pending` as the only visible sentence | `Real-data display is not active yet. Rights, field meanings, update timing, missing-session handling, and database safeguards still need accepted review.` |
| Public source note | `publicDataSource=mock; scoreSource=mock` only | `This public Beta is mock-source today. Technical state: publicDataSource=mock; scoreSource=mock.` |
| Blocked state | `Promotion blocked` | `Real-data display is paused until the required reviews pass.` |
| Future state | `After publicDataSource=supabase and scoreSource=real` | `If the required reviews pass later, PM can replace mock labels with an approved real-data phrase set.` |

Recommended public paragraph:

`Batch 1 starts with TWII and core ETF because they are broad-market reference points that help explain market pressure without giving stock-picking instructions. This Beta is still mock-source today: real-data display waits for accepted source rights, field meanings, update timing, missing-session handling, and database safeguards. Until then, the dashboard is a decision aid for understanding the product flow, not a live market signal or investment recommendation.`

Recommended briefing paragraph:

`Batch 1 readiness remains a mock-preserving public Beta lane. PM may describe TWII and core ETF as the first broad-market reference scope, but must keep publicDataSource=mock and scoreSource=mock visible until separate source-rights, field-contract, cadence, missing-session, readonly/write, readback, and fail-closed gates are accepted. Do not imply live real data, real score, complete coverage, or trading advice.`

## 4. User-Understandable Mock / Real Boundary

The public page should explain mock/real as a trust boundary, not as a technical apology.

Recommended terms:

| Concept | Public wording | Internal wording allowed in briefing |
| --- | --- | --- |
| Mock source | `mock-source Beta view` | `publicDataSource=mock` |
| Mock score | `Beta demonstration scoring` | `scoreSource=mock` |
| Real source not active | `live real-data display is not active yet` | `publicDataSource=supabase not authorized` |
| Real score not active | `real scoring has not been approved for public use` | `scoreSource=real not authorized` |
| Gate incomplete | `required reviews are still incomplete` | `source-rights / field-contract / readonly / write / rollback gates pending` |
| Fallback | `the page should stay mock-labeled or blocked` | `fail closed to mock` |

Suggested user-facing explanation:

`Mock-source means the dashboard is showing how the product explains market states before real public data is approved. Real-data display requires separate review of source rights, field meanings, update timing, missing sessions, and database safeguards. If any review is incomplete or unclear, the public page should stay mock-labeled or show a blocked state.`

Rules for all mock/real copy:

- Say `mock-source` before showing technical flags.
- Do not call mock data fake, harmless, or production-equivalent.
- Do not call future real data official, live, complete, current, or approved until a separate accepted gate says so.
- Pair any alert or pressure wording with a non-investment-advice note.
- Treat uncertainty as a reason to show a conservative label, not as a reason to fill in confidence.

## 5. PM-Ready Short Copy

PM may directly adopt these short lines on public or briefing surfaces, subject to final placement review.

1. `This Beta dashboard summarizes market mood for review, not for buy or sell decisions.`
2. `The current public view is mock-source while real-data rights, fields, freshness, and safeguards are still under review.`
3. `Batch 1 starts with TWII and core ETF because they are broad-market reference points, not stock-picking prompts.`
4. `Real-data display is not active yet; the page stays mock-labeled until the required reviews pass.`
5. `Use each alert as a prompt to review your own assumptions, time horizon, and risk limits.`
6. `A higher attention state means watch the context more closely; it does not predict returns or recommend a trade.`
7. `If source or freshness status is unclear, the dashboard should show mock or blocked instead of implying confidence.`
8. `This is a decision aid and public Beta explanation surface, not investment advice or a performance promise.`

## Public Copy Cleanup Checklist

Before PM ships the public dashboard copy, check that:

- The first-screen explanation says `mock-source` or equivalent reader-facing language.
- Technical flags, if shown, are secondary to plain-language explanation.
- Alerts explain status, cause, update/freshness, impact level, and next review step.
- Every pressure, score, alert, or risk phrase has nearby non-investment-advice language.
- No public copy says buy, sell, short, guaranteed return, certain profit, live real data, official real-time feed, complete coverage, or approved real score.
- No public copy exposes gate route labels, command names, table names, row payloads, raw payloads, stock-id payloads, secrets, authorization values, confirmation phrases, or operator values.
- Batch 1 is framed as readiness scope, not as accepted real-data promotion.
- Missing, delayed, blocked, or unclear states are visible instead of silently treated as usable evidence.

## A2 Conclusion

The public Beta dashboard copy cleanup recommendation is ready for PM intake. Public pages should keep user-facing status, explanation, freshness, mock-source boundary, Batch 1 scope, and non-investment-advice language. Developer residue should move to briefing/internal surfaces. Batch 1 should be described as a readiness lane, not a real-data approval. The mock/real boundary should be explained in plain language while preserving `publicDataSource=mock` and `scoreSource=mock`.
