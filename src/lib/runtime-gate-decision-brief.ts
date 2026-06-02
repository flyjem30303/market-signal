export type RuntimeGateDecisionBrief = {
  allowedNow: string[];
  blockedNow: string[];
  ceoRecommendation: string;
  mode: "runtime_gate_decision_brief";
  pmNextStep: string;
  postRunReview: string[];
  publicDataSource: "mock";
  requiredAuthorization: string;
  requiredCommandBoundary: string[];
  scoreSource: "mock";
  status: "local_ready_remote_requires_separate_authorization";
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
    scoreSource: "mock",
    status: "local_ready_remote_requires_separate_authorization"
  };
}
