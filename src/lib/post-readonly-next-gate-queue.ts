export type PostReadonlyNextGateItem = {
  acceptanceSignal: string;
  blockedPromotion: string;
  id: "schema_shape" | "freshness" | "row_coverage" | "data_quality" | "source_depth";
  nextAction: string;
  owner: "Data" | "Engineering" | "Investment";
  priority: 1 | 2 | 3 | 4 | 5;
  status: "local_ready" | "blocked_waiting_evidence" | "needs_role_review";
};

export type PostReadonlyNextGateQueue = {
  blockedActions: string[];
  currentDefaultRoute: "post_readonly_next_gate_preparation";
  headline: string;
  items: PostReadonlyNextGateItem[];
  mode: "post_readonly_next_gate_queue";
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getPostReadonlyNextGateQueue(): PostReadonlyNextGateQueue {
  return {
    blockedActions: [
      "SQL execution",
      "Supabase writes",
      "raw market data fetch or ingestion",
      "daily_prices modification",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    currentDefaultRoute: "post_readonly_next_gate_preparation",
    headline:
      "Object reachability is accepted; next work is evidence quality, not real-data promotion.",
    items: [
      {
        acceptanceSignal:
          "readonly shape summary lists required objects and fields without row payloads or secrets",
        blockedPromotion: "Supabase-backed public runtime",
        id: "schema_shape",
        nextAction:
          "compare sanitized object reachability with the runtime field contract and record gaps locally",
        owner: "Engineering",
        priority: 1,
        status: "local_ready"
      },
      {
        acceptanceSignal:
          "freshness interpretation maps latest sanitized evidence to stale/current/unknown without approving public source",
        blockedPromotion: "freshness-based public claim",
        id: "freshness",
        nextAction:
          "align data_freshness evidence, runtime copy, and fail-closed labels for stale or missing dates",
        owner: "Data",
        priority: 2,
        status: "local_ready"
      },
      {
        acceptanceSignal:
          "row coverage explains observed versus expected coverage and missing-row consequence",
        blockedPromotion: "row coverage points",
        id: "row_coverage",
        nextAction:
          "keep the incomplete aggregate result visible and decide the next bounded readonly evidence question",
        owner: "Data",
        priority: 3,
        status: "blocked_waiting_evidence"
      },
      {
        acceptanceSignal:
          "data quality gate defines minimum field validity, downgrade behavior, and public-claim limits",
        blockedPromotion: "data quality score promotion",
        id: "data_quality",
        nextAction:
          "connect field-validity QA, downgrade matrix, and release blocker wording into one acceptance path",
        owner: "Data",
        priority: 4,
        status: "needs_role_review"
      },
      {
        acceptanceSignal:
          "source-depth artifact proves history depth, source rights boundary, and missing-date policy",
        blockedPromotion: "scoreSource=real",
        id: "source_depth",
        nextAction:
          "prepare source-depth evidence request only after schema, freshness, row coverage, and quality gaps are explicit",
        owner: "Investment",
        priority: 5,
        status: "needs_role_review"
      }
    ],
    mode: "post_readonly_next_gate_queue",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "This queue does not run SQL, write Supabase, fetch market data, modify daily_prices, or set scoreSource=real."
  };
}
