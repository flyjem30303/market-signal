import fs from "node:fs";

const problems = [];

const componentPath = "src/components/public-beta-launch-readiness-panel.tsx";
const dataPath = "src/lib/public-beta-launch-readiness.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const component = read(componentPath);
const data = read(dataPath);
const dashboard = read(dashboardPath);
const briefing = read(briefingPath);
const css = read(cssPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const renderedRoutes = await checkRenderedRoutes([
  {
    path: "/",
    requiredMarkers: [
      "Single reply checklist",
      "PM reply packet contract",
      "pm_reply_packet_contract_ready",
      "Both platform lines must be present and shape-safe",
      "All four TWII slots must include the four no-secret fields",
      "Forbidden content",
      "Supabase URLs",
      "private preview tokens",
      "raw market data",
      "do_not_promote_publicDataSource_or_scoreSource_from_this_request",
      "Only missing now",
      "missing reply blocks",
      "missing_external_reply_blocks_present",
      "Missing now - Beta platform two values",
      "Missing now - A1 TWII four evidence slots",
      "PM one-screen reply packet",
      "Block 1 - Beta platform two values",
      "Block 2 - A1 TWII four-slot no-secret evidence",
      "Copy this one screen into the PM/A1 handoff",
      "A1 required per slot",
      "Complete when",
      "2 platform lines + 4 A1 slots",
      "BETA_HOSTING_PROJECT_NAME",
      "BETA_TEMPORARY_URL",
      "vendor-terms-evidence",
      "asset-mapping-evidence",
      "A1 PM classification queue",
      "A1 PM classification quick map",
      "ready_for_pm_after_a1_no_secret_reply",
      "Complete, no-secret, responsive",
      "One narrow no-secret clarification can repair the slot",
      "do_not_emit_apply_command",
      "A1 TWII PM fast triage packet",
      "A1 bounded repair request",
      "a1_twii_local_evidence_bounded_repair_request_ready",
      "Smallest no-secret repairs for A1 before PM classification.",
      "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
      "no-secret TWII field-contract decision label",
      "ready_waiting_a1_no_secret_reply",
      "Dry-run slot triage",
      "dry-run only",
      "do_not_apply_from_this_packet",
      "do_not_fetch_market_data_from_this_packet",
      "accepted / rejected / needs_bounded_repair / blocked",
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
      "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
      "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
      "cmd.exe /c npm run run:public-beta-post-reply-route-once",
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
      "A1 fail-fast policy",
      "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain",
      "A1 classification is intentionally skipped until all four no-secret TWII evidence slots are present",
      "a1-source-rights-readiness-summary",
      "Operational GOAL v3 execution first",
      "fast_track_active",
      "close only the active external blocker chain",
      "2 blocker groups: 2 platform lines + 4 A1 evidence slots"
    ]
  },
  {
    path: "/briefing",
    requiredMarkers: [
      "Single reply checklist",
      "PM reply packet contract",
      "pm_reply_packet_contract_ready",
      "Both platform lines must be present and shape-safe",
      "All four TWII slots must include the four no-secret fields",
      "Forbidden content",
      "Supabase URLs",
      "private preview tokens",
      "raw market data",
      "do_not_promote_publicDataSource_or_scoreSource_from_this_request",
      "Only missing now",
      "missing reply blocks",
      "missing_external_reply_blocks_present",
      "Missing now - Beta platform two values",
      "Missing now - A1 TWII four evidence slots",
      "PM one-screen reply packet",
      "Block 1 - Beta platform two values",
      "Block 2 - A1 TWII four-slot no-secret evidence",
      "Copy this one screen into the PM/A1 handoff",
      "A1 required per slot",
      "Complete when",
      "2 platform lines + 4 A1 slots",
      "BETA_HOSTING_PROJECT_NAME",
      "BETA_TEMPORARY_URL",
      "vendor-terms-evidence",
      "asset-mapping-evidence",
      "A1 PM classification queue",
      "A1 PM classification quick map",
      "ready_for_pm_after_a1_no_secret_reply",
      "Complete, no-secret, responsive",
      "One narrow no-secret clarification can repair the slot",
      "do_not_emit_apply_command",
      "A1 TWII PM fast triage packet",
      "A1 bounded repair request",
      "a1_twii_local_evidence_bounded_repair_request_ready",
      "Smallest no-secret repairs for A1 before PM classification.",
      "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
      "no-secret TWII field-contract decision label",
      "ready_waiting_a1_no_secret_reply",
      "Dry-run slot triage",
      "dry-run only",
      "do_not_apply_from_this_packet",
      "do_not_fetch_market_data_from_this_packet",
      "accepted / rejected / needs_bounded_repair / blocked",
      "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
      "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
      "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
      "cmd.exe /c npm run run:public-beta-post-reply-route-once",
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
      "A1 fail-fast policy",
      "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain",
      "A1 classification is intentionally skipped until all four no-secret TWII evidence slots are present",
      "a1-source-rights-readiness-summary",
      "Operational GOAL v3 execution first",
      "fast_track_active",
      "close only the active external blocker chain",
      "2 blocker groups: 2 platform lines + 4 A1 evidence slots"
    ]
  }
]);

const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
const a1OneRunnerCommand = "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once";

for (const [filePath, source, phrase] of [
  [componentPath, component, "PublicBetaLaunchReadinessPanel"],
  [componentPath, component, "Public Beta launch readiness"],
  [componentPath, component, "public-beta-operational-goal"],
  [componentPath, component, 'aria-label="Operational GOAL v3 execution first"'],
  [componentPath, component, "Current hard blockers"],
  [componentPath, component, "Remaining hard blockers"],
  [componentPath, component, "2 blocker groups: 2 platform lines + 4 A1 evidence slots"],
  [componentPath, component, "public-beta-external-input-request"],
  [componentPath, component, "Public Beta external input request"],
  [componentPath, component, "Request blocks"],
  [componentPath, component, "A1 fail-fast policy"],
  [componentPath, component, "a1FailFastPolicy"],
  [componentPath, component, "missingOnlyReplyPacket"],
  [componentPath, component, "public-beta-missing-reply-block"],
  [componentPath, component, "oneScreenReplyPacket"],
  [componentPath, component, "Public Beta one-screen platform reply block"],
  [componentPath, component, "Public Beta one-screen A1 reply block"],
  [componentPath, component, "A1 required per slot"],
  [componentPath, component, "Complete when"],
  [componentPath, component, "Single reply checklist"],
  [componentPath, component, "2 platform lines + 4 A1 slots"],
  [componentPath, component, "Public Beta single reply checklist"],
  [componentPath, component, "replyPacketContract"],
  [componentPath, component, "Forbidden content"],
  [componentPath, component, "Shape-safe one-runner"],
  [componentPath, component, "A1 evidence one-runner"],
  [componentPath, component, "After reply"],
  [componentPath, component, "Current executable step"],
  [componentPath, component, "External reply dry-run intake"],
  [componentPath, component, "Complete reply next command"],
  [componentPath, component, "Unsafe or incomplete reply fallback"],
  [componentPath, component, "replyIntakeDryRun"],
  [componentPath, component, "public-beta-platform-values-guide"],
  [componentPath, component, "Beta platform value reply format"],
  [componentPath, component, "After validation"],
  [componentPath, component, "Allowed values"],
  [componentPath, component, "Blocked values"],
  [componentPath, component, "PM classified"],
  [componentPath, component, "Next route"],
  [componentPath, component, "A1 reply format"],
  [componentPath, component, "public-beta-a1-classification-quick-map"],
  [componentPath, component, 'aria-label="A1 PM classification quick map"'],
  [componentPath, component, "pmClassificationQuickMap"],
  [componentPath, component, "A1 PM classification queue"],
  [componentPath, component, "public-beta-a1-fast-triage"],
  [componentPath, component, 'aria-label="A1 TWII PM fast triage packet"'],
  [componentPath, component, "public-beta-a1-bounded-repair"],
  [componentPath, component, 'aria-label="A1 bounded repair request"'],
  [componentPath, component, "boundedRepairRequest"],
  [componentPath, component, "PM review rule"],
  [componentPath, component, "Source-rights and ingestion"],
  [componentPath, component, "Current blockers"],
  [componentPath, component, "Next PM command"],
  [componentPath, component, "Runtime boundary"],
  [dataPath, data, "getPublicBetaLaunchReadinessSummary"],
  [dataPath, data, "operationalGoalGuide"],
  [dataPath, data, "Operational GOAL v3 execution first"],
  [dataPath, data, "close only the active external blocker chain"],
  [dataPath, data, "platform values, packet proof, A1 evidence classification, or runtime route health"],
  [dataPath, data, "full review gate is reserved for milestone integration"],
  [dataPath, data, "Public Beta pre-launch executable state"],
  [dataPath, data, "External input request"],
  [dataPath, data, "missingOnlyReplyPacket"],
  [dataPath, data, "Only missing now"],
  [dataPath, data, "Missing now - Beta platform two values"],
  [dataPath, data, "Missing now - A1 TWII four evidence slots"],
  [dataPath, data, "missing_external_reply_blocks_present"],
  [dataPath, data, "oneScreenReplyPacket"],
  [dataPath, data, "PM one-screen reply packet"],
  [dataPath, data, "Block 1 - Beta platform two values"],
  [dataPath, data, "Block 2 - A1 TWII four-slot no-secret evidence"],
  [dataPath, data, "Copy this one screen into the PM/A1 handoff"],
  [dataPath, data, "both beta platform lines are filled with safe non-secret values"],
  [dataPath, data, "all four A1 TWII slot summaries are provided in no-secret shape"],
  [dataPath, data, "response-readiness passes before the post-reply runner"],
  [dataPath, data, "replyChecklist"],
  [dataPath, data, "replyPacketContract"],
  [dataPath, data, "PM reply packet contract"],
  [dataPath, data, "pm_reply_packet_contract_ready"],
  [dataPath, data, "Both platform lines must be present and shape-safe"],
  [dataPath, data, "All four TWII slots must include the four no-secret fields"],
  [dataPath, data, "Supabase URLs"],
  [dataPath, data, "private preview tokens"],
  [dataPath, data, "raw market data"],
  [dataPath, data, "platform_two_values_shape_valid"],
  [dataPath, data, "a1_four_twii_slots_present_in_no_secret_shape"],
  [dataPath, data, "response_readiness_routes_to_post_reply_one_runner"],
  [dataPath, data, "do_not_promote_publicDataSource_or_scoreSource_from_this_request"],
  [dataPath, data, "afterAnyReplyFirstCommand"],
  [dataPath, data, "afterReplyNextExecutableStep"],
  [dataPath, data, "replyIntakeDryRun"],
  [dataPath, data, "a1PmPreviewCommand"],
  [dataPath, data, "cmd.exe /c npm run report:public-beta-a1-reply-pm-classification-preview"],
  [dataPath, data, "routeCommand"],
  [dataPath, data, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [dataPath, data, "PUBLIC_BETA_EXTERNAL_REPLY_PATH"],
  [dataPath, data, "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run"],
  [dataPath, data, "fileTextEchoed: false"],
  [dataPath, data, "valueEchoed: false"],
  [dataPath, data, "a1FailFastPolicy"],
  [dataPath, data, "a1_twii_four_slot_no_secret_evidence_missing_skip_a1_chain"],
  [dataPath, data, "A1 classification is intentionally skipped until all four no-secret TWII evidence slots are present"],
  [dataPath, data, "a1-source-rights-readiness-summary"],
  [dataPath, data, "external_reply_file_route"],
  [dataPath, data, "shortest executable route"],
  [dataPath, data, "cmd.exe /c npm run report:public-beta-external-input-copy-packet"],
  [dataPath, data, "cmd.exe /c npm run report:public-beta-external-input-request"],
  [dataPath, data, "cmd.exe /c npm run report:public-beta-external-input-response-readiness"],
  [dataPath, data, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [dataPath, data, "beta_platform_two_values"],
  [dataPath, data, "a1_twii_four_slot_no_secret_evidence"],
  [dataPath, data, "cmd.exe /c npm run report:beta-mainline-current-route"],
  [dataPath, data, "collect_external_input_response_then_run_public_beta_post_reply_one_runner"],
  [dataPath, data, "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>"],
  [dataPath, data, "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"],
  [dataPath, data, "Do not print or store platform values in repo."],
  [dataPath, data, "Do not record A1 evidence from this report."],
  [dataPath, data, "Do not approve source rights from this report."],
  [dataPath, data, "Do not deploy from this report."],
  [dataPath, data, "A1 TWII evidence task board"],
  [dataPath, data, "pmClassificationQueue"],
  [dataPath, data, "fastTriagePacket"],
  [dataPath, data, "boundedRepairRequest"],
  [dataPath, data, "A1 bounded repair request"],
  [dataPath, data, "a1_twii_local_evidence_bounded_repair_request_ready"],
  [dataPath, data, "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request"],
  [dataPath, data, "no-secret TWII field-contract decision label"],
  [dataPath, data, "A1 TWII PM fast triage packet"],
  [dataPath, data, "pmClassificationQuickMap"],
  [dataPath, data, "A1 PM classification quick map"],
  [dataPath, data, "ready_for_pm_after_a1_no_secret_reply"],
  [dataPath, data, "Complete, no-secret, responsive"],
  [dataPath, data, "One narrow no-secret clarification can repair the slot"],
  [dataPath, data, "do_not_emit_apply_command"],
  [dataPath, data, "ready_waiting_a1_no_secret_reply"],
  [dataPath, data, "do_not_apply_from_this_packet"],
  [dataPath, data, "do_not_fetch_market_data_from_this_packet"],
  [dataPath, data, "oneRunnerCommandAfterReply"],
  [dataPath, data, "thirdPmCommandAfterReply"],
  [dataPath, data, "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once"],
  [dataPath, data, "PM may classify only pending queue slots after response-readiness and the no-secret shape guard"],
  [dataPath, data, "PM only classifies accepted, rejected, needs_bounded_repair, or blocked"],
  [dataPath, data, "Level-1 MVP coverage: 182/360"],
  [dataPath, data, "Readonly pre-execution packet: ready_to_present_not_execute."],
  [dataPath, data, "No secrets, no raw market data, no Supabase write, no real source, and no real score before promotion gates pass."],
  [dashboardPath, dashboard, "import { PublicBetaLaunchReadinessPanel }"],
  [dashboardPath, dashboard, "<PublicBetaLaunchReadinessPanel compact />"],
  [briefingPath, briefing, "import { PublicBetaLaunchReadinessPanel }"],
  [briefingPath, briefing, "<PublicBetaLaunchReadinessPanel />"],
  [cssPath, css, ".public-beta-launch-readiness"],
  [cssPath, css, ".public-beta-operational-goal"],
  [cssPath, css, ".public-beta-external-input-request"],
  [cssPath, css, ".public-beta-missing-reply-block"],
  [cssPath, css, ".public-beta-platform-values-guide"],
  [cssPath, css, ".public-beta-a1-task-board"],
  [cssPath, css, ".public-beta-a1-fast-triage"],
  [cssPath, css, ".public-beta-a1-bounded-repair"],
  [cssPath, css, ".public-beta-a1-classification-quick-map"],
  [cssPath, css, ".public-beta-a1-classification-queue"],
  [cssPath, css, ".public-beta-data-readiness-guide"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-launch-readiness-panel"],
  [reviewGatePath, reviewGate, 'name: "public-beta-launch-readiness-panel"'],
  [statusPath, status, "Latest public Beta launch readiness visibility slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const a1AfterReplyStart = data.indexOf("afterA1Reply: [");
const a1AfterReplyEnd = data.indexOf("],", a1AfterReplyStart);
const a1AfterReplyBlock = a1AfterReplyStart >= 0 && a1AfterReplyEnd > a1AfterReplyStart
  ? data.slice(a1AfterReplyStart, a1AfterReplyEnd)
  : "";
if (!a1AfterReplyBlock.includes("responseReadinessCommand")) {
  problems.push(`${dataPath} A1 visible after-reply route must include responseReadinessCommand`);
}
if (!a1AfterReplyBlock.includes("a1PostReplyOneRunnerCommand")) {
  problems.push(`${dataPath} A1 visible after-reply route must include a1PostReplyOneRunnerCommand`);
}
if (
  a1AfterReplyBlock.indexOf("responseReadinessCommand") < 0 ||
  a1AfterReplyBlock.indexOf("a1PostReplyOneRunnerCommand") < 0 ||
  a1AfterReplyBlock.indexOf("responseReadinessCommand") > a1AfterReplyBlock.indexOf("a1PostReplyOneRunnerCommand")
) {
  problems.push(`${dataPath} A1 visible after-reply route should run response-readiness before A1 one-runner`);
}

if (!data.includes(`const responseReadinessCommand = "${responseReadinessCommand}"`)) {
  problems.push(`${dataPath} should define a shared responseReadinessCommand constant`);
}
if (!data.includes(`const a1PostReplyOneRunnerCommand = "${a1OneRunnerCommand}"`)) {
  problems.push(`${dataPath} should keep the A1 one-runner constant`);
}

if (pkg.scripts?.["check:public-beta-launch-readiness-panel"] !== "node scripts/check-public-beta-launch-readiness-panel.mjs") {
  problems.push(`${packagePath} missing check:public-beta-launch-readiness-panel`);
}

for (const [filePath, source] of [
  [componentPath, component],
  [dataPath, data],
  [cssPath, css]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
  const mojibakeHits = findMojibakeMarkers(source);
  if (mojibakeHits.length > 0) problems.push(`${filePath} contains mojibake markers: ${mojibakeHits.join(", ")}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "public_beta_launch_readiness_panel_visible",
      surfaces: renderedRoutes.map((route) => ({
        markerCount: route.markerCount,
        path: route.path,
        status: route.status
      })),
      nextCommand: "report:public-beta-external-input-copy-packet",
      platformValueGuide: "visible",
      worktreeGuide: "visible",
      a1TaskBoard: "visible",
      a1MiniPacketGuide: "visible",
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource: "supabase"/u,
    /scoreSource: "real"/u
  ];
}

async function checkRenderedRoutes(routes) {
  const baseUrl = process.env.PUBLIC_BETA_LOCALHOST_BASE_URL ?? "http://localhost:3000";
  const results = [];

  for (const route of routes) {
    const url = new URL(route.path, baseUrl);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const html = await response.text();
      const missingMarkers = route.requiredMarkers.filter((marker) => !html.includes(marker));
      if (response.status !== 200) {
        problems.push(`${route.path} expected HTTP 200, received ${response.status}`);
      }
      for (const marker of missingMarkers) {
        problems.push(`${route.path} missing rendered marker: ${marker}`);
      }
      checkA1RenderedAfterReplyOrder(route.path, html);
      checkA1RenderedClassificationQueueOrder(route.path, html);
      results.push({
        markerCount: route.requiredMarkers.length - missingMarkers.length,
        path: route.path,
        status: response.status
      });
    } catch (error) {
      problems.push(`${route.path} rendered check failed: ${error instanceof Error ? error.message : String(error)}`);
      results.push({
        markerCount: 0,
        path: route.path,
        status: "fetch_failed"
      });
    }
  }

  return results;
}

function checkA1RenderedAfterReplyOrder(path, html) {
  const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
  const a1OneRunnerCommand = "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once";
  const start = html.indexOf("PM review rule");
  const end = html.indexOf("A1 PM classification queue", start);
  const segment = start >= 0 && end > start ? html.slice(start, end) : "";

  if (!segment) {
    problems.push(`${path} missing rendered A1 PM review rule segment for after-reply order check`);
    return;
  }

  const responseIndex = segment.indexOf(responseReadinessCommand);
  const oneRunnerIndex = segment.indexOf(a1OneRunnerCommand);
  if (responseIndex < 0) {
    problems.push(`${path} A1 rendered PM review segment missing response-readiness command`);
  }
  if (oneRunnerIndex < 0) {
    problems.push(`${path} A1 rendered PM review segment missing A1 one-runner command`);
  }
  if (responseIndex >= 0 && oneRunnerIndex >= 0 && responseIndex > oneRunnerIndex) {
    problems.push(`${path} A1 rendered PM review segment should show response-readiness before A1 one-runner`);
  }
}

function checkA1RenderedClassificationQueueOrder(path, html) {
  const commands = [
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
    "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route"
  ];
  const start = html.indexOf("A1 PM classification queue");
  const end = html.indexOf("Source-rights and ingestion", start);
  const segment = start >= 0 && end > start ? html.slice(start, end) : "";

  if (!segment) {
    problems.push(`${path} missing rendered A1 PM classification queue segment for command-order check`);
    return;
  }

  const indexes = commands.map((command) => segment.indexOf(command));
  commands.forEach((command, index) => {
    if (indexes[index] < 0) {
      problems.push(`${path} A1 rendered classification queue missing command: ${command}`);
    }
  });

  for (let index = 1; index < indexes.length; index += 1) {
    if (indexes[index - 1] >= 0 && indexes[index] >= 0 && indexes[index - 1] > indexes[index]) {
      problems.push(`${path} A1 rendered classification queue command order is not response-readiness -> one-runner -> shape guard -> PM classification`);
      break;
    }
  }
}

function findMojibakeMarkers(source) {
  const markers = ["嚙", "銝", "蝷", "鞈", "撠", "甇", "餃", "", "", "", "", "", "�"];
  return markers.filter((marker) => source.includes(marker));
}
