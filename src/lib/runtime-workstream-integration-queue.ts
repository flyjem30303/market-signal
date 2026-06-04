export type RuntimeWorkstreamIntegrationItem = {
  acceptanceSignal: string;
  blockedUntil: string;
  id:
    | "pm_runtime_mainline"
    | "a1_evidence_handoff"
    | "a2_public_copy_gate"
    | "i_launch_operations_guard";
  integrationAction: string;
  owner: "PM" | "A1" | "A2" | "I";
  priority: 1 | 2 | 3 | 4;
  status: "active_mainline" | "guard_only" | "parallel_input_pending" | "ready_when_report_passes";
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
    iLaunchOps: 0;
    pmRuntime: 70;
  };
};

export function getRuntimeWorkstreamIntegrationQueue(): RuntimeWorkstreamIntegrationQueue {
  return {
    currentMainline: "runtime_readiness_integration",
    headline:
      "PM keeps runtime moving while A1 and A2 prepare bounded inputs and I guards launch risk.",
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
          "A1 blocker-closure packet separates data-quality evidence, row-coverage readiness, field-validity QA, downgrade rules, and explicit remote authorization needs",
        blockedUntil:
          "PM accepts the local-only handoff and CEO separately names any remote readonly attempt",
        id: "a1_evidence_handoff",
        integrationAction:
          "map accepted A1 evidence into the post-readonly next gate queue without running SQL, remote reads, remote writes, row payloads, or raw market-data ingestion",
        owner: "A1",
        priority: 2,
        status: "parallel_input_pending"
      },
      {
        acceptanceSignal:
          "A2 public-copy review confirms blocker-closure wording is understandable for mock-only state, source-rights limits, model-credibility limits, and real-score stop lines",
        blockedUntil:
          "A2 checker/report passes and PM selects only launch-blocking readability fixes",
        id: "a2_public_copy_gate",
        integrationAction:
          "use A2 findings to fix comprehension blockers before cosmetic polish, without editing A1 data evidence or runtime source promotion logic",
        owner: "A2",
        priority: 3,
        status: "ready_when_report_passes"
      },
      {
        acceptanceSignal:
          "I is accepted as a launch-readiness guard, not an implementation lane or deployment trigger",
        blockedUntil:
          "PM moves from local mock runtime toward public launch, cloud settings, production source, DNS, secrets, or rollback-impacting changes",
        id: "i_launch_operations_guard",
        integrationAction:
          "review launch, environment, credential, DNS, monitoring, rollback, and chairman-operated account steps before production-affecting moves",
        owner: "I",
        priority: 4,
        status: "guard_only"
      }
    ],
    mode: "runtime_workstream_integration_queue",
    nextPmAction:
      "Do not wait for A1, A2, or I; keep runtime readiness moving, integrate A1/A2 only after local checks pass, and trigger I only for production-affecting moves.",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "This queue does not run SQL, write Supabase, create staging rows, modify daily_prices, fetch or ingest raw market data, deploy, change DNS, change cloud settings, enter secrets, promote publicDataSource=supabase, or set scoreSource=real.",
    workMix: {
      a1Evidence: 20,
      a2PublicCopy: 10,
      iLaunchOps: 0,
      pmRuntime: 70
    }
  };
}
