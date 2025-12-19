@echo off
echo ========================================
echo CHECKING PROJECT OWNER COLUMN FIX
echo ========================================
echo.

cd /d "%~dp0"

echo Testing if server is running...
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server is not running!
    echo Please start the server with START-SERVER.bat first
    echo.
    pause
    exit /b 1
)

echo ✅ Server is running
echo.
echo Testing project owner column fix...
echo Opening test page in browser...

start "" "test-project-owner.html"

echo.
echo Test page opened. Check if project owner names are displayed instead of UUIDs.
echo.
pause