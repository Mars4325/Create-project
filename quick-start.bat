@echo off
echo 🚀 TaskHub QA Sandbox - Quick Start
echo ====================================
echo.

cd /d "%~dp0backend"

echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo 🗄️ Initializing database...
call npm run init-db

if %errorlevel% neq 0 (
    echo ❌ Failed to initialize database!
    pause
    exit /b 1
)

echo.
echo 🚀 Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start