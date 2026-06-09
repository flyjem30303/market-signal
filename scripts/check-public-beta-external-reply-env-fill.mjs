import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const fillPath = "scripts/fill-public-beta-external-reply-file-from-env.mjs";
const checkPath = "scripts/check-public-beta-external-reply-env-fill.mjs";
const routePath = "scripts/report-public-beta-external-reply-file-route.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";

const fillSource = read(fillPath);
const checkSource = read(checkPath);
const routeSource = read(routePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [fillPath, fillSource, "public_beta_external_reply_env_fill"],
  [fillPath, fillSource, "PUBLIC_BETA_A1_VENDOR_TERMS_SUMMARY"],
  [fillPath, fillSource, "public_beta_external_reply_env_fill_written"],
  [fillPath, fillSource, "fileTextEchoed: false"],
  [fillPath, fillSource, "valuesEchoed: false"],
  [checkPath, checkSource, "public_beta_external_reply_env_fill_guard_ready"],
  [routePath, routeSource, "fill:public-beta-external-reply-file-from-env"],
  [packagePath, JSON.stringify(pkg), "fill:public-beta-external-reply-file-from-env"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-env-fill"],
  [statusPath, status, "Latest external reply env fill helper slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["fill:public-beta-external-reply-file-from-env"] !==
  "node scripts/fill-public-beta-external-reply-file-from-env.mjs"
) {
  problems.push(`${packagePath} missing fill:public-beta-external-reply-file-from-env`);
}
if (
  pkg.scripts?.["check:public-beta-external-reply-env-fill"] !==
  "node scripts/check-public-beta-external-reply-env-fill.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-reply-env-fill`);
}

const missingRun = runFill({ PUBLIC_BETA_EXTERNAL_REPLY_PATH: tempPath("missing") });
if (missingRun.report?.status !== "public_beta_external_reply_env_fill_blocked_missing_or_unsafe_inputs") {
  problems.push("fill helper should block when env vars are missing");
}
if (missingRun.report?.fileWritten !== false) problems.push("missing-env run should not write a file");
if (missingRun.report?.fileTextEchoed !== false) problems.push("missing-env run must not echo file text");
if (missingRun.report?.valuesEchoed !== false) problems.push("missing-env run must not echo values");

const outputPath = tempPath("safe");
const safeRun = runFill(safeEnv(outputPath));
if (safeRun.status !== 0) problems.push("safe fill run should exit 0");
if (safeRun.report?.status !== "public_beta_external_reply_env_fill_written") {
  problems.push("safe fill run should write the reply file");
}
if (safeRun.report?.fileWritten !== true) problems.push("safe fill run should mark fileWritten true");
if (safeRun.report?.fileTextEchoed !== false) problems.push("safe fill run must not echo file text");
if (safeRun.report?.valuesEchoed !== false) problems.push("safe fill run must not echo values");
if (safeRun.report?.runtimeBoundary?.publicDataSource !== "mock") problems.push("fill helper publicDataSource must stay mock");
if (safeRun.report?.runtimeBoundary?.scoreSource !== "mock") problems.push("fill helper scoreSource must stay mock");

if (!fs.existsSync(outputPath)) {
  problems.push("safe fill run should create output file");
} else {
  const dryRun = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-reply-intake-dry-run"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, PUBLIC_BETA_EXTERNAL_REPLY_PATH: outputPath },
    timeout: 300000,
    windowsHide: true
  });
  const dryReport = parseJson(dryRun.stdout ?? "");
  if (dryRun.status !== 0) problems.push("dry-run after fill should exit 0");
  if (dryReport?.status !== "external_reply_shape_ready_for_post_reply_one_runner") {
    problems.push("dry-run after fill should be workflow-proof ready");
  }
  if (dryReport?.input?.fileTextEchoed !== false) problems.push("dry-run must not echo file text");
  if (dryReport?.input?.valueEchoed !== false) problems.push("dry-run must not echo values");
  fs.unlinkSync(outputPath);
}

for (const [filePath, source] of [
  [fillPath, fillSource],
  [routePath, routeSource]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "public_beta_external_reply_env_fill_guard_ready",
  publicDataSource: "mock",
  scoreSource: "mock"
}, null, 2));

function runFill(extraEnv) {
  const result = spawnSync("cmd.exe", ["/c", "npm", "run", "fill:public-beta-external-reply-file-from-env"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    timeout: 300000,
    windowsHide: true
  });
  return {
    report: parseJson(result.stdout ?? ""),
    status: result.status ?? 1
  };
}

function safeEnv(outputPath) {
  return {
    BETA_HOSTING_PROJECT_NAME: "taiwan-market-signal-beta",
    BETA_TEMPORARY_URL: "https://taiwan-market-signal-beta.vercel.app/",
    PUBLIC_BETA_A1_ASSET_MAPPING_LABEL: "asset-mapping-review-label",
    PUBLIC_BETA_A1_ASSET_MAPPING_RISK: "Execution remains blocked until PM opens and accepts a separate source-rights outcome gate.",
    PUBLIC_BETA_A1_ASSET_MAPPING_SUMMARY: "Reviewed no-secret asset mapping summary is complete for route validation without copied contract text or private operational details.",
    PUBLIC_BETA_A1_FIELD_CONTRACT_LABEL: "field-contract-review-label",
    PUBLIC_BETA_A1_FIELD_CONTRACT_RISK: "Execution remains blocked until PM opens and accepts a separate source-rights outcome gate.",
    PUBLIC_BETA_A1_FIELD_CONTRACT_SUMMARY: "Reviewed no-secret field contract summary is complete for route validation without copied contract text or private operational details.",
    PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_LABEL: "internal-feed-owner-review-label",
    PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_RISK: "Execution remains blocked until PM opens and accepts a separate source-rights outcome gate.",
    PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_SUMMARY: "Reviewed no-secret internal feed owner summary is complete for route validation without copied contract text or private operational details.",
    PUBLIC_BETA_A1_VENDOR_TERMS_LABEL: "vendor-terms-review-label",
    PUBLIC_BETA_A1_VENDOR_TERMS_RISK: "Execution remains blocked until PM opens and accepts a separate source-rights outcome gate.",
    PUBLIC_BETA_A1_VENDOR_TERMS_SUMMARY: "Reviewed no-secret vendor terms summary is complete for route validation without copied contract text or private operational details.",
    PUBLIC_BETA_EXTERNAL_REPLY_PATH: outputPath
  };
}

function tempPath(name) {
  return path.join("tmp", `public-beta-env-fill-check-${name}-${Date.now()}.txt`);
}

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
