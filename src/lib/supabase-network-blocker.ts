export type SupabaseNetworkBlockerSummary = {
  currentFinding: string;
  impact: string;
  nextAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "tcp443_blocked";
  stopLine: string;
};

export function getSupabaseNetworkBlockerSummary(): SupabaseNetworkBlockerSummary {
  return {
    currentFinding: "Latest Supabase network diagnostic: DNS ok, TCP 443 blocked before TLS and REST.",
    impact:
      "The current blocker is local network reachability, not a table, RLS, row coverage, SQL, or model-scoring issue.",
    nextAction:
      "Resolve firewall, proxy, VPN, endpoint-security, or outbound HTTPS policy first; then rerun one bounded readonly gate.",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "tcp443_blocked",
    stopLine: "Do not retry generic Supabase readonly attempts, run SQL, ingest market data, or set scoreSource=real."
  };
}
