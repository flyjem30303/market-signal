import type { SignalSnapshot } from "@/lib/signal-model";

export type StockRuntimeHeadlineSummary = {
  decisionAidGroups: Array<{
    items: string[];
    label: string;
    state: "active" | "readying" | "blocked";
    title: string;
  }>;
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
    decisionAidGroups: [
      {
        items: [
          "Mock composite score and risk direction",
          "Module health/risk ranking",
          "Freshness metadata reachability"
        ],
        label: "Can reference",
        state: "active",
        title: "Useful for reading flow and relative risk checks"
      },
      {
        items: ["Mock quote and module details", "Backtest and news modules", "Peer comparison cards"],
        label: "Display only",
        state: "readying",
        title: "Good for product validation, not investment proof"
      },
      {
        items: ["Live market-data claims", "Supabase-backed public data", "scoreSource=real and SQL scoring"],
        label: "Not live yet",
        state: "blocked",
        title: "Blocked until separate accepted gates"
      }
    ],
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
