@echo off
echo Starting server with debug output...
echo.

cd "d:\для курсора\taskhub-qa-sandbox\backend"

echo Checking Node.js version:
node --version
echo.

echo Checking if package.json exists:
if exist package.json echo package.json found
if not exist package.json echo ERROR: package.json not found
echo.

echo Installing dependencies if needed:
npm install
echo.

echo Starting server with detailed error output:
node server.js
echo.

pause