import fs from "node:fs";

const files = {
  repository: "src/lib/repositories/market-signal-repository.ts",
  sourceStatus: "src/lib/repositories/market-signal-source-status.ts",
  supabaseRepository: "src/lib/repositories/supabase-market-signal-repository.ts",
  freshnessStrip: "src/components/data-freshness-strip.tsx",
  promotionReview: "src/lib/phase-1-promotion-review-outcome.ts",
  readinessSummary: "src/lib/runtime-promotion-readiness-summary.ts",
  nextGateQueue: "src/lib/post-readonly-next-gate-queue.ts"
};

const text = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fs.readFileSync(file, "utf8")]));

const required = [
  [files.repository, text.repository, "return mockMarketSignalRepository;"],
  [files.repository, text.repository, "getMarketSignalSourceStatus({ env });"],
  [files.sourceStatus, text.sourceStatus, "resolvedSource: \"mock\""],
  [files.sourceStatus, text.sourceStatus, "publicScoreSource: \"mock\""],
  [files.sourceStatus, text.sourceStatus, "public score repository still resolves to mock"],
  [files.supabaseRepository, text.supabaseRepository, "createLoadedSupabaseMarketSignalRepository"],
  [files.supabaseRepository, text.supabaseRepository, "Use createLoadedSupabaseMarketSignalRepository() to preload readonly Supabase rows before use."],
  [files.freshnessStrip, text.freshnessStrip, "市場訊號來源：目前 {marketSignalSourceStatus.resolvedSource}"],
  [files.freshnessStrip, text.freshnessStrip, "後端唯讀狀態 {marketSignalSourceStatus.supabaseRuntimeReads}"],
  [files.readinessSummary, text.readinessSummary, "publicDataSource: \"mock\""],
  [files.readinessSummary, text.readinessSummary, "scoreSource: \"mock\""],
  [files.promotionReview, text.promotionReview, "status: \"rejected\""],
  [files.promotionReview, text.promotionReview, "outcome: \"rejected_for_promotion\""],
  [files.promotionReview, text.promotionReview, "canPromotePublicDataSourceToSupabase: false"],
  [files.promotionReview, text.promotionReview, "canSetScoreSourceReal: false"],
  [files.nextGateQueue, text.nextGateQueue, "status: \"blocked_waiting_evidence\""],
  [files.nextGateQueue, text.nextGateQueue, "field validity promotion rejected"],
  [files.nextGateQueue, text.nextGateQueue, "source-depth artifact promotion rejected"],
  [files.nextGateQueue, text.nextGateQueue, "coverage 完成不等於 real 上線"]
];

const forbidden = [
  [files.repository, text.repository, "createSupabaseMarketSignalRepository("],
  [files.repository, text.repository, "createServerSupabaseClient("],
  [files.repository, text.repository, "resolvedSource: \"supabase\""],
  [files.sourceStatus, text.sourceStatus, "publicScoreSource: \"real\""],
  [files.sourceStatus, text.sourceStatus, "resolvedSource: \"supabase\""],
  [files.promotionReview, text.promotionReview, "publicDataSource: \"supabase\""],
  [files.promotionReview, text.promotionReview, "scoreSource: \"real\""],
  [files.promotionReview, text.promotionReview, "canSetScoreSourceReal: true"],
  [files.promotionReview, text.promotionReview, "canPromotePublicDataSourceToSupabase: true"],
  [files.readinessSummary, text.readinessSummary, "publicDataSource: \"supabase\""],
  [files.readinessSummary, text.readinessSummary, "scoreSource: \"real\""]
];

const missing = required
  .filter(([, content, phrase]) => !content.includes(phrase))
  .map(([file, , phrase]) => ({ file, phrase }));
const blocked = forbidden
  .filter(([, content, phrase]) => content.includes(phrase))
  .map(([file, , phrase]) => ({ file, phrase }));

const readyLocalGates = (text.nextGateQueue.match(/status: "local_ready"/g) ?? []).length;
const needsReviewGates = (text.nextGateQueue.match(/status: "needs_role_review"/g) ?? []).length;
const blockedWaitingEvidenceGates = (text.nextGateQueue.match(/status: "blocked_waiting_evidence"/g) ?? []).length;
const rejectedPromotionReviews = (text.promotionReview.match(/outcome: "rejected_for_promotion",/g) ?? []).length;
const supabaseRepositoryImplemented = text.supabaseRepository.includes("createLoadedSupabaseMarketSignalRepository");

const status = missing.length === 0 && blocked.length === 0 ? "no_go_safe" : "blocked";

console.log(
  JSON.stringify(
    {
      blocked,
      decision: {
        canPromotePublicDataSourceToSupabase: false,
        canSetScoreSourceReal: false,
        reason:
          "Phase 1 data coverage is complete and the readonly Supabase market-signal adapter has a local preload path, but data-quality/source-depth promotion reviews are rejected for now. Runtime promotion remains NO-GO until those fixes are accepted and the public runtime factory is deliberately switched."
      },
      gateCounts: {
        blockedWaitingEvidenceGates,
        needsReviewGates,
        readyLocalGates,
        rejectedPromotionReviews
      },
      missing,
      mode: "phase_1_mock_to_real_promotion_gate",
      status,
      supabaseRepositoryImplemented
    },
    null,
    2
  )
);

if (status !== "no_go_safe") {
  process.exitCode = 1;
}
