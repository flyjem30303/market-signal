# A1 Public Beta Index Dashboard Indicator Data Requirements

Status: a1_public_beta_index_dashboard_indicator_data_requirements_ready

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This local-only A1 Data / Indicator Contract packet defines indicator data requirements for the first-stage public beta index dashboard closed loop.

Target surface: `public beta index dashboard`

Required planning vocabulary:

- `indicator data requirements`
- `market overview`
- `core indicator panel`
- `alert list`

This document is for PM integration planning only. It does not approve source rights, candidate rows, external fetch, ingestion, SQL, Supabase access, `daily_prices` writes, public data promotion, or real score promotion.

## Integration Rule

PM may integrate mock-only dashboard shells and explanation copy now. PM must keep all real-data lanes blocked until data source rights, data source status, update cadence, mock or real status, public display readiness, and gap resolution are explicitly accepted in a separate gate.

No row-level values, raw market payloads, secrets, authorization material, confirmation phrases, or real decision values are required by this packet.

## Surface Requirement Matrix

| Dashboard surface | indicator name | user meaning | data source status | update cadence | mock or real status | public display readiness | gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| market overview | TWII index state | Gives users a plain-language view of whether the broad Taiwan market is calm, stretched, improving, or weakening. | Source lane and display rights are not confirmed in this packet. | Mock cadence can be daily-session-like; real cadence must wait for accepted source calendar and revision rules. | Mock can be used now; real is blocked. | Mock public display is ready if clearly labeled as simulated. Real public display is not ready. | Confirm TWII source rights, field contract, timezone, missing-session handling, attribution, and delayed/source-gap wording. |
| market overview | ETF market proxy | Helps users compare broad-market pressure against ETF-based investable proxies without implying holdings or NAV coverage. | ETF source and redistribution rights are not confirmed in this packet. | Mock cadence can be daily; real cadence must wait for accepted ETF market-price update rules. | Mock can be used now; real is blocked. | Mock public display is ready with simulated labeling. Real public display is not ready. | Confirm ETF source rights, market-price-only scope, attribution, and whether NAV/premium/holdings are excluded. |
| market overview | sector breadth | Shows whether pressure is concentrated in a few sectors or spread across the market. | Sector taxonomy and source lane are not confirmed in this packet. | Mock cadence can be daily; real cadence must wait for accepted sector membership and price source rules. | Mock can be used now; real is blocked. | Mock public display is ready as a demonstration layer. Real public display is not ready. | Confirm sector definition, symbol membership, source rights, aggregation method, and display limits. |
| core indicator panel | volatility | Explains whether recent market movement is quiet, normal, elevated, or unstable. | Real volatility requires accepted price history source and derived-indicator rights. | Mock cadence can be daily; real cadence must follow accepted session close and revision policy. | Mock can be used now; real is blocked. | Mock public display is ready with non-investment wording. Real public display is not ready. | Confirm price window, calculation method, missing-day handling, rights to publish derived volatility, and risk wording. |
| core indicator panel | capital flow | Indicates whether money movement appears supportive, neutral, or under pressure. | Capital-flow source lane is not confirmed in this packet. | Mock cadence can be daily or weekly-like; real cadence must wait for accepted source frequency. | Mock can be used now as an illustrative placeholder; real is blocked. | Mock public display is ready only if marked as simulated and non-factual. Real public display is not ready. | Confirm eligible source, whether flow data is licensed or public, update timing, redistribution limits, and derived-display rights. |
| core indicator panel | moving average | Helps users understand whether the index or proxy is above, near, or below its medium-term trend. | Real moving average requires accepted TWII, ETF, or sector price source. | Mock cadence can be daily; real cadence must follow accepted session close and correction rules. | Mock can be used now; real is blocked. | Mock public display is ready with simulated labeling. Real public display is not ready. | Confirm source lane, lookback windows, precision, revision behavior, and whether derived moving average display is accepted. |
| core indicator panel | momentum | Summarizes whether short-term direction is strengthening, fading, or mixed. | Real momentum requires accepted price history source and derived-indicator rights. | Mock cadence can be daily; real cadence must wait for accepted source cadence and missing-session rules. | Mock can be used now; real is blocked. | Mock public display is ready with simulated labeling. Real public display is not ready. | Confirm formula, lookback window, source-rights coverage, source-gap wording, and whether public derived signal display is allowed. |
| alert list | TWII threshold alert | Warns users when broad-index state changes enough to deserve attention. | Real alert evaluation requires accepted TWII source and indicator calculation contract. | Mock alerts can refresh with the mock dashboard state; real cadence must match accepted calculation timing. | Mock can be used now; real is blocked. | Mock public display is ready if alerts are explicitly simulated. Real public display is not ready. | Confirm thresholds, real-data source, alert persistence, delayed data wording, and public notification policy. |
| alert list | ETF divergence alert | Highlights when ETF proxy behavior diverges from the broad index or sector view. | Real divergence requires accepted TWII and ETF lanes together. | Mock cadence can be daily; real cadence must wait for both lanes to share accepted timing rules. | Mock can be used now; real is blocked. | Mock public display is ready with simulated labeling. Real public display is not ready. | Confirm cross-lane source rights, synchronization rules, missing-data handling, and wording that avoids investment advice. |
| alert list | sector concentration alert | Tells users when market pressure appears concentrated in one or more sectors. | Real concentration requires accepted sector taxonomy, membership, and price source. | Mock cadence can be daily; real cadence must wait for accepted sector-source update cadence. | Mock can be used now; real is blocked. | Mock public display is ready as a demo alert. Real public display is not ready. | Confirm sector universe, aggregation method, source rights, display rights, and whether sector labels may be public. |
| alert list | volatility alert | Flags when volatility moves from normal to elevated or unstable. | Real alert requires accepted volatility source inputs and derived-indicator rights. | Mock cadence can be daily; real cadence must match accepted volatility calculation timing. | Mock can be used now; real is blocked. | Mock public display is ready with simulated labeling. Real public display is not ready. | Confirm volatility formula, thresholds, historical window, public derived-signal permission, and risk disclosure wording. |

## Mock-Ready Items

The following can be integrated first with `publicDataSource=mock` and `scoreSource=mock`:

| Item | PM integration action | Required label |
| --- | --- | --- |
| market overview shell | Show overall market state, last mock update, and state explanation. | Mock / simulated data only. |
| core indicator panel shell | Show TWII, ETF, sector, volatility, capital flow, moving average, and momentum cards with mock states. | Mock / simulated indicator state. |
| alert list shell | Show generated mock alert examples and empty-state behavior. | Mock / not a real market alert. |
| user meaning copy | Explain each indicator in user-facing language without exposing formulas as real signals. | Educational / non-investment explanation. |
| public display readiness flags | Show whether each panel is mock-ready or real-blocked. | Public beta mock mode. |

## Real-Blocked Items

The following must wait for separate source, rights, and cadence confirmation:

| Blocked item | Why blocked | Required before real display |
| --- | --- | --- |
| TWII real indicator values | Source rights, field contract, and display rules are not accepted by this packet. | Accepted TWII source rights, update cadence, field mapping, attribution, and display limits. |
| ETF real indicator values | ETF source and redistribution scope are not accepted by this packet. | Accepted ETF source rights, market-price scope, excluded NAV/holdings wording, cadence, and attribution. |
| sector real indicator values | Sector taxonomy and source rights are not accepted by this packet. | Accepted sector universe, membership source, aggregation method, cadence, and display rights. |
| volatility real signal | Derived-indicator publication rights and formula are not accepted by this packet. | Accepted calculation contract, lookback window, missing-session rules, and public derived-display permission. |
| capital flow real signal | Source lane, cadence, and redistribution rights are not accepted by this packet. | Accepted capital-flow source, update frequency, redistribution/display permission, and source-gap wording. |
| moving average real signal | Requires accepted underlying price source and derived display rights. | Accepted source lane, lookback windows, precision, correction policy, and display permission. |
| momentum real signal | Requires accepted formula, source lane, and public derived-signal rights. | Accepted formula, lookback windows, missing-data handling, and user-facing risk wording. |
| real alert generation | Alerts would imply real monitoring and must not run from unaccepted data. | Accepted data inputs, thresholds, cadence, persistence, notification wording, and legal/disclosure review. |

## PM Integration Notes

PM integration notes for first-stage dashboard wiring:

| Topic | PM note |
| --- | --- |
| Default runtime | Keep `publicDataSource=mock` and `scoreSource=mock` for the public beta index dashboard first phase. |
| User promise | The first public beta loop may demonstrate how the dashboard behaves, but must not claim real market status. |
| Copy requirement | Every mock panel and alert needs visible mock/simulated wording. |
| Readiness model | Use a per-indicator public display readiness badge: `mock_ready`, `real_blocked_source_rights`, `real_blocked_cadence`, or `real_blocked_display_rights`. |
| Gate separation | This document does not create candidate rows and does not authorize a real-data promotion gate. |
| Data source status | PM should track source lane, rights status, cadence status, attribution wording, and display-readiness status separately. |
| Alert wording | Alerts should be phrased as public beta demo states until real inputs and display permissions are accepted. |
| Next handoff | A later A1 packet can convert this requirements table into a source-by-source evidence checklist, still local-only unless PM separately opens a bounded execution gate. |

## Hard Stops

- Do not execute SQL.
- Do not connect to Supabase.
- Do not read secrets, env files, authorization material, confirmation phrases, or real decision values.
- Do not fetch market data.
- Do not write `daily_prices` or staging rows.
- Do not accept candidate rows.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim real public display readiness before source rights, data source status, update cadence, and display rights are accepted.
