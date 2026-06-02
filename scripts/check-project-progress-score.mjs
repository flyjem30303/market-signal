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
  [progressPath, "Supabase schema / repository readiness"],
  [progressPath, "Supabase object reachability"],
  [progressPath, "freshness interpretation"],
  [progressPath, "data_runs baseline"],
  [progressPath, "data_freshness candidate"],
  [progressPath, "資料品質降級規則"],
  [progressPath, "Supabase readonly runtime activation"],
  [progressPath, "freshness read-only metadata run"],
  [progressPath, "scoreSource mock"],
  [progressPath, "freshness read-only metadata evidence"],
  [progressPath, "scoreSource=real"],
  [progressPath, "scoreSource=real"],
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
  [componentPath, "runtimeGate.currentDefaultRoute"],
  [componentPath, "runtimeGate.separateRemoteTrigger"],
  [componentPath, "runtimeGate.publicDataSource"],
  [componentPath, "runtimeGate.scoreSource"],
  [componentPath, "Data coverage route / source readiness details"],
  [componentPath, "Data quality evidence gate"],
  [componentPath, "Data coverage route"],
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
  [briefingPath, "import { ProjectProgressPanel }"],
  [briefingPath, "<ProjectProgressPanel />"],
  [cssPath, ".project-progress-panel"],
  [cssPath, ".project-progress-meter"],
  [cssPath, ".project-progress-runtime-strip"],
  [cssPath, ".project-progress-evidence"],
  [cssPath, ".project-progress-route-decision"],
  [cssPath, ".project-progress-evidence ul"],
  [cssPath, ".project-progress-evidence li"],
  [cssPath, ".project-progress-lanes"]
];

const forbidden = [
  [progressPath, "adjustedScore: 100"],
  [progressPath, "scoreSource=real approved"],
  [progressPath, "canSetScoreSourceReal: true"],
  [progressPath, "currentPublicSource: \"supabase\""],
  [componentPath, "connect Supabase"],
  [componentPath, "run SQL"],
  [componentPath, "fetch("]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
