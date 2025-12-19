@echo off
echo ========================================
echo OPENING COMMAND PROMPT IN PROJECT FOLDER
echo ========================================
echo.

cd /d "%~dp0"

echo Opening Command Prompt in this folder...
echo Current directory: %cd%
echo.

echo To run Git commands, you can now use:
echo git status
echo git add .
echo git commit -m "Your message"
echo.

cmd /k