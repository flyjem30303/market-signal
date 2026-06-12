# TWII Operator Readonly Decision Packet No-Execution

Status: `twii_operator_readonly_decision_packet_ready_no_execution`

Date: 2026-06-13

Owner: PM mainline

Support lanes:

- A1 Data / Source / Coverage
- A2 Public Copy / Product Safety

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This packet converts the accepted A1 TWII exact source-rights and field-contract evidence into an operator-visible decision shape for a future bounded readonly attempt.

It does not execute the attempt. It does not read from Supabase. It does not call TWSE OpenAPI. It does not fetch, store, print, or commit market rows. It only names what a future operator decision must contain before PM may prepare a separate execution packet.

## Source Evidence Dependency

Required source evidence packet:

- `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md`

Accepted evidence status:

- `a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch`

Accepted PM classification:

- `twii_exact_source_rights_and_field_contract_evidence_ready_for_pm_review_not_execution`

Reference evidence used by the packet:

| Evidence area | Required value |
| --- | --- |
| Primary source page | `https://data.gov.tw/en/datasets/11755` |
| Source label | `Weighted Stock Price Index Historical Data` |
| License reference | `Open Government Data License, version 1.0` |
| Charge reference | `free` |
| Cadence reference | `Every day` |
| OpenAPI metadata reference | `https://openapi.twse.com.tw/v1/swagger.json` |
| Runtime source posture | `mock` |
| Runtime score posture | `mock` |

## Future Operator Decision Shape

A future operator decision must explicitly choose one of these decisions:

| Decision | Meaning | PM route |
| --- | --- | --- |
| `authorize_one_bounded_readonly_attempt` | Allow exactly one server-side bounded readonly reachability/count attempt after separate execution packet review. | `prepare_separate_twii_readonly_execution_packet_no_write` |
| `request_evidence_repair` | Evidence is not sufficient; A1 must repair the packet before any attempt can be considered. | `return_to_a1_exact_twii_evidence_repair_no_fetch` |
| `defer_readonly_attempt` | Keep runtime mock-only and do not prepare execution. | `continue_public_beta_runtime_mock_readability` |

The operator decision must include all fields below:

| Field | Required meaning |
| --- | --- |
| `operatorDecision` | One of the three explicit decisions above. |
| `sourceEvidencePacket` | Must equal `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md`. |
| `sourceEvidenceStatus` | Must equal `a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch`. |
| `readonlyScope` | Must be `TWII index baseline aggregate reachability/count only`. |
| `attemptLimit` | Must be `one`. |
| `writePermission` | Must be `false`. |
| `rawPayloadOutput` | Must be `false`. |
| `rowPayloadOutput` | Must be `false`. |
| `stockIdRowListOutput` | Must be `false`. |
| `publicDataSourcePromotion` | Must be `false`. |
| `scoreSourcePromotion` | Must be `false`. |
| `postRunReviewRequired` | Must be `true` before any result can affect later PM routing. |

## Execution Still Blocked

This packet is decision-shape only. Even if a future operator chooses `authorize_one_bounded_readonly_attempt`, PM must still prepare a separate execution packet and post-run review contract before any remote action.

Current executable status:

- `operatorDecisionAcceptedNow=false`
- `executionPacketPreparedNow=false`
- `runnerExecutableNow=false`
- `readonlyAttemptExecutableNow=false`
- `sqlExecutableNow=false`
- `supabaseWriteAllowedNow=false`
- `sourcePromotionAllowedNow=false`
- `scorePromotionAllowedNow=false`

## A1 Assignment

A1 next task:

`prepare_twii_readonly_execution_packet_prerequisites_if_operator_authorizes_later`

A1 must keep its output:

- local-only,
- no-fetch,
- no-secret,
- field-name-only,
- aggregate-only,
- no row payloads,
- no source payloads,
- no endpoint responses.

## A2 Assignment

A2 next task:

`prepare_twii_operator_decision_public_copy_guard_if_pm_requests`

A2 may draft public/internal wording that explains the source-attribution and cadence state, but A2 must not claim:

- real-time data,
- real data activation,
- source-rights approval,
- official endorsement,
- complete row coverage,
- buy/sell advice,
- `publicDataSource=supabase`,
- `scoreSource=real`.

## PM Next Route

PM next route:

`review_operator_readonly_decision_packet_then_wait_for_explicit_operator_decision`

Allowed PM action after this packet:

- display or record that TWII readonly decision shape is ready;
- ask for or receive a later explicit operator decision;
- prepare a separate execution packet only after a future accepted decision.

Blocked PM action after this packet:

- execute readonly attempt now;
- connect to Supabase now;
- call TWSE OpenAPI now;
- fetch market data now;
- write Supabase now;
- mutate `daily_prices`;
- award row coverage points;
- promote public source;
- promote score source.

## Hard Stop Lines

This packet does not authorize:

- SQL execution,
- Supabase connection,
- Supabase reads,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- endpoint probe,
- OpenAPI call,
- CSV download,
- market-data fetch,
- market-data ingest,
- market-data storage,
- market-data commit,
- runner execution,
- parser execution,
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
- official endorsement claims,
- investment advice claims.

## Completion Definition

This packet is complete when:

- exact source evidence dependency is named;
- all allowed operator decisions are named;
- future decision fields are named;
- current executable status remains false;
- A1 and A2 next tasks are named;
- PM next route is named;
- hard stop lines are explicit;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
