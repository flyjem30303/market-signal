import { spawnSync } from "node:child_process";
import fs from "node:fs";

const defaultReplyFilePath = "tmp\\public-beta-external-reply.txt";
const routeEnv = { ...process.env };
if (!routeEnv.PUBLIC_BETA_EXTERNAL_REPLY_PATH && fs.existsSync(defaultReplyFilePath)) {
  routeEnv.PUBLIC_BETA_EXTERNAL_REPLY_PATH = defaultReplyFilePath;
}

const commands = {
  a1Preview: "cmd.exe /c npm run report:public-beta-a1-reply-pm-classification-preview",
  copyPacket: "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
  dryRun: "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run",
  fillFromEnv: "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env",
  template: "cmd.exe /c npm run report:public-beta-external-reply-file-template",
  writer: "cmd.exe /c npm run write:public-beta-external-reply-file-template",
  workflowProof: "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"
};

const dryRun = runJson(commands.dryRun);
const a1Preview = runJson(commands.a1Preview);
const route = chooseRoute({ a1Preview: a1Preview.json, dryRun: dryRun.json });

const report = {
  status: route.status,
  ok: true,
  mode: "public_beta_external_reply_file_route",
  purpose:
    "Give PM one no-secret route decision for the local external reply file. This reads only safe JSON summaries from dry-run intake and A1 PM preview; it does not echo file text, print platform values, store values, record evidence, approve rights, deploy, run SQL, touch Supabase, or fetch market data.",
  routeDecision: route,
  inputSummary: {
    defaultReplyFilePath,
    defaultReplyFilePathUsed:
      !process.env.PUBLIC_BETA_EXTERNAL_REPLY_PATH && routeEnv.PUBLIC_BETA_EXTERNAL_REPLY_PATH === defaultReplyFilePath,
    requiredEnvVar: "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
    dryRunStatus: dryRun.json?.status ?? "unavailable",
    a1PreviewStatus: a1Preview.json?.status ?? "unavailable",
    fileTextEchoed: false,
    slotTextEchoed: false,
    valueEchoed: false
  },
  a1PreviewCounts: a1Preview.json?.counts ?? {
    missing: 0,
    needsBoundedRepair: 0,
    rejectedUnsafeShape: 0,
    required: 4,
    reviewableNoSecretShape: 0
  },
  platformShape: {
    ok: dryRun.json?.platformTwoValues?.ok === true,
    problemCount: Number(dryRun.json?.platformTwoValues?.problemCount ?? 0),
    valuesEchoed: false
  },
  nextExecutableStep: {
    command: route.nextCommand,
    lane: route.lane,
    reason: route.reason
  },
  nextCommands: route.nextCommands,
  sourceReports: {
    a1Preview: commandStatus(a1Preview),
    dryRun: commandStatus(dryRun)
  },
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
    slotTextEchoed: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  },
  stopLines: [
    "This route report does not echo the reply file text.",
    "This route report does not print platform values.",
    "This route report does not echo A1 slot summaries or source labels.",
    "This route report does not record evidence or approve source rights.",
    "This route report does not deploy, run SQL, connect to Supabase, or fetch market data.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function chooseRoute({ a1Preview, dryRun }) {
  if (dryRun?.status === "external_reply_shape_ready_for_post_reply_one_runner") {
    return {
      lane: "external_reply_file_workflow_proof",
      nextCommand: commands.workflowProof,
      nextCommands: [commands.workflowProof, "cmd.exe /c npm run report:beta-mainline-current-route"],
      reason: "The local reply file is complete and no-secret shape-safe; run the workflow proof as the single bridge into post-reply chain.",
      status: "external_reply_file_route_ready_for_workflow_proof"
    };
  }

  if (
    dryRun?.status === "rejected_unsafe_external_reply_shape" ||
    a1Preview?.status === "a1_reply_pm_preview_rejected_unsafe_shape"
  ) {
    return {
      lane: "external_input_copy_packet",
      nextCommand: commands.copyPacket,
      nextCommands: [commands.copyPacket],
      reason: "The reply file contains unsafe shape; return to the copy packet and replace unsafe content.",
      status: "external_reply_file_route_rejected_unsafe_shape"
    };
  }

  if (dryRun?.status === "a1_reply_shape_ready_platform_reply_pending") {
    return {
      lane: "platform_values_fill_existing_reply_file",
      nextCommand: commands.copyPacket,
      nextCommands: [commands.copyPacket, commands.dryRun],
      reason: "The local reply file exists and A1 shape is reviewable, but the two platform values are still missing or placeholder-shaped; fill those two lines, then rerun the reply-file route.",
      status: "external_reply_file_route_waiting_platform_values"
    };
  }

  if (dryRun?.status === "platform_reply_shape_ready_a1_reply_pending") {
    return {
      lane: "a1_bounded_repair",
      nextCommand: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      nextCommands: [
        "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
        commands.dryRun
      ],
      reason: "The local reply file exists and platform values are shape-safe, but A1 evidence slots are still missing, placeholder-shaped, or incomplete.",
      status: "external_reply_file_route_waiting_a1_bounded_repair"
    };
  }

  if (dryRun?.status === "blocked_external_reply_shape_incomplete") {
    return {
      lane: "external_reply_file_fill_existing_placeholders",
      nextCommand: commands.fillFromEnv,
      nextCommands: [commands.fillFromEnv, commands.dryRun],
      reason: "The local reply file exists, but both platform values and/or A1 slots are still missing, placeholder-shaped, or incomplete; provide no-secret env vars and fill the existing ignored file instead of generating a new one.",
      status: "external_reply_file_route_waiting_existing_file_fill"
    };
  }

  if (a1Preview?.status === "a1_reply_pm_preview_needs_bounded_repair") {
    return {
      lane: "a1_bounded_repair",
      nextCommand: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      nextCommands: [
        "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
        commands.template
      ],
      reason: "The A1 section is safe but incomplete; ask only for bounded repairs before proof.",
      status: "external_reply_file_route_waiting_a1_bounded_repair"
    };
  }

  return {
    lane: "external_reply_file_template",
    nextCommand: commands.writer,
    nextCommands: [commands.writer, commands.template, commands.copyPacket],
    reason: "A usable local reply file is not present yet; write an ignored local placeholder file, fill it, then rerun the reply-file route.",
    status: "external_reply_file_route_waiting_reply_file"
  };
}

function runJson(command) {
  const parts = command.split(" ");
  const result = spawnSync(parts[0], parts.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: routeEnv,
    timeout: 300000,
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
