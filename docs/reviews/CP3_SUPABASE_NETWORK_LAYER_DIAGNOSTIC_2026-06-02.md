# CP3 Supabase Network Layer Diagnostic

Date: 2026-06-02

Status: `CP3 Supabase network layer diagnostic recorded`

Decision: `ACCEPT_TCP443_OR_FIREWALL_AS_CURRENT_ROOT_CAUSE_CANDIDATE`

## Scope

This record captures one process-scoped Supabase network-layer diagnostic. It records only sanitized network status categories. It does not record raw URLs, hostnames, IP addresses, secrets, key prefixes, key suffixes, key lengths, response bodies, row payloads, row counts, raw error messages, raw market data, or SQL.

## Diagnostic Summary

- Execution count: one guarded network-layer diagnostic attempt.
- Command path: `node --env-file=.env.local scripts/report-supabase-network-layer-diagnostic.mjs` with process-scoped confirmation.
- Diagnostic status: `blocked`.
- Diagnostic reason: `tcp443_or_firewall`.
- URL shape: `supabase_host`, `https`, `ok`.
- Required environment variables: present, values not recorded.
- DNS status: `ok`.
- DNS address family seen: `ipv4`.
- TCP 443 status: `blocked`.
- TLS handshake status: `not_run`.
- REST root reachability: `not_run`.
- Sanitized HTTP status: `not_run`.
- Suggested root cause: `tcp443_or_firewall`.
- Files written by diagnostic: `false`.
- Mutations: `false`.
- SQL executed: `false`.
- Secrets printed: `false`.
- Row payloads printed: `false`.
- Public claims changed: `false`.
- `scoreSource=real` changed: `false`.

## CEO Synthesis

The Supabase project URL shape and environment loading are acceptable, and DNS resolution reaches a Supabase host category. The block occurs before TLS and before the REST root request, at TCP 443. The current root-cause candidate is therefore local network, firewall, proxy, VPN, endpoint security, or outbound HTTPS policy, not Supabase table/RLS policy, object existence, row coverage, model credibility, or source-depth readiness.

## Next Action

- Check whether this machine/network can open outbound TCP 443 to Supabase hosts.
- Check Windows firewall, antivirus/endpoint security, VPN, proxy, DNS filtering, and corporate network policy.
- If the network layer is cleared later, rerun exactly one bounded REST root diagnostic before any table-level readonly attempt.
- Do not repeat table-level readonly attempts while TCP 443 remains `blocked`.
- Keep public data source as mock.
- Keep `scoreSource=real` blocked.
- Keep SQL execution, Supabase writes, market-data ingestion, raw market-data commit, and public investment claims blocked.

## Verification Expectations

- Supabase network-layer diagnostic checker passes.
- Blank-error root-cause checker passes.
- Latest sanitized run checker passes.
- Supabase readonly validator output contract checker passes.
- Review gates pass.
- TypeScript check passes.
