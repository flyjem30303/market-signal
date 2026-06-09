# Vercel Operator Step-by-Step Checklist

Status: `vercel_operator_step_by_step_checklist_ready`

Date: 2026-06-08

Owner: PM mainline

## Purpose

This is the shortest manual Vercel operator checklist for obtaining the two non-secret Beta platform values. It does not create the project, deploy, mutate Vercel settings, write environment variables, or authorize public launch by itself.

## Official References

- Vercel Git import flow: https://vercel.com/docs/deployments/git
- Vercel existing project import guide: https://vercel.com/docs/getting-started-with-vercel/import
- Vercel Next.js framework guide: https://vercel.com/docs/frameworks/nextjs
- Vercel environment variables guide: https://vercel.com/docs/projects/environment-variables

## Manual Steps

1. Open Vercel dashboard.
2. Choose Add New Project or Import Project.
3. Select the Git repository for this project.
4. Confirm framework preset is Next.js.
5. Confirm build command is `npm run build`.
6. Leave install command as provider default or `npm install`.
7. Confirm source branch is `main` unless PM creates a separate release branch later.
8. Use project slug `taiwan-market-signal-beta` unless Vercel says it is already taken; if taken, use a lowercase letters/numbers/hyphens variant.
9. In Environment Variables, set or verify only public mock-safe runtime values needed for this Beta host:
   - `NEXT_PUBLIC_DATA_SOURCE=mock`
   - `NEXT_PUBLIC_SCORE_SOURCE=mock`
10. Do not add Supabase service role key during this two-value step.
11. Finish the Vercel import flow in the browser and wait until Vercel shows a public `https://...vercel.app/` URL.
12. After a public temporary URL exists, copy only the two values below.

## Values To Return To PM

```text
BETA_HOSTING_PROJECT_NAME=<vercel-project-slug>
BETA_TEMPORARY_URL=https://<public-beta-hostname>.vercel.app/
```

## Fast Local Reply Fill Path

After the two values exist, edit only these two lines in `D:\指數燈號\tmp\public-beta-external-reply-env.template.cmd`:

```cmd
set BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta
set BETA_TEMPORARY_URL=https://<your-vercel-preview-url>.vercel.app/
```

Then run:

```cmd
cmd.exe /c D:\指數燈號\tmp\public-beta-external-reply-env.template.cmd
cmd.exe /c npm run fill:public-beta-external-reply-file-from-env
cmd.exe /c npm run report:public-beta-external-reply-file-route
```

While either value is still missing, PM runs:

```powershell
cmd.exe /c npm run report:public-beta-external-input-request
```

After the operator returns the two values, PM runs:

```powershell
cmd.exe /c npm run report:public-beta-external-input-response-readiness
cmd.exe /c npm run run:public-beta-post-reply-route-once
cmd.exe /c npm run report:beta-deployment-quickstart
```

## Where The Values Are Found

- `BETA_HOSTING_PROJECT_NAME`: the Vercel project slug or project name shown for the imported project.
- `BETA_TEMPORARY_URL`: the public `https://...vercel.app/` URL shown after Vercel has a public deployment URL for the project.

If no public temporary URL exists yet, keep `BETA_TEMPORARY_URL` pending. Do not substitute localhost, a Supabase API URL, a dashboard URL, or a private preview URL.

## Do Not Do In This Checklist

- Do not run a deployment command from this repo.
- Do not create or mutate a hosting project from this repo.
- Do not paste Vercel tokens into repo files or chat.
- Do not paste Supabase service role keys into Vercel for this two-value step.
- Do not use Supabase dashboard URLs as `BETA_TEMPORARY_URL`.
- Do not change DNS, SSL, billing, or custom domain settings.
- Do not change `publicDataSource=mock`.
- Do not change `scoreSource=mock`.

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

The checklist is complete when PM has either:

- two shape-safe values that pass the combined post-reply one-runner; or
- a precise blocker that says which of the two values is still missing.

If the two values pass, PM continues with:

```powershell
cmd.exe /c npm run run:public-beta-post-reply-route-once
```
