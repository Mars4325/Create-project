@echo off
echo ========================================
echo TESTING TESTCASE OWNER COLUMN FIX
echo ========================================
echo.

cd /d "%~dp0"

echo Checking if server is running...
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
echo Testing testcase owner column fix...
echo Opening test page in browser...

start "" "test-owner-column.html"

echo.
echo Test page opened. Check if testcase owner names are displayed instead of UUIDs.
echo.
pause