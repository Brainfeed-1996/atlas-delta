$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Starting Atlas Delta servers..." -ForegroundColor Cyan
Write-Host ""

# Check if ports are available
$apiPort = 8200
$webPort = 3000

function Test-PortAvailable {
    param($Port)
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::IPv6Any, $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

if (-not (Test-PortAvailable -Port $apiPort)) {
    Write-Warning "Port $apiPort is already in use. API may not start."
}
if (-not (Test-PortAvailable -Port $webPort)) {
    Write-Warning "Port $webPort is already in use. Web may not start."
}

Write-Host "Starting API server on port $apiPort..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir'; pnpm dev:api" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "Starting Web server on port $webPort..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir'; pnpm dev:web" -WindowStyle Normal

Write-Host ""
Write-Host "Atlas Delta is starting!" -ForegroundColor Green
Write-Host "  API: http://localhost:$apiPort" -ForegroundColor Cyan
Write-Host "  Web: http://localhost:$webPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two PowerShell windows have been opened." -ForegroundColor Yellow
Write-Host "Close them when you want to stop the servers." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close this window"
