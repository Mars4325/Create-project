@echo off
echo ========================================
echo RESTARTING TaskHub QA Sandbox Server
echo ========================================
echo.

cd /d "%~dp0backend"

echo Stopping any running server processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Installing dependencies...
call npm install >nul 2>&1

echo.
echo Initializing database...
call npm run init-db >nul 2>&1

echo.
echo 🚀 Starting fresh server instance...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start