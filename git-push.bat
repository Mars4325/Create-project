@echo off
echo ========================================
echo TaskHub QA Sandbox - Git Push to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Checking if remote origin exists...
git remote -v

echo.
echo Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo Check your repository at:
    echo https://github.com/Mars4325/Create-project
    echo.
) else (
    echo.
    echo ❌ Push failed!
    echo Possible reasons:
    echo - No remote repository configured
    echo - Authentication issues
    echo - Network problems
    echo.
    echo Try manual push:
    echo git push -u origin main
    echo.
)

pause