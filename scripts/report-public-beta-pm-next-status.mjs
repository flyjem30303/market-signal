import { spawnSync } from "node:child_process";
import fs from "node:fs";

const commands = {
  mainline: "cmd.exe /c npm run report:beta-mainline-current-route",
  replyRoute: "cmd.exe /c npm run report:public-beta-external-reply-file-route",
  writer: "cmd.exe /c npm run write:public-beta-external-reply-file-template"
};
const defaultReplyPath = "tmp\\public-beta-external-reply.txt";
const replyRouteEnv = fs.existsSync(defaultReplyPath)
  ? { PUBLIC_BETA_EXTERNAL_REPLY_PATH: defaultReplyPath }
  : {};

const mainline = runJson(commands.mainline);
const replyRoute = runJson(commands.replyRoute, { env: replyRouteEnv });

const mainlineReport = mainline.json ?? {};
const replyRouteReport = replyRoute.json ?? {};
const goalReport = mainlineReport.goalReadiness ?? {};
const blockedItems = Array.isArray(goalReport.blockedItems) ? goalReport.blockedItems : [];
const routeDecision = replyRouteReport.routeDecision ?? {};

const report = {
  status: "public_beta_pm_next_status_ready",
  ok: true,
  mode: "public_beta_pm_next_status",
  purpose:
    "Give CEO/PM one compact, no-secret status for the active public Beta GOAL without reopening broad governance.",
  completionPercent: calculateCompletionPercent(goalReport),
  ceoDecision: chooseCeoDecision({ blockedItems, routeDecision }),
  currentRoute: {
    mainlineStatus: mainlineReport.status ?? "unknown",
    pmNextCommand: mainlineReport.pmMainline?.nextCommand ?? "unknown",
    pmAfterCurrentCommand: mainlineReport.pmMainline?.afterCurrentCommand ?? commands.replyRoute,
    replyFileRouteStatus: replyRouteReport.status ?? "unknown",
    replyFileRouteNextCommand: routeDecision.nextCommand ?? replyRouteReport.nextExecutableStep?.command ?? "unknown",
    replyFileRouteReason: routeDecision.reason ?? replyRouteReport.nextExecutableStep?.reason ?? "unknown"
  },
  nextSingleCommand: routeDecision.nextCommand ?? replyRouteReport.nextExecutableStep?.command ?? commands.replyRoute,
  nextCommandChain: normalizeCommands([
    mainlineReport.pmMainline?.nextCommand,
    mainlineReport.pmMainline?.afterCurrentCommand,
    routeDecision.nextCommand,
    ...(Array.isArray(routeDecision.nextCommands) ? routeDecision.nextCommands : [])
  ]),
  remainingHardBlockers: [
    ...platformBlockers(mainlineReport),
    ...a1Blockers(replyRouteReport, goalReport)
  ],
  readyItems: readyItems(goalReport),
  blockedItems,
  proofSummary: {
    runtimeRoutesOk: mainlineReport.runtimeHealth?.allRoutesHttp200 === true,
    runtimeRouteCount: Number(mainlineReport.runtimeHealth?.routeCount ?? 0),
    publicDataSource: mainlineReport.runtimeBoundary?.publicDataSource ?? goalReport.runtimeBoundary?.publicDataSource ?? "mock",
    scoreSource: mainlineReport.runtimeBoundary?.scoreSource ?? goalReport.runtimeBoundary?.scoreSource ?? "mock",
    replyFileRouteLane: routeDecision.lane ?? "unknown",
    replyFileRequiredEnvVar: replyRouteReport.inputSummary?.requiredEnvVar ?? "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
    replyFileTextEchoed: false,
    valuesEchoed: false
  },
  stopLines: [
    "This PM status does not echo platform values, reply-file text, A1 slot summaries, source labels, secrets, or raw payloads.",
    "This PM status does not deploy, mutate hosting, run SQL, connect to Supabase, write evidence, approve source rights, fetch market data, or promote source/score.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    deploymentAuthorized: false,
    evidenceRecorded: false,
    fileTextEchoed: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  },
  sourceReports: {
    embeddedGoalReadiness: {
      parsedJson: Boolean(mainlineReport.goalReadiness),
      source: "report:beta-mainline-current-route.goalReadiness"
    },
    mainlineCurrentRoute: commandStatus(mainline),
    replyFileRoute: commandStatus(replyRoute)
  }
};

console.log(JSON.stringify(report, null, 2));

function calculateCompletionPercent(goalReport) {
  const items = Array.isArray(goalReport.completionItems) ? goalReport.completionItems : [];
  if (items.length === 0) return 0;
  const score = items.reduce((total, item) => {
    if (item.status === "ready") return total + 1;
    if (item.status === "held") return total + 1;
    if (item.status === "ready_for_outcome_gate_candidate") return total + 0.75;
    return total;
  }, 0);
  return Math.round((score / items.length) * 100);
}

function chooseCeoDecision({ blockedItems, routeDecision }) {
  if (routeDecision.status === "external_reply_file_route_waiting_reply_file") {
    return "external_reply_file_is_the_current_hard_blocker_write_local_template_file_then_fill_it";
  }
  if (routeDecision.status === "external_reply_file_route_waiting_existing_file_fill") {
    return "external_reply_file_exists_fill_platform_values_and_a1_no_secret_slots";
  }
  if (routeDecision.status === "external_reply_file_route_waiting_platform_values") {
    return "external_reply_file_exists_fill_two_platform_values_only";
  }
  if (routeDecision.status === "external_reply_file_route_waiting_a1_bounded_repair") {
    return "a1_no_secret_evidence_is_the_current_hard_blocker_request_bounded_repair";
  }
  if (routeDecision.status === "external_reply_file_route_ready_for_workflow_proof") {
    return "run_external_reply_workflow_proof_then_return_to_mainline";
  }
  if (blockedItems.length === 0) return "public_beta_goal_ready_for_final_audit";
  return "continue_route_first_public_beta_mainline";
}

function platformBlockers(mainlineReport) {
  const missing = mainlineReport.platformValues?.missingValues;
  if (Array.isArray(missing) && missing.length > 0) {
    return missing.map((id) => ({
      id,
      owner: "PM or hosting operator",
      status: "missing_external_value",
      nextAction: "fill the external reply file with safe no-secret platform value shape"
    }));
  }
  return [];
}

function a1Blockers(replyRouteReport, goalReport) {
  const counts = replyRouteReport.a1PreviewCounts ?? {};
  const missing = Number(counts.missing ?? 0);
  const needsRepair = Number(counts.needsBoundedRepair ?? 0);
  const rejectedUnsafe = Number(counts.rejectedUnsafeShape ?? 0);
  if (missing + needsRepair + rejectedUnsafe > 0) {
    return [
      {
        id: "A1_TWII_FOUR_SLOT_NO_SECRET_SOURCE_RIGHTS_EVIDENCE",
        owner: "A1 Data / Supabase / Market Evidence",
        status: "missing_or_not_reviewable",
        missing,
        needsBoundedRepair: needsRepair,
        rejectedUnsafeShape: rejectedUnsafe,
        nextAction:
          "fill or repair the four no-secret A1 slots in PUBLIC_BETA_EXTERNAL_REPLY_PATH, then rerun the reply-file route"
      }
    ];
  }
  if (goalReport.blockedItems?.includes("a1_source_rights_and_coverage_frontier")) {
    return [
      {
        id: "A1_SOURCE_RIGHTS_AND_COVERAGE_FRONTIER",
        owner: "PM/A1",
        status: "blocked_until_outcome_gate_candidate",
        nextAction: "run the route-selected workflow proof and PM classification path"
      }
    ];
  }
  return [];
}

function readyItems(goalReport) {
  return (goalReport.completionItems ?? [])
    .filter((item) => item.status === "ready" || item.status === "held")
    .map((item) => ({
      id: item.id,
      status: item.status
    }));
}

function normalizeCommands(commands) {
  return commands
    .filter((command) => typeof command === "string" && command.length > 0 && command !== "unknown")
    .filter((command, index, list) => list.indexOf(command) === index);
}

function runJson(command, options = {}) {
  const parts = command.split(" ");
  const result = spawnSync(parts[0], parts.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...(options.env ?? {}) },
    timeout: 420000,
    windowsHide: true
  });
  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderrPrinted: (result.stderr ?? "").trim().length > 0
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function commandStatus(result) {
  return {
    exitCode: result.exitCode,
    parsedJson: Boolean(result.json),
    stderrPrinted: result.stderrPrinted
  };
}
