# DevNovate Blog Platform - Server Startup Script

Write-Host "🚀 Starting DevNovate Blog Platform..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Check if MongoDB is running
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    exit 1
}

# Check if ports are available
$backendPort = 5000
$frontendPort = 3000

$backendInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
$frontendInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

if ($backendInUse) {
    Write-Host "⚠️ Port $backendPort is already in use (Backend)" -ForegroundColor Yellow
}

if ($frontendInUse) {
    Write-Host "⚠️ Port $frontendPort is already in use (Frontend)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting Backend Server (Port $backendPort)..." -ForegroundColor Blue
Start-Process -WindowStyle Minimized -FilePath "powershell" -ArgumentList "-Command", "cd 'E:\COLLEGE NOTES\MY PROJECTS\LOVABLE HACKATHON\Lakshya project file\Project 2\project 2\backend'; node server.js"

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting Frontend Server (Port $frontendPort)..." -ForegroundColor Blue
Start-Process -WindowStyle Minimized -FilePath "powershell" -ArgumentList "-Command", "cd 'E:\COLLEGE NOTES\MY PROJECTS\LOVABLE HACKATHON\Lakshya project file\Project 2\project 2\frontend'; npm start"

Write-Host ""
Write-Host "🎉 Both servers should be starting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Test Accounts:" -ForegroundColor Yellow
Write-Host "Admin: admin@example.com / admin123" -ForegroundColor White
Write-Host "Admin: debuguser2@test.com / testpass123" -ForegroundColor White
Write-Host "User: alice@demo.com / demopass123" -ForegroundColor White
Write-Host "User: bob@demo.com / demopass123" -ForegroundColor White
Write-Host "User: charlie@demo.com / demopass123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop this script, but servers will continue running in background." -ForegroundColor Gray

# Keep the script running for monitoring
while ($true) {
    Start-Sleep -Seconds 10
    
    # Check if servers are responding
    try {
        $backendTest = Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ Backend responding ($(Get-Date -Format 'HH:mm:ss'))" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend not responding ($(Get-Date -Format 'HH:mm:ss'))" -ForegroundColor Red
    }
    
    try {
        $frontendTest = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✅ Frontend responding ($(Get-Date -Format 'HH:mm:ss'))" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend not responding ($(Get-Date -Format 'HH:mm:ss'))" -ForegroundColor Red
    }
}
