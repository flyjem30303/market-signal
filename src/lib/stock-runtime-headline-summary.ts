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
    headline: `${snapshot.asset.symbol} is readable as a mock signal`,
    items: [
      {
        body: "Use this page to read the mock signal, risk direction, freshness note, and current safety boundary.",
        label: "Use now",
        state: "active",
        value: "mock_runtime_readable"
      },
      {
        body: "Live market-data claims, Supabase-backed public data, row coverage credit, and real scoring are still blocked.",
        label: "Not live",
        state: "blocked",
        value: "real_data_blocked"
      },
      {
        body: "Improve the reading flow first; a bounded readonly attempt stays separate until CEO explicitly names it.",
        label: "Next move",
        state: "readying",
        value: "mock_runtime_hardening"
      }
    ],
    stopLine:
      "This headline summary does not approve publicDataSource=supabase, data-quality promotion, or scoreSource real mode.",
    subhead:
      "First-screen summary: what can be read now, what remains blocked, and what review comes next."
  };
}
