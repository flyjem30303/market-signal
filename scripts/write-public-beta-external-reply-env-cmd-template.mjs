import fs from "node:fs";
import path from "node:path";

const outputPath = path.normalize(process.env.PUBLIC_BETA_EXTERNAL_REPLY_ENV_CMD_TEMPLATE_PATH || "tmp/public-beta-external-reply-env.template.cmd");
const fillCommand = "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env";
const routeCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";

const requiredEnvVars = [
  ["PUBLIC_BETA_EXTERNAL_REPLY_PATH", "tmp\\public-beta-external-reply.txt"],
  ["BETA_HOSTING_PROJECT_NAME", "<lowercase-public-beta-hosting-project-name>"],
  ["BETA_TEMPORARY_URL", "https://<public-beta-hostname>/"],
  ["PUBLIC_BETA_A1_VENDOR_TERMS_LABEL", "<no-secret source or terms label>"],
  ["PUBLIC_BETA_A1_VENDOR_TERMS_SUMMARY", "<no-secret summary answering whether source terms support the intended internal use and derived display path>"],
  ["PUBLIC_BETA_A1_VENDOR_TERMS_RISK", "<remaining source-rights risk; no copied terms text>"],
  ["PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_LABEL", "<no-secret internal feed owner or authorization path label>"],
  ["PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_SUMMARY", "<no-secret summary of internal owner and authorization path>"],
  ["PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_RISK", "<remaining owner approval risk>"],
  ["PUBLIC_BETA_A1_FIELD_CONTRACT_LABEL", "<no-secret field contract label>"],
  ["PUBLIC_BETA_A1_FIELD_CONTRACT_SUMMARY", "<no-secret summary of approved fields, units, timezone, depth, and gaps>"],
  ["PUBLIC_BETA_A1_FIELD_CONTRACT_RISK", "<remaining field, unit, timezone, or historical-depth risk>"],
  ["PUBLIC_BETA_A1_ASSET_MAPPING_LABEL", "<no-secret asset mapping label>"],
  ["PUBLIC_BETA_A1_ASSET_MAPPING_SUMMARY", "<no-secret summary of TWII symbol, market, asset type, and mapping owner>"],
  ["PUBLIC_BETA_A1_ASSET_MAPPING_RISK", "<remaining alias or historical-continuity risk>"]
];

const lines = [
  "@echo off",
  "REM Public Beta external reply local env template.",
  "REM Fill only no-secret values. Do not paste Supabase keys, raw payloads, row payloads, copied contract text, or private links.",
  "REM This .cmd avoids PowerShell ExecutionPolicy blocking .ps1 templates.",
  "",
  ...requiredEnvVars.map(([name, value]) => `set "${name}=${value}"`),
  "",
  "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env",
  "cmd.exe /c npm run report:public-beta-external-reply-file-route"
];

if (fs.existsSync(outputPath)) {
  console.log(JSON.stringify({
    status: "public_beta_external_reply_env_cmd_template_blocked_existing_file",
    ok: false,
    mode: "public_beta_external_reply_env_cmd_template_writer",
    outputPath,
    fileWritten: false,
    fileOverwritten: false,
    fileTextEchoed: false,
    valuesEchoed: false,
    nextAction: "Edit or move the existing ignored .cmd template file; it was not overwritten.",
    runtimeBoundary: runtimeBoundary(),
    safety: safety()
  }, null, 2));
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${lines.join("\r\n")}\r\n`, "utf8");

console.log(JSON.stringify({
  status: "public_beta_external_reply_env_cmd_template_written",
  ok: true,
  mode: "public_beta_external_reply_env_cmd_template_writer",
  outputPath,
  requiredEnvVarCount: requiredEnvVars.length,
  fileWritten: true,
  fileOverwritten: false,
  fileTextEchoed: false,
  valuesEchoed: false,
  nextLocalFileAction: `Fill and run ${outputPath} with cmd.exe`,
  nextCommand: fillCommand,
  nextCommands: [fillCommand, routeCommand],
  runtimeBoundary: runtimeBoundary(),
  safety: safety()
}, null, 2));

function runtimeBoundary() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function safety() {
  return {
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
    valuesEchoed: false,
    valuesStoredInRepo: false
  };
}
