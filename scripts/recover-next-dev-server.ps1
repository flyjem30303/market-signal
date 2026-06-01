$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDirectory "..")
$packageJson = Join-Path $projectRoot "package.json"
$nextBin = Join-Path $projectRoot "node_modules\next\dist\bin\next"
$nextCache = Join-Path $projectRoot ".next"
$port = 3000

if (-not (Test-Path -LiteralPath $packageJson)) {
  throw "Cannot find package.json under $projectRoot"
}

if (-not (Test-Path -LiteralPath $nextBin)) {
  throw "Cannot find Next.js local binary under $projectRoot"
}

$escapedRoot = [Regex]::Escape($projectRoot.Path)
$portListeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
foreach ($listener in $portListeners) {
  $listenerProcess = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
  if ($listenerProcess -and $listenerProcess.ProcessName -eq "node") {
    Stop-Process -Id $listener.OwningProcess -Force
  }
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
  -FilePath "C:\Program Files\nodejs\node.exe" `
  -WorkingDirectory $projectRoot.Path `
  -WindowStyle Hidden `
  -ArgumentList @(
    "node_modules\next\dist\bin\next",
    "dev",
    "--hostname",
    "localhost",
    "--port",
    "$port"
  )

Write-Output "Next dev server recovery started for $($projectRoot.Path)"
