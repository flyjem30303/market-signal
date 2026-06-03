export type RuntimeWorkstreamIntegrationItem = {
  acceptanceSignal: string;
  blockedUntil: string;
  id: "pm_runtime_mainline" | "a1_evidence_handoff" | "a2_public_copy_gate";
  integrationAction: string;
  owner: "PM" | "A1" | "A2";
  priority: 1 | 2 | 3;
  status: "active_mainline" | "parallel_input_pending" | "ready_when_report_passes";
};

export type RuntimeWorkstreamIntegrationQueue = {
  currentMainline: "runtime_readiness_integration";
  headline: string;
  items: RuntimeWorkstreamIntegrationItem[];
  mode: "runtime_workstream_integration_queue";
  nextPmAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
  workMix: {
    a1Evidence: 20;
    a2PublicCopy: 10;
    pmRuntime: 70;
  };
};

export function getRuntimeWorkstreamIntegrationQueue(): RuntimeWorkstreamIntegrationQueue {
  return {
    currentMainline: "runtime_readiness_integration",
    headline:
      "PM keeps runtime moving while A1 and A2 prepare bounded inputs for later integration.",
    items: [
      {
        acceptanceSignal:
          "runtime readiness, review gate, TypeScript, build, and localhost health remain passing",
        blockedUntil:
          "none; this is the active mainline as long as public source and score source remain mock",
        id: "pm_runtime_mainline",
        integrationAction:
          "continue runtime readiness and integrate only coherent passing slices",
        owner: "PM",
        priority: 1,
        status: "active_mainline"
      },
      {
        acceptanceSignal:
          "A1 handoff candidate separates local-only evidence, missing readonly blockers, and explicit authorization needs",
        blockedUntil:
          "PM accepts the handoff and CEO separately names any remote readonly attempt",
        id: "a1_evidence_handoff",
        integrationAction:
          "map accepted A1 evidence into the post-readonly next gate queue without running SQL or remote writes",
        owner: "A1",
        priority: 2,
        status: "parallel_input_pending"
      },
      {
        acceptanceSignal:
          "A2 public copy checker distinguishes true visible-copy blockers from terminal encoding noise",
        blockedUntil:
          "A2 checker/report passes and PM selects a copy-only UI slice",
        id: "a2_public_copy_gate",
        integrationAction:
          "use A2 findings to fix launch-blocking readability before cosmetic polish",
        owner: "A2",
        priority: 3,
        status: "ready_when_report_passes"
      }
    ],
    mode: "runtime_workstream_integration_queue",
    nextPmAction:
      "Do not wait for A1 or A2; keep runtime readiness moving and integrate their outputs only after their local checks pass.",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "This queue does not run SQL, write Supabase, create staging rows, modify daily_prices, fetch or ingest raw market data, promote publicDataSource=supabase, or set scoreSource=real.",
    workMix: {
      a1Evidence: 20,
      a2PublicCopy: 10,
      pmRuntime: 70
    }
  };
}
