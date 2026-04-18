$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting Atlas Delta..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting API server on port 8094..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; pnpm dev:api"

Start-Sleep -Seconds 2

Write-Host "Starting Web server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; pnpm dev:web"

Write-Host ""
Write-Host "Atlas Delta is starting!" -ForegroundColor Green
Write-Host "API: http://localhost:8094" -ForegroundColor Cyan
Write-Host "Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Close this window to keep servers running." -ForegroundColor Gray
