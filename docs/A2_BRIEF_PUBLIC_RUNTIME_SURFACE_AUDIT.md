# A2 BRIEF Public Runtime Surface Audit

Updated: 2026-06-13

Status: `a2_brief_public_runtime_surface_audit_ready`

Owner: A2 Public Copy / Product Safety lane

Scope: `brief_public_runtime_surface_copy_audit`

## 1. Purpose

This audit keeps public runtime surfaces aligned with the BRIEF:

- users should understand market atmosphere within 30 seconds;
- users should know whether to follow, increase observation, or reduce risk within 3 minutes;
- public pages should explain source/coverage limits without exposing internal execution workflow;
- every public surface must keep the mock boundary and non-investment-advice posture clear.

## 2. Surfaces In Scope

The current public runtime surface set is:

- `/`
- `/briefing`
- `/weekly`
- `/stocks/TWII`
- `/stocks/2330`
- `/stocks/0050`
- `/stocks/006208`
- `/stocks/2382`
- `/stocks/2308`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`

## 3. Required Public Signals

At least the core product routes must expose:

- `Public Beta Decision Loop`
- `30 秒市場氛圍，3 分鐘行動判斷`
- `Public Beta Reading Path`
- `Source & Coverage`
- `publicDataSource=mock`
- `scoreSource=mock`
- `不是即時真實資料`
- `不提供買賣建議`

Home and `/briefing` should also expose:

- `Data Readiness`
- `資料真實化仍在準備中，公開頁維持 mock`

## 4. Forbidden Public Signals

Public pages must not expose:

- internal deployment blockers;
- operator packet commands;
- environment-variable placeholders;
- SQL or Supabase write approval;
- raw market-data workflow;
- complete coverage claims;
- real-time market-data claims;
- `publicDataSource=supabase approved`;
- `scoreSource=real approved`;
- buy/sell instructions.

## 5. A2 Decision

Recommended PM intake decision:

`accept_a2_brief_public_runtime_surface_audit`

Meaning:

PM may treat the current public surface guard as the active A2 copy-safety layer. This does not approve source rights, real data, real scoring, SQL, Supabase, raw payloads, or investment advice.
