# A1 TWII Readonly Execution Packet Prerequisites No-Execution

Status: `a1_twii_readonly_execution_packet_prerequisites_ready_no_execution`

Date: 2026-06-13

Owner: A1 Data / Source / Coverage support lane

Integration owner: PM mainline

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This A1 packet defines the prerequisite shape for a future TWII readonly execution packet if, and only if, a later explicit operator decision chooses `authorize_one_bounded_readonly_attempt`.

This packet does not execute the attempt, does not connect to Supabase, does not call TWSE OpenAPI, does not fetch market rows, does not store source payloads, and does not promote public runtime data.

## Required Upstream Packets

All upstream packets must remain accepted before PM may prepare a separate execution packet:

| Upstream packet | Required status |
| --- | --- |
| `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md` | `a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch` |
| `docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md` | `twii_operator_readonly_decision_packet_ready_no_execution` |

The future operator decision must be separately accepted and must select:

`authorize_one_bounded_readonly_attempt`

If the decision is `request_evidence_repair` or `defer_readonly_attempt`, this prerequisite packet must not route to execution-packet preparation.

## Future Execution Packet Required Fields

If PM later prepares a separate execution packet, A1 expects these fields to exist before any remote action can be reviewed:

| Field | Required value or rule |
| --- | --- |
| `attemptName` | `twii_one_bounded_readonly_attempt` |
| `scope` | `TWII index baseline aggregate reachability/count only` |
| `attemptLimit` | `1` |
| `sourceEvidencePacket` | `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md` |
| `operatorDecisionPacket` | `docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md` |
| `operatorDecision` | `authorize_one_bounded_readonly_attempt` |
| `serverOnlyRuntime` | `true` |
| `sqlExecution` | `false` |
| `supabaseWrite` | `false` |
| `dailyPricesMutation` | `false` |
| `rawPayloadOutput` | `false` |
| `rowPayloadOutput` | `false` |
| `stockIdRowListOutput` | `false` |
| `marketDataFetch` | `false` |
| `publicDataSourcePromotion` | `false` |
| `scoreSourcePromotion` | `false` |
| `postRunReviewRequired` | `true` |

## Readonly Scope Requirements

The future readonly attempt, if separately authorized later, must be bounded to:

- TWII only;
- aggregate reachability and count status only;
- no raw source payload;
- no source row output;
- no stock-id row-list output;
- no candidate row acceptance;
- no row coverage point award;
- no public runtime promotion;
- no real-score promotion.

## Fail-Closed Requirements

The future execution packet must fail closed when any of these are missing:

- accepted exact source evidence packet;
- accepted operator decision packet;
- explicit future operator decision;
- server-only runtime boundary;
- no-write assertion;
- no-SQL assertion;
- no-raw-payload assertion;
- no-row-payload assertion;
- post-run review command;
- rollback/stop instruction;
- sanitized aggregate-only result shape.

## A1 Acceptance Rules

A1 may mark a future execution packet prerequisite review as ready only if:

1. It references this prerequisite packet.
2. It references the accepted evidence packet.
3. It references the accepted operator decision packet.
4. It keeps all payload outputs disabled.
5. It keeps all write, SQL, mutation, promotion, and scoring flags disabled.
6. It requires post-run review before PM may route any result.

A1 must reject or repair the future packet if it:

- allows more than one attempt,
- broadens scope beyond TWII,
- includes raw payloads,
- includes row payloads,
- includes stock-id lists,
- includes candidate row acceptance,
- includes source promotion,
- includes score promotion,
- implies real-time data,
- implies official endorsement,
- implies investment advice.

## PM Route

PM route after accepting this A1 prerequisite packet:

`wait_for_explicit_operator_decision_before_execution_packet`

If a future explicit operator decision is accepted, PM may route to:

`prepare_separate_twii_readonly_execution_packet_no_write`

Until then, PM must keep the public runtime:

- mock-only,
- non-investment-advice,
- source-readiness only,
- not real-time,
- not complete coverage,
- not source-promoted.

## A2 Route

A2 may use this packet to prepare wording for:

`twii_operator_decision_public_copy_guard`

A2 must not describe this packet as execution, data activation, source approval, live data, complete coverage, or investment guidance.

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

This A1 packet is complete when:

- upstream packets are named;
- future execution packet fields are named;
- readonly scope stays aggregate-only;
- fail-closed requirements are named;
- PM and A2 next routes are named;
- hard stop lines are explicit;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
