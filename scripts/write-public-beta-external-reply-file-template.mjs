import fs from "node:fs";
import path from "node:path";

const outputPath = process.env.PUBLIC_BETA_EXTERNAL_REPLY_TEMPLATE_OUTPUT_PATH || "tmp/public-beta-external-reply.txt";
const normalizedOutputPath = path.normalize(outputPath);
const routeCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const templateCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-template";
const workflowProofCommand = "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof";

const platformLines = [
  "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
  "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
];

const slotIds = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const templateText = [
  ...platformLines,
  "",
  ...slotIds.flatMap((id) => [
    `evidenceSlotId: ${id}`,
    "sourceReferenceLabel: <no-secret label>",
    "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
    "remainingRisk: <one to two sentences; smallest blocker or execution risk>",
    ""
  ])
].join("\n");

const safety = {
  deploymentAuthorized: false,
  evidenceRecorded: false,
  fileTextEchoed: false,
  hostingMutated: false,
  marketDataFetched: false,
  rawPayloadPrinted: false,
  scoreSourceRealEnabled: false,
  secretsPrinted: false,
  sourceRightsApproved: false,
  sqlExecuted: false,
  supabaseReadsEnabled: false,
  supabaseWritesEnabled: false,
  valuesStored: false
};

if (fs.existsSync(normalizedOutputPath)) {
  console.log(JSON.stringify({
    status: "public_beta_external_reply_file_template_writer_blocked_existing_file",
    ok: false,
    mode: "public_beta_external_reply_file_template_writer",
    reason:
      "The local reply template file already exists. It was not overwritten, because it may contain real operator/A1 values that must stay local and unprinted.",
    outputPath: normalizedOutputPath,
    fileWritten: false,
    fileOverwritten: false,
    fileTextEchoed: false,
    valuesEchoed: false,
    nextCommand: routeCommand,
    fallbackTemplateReportCommand: templateCommand,
    setEnvCommand: `$env:PUBLIC_BETA_EXTERNAL_REPLY_PATH='${normalizedOutputPath}'`,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    safety,
    stopLines: [
      "Do not overwrite or print an existing reply file.",
      "If the existing file is filled, set PUBLIC_BETA_EXTERNAL_REPLY_PATH to this path and run the reply-file route.",
      "If the existing file is wrong, move it manually outside Git before generating a fresh placeholder."
    ]
  }, null, 2));
  process.exit(0);
}

fs.mkdirSync(path.dirname(normalizedOutputPath), { recursive: true });
fs.writeFileSync(normalizedOutputPath, `${templateText}\n`, "utf8");

console.log(JSON.stringify({
  status: "public_beta_external_reply_file_template_written",
  ok: true,
  mode: "public_beta_external_reply_file_template_writer",
  purpose:
    "Create a local ignored placeholder reply file so PM/A1 can fill the public Beta external values and no-secret evidence slots without copying JSON output.",
  outputPath: normalizedOutputPath,
  lineCount: templateText.split("\n").length,
  placeholdersOnly: true,
  fileWritten: true,
  fileOverwritten: false,
  fileTextEchoed: false,
  valuesEchoed: false,
  setEnvCommand: `$env:PUBLIC_BETA_EXTERNAL_REPLY_PATH='${normalizedOutputPath}'`,
  routeCommand,
  completeReplyNextCommand: workflowProofCommand,
  fallbackTemplateReportCommand: templateCommand,
  requiredBlocks: [
    {
      id: "beta_platform_two_values",
      owner: "PM or hosting operator",
      requiredLines: platformLines
    },
    {
      id: "a1_twii_four_slot_no_secret_evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      requiredSlotIds: slotIds,
      requiredPerSlot: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]
    }
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety,
  stopLines: [
    "Fill placeholders only with public hosting values and no-secret A1 summaries.",
    "Do not paste secrets, Supabase keys, Supabase project URL, copied contract text, raw payloads, row payloads, or stock-id payloads.",
    "Keep this file in tmp/ and outside Git.",
    "After filling, set PUBLIC_BETA_EXTERNAL_REPLY_PATH to this path and run the reply-file route first.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
}, null, 2));
