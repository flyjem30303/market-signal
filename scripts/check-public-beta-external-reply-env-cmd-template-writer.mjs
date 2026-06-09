import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const writerPath = "scripts/write-public-beta-external-reply-env-cmd-template.mjs";
const checkPath = "scripts/check-public-beta-external-reply-env-cmd-template-writer.mjs";
const fillPath = "scripts/fill-public-beta-external-reply-file-from-env.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";

const writerSource = read(writerPath);
const checkSource = read(checkPath);
const fillSource = read(fillPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [writerPath, writerSource, "public_beta_external_reply_env_cmd_template_writer"],
  [writerPath, writerSource, "PowerShell ExecutionPolicy"],
  [writerPath, writerSource, "PUBLIC_BETA_A1_VENDOR_TERMS_SUMMARY"],
  [writerPath, writerSource, "fill:public-beta-external-reply-file-from-env"],
  [writerPath, writerSource, "fileTextEchoed: false"],
  [writerPath, writerSource, "valuesEchoed: false"],
  [fillPath, fillSource, "function isFilled"],
  [checkPath, checkSource, "public_beta_external_reply_env_cmd_template_writer_guard_ready"],
  [packagePath, JSON.stringify(pkg), "write:public-beta-external-reply-env-cmd-template"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-env-cmd-template-writer"],
  [statusPath, status, "Latest external reply cmd env template writer slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["write:public-beta-external-reply-env-cmd-template"] !==
  "node scripts/write-public-beta-external-reply-env-cmd-template.mjs"
) {
  problems.push(`${packagePath} missing write:public-beta-external-reply-env-cmd-template`);
}
if (
  pkg.scripts?.["check:public-beta-external-reply-env-cmd-template-writer"] !==
  "node scripts/check-public-beta-external-reply-env-cmd-template-writer.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-reply-env-cmd-template-writer`);
}

const outputPath = path.join("tmp", `public-beta-env-cmd-template-check-${Date.now()}.cmd`);
try {
  const run = spawnSync("cmd.exe", ["/c", "npm", "run", "write:public-beta-external-reply-env-cmd-template"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, PUBLIC_BETA_EXTERNAL_REPLY_ENV_CMD_TEMPLATE_PATH: outputPath },
    timeout: 300000,
    windowsHide: true
  });
  const report = parseJson(run.stdout ?? "");
  if (run.status !== 0) problems.push("cmd env template writer should exit 0");
  if (report?.status !== "public_beta_external_reply_env_cmd_template_written") problems.push("cmd env template writer status mismatch");
  if (report?.fileTextEchoed !== false) problems.push("cmd env template writer must not echo file text");
  if (report?.valuesEchoed !== false) problems.push("cmd env template writer must not echo values");

  if (!fs.existsSync(outputPath)) {
    problems.push("cmd env template writer should create template file");
  } else {
    const text = fs.readFileSync(outputPath, "utf8");
    for (const phrase of [
      "set \"BETA_HOSTING_PROJECT_NAME=",
      "set \"BETA_TEMPORARY_URL=",
      "set \"PUBLIC_BETA_A1_VENDOR_TERMS_SUMMARY=",
      "set \"PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_SUMMARY=",
      "set \"PUBLIC_BETA_A1_FIELD_CONTRACT_SUMMARY=",
      "set \"PUBLIC_BETA_A1_ASSET_MAPPING_SUMMARY=",
      "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env"
    ]) {
      if (!text.includes(phrase)) problems.push(`cmd env template missing phrase: ${phrase}`);
    }
  }

  const secondRun = spawnSync("cmd.exe", ["/c", "npm", "run", "write:public-beta-external-reply-env-cmd-template"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, PUBLIC_BETA_EXTERNAL_REPLY_ENV_CMD_TEMPLATE_PATH: outputPath },
    timeout: 300000,
    windowsHide: true
  });
  const secondReport = parseJson(secondRun.stdout ?? "");
  if (secondRun.status !== 0) problems.push("existing cmd env template guard should exit 0");
  if (secondReport?.status !== "public_beta_external_reply_env_cmd_template_blocked_existing_file") {
    problems.push("existing cmd env template guard should not overwrite");
  }
} finally {
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(writerSource) || pattern.test(fillSource)) problems.push(`forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "public_beta_external_reply_env_cmd_template_writer_guard_ready",
  publicDataSource: "mock",
  scoreSource: "mock"
}, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
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

function forbiddenPatterns() {
  return [
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /git",\s*"add"/iu,
    /git",\s*"commit"/iu,
    /git",\s*"push"/iu,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u
  ];
}
