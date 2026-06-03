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
  readonlyDecision: {
    body: string;
    label: "Readonly result";
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
      body:
        "Use accepted object reachability as backend evidence only. The next gate must decide schema shape, data freshness, row coverage, data quality, source-depth, and UI runtime interpretation before any public source or score promotion.",
      label: "Next gate",
      title: "Decide post-readonly runtime interpretation"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, SQL scoring, publicDataSource=supabase, and scoreSource=real remain blocked until separate accepted gates.",
      label: "Not live yet",
      title: "Real-data claims are not live"
    },
    readonlyDecision: {
      body: `${postReadonly.objectsReachable} Supabase objects are reachable in read-only validation. Public source remains ${postReadonly.publicDataSource}; score remains ${postReadonly.scoreSource}. ${postReadonly.stopLine}`,
      label: "Readonly result",
      title: "Object reachability is verified"
    },
    useNow: {
      body: `${symbol} can be used now for mock-only signal reading, risk sorting, and product-flow validation. It does not provide investment advice or real market-data evidence.`,
      label: "Use now",
      title: "Use mock signals for reading only"
    }
  };
}
