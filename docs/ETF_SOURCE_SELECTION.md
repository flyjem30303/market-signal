# ETF Source Selection

Status: blocked

Purpose:

- Choose ETF-specific data sources before ingestion begins.
- Avoid treating ETF quote data as enough for public ETF interpretation.
- Keep Taiwan-first execution compatible with future global ETF coverage.

## Current Decision

No ETF-specific source is approved.

ETF ingestion remains blocked until a source passes product, investment,
technical, and legal review.

## Minimum Required Fields

```text
fund_category
tracking_index
issuer
expense_ratio
aum
nav
premium_discount
tracking_difference
distribution_frequency
constituent_count
top_holdings
```

## Candidate Source Types

### TW Official Sources

Use for Taiwan ETF wedge if coverage, licensing, and update cadence are
confirmed.

Current research surfaces:

```text
TWSE ETF overview
TWSE ETF daily trading data
TWSE ETFortune market overview
TWSE ETFortune ETF detail pages
```

Decision needs:

```text
field coverage
official source URL
license / terms
update cadence
historical availability
automation reliability
```

### Issuer Official Pages

Useful for holdings and fund profile data, but each issuer may have different
formats and terms.

Decision needs:

```text
issuer coverage
normalization effort
terms of use
redistribution limits
format stability
```

### Paid Market Data Vendor

Potential long-term route for global ETF expansion.

Decision needs:

```text
cost
redistribution rights
global coverage
API reliability
historical depth
support SLA
```

## Gate

The source gate is stored at:

```text
data/source-gates/etf-source-gate.json
```

Validate it with:

```bash
npm run check:etf-source-gate
```

ETF source due diligence is stored at:

```text
data/source-gates/etf-source-due-diligence.json
```

Validate it with:

```bash
npm run check:etf-due-diligence
```

Generate a CEO-readable report with:

```bash
npm run report:etf-source
```

Internal browser view:

```text
/internal/etf-source-readiness?token=your-local-token
```

Current expected status:

```text
blocked
```

This is intentional until a source is approved.

## Approval Requirements

ETF source approval requires:

1. A / PM + Developer confirms ingestion feasibility.
2. C / Investment Advisor confirms the fields support ETF-specific analysis.
3. D / Legal confirms usage and redistribution terms.
4. E / CEO approves internal ingestion.

Approval still does not approve public ETF interpretation.
