@echo off
cd /d d:\для курсора\taskhub-qa-sandbox

echo ========================================
echo GIT COMMIT - TaskHub QA Sandbox
echo ========================================
echo.

echo Checking Git status...
git status
echo.

echo Adding all changes...
git add .
echo.

echo Creating commit...
git commit -m "Fix TestCase owner column - show usernames instead of UUIDs

- Add created_by_username and assigned_to_username to TestCase constructor
- Update frontend to display usernames in test cases table
- Add debug files for testing validation"

echo.
echo Commit completed!
echo.

pause