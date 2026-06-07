import fs from "node:fs";

const progressPath = "src/lib/project-progress-score.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [progressPath, componentPath, briefingPath, cssPath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [progressPath, "export type ProjectProgressLane"],
  [progressPath, "getDataCoverageRouteDecision"],
  [progressPath, "dataCoverageRouteDecision"],
  [progressPath, "getProjectProgressSummary"],
  [progressPath, "buildDataQualityEvidenceGate"],
  [progressPath, "buildDataQualityScoreContract"],
  [progressPath, "dataQualityScore: dataQualityScoreContract.score"],
  [progressPath, "freshnessState: \"complete\""],
  [progressPath, "dataQualityEvidenceGate"],
  [progressPath, "dataQualityScoreContract"],
  [progressPath, "adjustedScore"],
  [progressPath, "networkBlocker"],
  [progressPath, "PM project progress:"],
  [progressPath, "Mock MVP product surface"],
  [progressPath, "Mock signal reading flow"],
  [progressPath, "Runtime state guard"],
  [progressPath, "Supabase schema / repository readiness"],
  [progressPath, "Data freshness and quality evidence"],
  [progressPath, "Investment credibility evidence"],
  [progressPath, "CEO execution focus"],
  [progressPath, "DevOps / health / recovery"],
  [progressPath, "Supabase object reachability"],
  [progressPath, "freshness interpretation"],
  [progressPath, "data_runs baseline"],
  [progressPath, "data_freshness candidate"],
  [progressPath, "object reachability ok"],
  [progressPath, "schema shape"],
  [progressPath, "data quality"],
  [progressPath, "source-depth"],
  [progressPath, "scoreSource stays mock"],
  [progressPath, "post-readonly evidence queue"],
  [progressPath, "scoreSource=real"],
  [progressPath, "publicDataSource=supabase"],
  [progressPath, "owner: \"CEO\""],
  [progressPath, "owner: \"Data\""],
  [progressPath, "owner: \"Engineering\""],
  [progressPath, "owner: \"Investment\""],
  [progressPath, "owner: \"PM\""],
  [componentPath, "ProjectProgressPanel"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getRuntimeGateDecisionBrief"],
  [componentPath, "PM Progress Score"],
  [componentPath, "Project progress"],
  [componentPath, "CEO PM runtime progress alignment"],
  [componentPath, "project-progress-runtime-strip"],
  [componentPath, "runtime.displayHeadline"],
  [componentPath, "runtime.displayNextDecision"],
  [componentPath, "runtimeGate.displayRouteTitle"],
  [componentPath, "runtimeGate.displayDecisionPoint"],
  [componentPath, "runtimeGate.displayStatus"],
  [componentPath, "runtimeGate.displayRemoteTrigger"],
  [componentPath, "runtimeGate.displaySourceBoundary"],
  [componentPath, "runtimeGate.displayScoreSource"],
  [componentPath, "runtimeGate.displayBlockedNowTitle"],
  [componentPath, "Evidence gate"],
  [componentPath, "progress.networkBlocker.currentFinding"],
  [componentPath, "project-progress-network-blocker"],
  [componentPath, "Data coverage route / source readiness details"],
  [componentPath, "Data quality evidence gate"],
  [componentPath, "Data coverage route"],
  [componentPath, "formatBoundary"],
  [componentPath, "formatBoolean"],
  [componentPath, "formatNextGate"],
  [componentPath, "formatRequired"],
  [componentPath, "公開資料來源"],
  [componentPath, "分數來源"],
  [componentPath, "CEO 另行命名授權"],
  [componentPath, "允許動作"],
  [componentPath, "封鎖動作"],
  [componentPath, "核准前禁止"],
  [componentPath, "執行前必須完成"],
  [componentPath, "執行前仍封鎖"],
  [componentPath, "progress.dataCoverageRouteDecision.status"],
  [componentPath, "progress.dataCoverageRouteDecision.recommendation"],
  [componentPath, "progress.dataCoverageRouteDecision.blockedReason"],
  [componentPath, "progress.dataCoverageRouteDecision.options.map"],
  [componentPath, "progress.dataCoverageRouteDecision.stopLine"],
  [componentPath, "progress.dataQualityEvidenceGate.completedEvidence.length"],
  [componentPath, "progress.dataQualityEvidenceGate.evidenceProgressPercent"],
  [componentPath, "progress.dataQualityScoreContract.score"],
  [componentPath, "progress.dataQualityScoreContract.passThreshold"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.status"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.requirements.filter"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.universePolicy.symbols.length"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.coverageWindowPolicy.requiredTradingSessions"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.expectedRowPolicy.expectedTotalRows"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.missingRowTolerancePolicy.maxMissingRowsForCoverage"],
  [componentPath, "progress.dataQualityScoreContract.rowCoverage.marketCalendarPolicy.calendarScope"],
  [componentPath, "progress.dataQualityEvidenceGate.missingEvidence.length"],
  [componentPath, "progress.dataQualityEvidenceGate.missingActions.slice(0, 4).map"],
  [componentPath, "action.owner"],
  [componentPath, "action.nextAction"],
  [componentPath, "progress.dataQualityEvidenceGate.stopLine"],
  [briefingPath, "import { BriefingPublicBetaGateSummary }"],
  [briefingPath, "<BriefingPublicBetaGateSummary />"],
  [cssPath, ".project-progress-panel"],
  [cssPath, ".project-progress-meter"],
  [cssPath, ".project-progress-runtime-strip"],
  [cssPath, ".project-progress-network-blocker"],
  [cssPath, ".project-progress-evidence"],
  [cssPath, ".project-progress-route-decision"],
  [cssPath, ".project-progress-evidence ul"],
  [cssPath, ".project-progress-evidence li"],
  [cssPath, ".project-progress-lanes"]
];

const forbiddenLiterals = [
  [progressPath, "adjustedScore: 100"],
  [progressPath, "scoreSource=real approved"],
  [progressPath, "canSetScoreSourceReal: true"],
  [progressPath, "currentPublicSource: \"supabase\""],
  [componentPath, "connect Supabase"],
  [componentPath, "run SQL"],
  [componentPath, "fetch("],
  [componentPath, "runtimeGate.currentDefaultRoute"],
  [componentPath, "runtimeGate.separateRemoteTrigger"],
  [componentPath, "runtimeGate.publicDataSource"],
  [componentPath, "runtimeGate.scoreSource"],
  [componentPath, "runtime.status"],
  [componentPath, "runtime.nextDecision"],
  [componentPath, "public source"],
  [componentPath, "score source"],
  [componentPath, "Public source"],
  [componentPath, "Allowed:"],
  [componentPath, "Forbidden:"],
  [componentPath, "Required before execution:"],
  [componentPath, "? \"yes\" : \"no\""]
];

const mojibakePattern = /[\uE000-\uF8FF\uFFFD]|[嚗餅銝蝡舫摰祇雿輻閮踹]{2,}|\?{2,}/u;

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbiddenLiterals
  .filter(([file, phrase]) => read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);
const mojibake = [progressPath, componentPath]
  .filter((file) => mojibakePattern.test(read(file)))
  .map((file) => `${file}: mojibake-like text`);

console.log(
  JSON.stringify(
    {
      blocked: [...blocked, ...mojibake],
      missing,
      status: missing.length === 0 && blocked.length === 0 && mojibake.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0 || mojibake.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
