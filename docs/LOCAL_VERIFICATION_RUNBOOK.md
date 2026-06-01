# Local Verification Runbook

This runbook keeps local verification deterministic. Do not run `npm run build`
in parallel with `npm run check:review-gates` or localhost health checks because
Next.js writes `.next` while other checks may read app output.

If `npm run build` reports `Cannot find module for page` for a route that
exists in `src/app`, treat it as a generated `.next` manifest/cache mismatch
before treating it as a source-code or permission failure. Stop parallel checks,
clear `.next`, rerun `npm run build`, then run `npm run dev:recover` and
`npm run check:localhost-full-health`.

If `http://localhost:3000/` is unreachable, first treat it as a
dev server availability issue. Confirm whether port 3000 has a listener, then run
`npm run dev:recover`. A successful recovery should make the home page return
HTTP 200 before any product or runtime debugging continues.

## Required Order

1. Run `npm run check:localhost-full-health` when the dev server is already up.
2. Run `npm run report:project-progress-snapshot` to capture the CEO/PM local progress state.
3. Run `npm run report:ceo-progress-brief` when a concise chairman-facing verbal update is needed.
4. Run `npm run report:blocker-resolution-plan` when blocked or waiting decision nodes need an owner/action map.
5. Run `npm run report:data-quality-evidence-checklist`, `npm run report:source-rights-disclosure-checklist`, and `npm run report:model-credibility-checklist` when the blocker owners need the concrete review inputs.
6. Run `npm run check:review-gates`.
7. Run `npm run build` only after review gates finish.
8. Run `npm run dev:recover` after build.
9. Run `npm run check:localhost-full-health` again after recovery.

## Localhost Recovery

Use this sequence when the browser shows connection refused:

1. Confirm the page is a connection failure, not an application error.
2. Check whether port 3000 is listening.
3. Run `npm run dev:recover`.
4. Confirm `http://localhost:3000/` returns HTTP 200.
5. Continue review gates or runtime work only after localhost is reachable.

This recovery starts only the local Next.js dev server. It does not connect to
Supabase, run SQL, write data, ingest market data, or change the public source
or score source.

`npm run report:project-progress-snapshot` is local-only. It must keep
`publicDataSource=mock`, `scoreSource=mock`, `sqlExecuted=false`,
`connectionAttempted=false`, and `supabaseWritesEnabled=false`. Its output
must not include Supabase URLs, service role keys, anon keys, token values,
raw row payloads, SQL text, raw market data, key prefixes, key suffixes, or
key lengths.

`npm run report:ceo-progress-brief` is also local-only and derives from the
same sanitized snapshot.

`npm run report:blocker-resolution-plan` is local-only and keeps waiting /
blocked nodes as action plans. It must not approve Supabase execution, public
data-source promotion, row coverage points, or real scoring.

The three blocker checklist reports are local-only review inputs. They keep
Data, Legal, and Investment lanes explicit, but they do not verify external
rights, execute remote reads, award row coverage points, approve public
promotion, or approve real scoring.

## Boundary

- Do not run SQL.
- Do not write Supabase.
- Do not fetch or ingest raw market data.
- Do not set `scoreSource=real`.
- Keep public data source mock until the readonly gates explicitly approve the next stage.
