# Simple server startup script
Write-Host "Starting DevNovate Blog Platform..."
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"
Write-Host ""

# Start backend in new window
Write-Host "Starting backend server..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'E:\COLLEGE NOTES\MY PROJECTS\LOVABLE HACKATHON\Lakshya project file\Project 2\project 2\backend'; node server.js"

Start-Sleep -Seconds 3

# Start frontend in new window  
Write-Host "Starting frontend server..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'E:\COLLEGE NOTES\MY PROJECTS\LOVABLE HACKATHON\Lakshya project file\Project 2\project 2\frontend'; npm start"

Write-Host ""
Write-Host "Both servers are starting in new windows!"
Write-Host "Test accounts:"
Write-Host "Admin: admin@example.com / admin123"
Write-Host "User: alice@demo.com / demopass123"
