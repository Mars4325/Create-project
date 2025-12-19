@echo off
echo Installing missing dependencies...
echo.

cd "d:\для курсора\taskhub-qa-sandbox\backend"

echo Installing cookie-parser:
npm install cookie-parser
echo.

echo Checking all dependencies:
npm list --depth=0
echo.

echo Starting server:
npm start
echo.

pause