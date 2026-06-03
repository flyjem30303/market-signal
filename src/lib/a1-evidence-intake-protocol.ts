import { getPromotionPrerequisitesGate } from "@/lib/promotion-prerequisites-gate";

export type A1EvidenceIntakeDecision = "accepted_for_mainline_review" | "blocked_from_promotion";

export type A1EvidenceIntakeStep = {
  command: string;
  id: string;
  order: number;
  purpose: string;
  runMode: "local_static" | "local_health" | "local_build" | "local_recovery";
};

export type A1EvidenceIntakeProtocol = {
  acceptanceDecision: A1EvidenceIntakeDecision;
  acceptedInput: string;
  a1Role: "Data Evidence Lead";
  blockedPromotions: string[];
  currentA1GateStatus: string;
  headline: string;
  mode: "a1_evidence_intake_protocol";
  nextMainlineAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
  verificationOrder: A1EvidenceIntakeStep[];
};

export function getA1EvidenceIntakeProtocol(): A1EvidenceIntakeProtocol {
  const promotionPrerequisites = getPromotionPrerequisitesGate();

  return {
    acceptanceDecision: promotionPrerequisites.canPrepareReadonlyDecisionPacket
      ? "accepted_for_mainline_review"
      : "blocked_from_promotion",
    acceptedInput: "local_promotion_prerequisites_gate",
    a1Role: "Data Evidence Lead",
    blockedPromotions: [
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage points",
      "data-quality score lift",
      "readonly attempt execution"
    ],
    currentA1GateStatus: promotionPrerequisites.status,
    headline:
      "A1 evidence can be received by mainline as a decision packet input, not as runtime promotion approval.",
    mode: "a1_evidence_intake_protocol",
    nextMainlineAction:
      "Review A1 gate outputs locally, keep runtime mock, then decide whether a separately named bounded readonly packet should be presented.",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "A1 intake does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, print secrets, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real.",
    verificationOrder: [
      {
        command: "node scripts/check-promotion-prerequisites-gate.mjs",
        id: "a1-promotion-prerequisites",
        order: 1,
        purpose: "Verify A1 handoff stays local-only and contains the required post-run review fields.",
        runMode: "local_static"
      },
      {
        command: "node scripts/check-a1-evidence-intake-protocol.mjs",
        id: "mainline-intake-protocol",
        order: 2,
        purpose: "Verify mainline accepts A1 evidence for review only and blocks promotion.",
        runMode: "local_static"
      },
      {
        command: "node scripts/check-review-gates.mjs",
        id: "aggregate-review-gate",
        order: 3,
        purpose: "Run the aggregate gate after local static checks pass.",
        runMode: "local_static"
      },
      {
        command: "& 'C:\\Program Files\\nodejs\\npm.cmd' run build",
        id: "production-build",
        order: 4,
        purpose: "Run build after review gates, never in parallel with localhost health.",
        runMode: "local_build"
      },
      {
        command: "& 'C:\\Program Files\\nodejs\\npm.cmd' run dev:recover",
        id: "dev-recovery-after-build",
        order: 5,
        purpose: "Recover the dev server after build touches .next output.",
        runMode: "local_recovery"
      },
      {
        command: "node scripts/check-localhost-full-health.mjs",
        id: "localhost-health-after-recovery",
        order: 6,
        purpose: "Verify browser routes only after recovery completes.",
        runMode: "local_health"
      }
    ]
  };
}
