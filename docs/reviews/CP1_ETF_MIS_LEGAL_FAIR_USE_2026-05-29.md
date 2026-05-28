# CP1 ETF MIS Legal / Fair-Use Review

Checkpoint: CP1 Data Trust Checkpoint
Date: 2026-05-29
Trigger: ETF MIS endpoints were discovered and manually smoke-tested.

## A / PM+Dev

The MIS ETF endpoints are technically reachable and parseable in a manual smoke
report, but there is no approved ingestion path. A must keep the reporter
non-ingesting, manual, and outside scheduled gates.

## B / Marketing

No public ETF freshness, source quality, or coverage claim should be made from
MIS payloads. Marketing can only say ETF source diligence is in progress.

## C / Investment

ETF MIS payloads cannot feed scoring, recommendations, or model confidence until
source permissions and field contracts are approved.

## D / Legal

TWSE terms restrict unapproved automated download / scraping. TWSE information
use guidance points applicants toward trading-information rules, contracts, and
fees. D blocks scheduled polling, storage, redistribution, public display, and
commercial use until written permission, contract coverage, or an approved
vendor license exists.

## E / CEO

Technical evidence is useful, but the project will not convert MIS reachability
into product dependency. Keep ETF MIS as a due-diligence artifact only.

## F / Design

No public ETF UI should expose MIS-derived values. Internal tools may show
blocker status and summary validation metadata only.

## Conflicts

```text
Technical availability conflicts with legal / commercial permission.
ETF roadmap desire conflicts with product trust and release risk.
```

## CEO Synthesis

The product must preserve trust before expanding ETF coverage. A reachable
endpoint is not a source license. ETF MIS work remains blocked for ingestion and
public release.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Mark rate-limit / fair-use as blocked.
Mark license / redistribution as blocked.
Document approved-use requirements before adapter design.
Keep smoke reporter manual and non-persistent.
Do not include MIS network checks in review-gates.
```

## Next Implementation Slice

Continue approved Taiwan stock data / public product work, or prepare a TWSE /
vendor permission checklist before any ETF ingestion design.
