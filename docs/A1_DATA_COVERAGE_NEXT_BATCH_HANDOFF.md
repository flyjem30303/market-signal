# A1 Data Coverage Next Batch Handoff

Status: `a1_data_coverage_next_batch_handoff_ready_local_only_background`

Date: 2026-06-10

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only background handoff for the next data coverage batch. This file consolidates repo-local coverage universe, TWII candidate, source-rights, and row coverage evidence without touching PM mainline artifacts.

## Current Coverage Snapshot

Level 1 MVP row coverage remains incomplete:

| Scope | Expected rows | Observed rows | Missing rows | Current state |
| --- | ---: | ---: | ---: | --- |
| Full Level 1 MVP universe | 360 | 182 | 178 | `blocked_incomplete` |
| TW equity sub-scope: `2330`, `2382`, `2308` | 180 | 180 | 0 | `accepted_complete` |
| TWII index lane | 60 | 0 | 60 | candidate-ready for local PM review only |
| ETF lane: `0050`, `006208` | 120 | 2 | 118 | source-rights blocked |
| `0050` ETF | 60 | 1 | 59 | source-rights blocked |
| `006208` ETF | 60 | 1 | 59 | source-rights blocked |

Repo evidence anchors:

- `docs/COVERAGE_UNIVERSE_ROADMAP.md` keeps Level 1 MVP coverage separate from Level 2 all-listed expansion.
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md` accepts only the TW equity sub-scope and keeps full MVP coverage blocked.
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md` records ETF `2/120` with `118` missing rows and source-rights blocked.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` records TWII source-rights candidate review readiness with no execution authority.
- `docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md` defines the TWII aggregate-only artifact contract.
- `data/candidates/twii-sanitized-candidate.json` is an existing local aggregate-only TWII candidate artifact for PM review, not source-derived row acceptance.
- `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` records TWII slots accepted for source-rights outcome gate preparation and ETF evidence slots still pending.
- `data/source-gates/twii-write-prerequisite-intake-ledger.json` records future TWII write prerequisites as accepted for candidate-gate preparation only, with implementation still blocked.
- `data/source-gates/twii-no-secret-execution-readiness-review.json`, `data/source-gates/twii-real-write-runner-implementation-review-gate.json`, and `data/source-gates/twii-implementation-scope-packet.json` all preserve no-execution / blocked implementation state.

## Known Coverage Gaps

| Gap | Missing rows | Why it matters | Current blocker |
| --- | ---: | --- | --- |
| TWII index daily coverage | 60 | Completes the index lane in the Level 1 universe and reduces the full MVP gap from `178` to `118` if later accepted and written through authorized gates. | Candidate artifact is local and aggregate-only; execution, source probing, Supabase, `daily_prices` mutation, and row coverage scoring remain blocked. |
| ETF daily coverage for `0050` | 59 | Part of the remaining ETF `118` rows. | ETF legal use, redistribution, attribution, retention, derived analysis, rate-limit, field-contract, and source comparison evidence remain pending. |
| ETF daily coverage for `006208` | 59 | Part of the remaining ETF `118` rows. | Same ETF source-rights blocker as `0050`; no candidate generation from remote/source data is authorized. |
| Full Level 1 promotion | 178 | Public real-data and real-score promotion require full coverage plus source-rights, data quality, model credibility, and public-claim gates. | Full universe remains `182/360`; public source and real scoring remain blocked. |
| Level 2 all-listed expansion | Not part of Level 1 denominator | Future Taiwan all-listed coverage needs its own universe manifest and denominator. | Must not reuse the MVP `360` denominator or current Level 1 gates. |

## Next Batch Lane Candidates

### Candidate 1: TWII Index Daily Coverage

Recommended background priority: highest for local-only handoff continuity.

Current local state:

- Target lane: `TWII`.
- Asset type: `index`.
- Target scope: `twii_index_daily_prices_missing_rows`.
- Expected window: `60` sessions.
- Observed rows: `0`.
- Candidate missing rows: `60`.
- Existing artifact path: `data/candidates/twii-sanitized-candidate.json`.
- Source lane in current artifact: `official-exchange-index`.
- Current source-rights status reference: `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`.
- Current review output policy: `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`.

Required sanitized artifact conditions:

- Must remain local JSON with metadata and aggregate counts only.
- Must keep `sanitizedAggregateOnly=true`.
- Must keep `rawPayloadIncluded=false`, `rowPayloadIncluded=false`, `stockIdPayloadIncluded=false`, and `secretsIncluded=false`.
- Must not include source response bodies, per-row values, raw URLs with credentials, stock id payloads, or committed market-data files.
- May include field names and validation labels only; field values must not be printed in this background handoff.

Required source-rights conditions:

- PM/CEO must separately decide source authority, automated access permission, internal storage, retention, redistribution/display limits, attribution wording, derived analysis, rate limits/fair use, commercial use constraints, and field-contract readiness.
- Existing `4/4` TWII evidence slots are accepted for source-rights outcome gate preparation only.
- Acceptance for preparation does not authorize probing, fetching, candidate row acceptance, SQL, Supabase, or writes.
- If `official-exchange-index` is rejected, the fallback lanes remain `licensed-market-data-vendor` and `internal-approved-feed`, still local-only until a later gate accepts one route.

Required QA / gate conditions:

- Candidate artifact chain handoff must validate the existing artifact as aggregate-only before any named packet references it.
- Any later execution gate must name the exact command, exact target scope, max attempts, confirmation phrase, stop conditions, rollback/readback plan, and post-run review.
- Aggregate readback and post-run review must remain separate from row coverage scoring.
- Row coverage points can only be considered after source-rights, candidate, execution, readback, and post-run review gates pass.

### Candidate 2: ETF Daily Coverage for `0050` and `006208`

Recommended background priority: second, because it closes more rows but remains source-rights blocked.

Current local state:

- Target lane: ETF daily market-price coverage.
- Target symbols: `0050`, `006208`.
- Target scope: `etf_daily_prices_missing_rows`.
- Expected rows: `120`.
- Observed rows: `2`.
- Missing rows: `118`.
- Per-symbol missing rows: `0050` has `59`, `006208` has `59`.
- Candidate source lanes named in docs: `twse-mis-etf-surface`, `issuer-official-pages`, or `licensed-vendor`.
- Current blocker: `legal_and_redistribution_terms_unapproved`.

Required sanitized artifact conditions:

- Must define aggregate metadata only: expected rows, observed rows, missing rows, per-symbol aggregate counts, field contract reference, source lane label, and review output policy.
- Must not generate ETF candidate rows from remote/source data in this background branch.
- Must exclude raw payloads, row payloads, stock id payloads, secrets, source response bodies, per-row values, and committed market-data files.
- Must keep ETF market-price daily coverage separate from NAV, premium/discount, holdings, issuer metadata, and intraday indicative value unless PM opens separate field-contract gates.

Required source-rights conditions:

- One source lane must be accepted for storage rights, retention, redistribution/display limits, attribution wording, derived-analysis use, delay/incompleteness wording, rate limits, and field contract.
- Current source-rights intake evidence is pending in `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json`.
- No ETF public source claim, candidate generation, market-data fetch, or write path is allowed while legal and redistribution terms remain unapproved.

Required QA / gate conditions:

- ETF source-rights outcome gate must pass before artifact generation from source data.
- ETF candidate artifact gate must validate aggregate-only shape and exact `118` missing-row scope, unless PM documents a different count.
- ETF bounded staging/write authorization must be separate and exact-command based.
- ETF post-run review and readback must report only aggregate counts and must not award row coverage points by themselves.

### Candidate 3: TW Equity Follow-On / Level 2 Preparation

Recommended background priority: planning only, not a Level 1 coverage batch.

Current local state:

- TW equity Level 1 sub-scope is complete at `180/180`.
- Level 2 Taiwan listed company universe is a future expansion stage, not part of the current `360` denominator.
- Existing roadmap notes stock master seed evidence of `1086` listed-stock records, but a formal Level 2 universe manifest and denominator are required before work begins.

Required sanitized artifact conditions:

- Any future Level 2 artifact must be a new batch/universe contract, not a reuse of the Level 1 `2330`, `2382`, `2308` contract.
- Batch artifacts must preserve aggregate review outputs and avoid raw payload, row payload, stock id payload, and secrets in handoffs.
- A Level 2 denominator must be explicit: active TWSE listed common stocks multiplied by the accepted session policy.

Required source-rights conditions:

- TW equity prior terms support only the accepted bounded scope and selected uses; redistribution/download/API reuse remains blocked.
- All-listed expansion must reconfirm source-rights, storage, retention, redistribution, attribution, derived analysis, rate limits, failure/retry partitioning, staging-first posture, and public claim limits.

Required QA / gate conditions:

- PM must create or accept an all-listed universe manifest before any Level 2 candidate artifact exists.
- Row coverage scoring must report by batch, industry or group, and full listed universe.
- Level 2 must not affect Level 1 completion status unless PM opens a separate roadmap/promote gate.

## Suggested Next Local-Only Work Order

1. Validate the TWII sanitized candidate artifact chain handoff as a report-only, no-write reference check.
2. Prepare a PM-review summary of TWII source-rights acceptance gaps that does not quote terms text, expose private links, or include source payloads.
3. In parallel, prepare ETF source-rights evidence intake reminders for the six pending ETF slots without fetching market data.
4. Defer Level 2 all-listed work to a separate universe-manifest branch after Level 1 routing is settled.

This sequence is local-only. It is intended to reduce PM review friction while preserving the current no-execution posture.

## Non-Executable Boundaries

This handoff does not authorize and did not perform:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- Supabase client import for execution;
- credential value read;
- secret output;
- staging row creation;
- `daily_prices` mutation;
- candidate row acceptance;
- row coverage scoring;
- row coverage point award;
- market-data fetch;
- market-data ingestion;
- market-data storage;
- market-data commit;
- raw payload output;
- source response body output;
- row payload output;
- stock id payload output;
- source URL output with tokens or credentials;
- source-derived candidate row generation;
- external endpoint probing;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

Current runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## PM Handoff Note

This is a background A1 handoff only. It should not be treated as a PM decision record, source-rights approval, candidate artifact acceptance, execution packet, write authorization, readback proof, or promotion gate. PM mainline must explicitly accept, repair, block, or reject any lane before it changes routing or coverage status.
