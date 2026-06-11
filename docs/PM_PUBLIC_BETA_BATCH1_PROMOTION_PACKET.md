# PM Public Beta Batch 1 Promotion Packet

Status: `pm_public_beta_batch1_promotion_packet_ready_local_only`

Date: 2026-06-11

Owner: PM mainline

Scope: Public Beta Index Status Dashboard, Batch 1 TWII + core ETF data realization

## 1. CEO Direction

Move the next GOAL from a narrow data-closure frame into a public Beta dashboard usability loop:

- Keep data realization as the mainline.
- Pull product readability forward enough that users can understand progress without seeing internal process debris.
- Keep source-rights, field contract, readonly, write, and promotion gates explicit for PM/CEO review.
- Do not slow the project with low-value governance detail; keep only gates that prevent unsafe public claims, bad data, or irreversible writes.

## 2. Current Runtime Boundary

The current public runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- no public claim that real market data is live
- no public claim that scores are generated from production market data
- no investment advice, no buy/sell instruction, no performance promise

This packet does not authorize:

- SQL execution
- Supabase write
- staging row creation
- `daily_prices` mutation
- raw market-data fetch, storage, or commit
- `publicDataSource=supabase`
- `scoreSource=real`

## 3. Batch 1 User-Facing Objective

Batch 1 should make the dashboard easier to understand before real promotion:

| User need | Product answer | Current state |
| --- | --- | --- |
| Know the market mood quickly | TWII becomes the first market baseline | waiting |
| Compare broad ETF context | Core ETF group follows TWII after source-rights and field contract review | waiting |
| Understand whether data is real | Public copy keeps mock boundary clear | active |
| Avoid over-trusting a number | Each data card states what is still blocked | active |

## 4. PM Gate Map

| Gate | Must be true before moving forward | Current PM state | Next owner |
| --- | --- | --- | --- |
| Source-rights gate | TWII and core ETF public display rights are accepted or explicitly constrained | blocked | A1 + PM |
| Field-contract gate | Minimum fields, date/session semantics, units, and excluded ETF fields are accepted | waiting | A1 + PM |
| Cadence/missing-session gate | Update cadence, Taiwan session calendar, stale-data state, and missing-row display rules are accepted | waiting | A1 + PM |
| Readonly gate | Bounded readonly route can verify aggregate availability without secrets/raw payloads | blocked | PM |
| Write/backfill gate | Write path, rollback, idempotency, and aggregate readback are defined and separately authorized | blocked | PM |
| Public-promotion gate | Legal/trust copy, runtime fallback, and public claims all pass | blocked | PM + D/A2 |

## 5. Promotion Packet Acceptance Criteria

PM can mark this packet as ready for the next execution-oriented GOAL only when all of these are true:

1. A1 data/source-rights delta exists and contains no secret, raw payload, row payload, or unauthorized execution claim.
2. A2 public trust copy exists and separates public user copy from internal gate language.
3. Homepage shows user-readable Batch 1 progress, not command snippets or external reply intake mechanics.
4. `/briefing` keeps the operational gate details needed by CEO/PM.
5. Local visible-language checker confirms no old public-beta hard-blocker/developer-intake phrases reappear on public pages.
6. TypeScript and local route health checks pass.
7. Review gate passes.

## 6. Hard Stops

Stop and do not promote if any of the following appear:

- source-rights state is unknown but public copy implies approved rights;
- ETF copy implies holdings, NAV, premium/discount, or constituent data exists before the contract accepts it;
- readonly attempt requires printing secrets, raw payloads, row payloads, or exact protected values;
- write/backfill work is requested without a separate explicit gate;
- public UI says or implies production real data is live;
- `publicDataSource=supabase` or `scoreSource=real` is changed outside an approved promotion gate.

## 7. PM Integration Decision

Decision: `accepted_for_local_mainline_integration`

Reason:

- The homepage can now present Batch 1 as a user-facing data next step.
- The detailed source-rights/field/runtime gates remain available in `/briefing`.
- A1 and A2 can continue in parallel without blocking mainline UI/runtime work.
- The next high-value slice is not another broad governance map; it is either:
  - a bounded readonly promotion packet if rights/field prerequisites are present, or
  - a public copy cleanup slice if users still see development-process language.

## 8. A1 / A2 Intake

PM has received and accepted these local-only support artifacts for mainline planning:

| Lane | Artifact | PM intake result | How it changes mainline |
| --- | --- | --- | --- |
| A1 | `docs/A1_PUBLIC_BETA_BATCH1_PROMOTION_DATA_DELTA.md` | `accepted_for_pm_packet_input` | Confirms the remaining data delta: source-rights, fields, session/cadence, readonly prerequisites, write/backfill prerequisites, and hard stops. |
| A2 | `docs/A2_PUBLIC_BETA_DASHBOARD_COPY_CLEANUP.md` | `accepted_for_pm_packet_input` | Confirms public pages should lead with user language, move developer process details to `/briefing`, and explain mock/real as a trust boundary. |

PM interpretation:

- A1 does not close any real-data gate; it makes the remaining gate delta explicit enough to avoid vague "data coverage" work.
- A2 does not replace legal review; it gives PM usable wording rules that keep public copy honest while improving user readability.
- Both artifacts preserve `publicDataSource=mock` and `scoreSource=mock`.

## 9. Next Mainline Slice

Recommended next slice:

`public_beta_batch1_promotion_packet_absorb_a1_a2`

Expected work:

- keep A1 data delta linked from PM packet and use it as the next readonly/write gate prerequisite checklist;
- keep A2 copy cleanup linked from PM packet and use it as the public-page cleanup standard;
- run TypeScript, public visible language quality, route health, and review gate;
- keep Git backup after passing checks.
