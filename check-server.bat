@echo off
echo ========================================
echo TaskHub QA Sandbox - Server Check
echo ========================================
echo.

echo Checking if port 3000 is in use...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ❌ Port 3000 is already in use!
    echo.
    echo Processes using port 3000:
    netstat -ano | findstr :3000
    echo.
    echo Please close other applications using port 3000 or use a different port.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Port 3000 is free
)

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    echo npm should come with Node.js installation.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ npm is installed
    npm --version
)

echo.
echo Starting TaskHub QA Sandbox Server...
echo ========================================
echo.

cd /d "%~dp0backend"

echo Installing dependencies (if needed)...
call npm install >nul 2>&1

echo.
echo Initializing database...
call npm run init-db >nul 2>&1

echo.
echo 🚀 Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start