$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDirectory "..")
$packageJson = Join-Path $projectRoot "package.json"
$nextBin = Join-Path $projectRoot "node_modules\next\dist\bin\next"
$nodeBin = "C:\Program Files\nodejs\node.exe"
$cmdBin = "C:\Windows\System32\cmd.exe"
$nextCache = Join-Path $projectRoot ".next"
$tmpDirectory = Join-Path $projectRoot "tmp"
$stdoutLog = Join-Path $tmpDirectory "next-dev-recover.out.log"
$stderrLog = Join-Path $tmpDirectory "next-dev-recover.err.log"
$port = 3000

if (-not (Test-Path -LiteralPath $packageJson)) {
  throw "Cannot find package.json under $projectRoot"
}

if (-not (Test-Path -LiteralPath $nextBin)) {
  throw "Cannot find Next.js local binary under $projectRoot"
}

if (-not (Test-Path -LiteralPath $nodeBin)) {
  throw "Cannot find node.exe under $nodeBin"
}

if (-not (Test-Path -LiteralPath $cmdBin)) {
  throw "Cannot find cmd.exe under $cmdBin"
}

if (-not (Test-Path -LiteralPath $tmpDirectory)) {
  New-Item -ItemType Directory -Path $tmpDirectory | Out-Null
}

$escapedRoot = [Regex]::Escape($projectRoot.Path)
$portListeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
foreach ($listener in $portListeners) {
  $listenerProcess = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
  if ($listenerProcess -and $listenerProcess.ProcessName -eq "node") {
    Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
    & taskkill.exe /PID $listener.OwningProcess /F | Out-Null
  }
}

$netstatListeners = & netstat.exe -ano | Select-String -Pattern ":$port\s+.*LISTENING\s+(\d+)"
foreach ($line in $netstatListeners) {
  $pidText = $line.Matches[0].Groups[1].Value
  if ($pidText) {
    & taskkill.exe /PID $pidText /F | Out-Null
  }
}

for ($attempt = 0; $attempt -lt 10; $attempt++) {
  $remainingListener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if (-not $remainingListener) {
    break
  }
  Start-Sleep -Milliseconds 500
}

$nextProcesses = @()
try {
  $nextProcesses = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" -ErrorAction Stop |
    Where-Object {
      $_.CommandLine -match $escapedRoot -and
      $_.CommandLine -match "node_modules\\next\\dist\\bin\\next"
    }
} catch {
  $nextProcesses = @()
}

foreach ($process in $nextProcesses) {
  Stop-Process -Id $process.ProcessId -Force
}

$resolvedCache = Resolve-Path -LiteralPath $nextCache -ErrorAction SilentlyContinue
if ($resolvedCache -and $resolvedCache.Path.StartsWith($projectRoot.Path)) {
  Remove-Item -LiteralPath $resolvedCache.Path -Recurse -Force
}

# The Codex desktop shell can expose both Path and PATH in the process
# environment. Windows Start-Process treats them as duplicate keys and exits.
if ([System.Environment]::GetEnvironmentVariable("Path", "Process") -and [System.Environment]::GetEnvironmentVariable("PATH", "Process")) {
  [System.Environment]::SetEnvironmentVariable("PATH", $null, "Process")
}

Start-Process `
  -FilePath $nodeBin `
  -WorkingDirectory $projectRoot.Path `
  -WindowStyle Hidden `
  -ArgumentList @(
    $nextBin,
    "dev",
    "--hostname",
    "localhost",
    "--port",
    "$port"
  )

Write-Output "Next dev server recovery started for $($projectRoot.Path)"
