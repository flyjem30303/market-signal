import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-post-write-review-contract-no-execution.json";
const sourceRecoveryPath = "data/evidence-intake/phase-1-write-runner-rollback-or-quarantine-contract-no-execution.json";
const problems = [];

const artifact = readJson(artifactPath);
const sourceRecovery = readJson(sourceRecoveryPath);

validateSourceRecovery();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "phase_1_write_runner_post_write_review_contract_no_execution_ready" : "blocked",
      reviewDecision: artifact.reviewDecision ?? null,
      reviewMode: artifact.reviewMode ?? null,
      sourceRecoveryStatus: artifact.sourceRecoveryStatus ?? null,
      postWriteReviewPrepared: artifact.postWriteReviewPrepared ?? null,
      aggregateOnlyReview: artifact.aggregateOnlyReview ?? null,
      promotionAllowedNow: artifact.promotionAllowedNow ?? null,
      publicDataSourcePromotionAllowedNow: artifact.publicDataSourcePromotionAllowedNow ?? null,
      scoreSourceRealPromotionAllowedNow: artifact.scoreSourceRealPromotionAllowedNow ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      implementationAllowedNow: artifact.implementationAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      safety: artifact.safety ?? {},
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceRecovery() {
  if (sourceRecovery.status !== "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready") {
    problems.push("source recovery status mismatch");
  }
  if (sourceRecovery.nextRoute !== "phase_1_write_runner_post_write_review_contract_no_execution") {
    problems.push("source recovery nextRoute mismatch");
  }
}

function validateArtifact() {
  if (artifact.status !== "phase_1_write_runner_post_write_review_contract_no_execution_ready") {
    problems.push("artifact status mismatch");
  }
  if (artifact.postWriteReviewPrepared !== true) problems.push("postWriteReviewPrepared must be true");
  if (artifact.aggregateOnlyReview !== true) problems.push("aggregateOnlyReview must be true");
  if (artifact.promotionAllowedNow !== false) problems.push("promotionAllowedNow must be false");
  if (artifact.publicDataSourcePromotionAllowedNow !== false) {
    problems.push("publicDataSourcePromotionAllowedNow must be false");
  }
  if (artifact.scoreSourceRealPromotionAllowedNow !== false) {
    problems.push("scoreSourceRealPromotionAllowedNow must be false");
  }
  if (artifact.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (artifact.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (artifact.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
  if (artifact.safety?.publicDataSource !== "mock") problems.push("publicDataSource must stay mock");
  if (artifact.safety?.scoreSource !== "mock") problems.push("scoreSource must stay mock");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
