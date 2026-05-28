# CP1 to CP2 Release Checklist

Status: not ready

Purpose:

- Define what must be true before CP1 can move to a CP2 public-data or public-SEO expansion checkpoint.
- Keep internal diagnostics separate from public product behavior.
- Prevent accidental approval of Supabase public UI, ETF ingestion, or real score claims.

## Current Decision

```text
NOT_READY
```

CP1 may continue internal diagnostics and source due diligence. CP2 is not open.

## Required Before CP2 Can Open

### Data Source

- [x] Supabase bootstrap validated.
- [x] Supabase freshness validated.
- [x] Supabase raw market diagnostics validated.
- [x] Public source remains `NEXT_PUBLIC_DATA_SOURCE=mock`.
- [x] Remote Supabase ETF schema validated, if ETF work is in scope.
- [ ] Public Supabase repository contract approved.

### Model And Scores

- [x] Mock score source is explicit.
- [x] Public release gate blocks mock scores.
- [ ] Real scoring model design approved by C / Investment Advisor.
- [ ] Data quality rules approved for public display.
- [ ] Backtest / validation methodology approved.

### ETF

- [x] ETF asset-type policy exists.
- [x] ETF schema exists in repo.
- [x] ETF source gate exists.
- [x] ETF due-diligence gate exists.
- [ ] ETF source approved.
- [ ] ETF ingestion validated.
- [ ] ETF scoring reviewed.
- [ ] ETF legal disclosure approved.

### Legal And Disclosure

- [x] Internal routes are protected and noindex.
- [x] Internal route exposure guard passes.
- [ ] Public real-data disclosure approved.
- [ ] Public ETF disclosure approved, if ETF work is in scope.
- [ ] Source licensing / redistribution review approved.

### Product And UX

- [x] Internal diagnostics console exists.
- [ ] Public UI copy for real raw data vs model interpretation approved.
- [ ] Public UI state for stale / partial / unavailable real data approved.
- [ ] SEO expansion reviewed by B / Marketing and D / Legal.

## Current Blocking Gates

```text
ETF source gate: blocked
ETF due-diligence gate: blocked
Public release gate: blocked
NEXT_PUBLIC_DATA_SOURCE=supabase: not approved
```

## CEO Rule

Do not open CP2 until:

```text
npm run check:review-gates
npm run check:cp1-to-cp2
```

both pass with CP2 status `ready`.
