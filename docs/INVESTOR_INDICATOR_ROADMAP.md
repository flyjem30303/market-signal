# Investor Indicator Roadmap

## CEO Decision

The site should become an investor decision-support product, but investor-facing indicators must not be fully implemented before the runtime, data, and source-depth foundation is ready.

This roadmap is a product-direction guard, not a runtime implementation approval.

## C Advisor Assessment

C's professional investment-advisor assessment is:

- The current direction can attract users if the first screen explains market condition, stock health, risk, change, and what to watch next.
- The current foundation is not yet ready for full professional indicator implementation.
- Health score and risk score are attractive only when users can see why the light changed and what remains uncertain.
- Static scores alone are weaker than change detection, risk source explanation, and confidence level.

## Indicator Families To Design Later

These are product targets for later implementation after the foundation is ready:

- Market temperature: market, sector, and major-weight direction.
- Stock health: trend, volume, volatility, fundamentals, and data confidence.
- Risk signal: overheating, weakening trend, data gap, volatility expansion, and source-depth limitations.
- Change detection: better or worse than yesterday, last week, or the last accepted review window.
- Watch-next guidance: what to observe next without creating buy or sell advice.
- Confidence level: whether the available data is strong enough to trust the reading.

## Current Execution Rule

For the current stage, PM and Engineering should continue foundation work:

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not set `scoreSource=real`.
- Do not present real market-data claims.
- Do not implement real investor signals, real advice, or real trading recommendations.
- Do not run SQL or write Supabase as part of this roadmap.
- Keep public UI language readable while moving technical gates and governance detail below the first screen.

## Speed Guard

This roadmap must not slow the project with a new long governance track.

The near-term rule is:

1. Continue runtime foundation and bounded data-readiness work.
2. Keep investor indicator design as a lightweight product backlog.
3. Only implement full indicator families after data source, row coverage, source depth, model credibility, and public claim gates are accepted.
4. Use small wording improvements only when they make the current mock runtime easier to understand.

## CEO Next Slice Preference

The next safe slices should prioritize foundation and runtime clarity:

- Runtime/data foundation: 70%.
- Product readability and indicator wording alignment: 20%.
- Future indicator design notes: 10%.

This ratio can change, but full indicator implementation waits until the foundation is ready.
