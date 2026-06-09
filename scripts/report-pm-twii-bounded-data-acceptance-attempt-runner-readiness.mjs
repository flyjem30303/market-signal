import fs from "node:fs";

const designPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_RUNNER_DESIGN.md";
const postRunTemplatePath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_ATTEMPT_POST_RUN_REVIEW_TEMPLATE.md";
const design = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : "";
const postRunTemplate = fs.existsSync(postRunTemplatePath) ? fs.readFileSync(postRunTemplatePath, "utf8") : "";

const requiredDesignPhrases = [
  "twii_bounded_data_acceptance_attempt_runner_design_ready_no_execution",
  "mode no-write-preview",
  "candidateRowsAcceptedNow=false",
  "dailyPricesMutated=false",
  "supabaseConnectionAttempted=false",
  "sqlExecuted=false",
  "rowCoverageScoringAllowed=false",
  "publicDataSource=mock",
  "scoreSource=mock"
];
const requiredTemplatePhrases = [
  "twii_bounded_data_acceptance_attempt_post_run_review_template_ready",
  "`candidateRowsAcceptedNow=false`",
  "`dailyPricesMutated=false`",
  "`supabaseConnectionAttempted=false`",
  "`sqlExecuted=false`",
  "`rowCoverageScoringAllowed=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
];

const missingDesignPhrases = requiredDesignPhrases.filter((phrase) => !design.includes(phrase));
const missingTemplatePhrases = requiredTemplatePhrases.filter((phrase) => !postRunTemplate.includes(phrase));
const ready = missingDesignPhrases.length === 0 && missingTemplatePhrases.length === 0;

const report = {
  status: ready
    ? "pm_twii_bounded_data_acceptance_attempt_runner_readiness_ready_no_execution"
    : "pm_twii_bounded_data_acceptance_attempt_runner_readiness_blocked_contract_incomplete",
  ok: true,
  mode: "pm_twii_bounded_data_acceptance_attempt_runner_readiness",
  owner: "PM",
  designPath,
  postRunTemplatePath,
  missingDesignPhrases,
  missingTemplatePhrases,
  futureCommandShape:
    "cmd.exe /c npm run run:twii-bounded-data-acceptance-attempt -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview",
  decisionMeaning: ready
    ? "ready_for_later_no_write_preview_runner_implementation_goal_only"
    : "blocked_until_runner_design_and_post_run_template_complete",
  nextAction: ready
    ? "PM may propose a later no-write preview runner implementation GOAL; this report does not implement or execute it."
    : "Complete runner design and post-run review template.",
  authorizationBoundary: {
    runnerImplementedNow: false,
    runnerExecutionAllowedNow: false,
    dataAcceptanceAttemptAllowedNow: false,
    candidateRowsAcceptedNow: false,
    rowCoverageScoringAllowed: false,
    remoteTwiiProbeAllowed: false,
    marketDataRetrievalAllowed: false,
    sourceDerivedCandidateGenerationAllowed: false,
    supabaseOperationAllowed: false,
    stagingWriteExecutionAllowed: false,
    dailyPricesMutationAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    remoteTwiiProbeExecuted: false,
    candidateArtifactCreated: false,
    sourceDerivedCandidateRowsCreated: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    candidateRowsAccepted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));
