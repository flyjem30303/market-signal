# Beta Two Value Operator Handoff

Status: `beta_two_value_operator_handoff_ready_waiting_values`

Date: 2026-06-07

Owner: I Launch / Ops

Review owner: PM mainline

## CEO Decision

CEO decision: `reduce_operator_handoff_to_two_safe_values`.

The chairman Beta launch review packet has reduced the next external input to two safe non-secret values. This handoff is the exact form I / operator should use before PM runs the packet-window proof map.

Current route: `beta_two_value_operator_handoff`.

Current outcome: `handoff_ready_waiting_for_project_name_and_public_beta_url`.

This handoff does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

Current missing-value PM command:

```text
cmd.exe /c npm run report:public-beta-external-input-request
```

After I / operator replies, PM first runs:

```text
cmd.exe /c npm run report:public-beta-external-input-response-readiness
```

## Provide Only These Two Values

Copy the two values into the runtime environment or provide them to PM for the validator run. Do not paste secrets into repo files.

```text
BETA_HOSTING_PROJECT_NAME=
BETA_TEMPORARY_URL=
```

Safe example shape:

```text
BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta
BETA_TEMPORARY_URL=https://taiwan-market-signal-beta.example.app
```

## Value Rules

`BETA_HOSTING_PROJECT_NAME`:

- plain project name only;
- lowercase letters, numbers, and hyphens;
- starts and ends with a letter or number;
- no URL;
- no dashboard link;
- no token;
- no secret;
- no key;
- no password;
- no invite value.

`BETA_TEMPORARY_URL`:

- public `https://` URL;
- no query string;
- no hash;
- no username or password;
- no dashboard URL;
- no private preview token;
- no localhost URL;
- no Supabase project API URL;
- path must be empty or `/`.

## PM After-Reply Command

After the two values are provided, PM first checks response readiness, then uses the combined post-reply one-runner:

```text
cmd.exe /c npm run report:public-beta-external-input-response-readiness
cmd.exe /c npm run run:public-beta-post-reply-route-once
```

Expected outcomes:

| Outcome | Meaning | Next route |
| --- | --- | --- |
| `blocked_waiting_values` | One or both values are missing. | Ask I / operator for the missing safe value only. |
| `rejected_unsafe_values` | One or both values are unsafe. | Ask I / operator for corrected non-secret values only. |
| `accepted_two_value_shape_only` | Both values pass local shape validation inside the one-command runner. | Continue to PM review of the no-secret packet-window proof result. |

Passing the validator does not deploy the site and does not prove launch completion.

## PM Packet Window Sequence

After the one-command runner reaches pending PM review, PM should run:

1. `cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note "PM dry-run verifies the reviewed artifact outcome recorder without writing a review artifact."`
2. PM records `accepted` or `rejected` only after review.
3. If accepted, PM prepares a separate pre-execution packet candidate.

Deployment remains unauthorized until a later explicit execution gate.

## Do Not Provide

Do not provide:

- secrets;
- environment variable values other than the two names above;
- Supabase service keys;
- dashboard tokens;
- DNS credentials;
- private preview tokens;
- executable deployment commands;
- SQL;
- raw market data;
- row payloads;
- stock id payloads.

## PM / A1 / A2 Routing

PM route:

- While values are missing, use `report:public-beta-external-input-request`.
- After I / operator replies, use `report:public-beta-external-input-response-readiness`.
- Then run `run:public-beta-post-reply-route-once`; standalone validation/proof-map commands are only diagnostics if the runner fails.
- Do not reopen the full operator sheet unless this handoff fails.
- Keep `publicDataSource=mock` and `scoreSource=mock`.

A1 route:

- Continue TWII / ETF source-rights evidence independently.
- Do not treat this handoff as source-rights, Supabase, coverage, or real promotion approval.

A2 route:

- Re-enter only after the temporary Beta URL is validator-accepted and PM asks for public-route readability QA.

I route:

- Provide only the two values above.
- Keep all secrets and credentials outside repo and logs.

## Acceptance

PM may classify this handoff as `accepted` when:

1. only two required values are named;
2. the handoff references `report:public-beta-external-input-request`, `report:public-beta-external-input-response-readiness`, and `run:public-beta-post-reply-route-once`;
3. safe and unsafe examples are explicit;
4. the next route after response-readiness is `run:public-beta-post-reply-route-once`;
5. `publicDataSource=mock` remains required;
6. `scoreSource=mock` remains required;
7. package and review-gate registration exist;
8. hard stops are visible.

## Hard Stops

This handoff does not authorize:

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

- `cmd.exe /c npm run check:beta-two-value-operator-handoff`

Milestone verification:

- `cmd.exe /c npm run check:review-gates`
