@echo off
cd /d "%~dp0"

echo ========================================
echo GIT STATUS - TaskHub QA Sandbox
echo ========================================
echo.

git status

echo.
echo ========================================
echo AVAILABLE COMMANDS:
echo ========================================
echo git add .                    - Add all changes
echo git commit -m "message"      - Create commit
echo git push origin main         - Push to GitHub
echo git log --oneline           - Show commit history
echo.

pause