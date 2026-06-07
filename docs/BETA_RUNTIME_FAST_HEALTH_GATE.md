# Beta Runtime Fast Health Gate

Status: `beta_runtime_fast_health_gate_ready`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `add_fast_runtime_health_gate_to_prevent_overvalidation_drag`.

The active GOAL now favors larger high-value slices and avoids letting heavy validation slow routine launch readiness. The existing `check:localhost-full-health` remains valid for milestone packet-window proof, but it is too broad for every mainline runtime check because it includes many historical data and governance gates.

Current route: `beta_runtime_fast_health_gate`.

Current outcome: `fast_runtime_health_available_for_beta_mainline`.

This gate does not deploy, create or mutate hosting resources, run deployment commands, upload secrets, mutate platform environment variables, change DNS or SSL, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, fetch or ingest market data, promote public runtime state, award row coverage points, or set real score source.

## Fast Health Scope

The fast health gate checks only the runtime signals needed to keep Beta engineering moving:

1. localhost public routes return HTTP `200`;
2. the public runtime source remains `publicDataSource=mock`;
3. the public score source remains `scoreSource=mock`;
4. no public runtime source promotion is approved;
5. no real score source promotion is approved;
6. the checker is registered in `package.json`;
7. the checker is registered in the review gate.

Default route list:

- `/`
- `/briefing`
- `/weekly`
- `/stocks/2330`
- `/stocks/TWII`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`

## Relationship To Full Health

Use `check:beta-runtime-fast-health` for regular PM mainline progress.

Use `check:localhost-full-health` only when one of these is true:

- platform project name and temporary Beta URL exist;
- executable packet-window proof is being assembled;
- route code, routing config, or server startup behavior changed;
- TypeScript/build risk changed;
- a fast health failure requires deeper diagnosis.

This keeps routine launch progress fast while preserving full proof for milestone windows.

## PM / A1 / A2 Routing

PM route:

- Run this gate before creating or refreshing Beta runtime readiness evidence.
- If this gate passes and platform values remain pending, continue `beta_deployment_executable_packet_after_platform_values_or_runtime_promotion_readiness_with_mock_boundary`.
- If this gate fails, repair runtime health before more packet work.
- Keep `check:localhost-full-health` reserved for milestone packet-window proof.

A1 route:

- Continue TWII / ETF source-rights evidence.
- Do not use this gate as source-rights approval, candidate artifact approval, Supabase read/write approval, row coverage approval, or real promotion approval.

A2 route:

- Re-enter only when fast health failure points to route-local readability, legal copy, trust copy, or route rendering regression.
- Do not treat this gate as visual polish approval.

## Acceptance

PM may classify this gate as `accepted` when:

1. `check:beta-runtime-fast-health` passes;
2. default public routes return HTTP `200`;
3. `publicDataSource=mock` remains unchanged;
4. `scoreSource=mock` remains unchanged;
5. `check:localhost-full-health` remains milestone-only, not removed;
6. package and review-gate registration exist.

## Hard Stops

This gate does not authorize:

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

- `cmd.exe /c npm run check:beta-runtime-fast-health`
- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run check:public-route-loop`

Milestone verification:

- `cmd.exe /c npm run check:localhost-full-health`
- `cmd.exe /c npm run check:review-gates`
