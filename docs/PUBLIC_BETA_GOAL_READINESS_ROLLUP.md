# Public Beta Goal Readiness Rollup

Status: `public_beta_goal_readiness_rollup_ready_currently_not_complete`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Trust / Legal / UX Readiness

## Purpose

This rollup converts the active GOAL into one PM-readable readiness report. It reads the current mainline route report and summarizes which GOAL completion items are ready, blocked, or held.

The rollup logic lives in `scripts/lib/public-beta-goal-readiness-rollup.mjs`. The standalone command reads `report:beta-mainline-current-route` and passes that report into the helper. The PM mainline route also embeds the same helper output under `goalReadiness`, so CEO/PM can see the GOAL state without opening another report.

The GOAL writing now follows `operational_goal_v3_execution_first`: close only the active external blocker chain, use the largest safe local slice that directly advances platform values, packet proof, A1 evidence classification, or runtime route health, prefer existing one-runner commands, and run only the smallest checker set that proves the slice. Broad UI polish, broad governance packets, role-review loops, and full review gates for tiny wording-only changes are deferred unless they directly unlock the public Beta packet chain.

## Commands

```powershell
cmd.exe /c npm run report:public-beta-goal-readiness-rollup
cmd.exe /c npm run check:public-beta-goal-readiness-rollup
```

## Completion Items

- `runtime_core_routes`
- `beta_platform_values_and_packet`
- `a1_source_rights_and_coverage_frontier`
- `a2_public_trust_copy`
- `promotion_boundary`

## Current Interpretation

The rollup is expected to report `public_beta_goal_not_ready_continue_parallel_work` until:

- the two Beta platform values are present and shape-valid;
- the packet proof map and reviewed artifact route are complete;
- A1 has enough accepted source-rights evidence to open the next outcome gate candidate;
- A2 `launchBlockingStatus` is `clear`, with no P0/P1 first-screen, boundary, or mojibake blocker;
- `publicDataSource=mock` and `scoreSource=mock` remain held until promotion gates pass.

No SQL, Supabase read/write, deployment, raw market-data fetch/ingest, evidence recording, or source/score promotion is authorized.

## Next Route

PM should use the rollup to choose the next high-value slice:

1. If platform values are missing, keep the mainline on `cmd.exe /c npm run report:public-beta-external-input-request`.
2. After any filled external reply file, run `cmd.exe /c npm run report:public-beta-external-reply-file-route`.
3. The reply-file route chooses the template, copy packet, bounded A1 repair, workflow proof, or lower-level response-readiness path.
4. If the route reaches lower-level proof, response-readiness remains `cmd.exe /c npm run report:public-beta-external-input-response-readiness`, followed by `cmd.exe /c npm run run:public-beta-post-reply-route-once`.
5. If the proof map reaches the reviewed artifact template, PM records `accepted` or `rejected` in the separate reviewed-artifact outcome record.
6. If A1 is still blocked, ask only for the four TWII no-secret evidence slots, then classify with `report:a1-source-rights-reviewed-outcome-surface`.
7. If A2 `launchBlockingStatus` is not `clear`, repair only launch-blocking public-copy regressions; otherwise defer P2 polish.
8. If all items pass, run a focused final audit before any goal completion claim.
