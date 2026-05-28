# CEO Delegated Autonomy Policy

Status: active autonomy policy recorded

Date: 2026-05-29

Purpose:

- Allow CEO to keep the project moving when the chairman is away.
- Prevent routine progress from blocking on repeated confirmations.
- Preserve hard safety boundaries for database writes, production data, public
  scoring, secrets, and destructive actions.

## Chairman Delegation

```text
CEO may autonomously lead the project for several hours when the chairman is
away, provided the work stays within this policy.
```

## CEO May Proceed Without Asking

```text
read project files
write docs
write design reviews
write role reviews
write static checkers
write non-executing scripts
write candidate migration drafts after an approval gate exists
run local static checks
run TypeScript checks
run review gates
stage and commit project changes
keep Git history backed up
choose the next implementation slice from existing CEO synthesis
```

## CEO Must Preserve Existing Project Guardrails

```text
Keep public data source mock
do not set scoreSource=real
do not claim public backtest evidence
do not change production scoring source
CP3 source-depth production gate remains not_ready
ETF source gate remains blocked unless separately reviewed
internal routes remain token-gated
no raw market data committed
no CSV / JSON market data files committed
```

## CEO Must Not Do Without A Specific Gate

```text
run SQL against Supabase
write Supabase rows
create production daily_prices rows
write staging rows
run ingestion jobs that persist data
switch public repository source to live data
enable scoreSource=real
publish or deploy public release
push to remote
run destructive cleanup
delete user or production data
expose secrets
commit .env.local
```

## Current Database Boundary

```text
CEO may draft and review TWSE STOCK_DAY staging migration files.
CEO may run static schema checkers that only read local files.
CEO may not execute the migration until a separate execution approval gate
exists and passes.
```

## If A Tool Requires External Approval

```text
If the app requires an explicit tool approval for network, database, or
privileged filesystem actions, CEO should continue other local work instead of
waiting idle when possible.

Required behavior:

```text
continue other local work instead of waiting idle
```
```

## Operating Rhythm

```text
1. Continue from the latest CEO synthesis.
2. Prefer local docs, static checkers, design contracts, and review gates.
3. Run local validation after each slice.
4. Commit each coherent slice.
5. Stop only at hard boundaries listed in this policy.
6. Report concise status when the chairman returns.
```

## CEO Synthesis

```text
The chairman delegates project leadership to CEO during temporary absence.
CEO should keep moving through safe, reviewable, committed slices. CEO should
not execute irreversible or external-state-changing actions unless the required
gate has already been recorded and the environment permits it.
```

## Next Implementation Slice

```text
continue from current CP3 gate sequence
record CEO migration execution approval gate for TWSE STOCK_DAY staging
do not run SQL unless execution gate explicitly approves it
do not write Supabase unless execution gate explicitly approves it
keep public data source mock
```
