import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getSupabaseNetworkBlockerSummary, type SupabaseNetworkBlockerSummary } from "@/lib/supabase-network-blocker";

export type RuntimeProductSummary = {
  networkBlocker: SupabaseNetworkBlockerSummary;
  nextGate: {
    body: string;
    label: "Next gate";
    title: string;
  };
  notLiveYet: {
    body: string;
    label: "Not live yet";
    title: string;
  };
  useNow: {
    body: string;
    label: "Use now";
    title: string;
  };
};

export function getRuntimeProductSummary(symbol: string): RuntimeProductSummary {
  const postReadonly = getPostReadonlyRuntimeState();
  const networkBlocker = getSupabaseNetworkBlockerSummary();

  return {
    networkBlocker,
    nextGate: {
      body: `Resolve network reachability first: previous readonly evidence had ${postReadonly.objectsReachable} Supabase objects reachable, but the latest blocker is ${networkBlocker.status}. Resolve TCP 443 reachability before another bounded CEO-named readonly gate.`,
      label: "Next gate",
      title: "Review readiness before runtime activation"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, SQL scoring, publicDataSource=supabase, and scoreSource=real remain blocked until separate accepted gates.",
      label: "Not live yet",
      title: "Real-data claims are not live"
    },
    useNow: {
      body: `${symbol} can be used now for mock-only signal reading, risk sorting, and product-flow validation. It does not provide investment advice or real market-data evidence.`,
      label: "Use now",
      title: "Use mock signals for reading only"
    }
  };
}
