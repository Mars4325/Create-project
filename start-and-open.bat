@echo off
echo ========================================
echo TaskHub QA Sandbox - Start and Open
echo ========================================
echo.

cd /d "%~dp0backend"

echo 📦 Installing dependencies...
call npm install >nul 2>&1

echo.
echo 🗄️ Initializing database...
call npm run init-db >nul 2>&1

echo.
echo 🚀 Starting server...
start /B npm start

echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak >nul

echo 🌐 Opening browser...
start http://localhost:3000

echo.
echo ✅ Server started and browser opened!
echo If the page doesn't load, wait a few seconds and refresh.
echo.
pause