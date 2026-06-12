# A1 TWII Bounded Readonly Gate Candidate Requirements No-Execution

Status: `a1_twii_bounded_readonly_gate_candidate_requirements_ready_no_execution`

Date: 2026-06-12

Owner: A1 Data / Source / Coverage support lane

Integration owner: PM mainline

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This packet defines the smallest PM-reviewable requirement set before any later TWII bounded readonly gate can be considered.

It is intentionally not executable. It does not create a runner, connect to Supabase, call an endpoint, read market rows, write rows, or promote public runtime data.

The packet exists so PM can keep moving the BRIEF product/runtime line while A1 prepares a clean decision surface for a future separately named readonly attempt.

## Candidate Gate Shape

| Requirement | Candidate value | PM meaning |
| --- | --- | --- |
| Candidate gate id | `twii_bounded_readonly_gate_candidate_requirements_no_execution` | Planning-only gate, not an attempt. |
| Target lane | `TWII` / `index_baseline` | First index baseline candidate for market atmosphere. |
| Candidate source route | `official_open_data_api` | Open-data route candidate, not website crawling. |
| Target data class | `daily_after_close_index_baseline` | Daily close level only; no intraday promise. |
| Candidate runtime use | `readiness_copy_only` | Public pages may show preparation status only. |
| Current public source | `publicDataSource=mock` | No source promotion in this packet. |
| Current score source | `scoreSource=mock` | No real scoring in this packet. |

## Required Before Any Future Readonly Attempt

| Requirement group | Required evidence before execution | Current state |
| --- | --- | --- |
| Source rights | Exact endpoint terms, automation allowance, storage/display allowance, attribution wording, fair-use posture. | `not_accepted_for_execution` |
| Field contract | `trade_date`, `close_value`, `instrument_code`, `instrument_name`, `source_url_label`, and `source_updated_at` semantics accepted. | `not_accepted_for_execution` |
| Cadence | Daily-after-close schedule, retry cap, cache fallback, missing-session policy, correction policy. | `not_accepted_for_execution` |
| Readonly scope | The future attempt may inspect only metadata or sanitized aggregate readiness, not raw row payloads. | `not_accepted_for_execution` |
| Secret posture | Server-only credential presence may be checked only through safe boolean output. | `not_accepted_for_execution` |
| Output posture | Output must be sanitized aggregate-only and no-secret. | `not_accepted_for_execution` |
| Post-run review | Future attempt must write a post-run review summary before any promotion discussion. | `not_accepted_for_execution` |
| Promotion gate | Public source and real score promotion remain a separate explicit gate. | `blocked_by_design` |

## Future Attempt Minimum Packet Fields

Any later packet that asks for a bounded readonly attempt must name these fields explicitly:

| Field | Required value shape |
| --- | --- |
| `operatorDecision` | `go`, `no_go`, or `repair_required`; default is absent. |
| `authorizationPhrase` | External operator phrase; never stored in source control. |
| `executeSwitch` | Must be `readonly_once`; default is absent. |
| `sourceRoute` | Exact approved route label; no endpoint payload sample. |
| `maxScope` | `metadata_or_sanitized_aggregate_only`. |
| `rawPayloadOutput` | Must be `false`. |
| `rowPayloadOutput` | Must be `false`. |
| `stockIdRowListOutput` | Must be `false`. |
| `supabaseWrite` | Must be `false`. |
| `dailyPricesMutation` | Must be `false`. |
| `publicDataSourcePromotion` | Must be `false`. |
| `scoreSourcePromotion` | Must be `false`. |

## Fail-Closed Requirements

The future readonly gate must fail closed if any of these is missing or ambiguous:

1. exact source route and governing terms,
2. accepted field contract,
3. accepted cadence and missing-session policy,
4. no-secret output contract,
5. no raw payload output contract,
6. no row payload output contract,
7. no Supabase write contract,
8. no `daily_prices` mutation contract,
9. no public source promotion contract,
10. no real score promotion contract,
11. post-run review destination,
12. rollback or disable owner.

## PM Intake Decision

PM may accept this packet only as no-execution planning.

PM-safe intake route:

`accept_twii_bounded_readonly_gate_candidate_requirements_no_execution`

Next PM route:

`surface_bounded_readonly_requirements_as_runtime_readiness_then_wait_for_external_execution_decision`

Next A1 route:

`prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`

Next A2 route:

`review_twii_source_attribution_and_cadence_public_copy_guard`

## Hard Stop Lines

This packet does not authorize:

- SQL execution,
- Supabase connection,
- Supabase reads,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- endpoint probe,
- market-data fetch,
- market-data ingest,
- market-data storage,
- market-data commit,
- runner creation,
- parser implementation,
- candidate market-row artifact generation,
- raw payload output,
- row payload output,
- stock-id row-list output,
- secret output,
- row coverage points,
- public source promotion,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time market-data claims,
- investment advice claims.

## Completion Definition

This packet is complete when:

- future attempt requirement groups are named;
- minimum packet fields are named;
- fail-closed requirements are named;
- PM, A1, and A2 next routes are named;
- no-execution stop lines are explicit;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
