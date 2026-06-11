# A2 Operator Value Intake Stopline Preparation Alignment Copy Guard

Status: a2_operator_value_intake_stopline_preparation_alignment_copy_guard_ready

## Scope

This A2 copy guard supports PM mainline work for the TWII operator value intake stopline preparation alignment gate. It is copy-only, local-only, placeholder-only, and fail-closed.

The phrase `operator value intake stopline preparation alignment` means the project may describe the shape of a future operator intake stopline, but must not imply that any real operator value, authorization, confirmation phrase, execution switch, Supabase write, or market-data promotion has occurred.

## safe wording

- The system is preparing a bounded operator value intake stopline.
- The current state is a preparation alignment gate, not an execution gate.
- Operator-provided values remain external-only until explicitly provided through the approved process.
- Public runtime remains mock-backed while preparation gates are reviewed.
- `publicDataSource=mock`
- `scoreSource=mock`

## forbidden wording

Do not use wording that implies any of the following:

- Already received real values.
- Already authorized.
- Already Go.
- Already executed.
- Supabase already written.
- Real data already online.
- Legal approval completed.
- Investment advice.
- Tradable signal.

Forbidden examples include statements equivalent to: real TWII rows are loaded, the operator approved execution, the write path is live, the site is using real market data, legal has cleared the release, or users can trade based on the signal.

## public copy rule

Public-facing copy must stay conservative and user-safe. It may say the product is preparing for real-data readiness, but it must not say or imply that real-data ingestion, Supabase write closure, TWII row acceptance, or runtime promotion has happened.

Public copy must preserve:

- `publicDataSource=mock`
- `scoreSource=mock`
- No investment advice.
- No tradable signal.
- No promise of complete or timely market data.

## internal operator copy rule

Internal operator copy may describe placeholders and required fields, but only as field-name-only, presence-only preparation. It must not include actual secret values, env values, authorization values, confirmation phrases, real decision values, raw payloads, row payloads, stock-id payloads, or market data.

Internal operator copy must make clear that blocked state remains active until PM separately verifies all required stoplines and proof placeholders.

## hard boundaries

- Do not run SQL.
- Do not connect to Supabase.
- Do not read secret/env/authorization/confirmation phrase/real decision values.
- Do not fill in real values.
- Do not fetch market data.
- Do not read raw/row/stock-id payload.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not accept candidate rows.
- Do not do row coverage scoring.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## PM integration notes

- PM can cite this file as the A2 copy guard for `operator value intake stopline preparation alignment`.
- PM should reject any runtime, report, gate, or public copy that suggests authorization, Go, execution, Supabase writes, real-data online status, legal approval, investment advice, or tradable signals.
- PM should keep the next gate wording aligned with fail-closed preparation language until a separate authorized process supplies external-only values and all proof placeholders are reviewed.
