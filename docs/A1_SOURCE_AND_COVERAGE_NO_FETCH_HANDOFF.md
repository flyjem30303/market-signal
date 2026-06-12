# A1 Source and Coverage No-Fetch Handoff

Updated: 2026-06-12

Status: `a1_source_and_coverage_no_fetch_handoff_ready_local_only`

Owner: A1 Data / Supabase / Market Evidence

Scope: `continue_data_line_source_and_coverage_without_market_row_fetch`

## 1. Executive Summary for PM

This handoff advances the data line without fetching, storing, committing, or printing market rows.

Recommended PM route:

1. Treat `TWSE OpenAPI / public official route` as the first candidate lane for daily close and daily trading information, but keep it at `terms-and-field-contract-review` until source-rights evidence is accepted.
2. Keep `TWII` as the first coverage-repair lane because it has the largest immediate MVP impact and the clearest 60-session missing window.
3. Keep `0050` and `006208` as ETF fallback lanes after the index lane proves the no-fetch artifact contract and post-run review shape.
4. Split listed-stock universe coverage into batches after PM accepts a no-row universe partition plan; do not generate stock-level row payloads in this handoff.

PM decision needed: `accept_a1_source_and_coverage_no_fetch_route` before asking A1 to prepare the next packet.

No decision needed for runtime promotion: `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## 2. Candidate Data Sources

| Candidate | Intended data | Free | Automated access candidate | Current legal/public-use posture | Decision state |
| --- | --- | --- | --- | --- | --- |
| `TWSE OpenAPI / public official route` | listed stock daily close, daily trading information, index history where route supports it | Candidate yes, pending accepted terms evidence | Candidate yes, pending accepted terms evidence | Not accepted yet; requires terms location, attribution, reuse, rate/fair-use, and redistribution evidence | Priority 1, continue evidence review |
| `TWSE official downloadable/public pages` | daily close and exchange summary artifacts | Candidate yes, but automation and redistribution need evidence | Unclear until terms and access rules are accepted | Not accepted yet; may be UI/download oriented and not safe for unattended automation without proof | Priority 2 fallback |
| `TPEX public official routes` | OTC universe daily close/trading info | Candidate yes, pending route evidence | Candidate yes, pending route evidence | Not accepted yet; keep separate from listed-stock TWSE lane | Priority 3 after listed-stock policy |
| `Vendor / paid data feed` | complete official or licensed market feed | No for current micro-site budget | Yes if contract exists | Out of current plan because chairman has rejected contract/licensing path for now | Do not pursue now |
| `Internal manual feed` | human-collected daily close/trading info | Operationally no, because user does not want manual operation | No reliable automated path | Not aligned with product goal | Do not pursue now |

Conclusion: the highest-value free automated candidate remains official public API/open route evidence, but it is not promoted to runtime until source-rights and field-contract packets are accepted.

## 3. Evidence Still Missing

Minimum evidence before any real row operation can be proposed:

- Terms location and version for each official source lane.
- Clear statement or accepted interpretation for automated access.
- Clear statement or accepted interpretation for redistribution/public display.
- Attribution requirement and user-facing source wording.
- Rate/fair-use boundary.
- Field contract: `trade_date`, close price, trading amount/value/volume if used, timezone, non-trading day behavior.
- Coverage universe definition: listed stocks, ETFs, indices, OTC symbols, excluded instruments.
- Post-run review shape: aggregate readback, duplicate handling, rejected row count, rollback or no-write proof.

This handoff does not claim any candidate is fully accepted for real ingestion.

## 4. Coverage Refill Roadmap

### Batch 0: Runtime and source-rights proof

- Keep public runtime on synthetic/mock surfaces.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Use only contract/synthetic evidence in UI and checks.

### Batch 1: Core MVP coverage

| Lane | Current coverage posture | Next no-fetch action | Promotion blocker |
| --- | --- | --- | --- |
| `TWII` | first repair lane; prior local aggregate indicates `0/60` observed in the Batch 1 readiness packets | Prepare source-rights + field-contract acceptance packet, then bounded one-attempt authorization packet | Terms/automation/redistribution evidence not accepted |
| `0050` | ETF fallback lane; prior local aggregate indicates `1/60` observed | Keep as ETF fallback after TWII packet shape is accepted | ETF source-rights and ETF field contract not accepted |
| `006208` | ETF fallback lane; prior local aggregate indicates `1/60` observed | Keep paired with `0050` for ETF coverage proof | ETF source-rights and ETF field contract not accepted |

### Batch 2: Batch 1 listed stocks

Suggested first listed-stock batch should be small and explainable:

- market-cap leaders already visible in the product mock universe.
- semiconductor and financial representatives.
- high-liquidity symbols only.
- no stock-id payload list in this handoff.

Next packet should define selection rules without printing symbol row payloads.

### Batch 3: Full listed-stock universe

Only after Batch 1 has source-rights, field contract, no-write post-run proof, and PM acceptance:

- partition by exchange/listing status.
- partition by liquidity or market segment.
- define retry/holiday/delist handling.
- keep each execution window bounded.
- keep aggregate-only progress reporting until real ingestion is separately approved.

### Batch 4: ETF and OTC expansion

- ETF lanes require ETF-specific terms and fields.
- OTC lanes require TPEX-specific terms and fields.
- Do not assume TWSE listed-stock permissions cover ETF or OTC lanes.

## 5. Stop Lines

- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch market rows.
- Do not store market rows.
- Do not commit market rows.
- Do not output secrets.
- Do not output raw payload.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not claim source-rights are accepted.
- Do not claim production data coverage is complete.

## 6. PM Decision Packet

Recommended decision:

`accept_a1_source_and_coverage_no_fetch_route`

Meaning:

- PM accepts this as the data-line route map.
- A1 may prepare the next no-fetch packet.
- A1 may not execute market fetches.
- A1 may not run SQL.
- A1 may not connect/write Supabase.
- A1 may not mutate `daily_prices`.
- PM/mainline may continue runtime product work using mock/synthetic source boundaries.

If PM rejects:

- A1 should narrow the source candidates further and produce a source-rights-only comparison.

## 7. Next Recommended A1 Task

`prepare_official_openapi_terms_and_field_contract_evidence_matrix_no_fetch`

Goal:

- Produce a no-fetch evidence matrix for the official public API/open route lane.
- Include terms location, automation allowance, redistribution/public display, attribution, rate/fair-use, and field contract checklist.
- Keep all evidence as links, notes, and aggregate classifications only.
- Do not fetch or store market rows.

Expected output:

- `docs/A1_OFFICIAL_OPENAPI_TERMS_AND_FIELD_CONTRACT_EVIDENCE_MATRIX.md`
- optional checker `scripts/check-a1-official-openapi-terms-and-field-contract-evidence-matrix.mjs`
