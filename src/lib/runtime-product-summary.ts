import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimeProductSummary = {
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

  return {
    nextGate: {
      body: `Readonly evidence has ${postReadonly.objectsReachable} Supabase objects reachable, but the next gate is still a bounded CEO-named review for schema shape, freshness, row coverage, and public wording.`,
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
