@echo off
echo ========================================
echo SIMPLE Git Save - TaskHub QA Sandbox
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Git status...
cmd /c "git status"

echo.
echo Adding all files...
cmd /c "git add ."

echo.
echo Creating simple commit...
cmd /c "git commit -m \"TaskHub QA Sandbox - Complete Implementation\""

if %errorlevel% equ 0 (
    echo.
    echo ✅ COMMIT CREATED SUCCESSFULLY!
    echo.
    echo Pushing to GitHub...
    cmd /c "git push origin main"

    if %errorlevel% equ 0 (
        echo.
        echo 🎉 SUCCESS! PROJECT SAVED TO GITHUB!
        echo.
        echo 📋 Repository: https://github.com/Mars4325/Create-project
        echo 🌟 Check your commits online!
        echo.
    ) else (
        echo.
        echo ⚠️ COMMIT CREATED, BUT PUSH FAILED
        echo Try pushing manually: git push origin main
        echo.
    )
) else (
    echo.
    echo ❌ COMMIT FAILED!
    echo Check for errors above.
    echo.
)

echo Press any key to continue...
pause >nul