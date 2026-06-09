# Beta Deployment Quickstart

Status: `beta_deployment_quickstart_ready`

Date: 2026-06-07

Owner: PM mainline

## Purpose

This is the single PM entry point for the public Beta deployment chain. It compresses the current launch route and pre-execution packet readiness into one report, so the next action stays executable without reopening broad deployment governance.

## Commands

```powershell
cmd.exe /c npm run report:beta-deployment-quickstart
cmd.exe /c npm run check:beta-deployment-quickstart
```

## Current PM Action

The current expected route is to provide only two non-secret platform values:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

Current first command while the two values are still missing:

```powershell
cmd.exe /c npm run report:public-beta-external-input-request
```

After the operator replies with the two platform values, run:

```powershell
cmd.exe /c npm run report:public-beta-external-input-response-readiness
cmd.exe /c npm run run:public-beta-post-reply-route-once
cmd.exe /c npm run report:beta-deployment-quickstart
```

Do not reopen broad deployment governance. Do not collect platform tokens, dashboard URLs, Supabase URLs, API keys, private preview URLs, or deployment credentials for this step.

## 90-Second Operator Handoff

Ask the hosting operator for only this reply:

```text
BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>
BETA_TEMPORARY_URL=https://<public-beta-hostname>/
```

Operator reads only:

- hosting project or site name;
- public `https` temporary Beta URL.

Operator should not open or change:

- Supabase dashboard for this step;
- DNS, custom domain, billing, or production launch settings;
- platform token, secret, key, password, invite, or private preview settings.

After the operator replies, PM runs:

```powershell
cmd.exe /c npm run report:public-beta-external-input-response-readiness
cmd.exe /c npm run run:public-beta-post-reply-route-once
```

## Where To Get The Two Values

CEO default: use Vercel first for the first public Beta because this is a Next.js app and Vercel gives the shortest path to a project name plus a public `vercel.app` URL. Netlify and Cloudflare Pages remain acceptable fallbacks if Vercel is unavailable or the chairman prefers another hosting platform.

Use only one provider for this two-value step:

| Provider | `BETA_HOSTING_PROJECT_NAME` | `BETA_TEMPORARY_URL` | Use when |
| --- | --- | --- | --- |
| Vercel | Project slug shown in the Vercel project. | Public `https://...vercel.app/` deployment URL. | Recommended default for fastest Next.js Beta path. |
| Netlify | Site name shown in the Netlify site. | Public `https://...netlify.app/` site URL. | Use if Netlify is the chosen hosting account. |
| Cloudflare Pages | Pages project name. | Public `https://...pages.dev/` project or preview URL. | Use if Cloudflare Pages is the chosen hosting account. |

Allowed shapes:

```text
BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta
BETA_TEMPORARY_URL=https://taiwan-market-signal-beta.vercel.app/
```

Provider notes:

- Vercel deployments generate public deployment URLs, and Vercel project names can be supplied or shown as project names.
- Netlify sites have a site name and a public `netlify.app` site URL.
- Cloudflare Pages projects are served on `pages.dev`; preview URLs can be branch-specific.
- A custom domain is not required for this Beta two-value step.

If the chosen provider has not created a public temporary URL yet, keep `BETA_TEMPORARY_URL` pending and continue local readiness work. Do not substitute a Supabase API URL, dashboard URL, private preview token, localhost URL, or any URL with a query string or hash.

## After The Two Values Validate

The quickstart routes PM to the next focused command:

1. `cmd.exe /c npm run run:public-beta-post-reply-route-once`
2. Record the PM reviewed artifact outcome only if the proof map reaches the expected no-secret review template.
3. Render the pre-execution packet candidate only after an accepted reviewed artifact exists.

The standalone validator and packet-window proof map remain internal diagnostics inside the combined post-reply one-command runner.

## Parallel Lanes

- A1 continues source-rights and coverage readiness only.
- A2 keeps public trust copy stable and only patches launch-blocking copy if the runtime surface changes.

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No deployment is authorized by this quickstart.
- No hosting resource is created or mutated.
- No platform environment value is printed.
- No SQL is executed.
- No Supabase connection, read, or write is executed.
- No staging rows or `daily_prices` rows are created or modified.
- No raw market data is fetched, stored, ingested, or committed.
- No secrets, raw payloads, row payloads, or stock id payloads are printed.

## Verification

Daily focused checks:

```powershell
cmd.exe /c npm run check:beta-deployment-quickstart
cmd.exe /c npm run check:public-beta-core-route-quick-proof
cmd.exe /c npm run check:beta-runtime-fast-health
cmd.exe /c npx tsc --noEmit
```

Run the full review gate only before deployment execution, source promotion, score promotion, or a public launch completion claim.
