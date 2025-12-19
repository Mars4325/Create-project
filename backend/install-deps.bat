@echo off
echo Installing missing dependencies for TaskHub QA Sandbox...
echo.

echo Installing cookie-parser:
npm install cookie-parser
echo.

echo Installing all dependencies:
npm install
echo.

echo Checking installed packages:
npm list cookie-parser
echo.

echo Dependencies installed successfully!
echo You can now run the server with: node server.js
echo.

pause