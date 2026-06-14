# A3 Phase 1 Public Beta Remote Monitoring Snapshot

Updated: 2026-06-14

Status: `a3_phase_1_public_beta_remote_monitoring_snapshot_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This packet turns the current public Beta URL into a repeatable no-secret monitoring check.

It verifies that the public Vercel alias still serves the Phase 1 index-lighting experience, preserves the revised BRIEF wording, keeps Phase 2 membership as a preview, and does not expose internal launch residue.

This packet does not deploy production, change DNS, mutate environment variables, print secrets, execute SQL, read or write Supabase, fetch market data, or promote real data.

## Default Remote Target

Default base URL:

- `https://market-signal-two.vercel.app`

Override for a future preview or custom domain:

- `PUBLIC_BETA_MONITORING_BASE_URL=https://your-public-beta-url`

## Remote Route Contract

| Route | Required public proof |
| --- | --- |
| `/` | Phase 1 public index-lighting headline, 30-second read promise, 3-minute action judgment, mock/demo data boundary, no individual buy/sell advice. |
| `/briefing` | Daily market briefing, 30-second / 3-minute reading order, demo-data boundary, no buy/sell advice. |
| `/weekly` | Weekly review, next-week risk review, formal data not yet enabled, no buy/sell advice. |
| `/membership` | Phase 2 membership roadmap, not a member entry point, no login, no payment, no persisted watchlist yet. |
| `/stocks/2330` | Representative stock route, 30-second / 3-minute reading order, demo data, no individual buy/sell advice. |
| `/stocks/TWII` | Representative index route, 30-second / 3-minute reading order, demo data, no individual buy/sell advice. |
| `/methodology` | Method explanation, data-quality boundary, formal data not yet enabled, no trade instruction. |
| `/disclaimer` | Risk disclosure, demo-data boundary, no investment advice, no guaranteed outcome. |
| `/terms` | Service terms, information-only positioning, data boundary, user risk responsibility. |
| `/privacy` | Privacy/data explanation, no brokerage credentials, membership data boundary. |
| `/robots.txt` | Public route reachable. |
| `/sitemap.xml` | Public route reachable and includes the membership preview route. |

## Public Residue Stop Lines

The monitor must fail closed if public visible text includes:

- command snippets;
- `PUBLIC_BETA_` or `BETA_` environment variable names;
- internal blocker language;
- workflow proof language;
- raw payload or raw market data language;
- `daily_prices`;
- `publicDataSource`;
- `scoreSource`;
- Supabase or SQL implementation language;
- Git or commit process language;
- operator-only action language;
- rollback instructions presented to public users.

## Runtime Boundary

The monitor must keep reporting:

- `publicDataSource=mock`
- `scoreSource=mock`
- `platformMutationExecuted=false`
- `sqlExecuted=false`
- `supabaseReadOrWriteExecuted=false`
- `marketDataFetched=false`
- `phase2MembershipImplemented=false`

## Command

Run:

- `cmd.exe /c npm run check:a3-phase-1-public-beta-remote-monitoring-snapshot`

For a different public URL:

- `cmd.exe /c "set PUBLIC_BETA_MONITORING_BASE_URL=https://your-public-beta-url&& npm run check:a3-phase-1-public-beta-remote-monitoring-snapshot"`

## Workstream Ownership

| Lane | Responsibility |
| --- | --- |
| PM mainline | Decide keep-open, repair, or pause if the monitor reports a public comprehension regression. |
| A1 | Continue lawful data-source and coverage work; do not promote data source from this monitor. |
| A2 | Repair public trust copy, non-advice wording, data-source wording, and membership boundary wording if the monitor flags a text regression. |
| A3 | Own remote route health, monitoring cadence, rollback readiness, and Vercel/post-deploy smoke records. |
| A4 | Keep Phase 2 membership planning separate from Phase 1 public monitoring. |

## Stop Lines

This packet does not authorize:

- production deploy;
- DNS change;
- production env mutation;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- live official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 login, payment, watchlist persistence, alert execution, or member-only content implementation.

## CEO Recommendation

Use this monitor after every future Vercel deployment and during the first business day of public Beta.

If it passes, A3 can record a keep-open monitoring point under the mock/demo boundary.

If it fails, PM should route the issue to A2 for public copy repair, A3 for route/platform repair, or A4 only if the membership preview is confusing users into thinking Phase 2 is already live.

## 2026-06-14 Monitoring Point

Status: `remote_monitoring_snapshot_passed_after_visual_review_refresh`

Remote target:

- `https://market-signal-two.vercel.app`

Commands run:

- `cmd.exe /c npm run check:a3-phase-1-public-beta-remote-monitoring-snapshot`
- `cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"`
- `cmd.exe /c "set LOCALHOST_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-surface-user-facing-audit"`

Observed result:

- 12 monitoring routes returned safe public results, including `/`, `/briefing`, `/weekly`, `/membership`, representative stock/index routes, legal routes, `robots.txt`, and `sitemap.xml`.
- Core route quick proof passed against the remote URL.
- Public surface user-facing audit passed across 14 public routes and 5 internal-boundary checks.
- No public command snippets, local paths, env placeholders, workflow residue, raw-payload language, SQL/Supabase implementation language, or source/score promotion claim was detected.
- Membership remains a Phase 2 preview; no login, payment, persisted watchlist, personalized alert, or member-only implementation was claimed.

Runtime boundary:

- `publicDataSource=mock`
- `scoreSource=mock`
- `platformMutationExecuted=false`
- `sqlExecuted=false`
- `supabaseReadOrWriteExecuted=false`
- `marketDataFetched=false`

PM/A3 conclusion:

The public Vercel alias remains safe to keep open as a Phase 1 mock/demo public Beta candidate while A1 continues data-source/coverage work and A4 remains planning-only.
