export type RuntimeGateDecisionBrief = {
  allowedNow: string[];
  blockedNow: string[];
  ceoRecommendation: string;
  currentDefaultRoute: "post_readonly_runtime_decision";
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
  id: "post_readonly_runtime_decision" | "schema_freshness_quality_gate";
  nextStep: string;
  reason: string;
  status: "default_now" | "requires_separate_ceo_named_action";
  title: string;
};

export function getRuntimeGateDecisionBrief(): RuntimeGateDecisionBrief {
  return {
    allowedNow: [
      "post-readonly runtime interpretation",
      "local review gate checks",
      "public mock boundary display",
      "schema, freshness, row coverage, data quality, and source-depth planning"
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
      "Use successful object reachability as backend evidence only, then decide schema shape, data freshness, row coverage, data quality, source-depth, and UI runtime interpretation before any promotion.",
    currentDefaultRoute: "post_readonly_runtime_decision",
    decisionPoint:
      "Post-readonly decision: Supabase object reachability is accepted, while the public runtime remains mock-only.",
    mode: "runtime_gate_decision_brief",
    pmNextStep:
      "Update runtime interpretation and prepare the next gate; do not execute remote work from this brief.",
    postRunReview: [
      "record exactly one attempt",
      "record sanitized aggregate only",
      "record no secrets and no row payloads",
      "stop after the attempt regardless of success or blocked result",
      "do not promote runtime readiness from remote output without a later accepted gate"
    ],
    publicDataSource: "mock",
    requiredAuthorization:
      "Separate accepted gate required before SQL, writes, public source promotion, or scoreSource=real",
    requiredCommandBoundary: [
      "process-scoped confirmation only",
      "no bundled SQL",
      "no writes",
      "no ingestion",
      "no raw payload logging"
    ],
    routeOptions: [
      {
        id: "post_readonly_runtime_decision",
        nextStep: "make the runtime say object reachability is verified while public source and scoring remain mock-only",
        reason: "it converts accepted backend evidence into clearer product state without remote execution or real-data promotion",
        status: "default_now",
        title: "Default route: post-readonly runtime decision"
      },
      {
        id: "schema_freshness_quality_gate",
        nextStep: "prepare a separate accepted gate for schema shape, freshness, row coverage, data quality, and source-depth",
        reason: "it is the next promotion prerequisite but must stay isolated from SQL, writes, ingestion, and real scoring",
        status: "requires_separate_ceo_named_action",
        title: "Optional route: schema, freshness, and quality gate"
      }
    ],
    scoreSource: "mock",
    separateRemoteTrigger: "CEO explicitly names a bounded schema, freshness, quality, or source-depth gate",
    status: "local_ready_remote_requires_separate_authorization"
  };
}
