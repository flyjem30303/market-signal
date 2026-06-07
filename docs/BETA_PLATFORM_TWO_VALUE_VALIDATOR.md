# Beta Platform Two Value Validator

Status: `beta_platform_two_value_validator_ready_waiting_values`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops

## CEO Decision

CEO decision: `make_two_platform_values_locally_validatable_before_packet_window`.

The two-value intake gate has narrowed the remaining Beta executable packet blocker to hosting project name and temporary Beta URL. PM now needs a local validator so the next platform values can be checked without reopening the broad operator sheet.

Current route: `beta_platform_two_value_validator`.

Current outcome: `validator_ready_waiting_for_two_safe_values`.

This validator does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Command

Focused command:

- `cmd.exe /c npm run validate:beta-platform-two-values`

Required environment variables:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

Input loading:

- The validator first reads shell environment variables.
- If one or both values are missing, it safely reads only `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL` from `.env.local`.
- It does not print the values; output remains boolean/shape-only.
- `.env.example` includes blank placeholders for both values so `.env.local` can be filled without storing actual values in tracked docs.

Example shape:

```text
BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta
BETA_TEMPORARY_URL=https://taiwan-market-signal-beta.example.app
```

Do not store those values in repo documents unless PM explicitly creates a later no-secret packet record.

## Validation Rules

Hosting project name:

- length must be between `3` and `64`;
- lowercase letters, numbers, and hyphens only;
- must start and end with a letter or number;
- must not contain `http`, `token`, `secret`, `key`, `password`, `dashboard`, or `invite`.

Temporary Beta URL:

- must be a public `https://` URL;
- must not include username or password;
- must not include a query string or hash;
- hostname must contain at least one dot;
- hostname must not contain `localhost`, `127.0.0.1`, `dashboard`, `token`, `secret`, `key`, `password`, `invite`, or `supabase.co`;
- path must be empty or `/`.

## Output States

| State | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_values` | One or both values are missing. | Keep waiting for safe values. |
| `rejected_unsafe_values` | At least one value looks unsafe or non-public. | Ask I / launch operator for corrected non-secret values. |
| `accepted_two_value_shape_only` | Both values pass local shape validation. | Run repo proof and create a separate packet-window candidate. |

Passing this validator does not mean the site is deployed or public launch is complete. It only means the two values are safe enough to enter a later packet candidate.

## PM / A1 / A2 Routing

PM route:

- Run this validator immediately after I provides the two values.
- If accepted, run `run:beta-executable-packet-repo-proof` in the same packet window.
- If rejected, do not write the values to repo documents; request corrected values.

A1 route:

- Continue TWII / ETF source-rights evidence independently.

A2 route:

- Re-enter only after a validator-accepted temporary Beta URL exists and PM asks for public-route readability QA.

I route:

- Provide only the plain project name and public temporary Beta URL.
- Keep private platform tokens, dashboard tokens, env values, DNS credentials, and secrets outside repo and logs.

## Acceptance

PM may classify this validator as `accepted` when:

1. script registration exists;
2. review-gate registration exists;
3. the validator returns `blocked_waiting_values` when values are absent;
4. `.env.local` fallback reads only the two Beta platform values and does not print them;
5. unsafe value rules are explicit;
6. accepted output is limited to shape validation only;
7. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Hard Stops

This validator does not authorize:

- production deployment;
- preview deployment;
- deployment command execution;
- hosting project creation;
- hosting project mutation;
- DNS change;
- SSL configuration change;
- platform env mutation;
- secret output;
- secret storage action;
- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- row coverage points;
- complete MVP coverage claim;
- Supabase public-source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Verification

Focused verification:

- `cmd.exe /c npm run check:beta-platform-two-value-validator`
- `cmd.exe /c npm run validate:beta-platform-two-values`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
