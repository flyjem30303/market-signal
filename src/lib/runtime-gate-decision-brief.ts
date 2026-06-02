export type RuntimeGateDecisionBrief = {
  allowedNow: string[];
  blockedNow: string[];
  ceoRecommendation: string;
  currentDefaultRoute: "mock_runtime_hardening";
  decisionPoint: string;
  mode: "runtime_gate_decision_brief";
  pmNextStep: string;
  postRunReview: string[];
  publicDataSource: "mock";
  requiredAuthorization: string;
  requiredCommandBoundary: string[];
  routeOptions: RuntimeGateRouteOption[];
  scoreSource: "mock";
  separateRemoteTrigger: string;
  status: "local_ready_remote_requires_separate_authorization";
};

export type RuntimeGateRouteOption = {
  id: "mock_runtime_hardening" | "bounded_readonly_attempt";
  nextStep: string;
  reason: string;
  status: "default_now" | "requires_separate_ceo_named_action";
  title: string;
};

export function getRuntimeGateDecisionBrief(): RuntimeGateDecisionBrief {
  return {
    allowedNow: [
      "local runtime hardening",
      "local review gate checks",
      "public mock boundary display",
      "post-run review preparation"
    ],
    blockedNow: [
      "SQL execution",
      "Supabase writes",
      "staging row writes",
      "daily_prices writes",
      "raw market data fetch or ingestion",
      "printing secrets",
      "printing row payloads",
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage points"
    ],
    ceoRecommendation:
      "Continue runtime work unless CEO explicitly names one bounded Supabase readonly attempt as a separate action.",
    currentDefaultRoute: "mock_runtime_hardening",
    decisionPoint:
      "Choose between continuing mock runtime hardening now or separately naming one bounded Supabase readonly attempt.",
    mode: "runtime_gate_decision_brief",
    pmNextStep:
      "Keep this brief visible in runtime briefing and do not execute remote work from this brief.",
    postRunReview: [
      "record exactly one attempt",
      "record sanitized aggregate only",
      "record no secrets and no row payloads",
      "stop after the attempt regardless of success or blocked result",
      "do not promote runtime readiness from remote output without a later accepted gate"
    ],
    publicDataSource: "mock",
    requiredAuthorization: "CEO must explicitly name one bounded Supabase readonly attempt",
    requiredCommandBoundary: [
      "process-scoped confirmation only",
      "no bundled SQL",
      "no writes",
      "no ingestion",
      "no raw payload logging"
    ],
    routeOptions: [
      {
        id: "mock_runtime_hardening",
        nextStep: "keep improving local runtime clarity and fail-closed public states",
        reason: "it moves product usability without remote execution or real-data promotion",
        status: "default_now",
        title: "Default route: mock runtime hardening"
      },
      {
        id: "bounded_readonly_attempt",
        nextStep: "run exactly one guarded readonly attempt only after the CEO names it separately",
        reason: "it may reduce row coverage uncertainty but must be isolated from SQL, writes, ingestion, and real scoring",
        status: "requires_separate_ceo_named_action",
        title: "Optional route: bounded readonly attempt"
      }
    ],
    scoreSource: "mock",
    separateRemoteTrigger: "CEO explicitly names one bounded Supabase readonly attempt",
    status: "local_ready_remote_requires_separate_authorization"
  };
}
