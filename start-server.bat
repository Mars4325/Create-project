@echo off
echo ========================================
echo TaskHub QA Sandbox Server
echo ========================================
echo.

cd /d "%~dp0backend"

echo 📦 Installing dependencies (if needed)...
call npm install >nul 2>&1

echo.
echo 🗄️ Initializing database...
call npm run init-db >nul 2>&1

echo.
echo 🚀 Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start