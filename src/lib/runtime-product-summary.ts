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
      body: `${postReadonly.objectsReachable} Supabase objects are reachable, but the next gate must still accept schema shape, freshness interpretation, and UI state before any real-data claim.`,
      label: "Next gate",
      title: "evidence review before real data"
    },
    notLiveYet: {
      body:
        "Real market data, Supabase-backed public data, publicDataSource=supabase, and scoreSource=real remain blocked.",
      label: "Not live yet",
      title: "real-data mode is blocked"
    },
    useNow: {
      body: `${symbol} can be read as a mock-only signal with local readiness context. Treat it as product flow validation, not investment evidence.`,
      label: "Use now",
      title: "mock signal and readiness"
    }
  };
}
