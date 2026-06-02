import type { SignalSnapshot } from "@/lib/signal-model";

export type StockRuntimeHeadlineSummary = {
  headline: string;
  items: Array<{
    body: string;
    label: string;
    state: "active" | "readying" | "blocked";
    value: string;
  }>;
  stopLine: string;
  subhead: string;
};

export function getStockRuntimeHeadlineSummary(snapshot: SignalSnapshot): StockRuntimeHeadlineSummary {
  return {
    headline: `${snapshot.asset.symbol} runtime is readable but still mock-only`,
    items: [
      {
        body: "Use this page to read the mock signal, risk direction, freshness disclosure, and current review blockers.",
        label: "Use now",
        state: "active",
        value: "mock_runtime_readable"
      },
      {
        body: "Supabase-backed public data, row coverage credit, data-quality approval, and real scoring are still blocked.",
        label: "Not live",
        state: "blocked",
        value: "real_data_blocked"
      },
      {
        body: "Continue runtime readability work unless CEO separately names one bounded readonly attempt.",
        label: "Next move",
        state: "readying",
        value: "mock_runtime_hardening"
      }
    ],
    stopLine:
      "This headline summary does not approve publicDataSource=supabase, data-quality promotion, or scoreSource real mode.",
    subhead:
      "First-screen summary for PM and CEO review: readable product state first, governance detail below."
  };
}
