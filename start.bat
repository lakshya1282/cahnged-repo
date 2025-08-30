@echo off
echo Starting DevNovate Blog Platform...
echo ================================

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d "E:\COLLEGE NOTES\MY PROJECTS\LOVABLE HACKATHON\Lakshya project file\Project 2\project 2\backend" && node server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d "E:\COLLEGE NOTES\MY PROJECTS\LOVABLE HACKATHON\Lakshya project file\Project 2\project 2\frontend" && npm start"

echo.
echo Both servers are starting in new windows!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Test Accounts:
echo Admin: admin@example.com / admin123
echo User: alice@demo.com / demopass123
echo.
pause
