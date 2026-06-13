# A1 Source Coverage Terms Matrix Handoff No-Fetch

Updated: 2026-06-13

Status: `a1_source_coverage_terms_matrix_handoff_no_fetch_ready_local_only`

Owner: A1 Data / Source / Coverage

Scope: `official_open_free_source_terms_and_coverage_matrix_followup_no_fetch`

## Boundary

This handoff is local-only source and coverage planning. It does not fetch market data, call external endpoints, run SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, print secrets, print row payloads, print stock-id payloads, or change runtime source flags.

Runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`

Primary local evidence anchors:

- `docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md`
- `docs/A1_NO_FETCH_CANDIDATE_ARTIFACT_CONTRACT.md`
- `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md`
- `docs/A1_DATA_COVERAGE_NEXT_BATCH_HANDOFF.md`
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`
- `docs/COVERAGE_UNIVERSE_ROADMAP.md`
- `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json`

## 1. TWII Current Source Condition State

TWII remains the clearest first index lane, but only at the local planning and no-fetch gate layer.

| Item | Current state |
| --- | --- |
| Coverage lane | `TWII` index daily coverage |
| Batch 1 coverage | `0/60` |
| Missing rows | `60` |
| Current candidate source lane | official exchange / official index route candidate |
| Source-rights intake slots | Four TWII no-secret evidence slots recorded as `accepted` for opening the next source-rights gate only |
| Field-contract intake | Accepted for gate planning only, including minimum index fields, calendar/session handling, timezone, precision, optional fields, revision behavior, and `daily_prices` mapping labels |
| Asset mapping intake | Accepted for gate planning only, without row payloads or stock-id payloads |
| Candidate artifact posture | Sanitized aggregate-only contract exists; candidate generation, row acceptance, and writes remain blocked |
| Execution posture | Blocked |

TWII can move to the next PM gate only as a no-fetch source-rights outcome / field-contract confirmation packet. The accepted TWII intake evidence does not authorize market-row retrieval, parser execution against live data, SQL, Supabase access, `daily_prices` mutation, row coverage credit, public data-source promotion, or `scoreSource=real`.

Remaining TWII confirmations before any future execution packet:

- official terms source, terms version, or governing dataset notice;
- automated scheduled access allowance;
- internal storage and retention allowance;
- public display, redistribution, export, and downstream-copy boundaries;
- attribution wording;
- rate / fair-use / retry boundary;
- final field contract for index close, date/session, timezone, precision, correction/revision, and missing-session policy;
- no-secret post-run review and aggregate readback shape.

## 2. ETF And Listed-Stock Legal Source Gaps

ETF and listed-stock coverage should not be treated as solved by the TWII intake state. Each source lane still needs its own legal/free/automation confirmation.

| Lane | Current coverage state | Candidate legal/free sources | Missing legal confirmation |
| --- | --- | --- | --- |
| `0050` ETF | `1/60`, missing `59` rows | TWSE official ETF surface, issuer official pages, licensed vendor fallback | ETF legal use, redistribution/display, attribution, retention, derived analysis, rate/fair-use, field contract, and source-lane comparison remain pending |
| `006208` ETF | `1/60`, missing `59` rows | TWSE official ETF surface, issuer official pages, licensed vendor fallback | Same blocker set as `0050`; ETF market price must stay separate from NAV, premium/discount, holdings, and issuer metadata unless PM opens separate field-contract gates |
| Listed-stock Level 1 anchors: `2330`, `2382`, `2308` | TW equity sub-scope is already recorded as `180/180` in local coverage gates | Existing accepted bounded lane evidence for current scope only | Does not prove all-listed source rights, broad redistribution, public API reuse, or future batch ingestion rights |
| Future TWSE listed common stocks | Level 2 roadmap item, not part of current `360` denominator | TWSE OpenAPI / official public route candidate; TWSE official public download/page fallback | Terms location/version, automated access, free use, public display, redistribution, attribution, rate/fair-use, field contract, universe manifest, and batch denominator remain unaccepted |
| TPEX / OTC future lane | Future expansion lane | TPEX official public route candidate | Must not inherit TWSE listed-stock terms; needs separate source-rights and field-contract confirmation |

ETF evidence slots in `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` remain `pending`, including legal use, redistribution/display, attribution/retention, derived-analysis/rate-limit, field contract, and source comparison. Therefore ETF candidate generation from source data, ETF market-data fetch, and ETF `daily_prices` repair remain blocked.

For listed stocks, the official open/free matrix identifies TWSE OpenAPI / official public routes as promising candidates, but still only candidates. PM still needs a no-fetch terms and endpoint-contract decision before A1 can propose any broader all-listed batch plan.

## 3. Next PM-Acceptable No-Fetch Gate

Recommended next PM gate:

`accept_a1_no_fetch_source_terms_coverage_gap_gate`

PM may accept this as a local-only gate if it records the following decisions without requesting market-row retrieval:

- TWII route: approve preparation of a no-fetch TWII source-rights outcome and field-contract confirmation packet.
- ETF route: keep `0050` and `006208` blocked until the six ETF evidence slots are answered with no-secret summaries.
- Listed-stock route: keep TWSE OpenAPI / official public route as candidate-only until a terms/version, automation, attribution, redistribution, retention, rate/fair-use, and field-contract packet is accepted.
- Coverage route: keep Level 1 MVP coverage separate from Level 2 all-listed expansion.
- Runtime route: preserve `publicDataSource=mock` and `scoreSource=mock`.

Gate output should be a PM-readable decision record with only these safe fields:

- `targetLane`
- `sourceLaneCandidate`
- `coverageState`
- `sourceRightsStatus`
- `fieldContractStatus`
- `legalFreeAutomationStatus`
- `candidateArtifactStatus`
- `nextAllowedNoFetchPacket`
- `blockedActions`
- `publicDataSource`
- `scoreSource`

The gate must reject any request for SQL, Supabase connection, Supabase write, staging rows, `daily_prices` mutation, source endpoint probing, market-row fetch, raw payload output, row payload output, stock-id payload output, secret output, runtime promotion, row coverage points, or real-score promotion.

## Suggested Next Step

A1 should prepare:

`docs/A1_NO_FETCH_SOURCE_TERMS_COVERAGE_GAP_GATE.md`

That next document should be a short PM decision record template that selects exactly one next no-fetch packet:

1. `twii_source_rights_outcome_field_contract_confirmation_no_fetch`;
2. `etf_source_owner_and_field_contract_questions_no_fetch`;
3. `twse_openapi_listed_stock_terms_endpoint_contract_no_fetch`.

Recommended default: choose TWII first if PM wants to close the smallest Level 1 index gap; choose ETF first if PM wants to follow the existing ETF coverage-completion route; choose listed-stock terms first only if PM is preparing the later Level 2 all-listed expansion.

## A1 Conclusion

The official open/free source matrix is usable as a no-fetch planning artifact, not as ingestion approval. TWII has accepted no-secret intake evidence for the next source-rights gate, ETF remains source-rights blocked, and broader listed-stock coverage still needs formal TWSE terms / endpoint-contract confirmation. The next safe move is a PM-accepted no-fetch source terms coverage gap gate.
