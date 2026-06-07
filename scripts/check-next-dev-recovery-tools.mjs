import fs from "node:fs";

const healthPath = "scripts/check-localhost-health.mjs";
const contentHealthPath = "scripts/check-localhost-content-health.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const healthConfigPath = "scripts/localhost-health-config.mjs";
const recoveryPath = "scripts/recover-next-dev-server.ps1";
const packagePath = "package.json";
const findings = [];

const health = read(healthPath);
const contentHealth = read(contentHealthPath);
const fullHealth = read(fullHealthPath);
const healthConfig = read(healthConfigPath);
const recovery = read(recoveryPath);
const packageJson = JSON.parse(read(packagePath));

for (const token of [
  "LOCALHOST_HEALTH_BASE_URL",
  "http://localhost:3000",
  "localhostStatusHealthPaths",
  "new URL(path, baseUrl)",
  "recoveryHint",
  "scripts/recover-next-dev-server.ps1"
]) {
  requireToken(healthPath, health, token);
}

for (const token of [
  "LOCALHOST_HEALTH_BASE_URL",
  "http://localhost:3000",
  "localhostContentHealthChecks",
  "localhostContentForbidden",
  "new URL(check.path, baseUrl)"
]) {
  requireToken(contentHealthPath, contentHealth, token);
}

for (const token of [
  '"/stocks/2330"',
  '"/stocks/TWII"',
  '"/stocks/0050"',
  '"/stocks/006208"',
  '"/stocks/2382"',
  '"/stocks/2308"',
  '"/briefing"',
  '"/weekly"',
  '"/robots.txt"',
  "Runtime At A Glance",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Data / Legal / Investment checklists are local-ready",
  "local_ready_remote_paused",
  "Internal Server Error",
  "Supabase readonly attempt"
]) {
  requireToken(healthConfigPath, healthConfig, token);
}

for (const token of [
  "scripts/check-localhost-health-config.mjs",
  "scripts/check-localhost-health.mjs",
  "scripts/check-localhost-content-health.mjs",
  "scripts/check-row-coverage-health-route-alignment.mjs",
  "scripts/check-project-progress-snapshot.mjs",
  "scripts/check-ceo-progress-brief.mjs",
  "scripts/check-blocker-resolution-plan.mjs",
  "scripts/check-data-quality-evidence-checklist.mjs",
  "scripts/check-source-rights-disclosure-checklist.mjs",
  "scripts/check-model-credibility-checklist.mjs",
  "scripts/check-blocker-readiness-panel.mjs",
  "scripts/check-next-dev-recovery-tools.mjs"
]) {
  requireToken(fullHealthPath, fullHealth, token);
}

for (const token of [
  "$ErrorActionPreference = \"Stop\"",
  "package.json",
  "node_modules\\next\\dist\\bin\\next",
  "Get-NetTCPConnection -LocalPort $port -State Listen",
  "$listenerProcess.ProcessName -eq \"node\"",
  "Get-CimInstance Win32_Process",
  "CommandLine -match $escapedRoot",
  "CommandLine -match \"node_modules\\\\next\\\\dist\\\\bin\\\\next\"",
  "Remove-Item -LiteralPath $resolvedCache.Path -Recurse -Force",
  "$resolvedCache.Path.StartsWith($projectRoot.Path)",
  "Start-Process",
  "-WorkingDirectory $projectRoot.Path",
  "-FilePath \"C:\\Program Files\\nodejs\\node.exe\"",
  "-WindowStyle Hidden"
]) {
  requireToken(recoveryPath, recovery, token);
}

for (const forbidden of [
  "Remove-Item -Recurse -Force .",
  "Remove-Item -Recurse -Force *",
  "Stop-Process -Name node",
  "Get-Process node | Stop-Process",
  "cmd /c"
]) {
  if (recovery.includes(forbidden)) {
    findings.push({ file: recoveryPath, issue: `forbidden recovery token: ${forbidden}` });
  }
}

const scripts = packageJson.scripts ?? {};
if (scripts["check:localhost-health"] !== "node scripts/check-localhost-health.mjs") {
  findings.push({ file: packagePath, issue: "missing check:localhost-health script" });
}

if (scripts["check:localhost-content-health"] !== "node scripts/check-localhost-content-health.mjs") {
  findings.push({ file: packagePath, issue: "missing check:localhost-content-health script" });
}

if (scripts["check:localhost-full-health"] !== "node scripts/check-localhost-full-health.mjs") {
  findings.push({ file: packagePath, issue: "missing check:localhost-full-health script" });
}

if (scripts["report:project-progress-snapshot"] !== "node scripts/report-project-progress-snapshot.mjs") {
  findings.push({ file: packagePath, issue: "missing report:project-progress-snapshot script" });
}

if (scripts["check:project-progress-snapshot"] !== "node scripts/check-project-progress-snapshot.mjs") {
  findings.push({ file: packagePath, issue: "missing check:project-progress-snapshot script" });
}

if (scripts["report:ceo-progress-brief"] !== "node scripts/report-ceo-progress-brief.mjs") {
  findings.push({ file: packagePath, issue: "missing report:ceo-progress-brief script" });
}

if (scripts["check:ceo-progress-brief"] !== "node scripts/check-ceo-progress-brief.mjs") {
  findings.push({ file: packagePath, issue: "missing check:ceo-progress-brief script" });
}

if (scripts["report:blocker-resolution-plan"] !== "node scripts/report-blocker-resolution-plan.mjs") {
  findings.push({ file: packagePath, issue: "missing report:blocker-resolution-plan script" });
}

if (scripts["check:blocker-resolution-plan"] !== "node scripts/check-blocker-resolution-plan.mjs") {
  findings.push({ file: packagePath, issue: "missing check:blocker-resolution-plan script" });
}

if (scripts["check:data-quality-evidence-checklist"] !== "node scripts/check-data-quality-evidence-checklist.mjs") {
  findings.push({ file: packagePath, issue: "missing check:data-quality-evidence-checklist script" });
}

if (scripts["check:source-rights-disclosure-checklist"] !== "node scripts/check-source-rights-disclosure-checklist.mjs") {
  findings.push({ file: packagePath, issue: "missing check:source-rights-disclosure-checklist script" });
}

if (scripts["check:model-credibility-checklist"] !== "node scripts/check-model-credibility-checklist.mjs") {
  findings.push({ file: packagePath, issue: "missing check:model-credibility-checklist script" });
}

if (scripts["check:blocker-readiness-panel"] !== "node scripts/check-blocker-readiness-panel.mjs") {
  findings.push({ file: packagePath, issue: "missing check:blocker-readiness-panel script" });
}

if (scripts["dev:recover"] !== "powershell -ExecutionPolicy Bypass -File scripts/recover-next-dev-server.ps1") {
  findings.push({ file: packagePath, issue: "missing dev:recover script" });
}

console.log(
  JSON.stringify(
    {
      findings,
      status: findings.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (findings.length > 0) {
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function requireToken(file, source, token) {
  if (!source.includes(token)) {
    findings.push({ file, issue: `missing required token: ${token}` });
  }
}
