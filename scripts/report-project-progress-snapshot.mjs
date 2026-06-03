import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();

const { getProjectProgressSummary } = loadTsModule("src/lib/project-progress-score.ts");
const { getRuntimeReadinessSummary } = loadTsModule("src/lib/runtime-readiness-score.ts");
const { getRuntimeGateDecisionBrief } = loadTsModule("src/lib/runtime-gate-decision-brief.ts");
const { getRuntimeDeliveryCadence } = loadTsModule("src/lib/runtime-delivery-cadence.ts");
const { getRowCoverageSecondAttemptReadiness } = loadTsModule("src/lib/row-coverage-second-attempt-readiness.ts");
const { getFreshnessRuntimeActivationSummary } = loadTsModule("src/lib/freshness-runtime-activation.ts");
const { getFreshnessReadonlyLatestEvidenceSummary } = loadTsModule("src/lib/freshness-readonly-latest-evidence.ts");

const expectedRuntimeRoute = {
  defaultRoute: "post_readonly_runtime_decision",
  optionalStatus: "requires_separate_ceo_named_action",
  separateRemoteTrigger: "CEO explicitly names a bounded schema, freshness, quality, or source-depth gate"
};

const progress = getProjectProgressSummary();
const runtime = getRuntimeReadinessSummary();
const runtimeGateBrief = getRuntimeGateDecisionBrief();
const runtimeDeliveryCadence = getRuntimeDeliveryCadence();
const rowCoverage = getRowCoverageSecondAttemptReadiness();
const freshnessActivation = getFreshnessRuntimeActivationSummary();
const freshnessLatestEvidence = getFreshnessReadonlyLatestEvidenceSummary();

if (
  runtimeGateBrief.currentDefaultRoute !== expectedRuntimeRoute.defaultRoute ||
  runtimeGateBrief.separateRemoteTrigger !== expectedRuntimeRoute.separateRemoteTrigger ||
  !runtimeGateBrief.routeOptions.some((item) => item.status === expectedRuntimeRoute.optionalStatus)
) {
  throw new Error("Runtime route boundary does not match the local progress snapshot contract");
}

const snapshot = {
  mode: "local_project_progress_snapshot",
  status: "local_ready_remote_paused",
  generatedAt: new Date().toISOString(),
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  project: {
    adjustedScore: progress.adjustedScore,
    blockerClosureReadiness: {
      closurePercent: progress.blockerClosureReadinessGate.closurePercent,
      itemCount: progress.blockerClosureReadinessGate.items.length,
      publicDataSource: progress.blockerClosureReadinessGate.publicDataSource,
      scoreSource: progress.blockerClosureReadinessGate.scoreSource,
      status: progress.blockerClosureReadinessGate.status
    },
    headline: progress.headline,
    lanes: progress.lanes.map(({ current, label, owner, weight }) => ({
      current,
      label,
      owner,
      weight
    })),
    nextLift: progress.nextLift,
    rawScore: progress.rawScore,
    stage: progress.stage
  },
  runtime: {
    localPreflightCommand: runtime.localPreflightCommand,
    nextDecision: runtime.nextDecision,
    nextRemoteCommand: runtime.nextRemoteCommand,
    score: runtime.score,
    status: runtime.status
  },
  runtimeRoute: {
    currentDefaultRoute: runtimeGateBrief.currentDefaultRoute,
    decisionPoint: runtimeGateBrief.decisionPoint,
    routeOptions: runtimeGateBrief.routeOptions.map(({ id, nextStep, reason, status, title }) => ({
      id,
      nextStep,
      reason,
      status,
      title
    })),
    separateRemoteTrigger: runtimeGateBrief.separateRemoteTrigger,
    status: runtimeGateBrief.status
  },
  rowCoverage: {
    attemptState: rowCoverage.attemptState,
    nextDecision: rowCoverage.nextDecision,
    publicDataSource: rowCoverage.publicDataSource,
    readiness: rowCoverage.readiness,
    scoreSource: rowCoverage.scoreSource,
    stage: rowCoverage.stage,
    unresolvedCount: rowCoverage.unresolved.length
  },
  freshness: {
    activationState: freshnessActivation.state,
    latestEvidenceStatus: freshnessLatestEvidence.evidenceStatus,
    latestEvidenceAsOfDate: freshnessLatestEvidence.asOfDate,
    nextPublicDataSource: freshnessActivation.nextPublicDataSource,
    publicDataSource: freshnessLatestEvidence.publicDataSource,
    scoreSource: freshnessLatestEvidence.scoreSource
  },
  blockerExecutionQueue: {
    status: "bounded_row_coverage_decision_ready",
    ceoLaneRatio: "Data 45 / Engineering 35 / Legal-Investment 20",
    pmRule: "hold remote execution until separately named, while using the bounded decision gate to keep runtime work moving",
    stopRule: "stop before SQL, Supabase writes, ingestion, public source promotion, or scoreSource=real",
    items: [
      {
        id: "source-rights-and-disclosure",
        owner: "Legal",
        priority: 1,
        nextCommand: "npm run report:source-rights-disclosure-local-review"
      },
      {
        id: "model-credibility",
        owner: "Investment",
        priority: 2,
        nextCommand: "npm run report:model-credibility-local-review"
      },
      {
        id: "data-quality-evidence",
        owner: "Data",
        priority: 3,
        nextCommand: "npm run report:data-quality-field-validity-qa-review"
      }
    ]
  },
  cadenceAssessment: runtimeDeliveryCadence,
  decisionNodes: [
    {
      id: "local-verification",
      owner: "Engineering",
      readiness: "ready",
      status: "passed",
      nextAction: "Keep running full health, progress snapshot, review gates, build, recovery, and post-recovery health in the fixed local order."
    },
    {
      id: "row-coverage-readonly",
      owner: "Data",
      readiness: rowCoverage.readiness,
      status: "bounded_decision_ready_waiting_explicit_remote_execution_request",
      nextAction: "Decision packet is locally ready; execute exactly one bounded readonly attempt only as a separately named action, keep output sanitized, and keep public source mock."
    },
    {
      id: "data-quality-evidence",
      owner: "Data",
      readiness: progress.dataQualityEvidenceGate.status,
      status: "blocked",
      nextAction: "Raise row coverage, field validity, source rights, disclosure, QA, model, and public-claim evidence before any real-score candidacy."
    },
    {
      id: "runtime-public-state",
      owner: "Engineering",
      readiness: runtime.status,
      status: "mock_public_runtime",
      nextAction: "Continue post-readonly runtime interpretation while publicDataSource and scoreSource remain mock."
    },
    {
      id: "source-rights-and-disclosure",
      owner: "Legal",
      readiness: "not_ready",
      status: "blocked",
      nextAction: "Confirm source rights, attribution, redistribution limits, and public wording before any public data-source promotion."
    },
    {
      id: "model-credibility",
      owner: "Investment",
      readiness: "not_ready",
      status: "blocked",
      nextAction: "Review model behavior, backtest limits, downgrade rules, and interpretation policy before real-score candidacy."
    }
  ],
  ceoDecision: {
    currentLaneRatio: "runtime product 70 / blocker closure 20 / governance 10",
    nextMeaningfulGate: "post-readonly runtime decision, then schema/freshness/quality gate",
    recommendation:
      "consolidate the next work into a larger post-readonly runtime product slice; keep mandatory remote and real-data gates intact, but stop creating low-value micro governance slices",
    runtimeDefaultRoute: runtimeGateBrief.currentDefaultRoute,
    runtimeRouteDecisionPoint: runtimeGateBrief.decisionPoint,
    runtimeSeparateRemoteTrigger: runtimeGateBrief.separateRemoteTrigger
  }
};

console.log(JSON.stringify(snapshot, null, 2));

function loadTsModule(relativePath, cache = new Map()) {
  const absolutePath = path.join(root, relativePath);
  const normalizedPath = path.normalize(relativePath);

  if (cache.has(normalizedPath)) {
    return cache.get(normalizedPath).exports;
  }

  const module = { exports: {} };
  cache.set(normalizedPath, module);
  const sourceText = fs.readFileSync(absolutePath, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: absolutePath
  }).outputText;
  const localRequire = createLocalRequire(relativePath, cache);
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(localRequire, module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (specifier === "@/lib/supabase/server") {
      return {
        createServerSupabaseClient() {
          throw new Error("Supabase client is blocked in local project progress snapshot");
        }
      };
    }

    if (specifier.startsWith("@/")) {
      return loadTsModule(`src/${specifier.slice(2)}.ts`, cache);
    }

    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      const resolved = path.normalize(path.join(baseDirectory, `${specifier}.ts`));
      return loadTsModule(resolved, cache);
    }

    return nativeRequire(specifier);
  };
}
