import fs from "node:fs";

const healthPath = "scripts/check-localhost-health.mjs";
const recoveryPath = "scripts/recover-next-dev-server.ps1";
const packagePath = "package.json";
const findings = [];

const health = read(healthPath);
const recovery = read(recoveryPath);
const packageJson = JSON.parse(read(packagePath));

for (const token of [
  "LOCALHOST_HEALTH_BASE_URL",
  "http://localhost:3000",
  '"/stocks/2330"',
  '"/briefing"',
  '"/robots.txt"',
  "recoveryHint",
  "scripts/recover-next-dev-server.ps1"
]) {
  requireToken(healthPath, health, token);
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
