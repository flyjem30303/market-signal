# A1 Exact Source-Rights Evidence Intake Command Map

Status: `a1_exact_source_rights_evidence_intake_command_map_ready_local_only_not_filled`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integrator: PM mainline

## CEO Decision

CEO converts the current A1 next action into an exact intake command map so PM can keep the Beta mainline moving while A1 collects the narrow evidence that is still blocking `TWII` and ETF coverage.

This map refines `docs/A1_SOURCE_RIGHTS_NEXT_ACTION_REPORT.md` and `docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md`. It does not replace either packet; it names the precise evidence slots, accepted/rejected recording shape, and next gate routing before any candidate artifact or real-data promotion work.

## Current Baseline

- Current PM route: `keep_beta_mainline_moving_and_assign_a1_exact_twii_etf_source_rights_evidence_intake`.
- MVP coverage baseline: `182/360`.
- TW equity: `180/180`.
- `TWII`: `0/60`, missing `60`.
- ETF: `2/120`, missing `118`.
- Runtime boundary: `publicDataSource=mock`.
- Score boundary: `scoreSource=mock`.

## Exact A1 Intake Slots

### TWII

A1 must provide one no-secret summary or `unavailable` classification for each slot:

| Slot id | Required evidence | PM accepted meaning |
| --- | --- | --- |
| `vendor-terms-evidence` | Vendor or official terms allow internal analytical use, storage, retention, attribution, and delayed/missing data wording for index daily values. | PM may consider a separate TWII source-rights outcome gate. |
| `internal-feed-owner-evidence` | Internal owner confirms the approved feed, permitted use, storage scope, retention duty, and redistribution boundary. | PM may route to the approved internal-feed branch. |
| `field-contract-evidence` | Allowed index daily fields, nullable fields, trading-calendar/session rule, and derived validation policy are explicit. | PM may decide whether the candidate artifact shape is buildable. |
| `asset-mapping-evidence` | Index symbol mapping and any stock-id / market-id references are summarized without exposing stock id payloads or raw source payloads. | PM may decide whether `TWII` can reach a sanitized candidate-artifact gate. |

### ETF

A1 must provide one no-secret summary or `unavailable` classification for each slot:

| Slot id | Required evidence | PM accepted meaning |
| --- | --- | --- |
| `etf-legal-use-evidence` | Source owner and legal use terms for ETF market-price data are explicit. | PM may compare source lanes without approving ingestion. |
| `etf-redistribution-evidence` | Redistribution, screenshots, exports, downstream copies, public display, and API reuse limits are explicit. | PM may classify whether public Beta can later display derived ETF data. |
| `etf-attribution-retention-evidence` | Attribution text, delay wording, retention window, and deletion duties are explicit. | PM may prepare route-local public-copy and retention requirements. |
| `etf-derived-analysis-rate-limit-evidence` | Derived analysis permission, rate limits, outage behavior, and validation limits are explicit. | PM may decide whether a bounded candidate artifact gate is safe. |
| `etf-field-contract-evidence` | Market-price OHLCV/turnover scope, NAV/premium/discount/holding scope, and issuer metadata boundaries are explicit. | PM may decide whether ETF candidate rows can be shaped without raw payloads. |
| `etf-source-comparison-evidence` | Compare `TWSE official ETF disclosures`, `Issuer official ETF pages`, and `Paid market data vendor` with blocked/accepted/repair-needed outcome. | PM may choose the first acceptable source lane or keep ETF blocked. |

## Accepted / Rejected Recording Shape

A1 evidence summaries must use this shape in a future local evidence record or handoff:

```json
{
  "slotId": "vendor-terms-evidence",
  "lane": "TWII",
  "classification": "accepted | rejected | needs_bounded_repair | blocked | unavailable",
  "safeEvidenceSummary": "No secrets, no raw payloads, no row payloads.",
  "sourceReferenceLabel": "no-secret-label-or-url-only-if-public",
  "pmQuestionResolved": true,
  "remainingRisk": "short no-secret risk note",
  "nextGateCandidate": "twii_source_rights_outcome_gate | etf_source_rights_outcome_gate | blocked"
}
```

The record must not include copied source bodies, secrets, raw payloads, row payloads, stock id payloads, service-role material, SQL snippets, or Supabase URLs.

## PM Acceptance Rule

PM may open a later source-rights outcome gate only if:

1. every required slot for the selected lane is classified `accepted` or has an explicit accepted fallback;
2. storage, retention, attribution, delayed/missing wording, redistribution/display boundary, rate limits, field contract, and derived-analysis use are all explicit;
3. the evidence is no-secret and no-payload;
4. the chosen lane does not claim row coverage points, public source promotion, or real score promotion;
5. the next gate is named separately and still defaults to fail-closed.

If any slot is missing, ambiguous, or unsafe, PM must classify the lane as `blocked` or `needs_bounded_repair`.

## Route After A1 Returns Evidence

- If all four TWII slots are accepted, PM may prepare a separate `TWII` source-rights outcome gate.
- If ETF required slots are accepted, PM may prepare a separate ETF source-rights outcome gate.
- If both lanes remain blocked, PM should route to `continue_public_beta_runtime_mainline_mock_visible`, keep Beta deployment/runtime readiness moving, and ask A1 for only the missing slots instead of reopening broad governance.
- If a lane is rejected, PM should record the rejection and choose the other lane or keep public Beta mock-visible.

## Hard Stops

This map does not allow:

- remote source probing;
- market-data fetch;
- market-data ingestion;
- raw market-data storage;
- candidate artifact generation from source data;
- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- row payload output;
- stock id payload output;
- secret output;
- row coverage point award;
- source-rights approval claim;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claim.

## Verification

Use:

- `cmd.exe /c npm run report:a1-exact-source-rights-evidence-intake-command-map`
- `cmd.exe /c npm run check:a1-exact-source-rights-evidence-intake-command-map`

Both commands are local-only and must not connect to Supabase, fetch market data, generate candidate artifacts, print secrets, or mutate data.
