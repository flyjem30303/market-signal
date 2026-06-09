# Vercel Beta Pre-Creation Checklist

Status: `vercel_beta_pre_creation_checklist_ready`

Date: 2026-06-08

Owner: PM mainline

## Purpose

This checklist prepares the first Vercel public Beta setup without executing any hosting action. It tells PM/operator what to verify in the Vercel dashboard, what two non-secret values to bring back to the repo validator, and what must remain out of repo files and logs.

## Official References

- Vercel Git import flow: https://vercel.com/docs/deployments/git
- Vercel existing project import guide: https://vercel.com/docs/getting-started-with-vercel/import
- Vercel Next.js framework guide: https://vercel.com/docs/frameworks/nextjs
- Vercel environment variables guide: https://vercel.com/docs/projects/environment-variables

## CEO Default

Use Vercel first for the first public Beta because this is a Next.js app and the repo already exposes the standard Next.js scripts:

- install command: provider default or `npm install`
- build command: `npm run build`
- start command: `npm run start` for runtime reference only; Vercel normally serves the built Next.js project
- framework preset: Next.js
- source branch: `main` unless PM creates a separate release branch later
- preferred project slug: `taiwan-market-signal-beta`
- required public mock env: `NEXT_PUBLIC_DATA_SOURCE=mock`
- required public score env: `NEXT_PUBLIC_SCORE_SOURCE=mock`

This checklist does not require a custom domain.

## Values To Return

After the Vercel project and a public temporary URL exist, return only:

```text
BETA_HOSTING_PROJECT_NAME=<vercel-project-slug>
BETA_TEMPORARY_URL=https://<public-beta-hostname>.vercel.app/
```

Current first PM command while either value is still missing:

```powershell
cmd.exe /c npm run report:public-beta-external-input-request
```

After the operator returns the two values, run:

```powershell
cmd.exe /c D:\指數燈號\tmp\public-beta-external-reply-env.template.cmd
cmd.exe /c npm run fill:public-beta-external-reply-file-from-env
cmd.exe /c npm run report:public-beta-external-reply-file-route
cmd.exe /c npm run report:public-beta-external-input-response-readiness
cmd.exe /c npm run run:public-beta-post-reply-route-once
cmd.exe /c npm run report:beta-deployment-quickstart
```

## Vercel Dashboard Setup Notes

In Vercel, PM/operator should verify:

1. Project name is a plain slug, not a URL.
2. Framework preset is Next.js.
3. Build command is `npm run build`.
4. Install command is default or `npm install`.
5. Public temporary URL is an `https://...vercel.app/` URL.
6. Runtime public source stays mock for Beta: `NEXT_PUBLIC_DATA_SOURCE=mock`.
7. Runtime score source stays mock for Beta: `NEXT_PUBLIC_SCORE_SOURCE=mock`.
8. Data freshness source stays mock unless a separate promotion gate opens it.
9. No Supabase service role key is entered into this two-value intake.
10. No production custom domain is required for this two-value intake.

## Local Reply Fill Target

Use the Windows `.cmd` template because PowerShell execution policy may block `.ps1` scripts:

```cmd
D:\指數燈號\tmp\public-beta-external-reply-env.template.cmd
```

Replace only the two platform placeholders:

```cmd
set BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta
set BETA_TEMPORARY_URL=https://<your-vercel-preview-url>.vercel.app/
```

## Do Not Collect

Do not paste or store:

- Vercel tokens;
- Vercel dashboard URLs;
- private preview links with tokens;
- Supabase URLs or Supabase keys as substitutes for the Beta URL;
- DNS credentials;
- payment or billing credentials;
- deployment commands;
- SQL;
- raw market data;
- row payloads or stock id payloads.

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No deployment is authorized by this checklist.
- No hosting project is created or mutated by this checklist.
- No platform environment value is written by this checklist.
- No SQL is executed.
- No Supabase connection, read, or write is executed.
- No staging rows or `daily_prices` rows are created or modified.
- No raw market data is fetched, stored, ingested, or committed.
- No secrets, raw payloads, row payloads, or stock id payloads are printed.

## Completion Signal

This checklist is complete when PM can answer:

- Which Vercel project slug should become `BETA_HOSTING_PROJECT_NAME`.
- Which public `https://...vercel.app/` URL should become `BETA_TEMPORARY_URL`.
- Whether the two values pass `run:public-beta-post-reply-route-once`.

If either value is unavailable, keep the route as `blocked_waiting_two_platform_values` and continue local readiness work.
