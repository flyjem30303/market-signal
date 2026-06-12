# A1 ETF Market Price Field Contract No-Fetch

Updated: 2026-06-13

Status: `a1_etf_market_price_field_contract_no_fetch_ready`

Owner: A1 Data / Source / Coverage support lane

Scope: `etf_market_price_field_contract_without_market_row_fetch`

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## 1. Purpose

This packet turns the accepted ETF market-price-only scope into a field contract that PM can later use for runtime labels, synthetic fixtures, and a separate promotion gate.

It is planning-only. It does not contain ETF market rows, source payloads, endpoint responses, candidate rows, Supabase records, secrets, NAV values, holdings, premium-discount values, or issuer factsheet content.

## 2. Target Instruments

Initial public Beta ETF context remains limited to:

- `0050`
- `006208`

These instruments remain mock runtime anchors only. This contract does not prove complete ETF coverage and does not award ETF row coverage points.

## 3. Minimum Market-Price Field Contract

Future ETF daily market-price rows may only be shaped after source-rights and promotion gates pass. The minimum normalized contract is:

| Normalized field | Required | Expected shape | Public meaning | Fail-closed rule |
| --- | --- | --- | --- | --- |
| `symbol` | yes | string, one of `0050` or `006208` for the initial scope | Identifies which ETF context card the row belongs to. | Reject rows outside the approved ETF scope. |
| `displayName` | yes | string, public label only | Helps users recognize the ETF; it is not an endorsement. | Reject blank labels. |
| `assetClass` | yes | string, exactly `ETF` | Separates ETF from index and listed-equity lanes. | Reject non-ETF values. |
| `exchange` | yes | string, Taiwan exchange label | Shows the market venue context. | Reject blank or ambiguous exchange labels. |
| `currency` | yes | string, expected `TWD` | Keeps price interpretation explicit. | Reject unknown currency. |
| `sessionDate` | yes | ISO date string `YYYY-MM-DD` | The trading session represented by the row. | Reject invalid dates or future dates. |
| `closePrice` | yes | finite positive number | Daily after-close market price. | Reject missing, zero, negative, or non-numeric values. |
| `priceChange` | no | finite number | Daily price movement if the source provides it. | If missing, do not infer unless a separate formula gate exists. |
| `changePercent` | no | finite number | Daily percentage movement if the source provides it. | If missing, do not infer unless a separate formula gate exists. |
| `volume` | no | non-negative finite number | Trading activity context only. | If missing, mark activity context unavailable. |
| `turnover` | no | non-negative finite number | Turnover context only. | If missing, mark turnover context unavailable. |
| `sourceName` | yes | string | Names the source family without exposing credentials or raw payloads. | Reject blank source names. |
| `sourceUrlLabel` | yes | string label, not raw payload | Lets public copy attribute the source family. | Reject copied raw payload URLs with query secrets. |
| `sourceUpdatedAt` | yes | ISO datetime or accepted source timestamp label | Shows when the source was last checked or published. | Reject absent source update metadata. |
| `sourceCadence` | yes | string, expected daily after close | Prevents real-time precision claims. | Reject wording that implies tick-level or second-level real-time data. |

## 4. Quality And Session Policy

The future ETF adapter must keep these controls explicit:

| Policy | Required state | Rule |
| --- | --- | --- |
| `missingSessionPolicy` | required | Missing sessions stay missing; do not synthesize close prices. |
| `revisionPolicy` | required | Revisions must be recorded as source updates, not silent overwrites. |
| `duplicateDatePolicy` | required | Duplicate `symbol` + `sessionDate` rows fail closed before runtime use. |
| `failClosedPolicy` | required | Any required-field failure blocks the row and must not promote public data. |
| `attributionPolicy` | required | Public copy may name the source family only after source-rights review allows it. |
| `retentionPolicy` | required before real use | Storage duration and deletion rules must be accepted before any persistence. |

## 5. Explicit Exclusions

This contract excludes:

- NAV;
- holdings or constituents;
- premium / discount;
- intraday iNAV;
- distribution or dividend schedules;
- issuer factsheet text;
- ETF recommendation ranking;
- ETF buy, sell, overweight, underweight, or target-price language;
- any formula that derives unavailable fields without a separate formula gate.

## 6. Current Readiness

Current status:

- ETF source-rights status: `checking`
- ETF redistribution status: `not_approved`
- ETF market-price field contract: `draft_ready_no_fetch`
- ETF row coverage credit: `blocked`
- ETF runtime posture: `mock_only`
- ETF public source promotion: `blocked`

PM may use this packet to prepare runtime copy and synthetic adapter cases.

PM may not use this packet to fetch ETF rows, accept ETF candidate rows, write Supabase, update `daily_prices`, claim ETF real data, claim complete ETF coverage, display NAV, display holdings, display premium-discount, set `publicDataSource=supabase`, set `scoreSource=real`, or imply investment advice.

## 7. PM Runtime Intake

Recommended PM intake decision:

`accept_a1_etf_market_price_field_contract_no_fetch`

Recommended next PM route:

`prepare_etf_market_price_synthetic_fixture_no_fetch`

Recommended next A1 route:

`prepare_etf_market_price_synthetic_contract_cases_no_fetch`

Recommended next A2 route:

`review_etf_market_price_field_contract_public_copy_safety`

## 8. Hard Boundaries

This artifact does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- ETF market-row fetch, ingestion, storage, output, or commit;
- ETF raw payload output;
- ETF endpoint output;
- ETF candidate row acceptance;
- ETF row coverage points;
- NAV display;
- holdings display;
- premium-discount display;
- source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## 9. Completion Evidence

This artifact is complete when a checker proves:

1. target instruments `0050` and `006208` are present;
2. required normalized fields and optional fields are listed separately;
3. missing-session, revision, duplicate-date, and fail-closed policies are explicit;
4. NAV, holdings, premium-discount, intraday iNAV, distributions, factsheet text, and recommendation language are excluded;
5. runtime remains `publicDataSource=mock` and `scoreSource=mock`;
6. PM/A1/A2 next routes are named;
7. the artifact is registered in `package.json` and `scripts/check-review-gates.mjs`.
