@echo off
echo ========================================
echo CHECKING GIT REMOTE CONFIGURATION
echo ========================================
echo.

cd /d "%~dp0"

echo Current Git remotes:
git remote -v
echo.

echo ========================================
echo CHECKING BRANCH INFO
echo ========================================
git branch -a
echo.

echo ========================================
echo CHECKING IF READY TO PUSH
echo ========================================
git status
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo If remote is configured correctly, run:
echo git-push-all.bat     (for full commit + push)
echo git-push-only.bat    (for push only)
echo.
echo If remote is missing, run:
echo git remote add origin https://github.com/Mars4325/Create-project.git
echo.

pause