@echo off
echo ========================================
echo PUSH CHANGES TO GITHUB
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Git status...
git status
echo.

echo ========================================
echo PUSHING TO GITHUB...
echo ========================================
git push origin main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo SUCCESS! Changes pushed to GitHub
    echo ========================================
    echo.
    echo Repository URL: https://github.com/Mars4325/Create-project
    echo.
    echo Visit the URL to see your repository online!
    echo.
) else (
    echo ========================================
    echo ERROR! Push failed
    echo ========================================
    echo.
    echo Possible reasons:
    echo - No commits to push
    echo - Remote repository not configured correctly
    echo - Network issues
    echo.
    echo Try running git-push-all.bat instead
    echo.
)

pause