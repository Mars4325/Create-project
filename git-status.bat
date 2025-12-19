@echo off
echo ========================================
echo TaskHub QA Sandbox - Git Status
echo ========================================
echo.

cd /d "%~dp0"

echo 📊 Git Status:
git status

echo.
echo 📝 Recent Commits:
git log --oneline -5

echo.
echo 🔗 Remote Repository:
git remote -v

echo.
echo 💡 Available commands:
echo git-commit.bat    - Create commit with all changes
echo git-push.bat      - Push to GitHub
echo git-save.bat      - Commit and push in one step
echo.

pause