@echo off
setlocal

set "ROOT=%~dp0.."
set "NODE_DIR=%ROOT%\.cache\node-v20-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"

if not exist "%NODE_EXE%" (
  echo Preparing local Node 20 runtime...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $root=(Resolve-Path '%ROOT%').Path; $cache=Join-Path $root '.cache'; $nodeDir=Join-Path $cache 'node-v20-win-x64'; $zip=Join-Path $cache 'node-v20-win-x64.zip'; $tmp=Join-Path $cache 'node20-download'; New-Item -ItemType Directory -Force -Path $cache | Out-Null; $index=Invoke-RestMethod 'https://nodejs.org/dist/index.json'; $version=($index | Where-Object { $_.version -like 'v20.*' } | Select-Object -First 1).version; if (-not $version) { throw 'Cannot find Node 20 release from nodejs.org.' }; $url='https://nodejs.org/dist/' + $version + '/node-' + $version + '-win-x64.zip'; Invoke-WebRequest -Uri $url -OutFile $zip; if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }; Expand-Archive -Path $zip -DestinationPath $tmp -Force; $expanded=Join-Path $tmp ('node-' + $version + '-win-x64'); if (Test-Path $nodeDir) { Remove-Item -Recurse -Force $nodeDir }; Move-Item -Path $expanded -Destination $nodeDir; Remove-Item -Recurse -Force $tmp; Write-Host ('Installed ' + $version + ' into ' + $nodeDir)"
  if errorlevel 1 exit /b 1
)

set "PATH=%NODE_DIR%;%PATH%"

if "%~1"=="" (
  node -v
  exit /b %ERRORLEVEL%
)

%*
