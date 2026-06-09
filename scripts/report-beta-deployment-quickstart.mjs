const hostingProjectNameProvided = hasValue(process.env.BETA_HOSTING_PROJECT_NAME);
const temporaryBetaUrlProvided = hasValue(process.env.BETA_TEMPORARY_URL);
const missingPlatformValues = [
  hostingProjectNameProvided ? null : "BETA_HOSTING_PROJECT_NAME",
  temporaryBetaUrlProvided ? null : "BETA_TEMPORARY_URL"
].filter(Boolean);
const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";

const quickstart = {
  status: "ok",
  guardedStatus: "beta_deployment_quickstart_ready",
  mode: "pm_public_beta_deployment_quickstart",
  ceoDecision: "use_quickstart_as_single_pm_entry_and_do_not_reopen_broad_governance",
  currentGateStatus:
    missingPlatformValues.length > 0
      ? "blocked_waiting_two_platform_values"
      : "platform_values_present_ready_for_public_beta_post_reply_one_runner",
  completionFocus: "public_beta_pre_launch_executable_state",
  operatorShortcut: buildOperatorShortcut(missingPlatformValues),
  pmNow: {
    action:
      missingPlatformValues.length > 0
        ? "use_single_external_input_request_for_platform_values_and_a1_evidence"
        : "run_public_beta_post_reply_one_runner",
    command:
      missingPlatformValues.length > 0
        ? "cmd.exe /c npm run report:public-beta-external-input-request"
        : postReplyOneRunnerCommand,
    intakeCommand: "cmd.exe /c npm run report:beta-platform-two-value-intake-command",
    missingPlatformValues,
    doNotCollectMoreThanTheseValues: missingPlatformValues.length > 0
  },
  nextExecutableStep: {
    lane: missingPlatformValues.length > 0 ? "external_input_request" : "public_beta_post_reply_one_runner",
    command:
      missingPlatformValues.length > 0
        ? "cmd.exe /c npm run report:public-beta-external-input-request"
        : postReplyOneRunnerCommand,
    afterSuccess:
      missingPlatformValues.length > 0
        ? "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
        : "cmd.exe /c npm run report:beta-mainline-current-route"
  },
  afterPmNow: [
    {
      step: "show_single_external_input_request_while_values_are_missing",
      command: "cmd.exe /c npm run report:public-beta-external-input-request"
    },
    {
      step: "show_ephemeral_two_value_intake_command",
      command: "cmd.exe /c npm run report:beta-platform-two-value-intake-command"
    },
    {
      step: "check_after_reply_response_readiness",
      command: "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    },
    {
      step: "run_public_beta_post_reply_one_runner",
      command: postReplyOneRunnerCommand
    },
    {
      step: "return_to_pm_mainline_route_when_needed",
      command: "cmd.exe /c npm run report:beta-mainline-current-route"
    }
  ],
  parallelLanes: {
    a1: "continue_source_rights_and_coverage_readiness_only",
    a2: "keep_public_trust_copy_stable_unless_launch_blocking"
  },
  currentEvidence: {
    platformValues: {
      hostingProjectNameProvided,
      temporaryBetaUrlProvided,
      valuesAreNotPrinted: true
    },
    reviewedArtifactAccepted: false,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    routeHealthIsDelegatedTo: "cmd.exe /c npm run check:beta-runtime-fast-health",
    coreRouteQuickProofIsDelegatedTo: "cmd.exe /c npm run check:public-beta-core-route-quick-proof"
  },
  verification: {
    focusedChecks: [
      "cmd.exe /c npm run check:beta-deployment-quickstart",
      "cmd.exe /c npm run check:beta-platform-proof-status",
      "cmd.exe /c npm run check:beta-platform-values-route-preview",
      "cmd.exe /c npm run check:beta-runtime-fast-health"
    ],
    fullReviewGateWhen: "before deployment execution, source promotion, score promotion, or public launch claim"
  },
  stopLines: [
    "No deployment is authorized by this quickstart.",
    "No hosting resource is created or mutated by this quickstart.",
    "No platform environment value is printed by this quickstart.",
    "No SQL is executed by this quickstart.",
    "No Supabase connection, read, or write is executed by this quickstart.",
    "No staging rows or daily_prices rows are created or modified by this quickstart.",
    "No raw market data is fetched, stored, ingested, or committed by this quickstart.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed by this quickstart.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  sourceReports: {
    betaLaunchNextAction: {
      delegatedToManualPmRoute: "cmd.exe /c npm run report:beta-launch-next-action"
    },
    betaPreExecutionPacketReadiness: {
      delegatedToManualPmRoute: "cmd.exe /c npm run report:beta-pre-execution-packet-readiness"
    },
    publicBetaCoreRouteQuickProof: {
      delegatedToFocusedGate: "cmd.exe /c npm run check:public-beta-core-route-quick-proof"
    }
  }
};

console.log(JSON.stringify(quickstart, null, 2));

function buildOperatorShortcut(missingPlatformValues) {
  return {
    mode: "ninety_second_operator_handoff",
    providerRecommendation: "Vercel first; use Netlify or Cloudflare Pages only if Vercel is unavailable.",
    operatorReadsOnly: [
      "hosting project or site name",
      "public https temporary Beta URL"
    ],
    operatorReplyTemplate: [
      "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
      "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
    ],
    currentlyMissing: missingPlatformValues,
    doneWhen:
      missingPlatformValues.length === 0
        ? "two platform values are present locally; PM runs the public Beta post-reply one-runner"
        : "operator returns only the missing two-value fields and PM reruns response-readiness before the public Beta post-reply one-runner",
    doNotOpen: [
      "Supabase dashboard for this step",
      "DNS/custom domain settings",
      "billing or production launch settings",
      "platform token, secret, key, password, invite, or private preview settings"
    ],
    afterReplyCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    afterReplyProofRunnerCommand: postReplyOneRunnerCommand
  };
}

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}
