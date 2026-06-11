# A1 Public Beta Data Realization Gap Map

Status: a1_public_beta_data_realization_gap_map_ready

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This local-only A1 Data / Supabase / Market Evidence packet maps the public beta phase two data-realization gaps for the coverage universe PM wants to expose on public pages.

This document is for PM integration planning only. It does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, raw payload handling, secret access, candidate row acceptance, public real-data promotion, or `scoreSource=real`.

## Coverage Universe

Public beta phase two coverage universe:

- TWII
- ETF
- listed companies / individual stocks
- sector
- industry
- volatility
- capital flow
- moving average
- momentum

## Data Realization Gap Map

| Data class | public user meaning | current repo status | source rights status | Supabase readiness | ingestion/backfill readiness | display readiness | gap | next PM action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TWII | Gives users the broad Taiwan market reference point for index pressure, market trend, and dashboard context. | Existing A1 packets define TWII as a priority lane, but public runtime remains mock and no real public value is accepted here. | Not accepted for public beta real display in this packet; source, field contract, attribution, and redistribution/display scope still need separate acceptance. | Not ready for public use; no connection, schema write, staging, or `daily_prices` mutation is authorized by this packet. | Not ready; candidate artifact and backfill route remain separate gated work and are not accepted here. | Mock display can be integrated with clear simulated labeling; real TWII display is blocked. | Need accepted source rights, field mapping, timezone/session handling, missing-row rules, attribution, cadence, and public display wording. | Integrate TWII mock shell and readiness badge first; request a separate A1/D source-rights acceptance packet before any real display claim. |
| ETF | Helps users compare index pressure with investable market proxies without implying NAV, holdings, or product advice coverage. | ETF source-rights planning exists, but public beta remains mock and ETF real values are not accepted here. | Not accepted; PM still needs market-price scope, redistribution terms, attribution, and exclusion wording for NAV/holdings/premium if out of scope. | Not ready; no Supabase read/write route is approved for ETF public real values. | Not ready; no ETF ingestion or backfill may start from this packet. | Mock ETF cards and comparison copy are display-ready if labeled simulated; real display is blocked. | Need eligible ETF universe, source rights, pricing field contract, cadence, attribution, and excluded-data boundaries. | Add ETF mock comparison panel with "simulated ETF proxy" wording; keep a visible real-data-blocked status. |
| Listed companies / individual stocks | Lets users understand whether broad pressure comes from specific listed names without turning the surface into stock-picking advice. | Repo has coverage-planning concepts, but no public real individual-stock lane is accepted here. | Not accepted; individual security data rights, symbol universe, attribution, and redistribution scope remain unresolved. | Not ready; no stock-level Supabase rows, staging rows, or write/read promotion are authorized. | Not ready; no symbol backfill, raw payload intake, or candidate acceptance may happen here. | Mock examples can support UI behavior; real company/stock values are blocked. | Need symbol universe rules, exchange/source rights, corporate action handling, delayed-data wording, and public display limits. | Use aggregate or anonymized mock examples first; avoid naming real securities as current market evidence until rights are accepted. |
| Sector | Helps users see whether market pressure is concentrated or broad across major groups. | Sector dashboard requirements exist as mock-friendly planning; real taxonomy and membership are not accepted here. | Not accepted; sector taxonomy, membership source, aggregation rights, and display permission are pending. | Not ready; no sector aggregation rows or real Supabase-backed surface are authorized. | Not ready; sector membership and historical aggregation backfill are blocked until rights and method are accepted. | Mock sector breadth/concentration display is ready with simulated labels; real sector display is blocked. | Need accepted taxonomy, constituent membership rules, source rights, aggregation method, cadence, and label wording. | Integrate mock sector breadth and concentration states as an explanatory layer; ask A1 to prepare a taxonomy decision packet later. |
| Industry | Gives users a more granular pressure view than sector, useful for explaining which business clusters are driving movement. | Industry lane is not a confirmed real-data lane in the current public beta packet. | Not accepted; industry taxonomy, mapping source, and public redistribution/display rights are unresolved. | Not ready; no industry-level rows, views, or Supabase mutations are approved. | Not ready; no mapping or backfill should run before taxonomy and rights are accepted. | Mock industry labels can be used for layout testing only; real industry display is blocked. | Need industry taxonomy owner, mapping rules, overlap policy with sectors, source rights, and public label constraints. | Keep industry as a secondary mock drilldown or disabled/future badge; do not make it a phase-two dependency for first public integration. |
| Volatility | Explains whether market movement is calm, normal, elevated, or unstable without requiring users to read raw price history. | Volatility is identified as a dashboard indicator, but real derived signal publication is not accepted here. | Not accepted; derived-indicator display rights depend on accepted underlying price sources and calculation contract. | Not ready; no real volatility output should be stored, queried, or promoted from Supabase by this packet. | Not ready; no historical window backfill or calculation job is authorized. | Mock volatility state is display-ready if labeled simulated and non-investment; real state is blocked. | Need source lane, lookback window, formula, missing-session handling, derived-display rights, thresholds, and risk wording. | Integrate a mock volatility state chip and explanation copy; keep formula and thresholds behind a readiness note. |
| Capital flow | Shows whether money movement appears supportive, neutral, or under pressure at an aggregate level. | Capital flow exists as a desired public indicator, but source lane and real scope are not accepted. | Not accepted; source availability, licensing/public terms, redistribution, and derived-display rights are pending. | Not ready; no capital-flow Supabase table/view or write route is authorized. | Not ready; no ingestion/backfill route can be started without source approval. | Mock capital-flow copy can be displayed as simulated; real flow signal is blocked. | Need source owner, field definition, cadence, aggregation rules, display rights, attribution, and source-gap wording. | Use a mock "flow pressure" placeholder only if it is clearly simulated; PM should prioritize source-rights review before promising this panel. |
| Moving average | Helps users understand whether an index, ETF proxy, sector, or aggregate universe is above, near, or below trend. | Moving average is a derived indicator in planning; real calculation remains blocked by underlying source acceptance. | Not accepted; derived display requires accepted price source rights and calculation/display permission. | Not ready; no real moving-average values should be written, read, or promoted. | Not ready; no historical price backfill or rolling-window job is authorized here. | Mock moving-average status is display-ready with simulated labeling; real display is blocked. | Need accepted source lane, lookback windows, precision, correction policy, missing-session handling, and public derived-signal wording. | Integrate mock trend-position badge and user meaning copy; defer real calculation until TWII/ETF/sector source lanes are accepted. |
| Momentum | Summarizes whether direction is strengthening, weakening, fading, or mixed. | Momentum is a planned derived signal; current scoring and public data source stay mock. | Not accepted; underlying source rights and public derived-signal permission are unresolved. | Not ready; no momentum row, signal, score, or Supabase-backed output is authorized. | Not ready; no formula run, backfill, or real score promotion may happen here. | Mock momentum display is ready if labeled simulated; real display is blocked. | Need formula, lookback window, source-rights coverage, missing-data rules, threshold wording, and non-advice copy. | Add mock momentum badge/explanation to public UI first; PM should avoid using momentum as a real decision input. |

## Hard Stops / Forbidden Zones

- no SQL
- no Supabase writes
- no Supabase connection attempt
- no staging rows
- no `daily_prices` mutation
- no raw payload
- no secrets
- no market data fetch
- no market data ingest
- no candidate row acceptance
- no `publicDataSource=supabase`
- no `scoreSource=real`

## PM Integration Notes

The three best first integrations for the public pages do not need 100% real-data coverage:

| Priority | PM integration item | Why it can go first |
| --- | --- | --- |
| 1 | Coverage readiness matrix | A public-facing or internal-public-beta matrix can show each lane as `mock_ready` or `real_blocked`, giving users and reviewers transparency without claiming real market evidence. |
| 2 | Mock indicator shells for TWII, ETF, sector, volatility, moving average, and momentum | These panels teach the product shape and user meaning while preserving `publicDataSource=mock` and `scoreSource=mock`. |
| 3 | Source-rights / data-readiness disclosure strip | A compact disclosure can explain simulated data, pending source rights, and non-investment status across the public page before any real values are available. |

PM should not wait for complete real coverage before integrating the explanatory shell. PM should wait for separate accepted gates before showing real values, running ingestion/backfill, writing Supabase rows, mutating `daily_prices`, or promoting scores.

